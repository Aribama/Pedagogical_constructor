import json
from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from cards.models import TechniqueCard
from scenarios.models import Scenario, ScenarioItem

from .models import AIGenerationLog, AIServiceSettings
from .prompts import build_lesson_input, build_multiagent_prompt
from .providers.registry import get_provider, list_providers
from .serializers import GeneratePlanSerializer


def today_range():
    """
    Возвращает границы текущих суток в локальном времени Django.
    [start, end) — удобно для фильтрации created_at__gte/lt
    """
    now = timezone.localtime()
    start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    end = start + timedelta(days=1)
    return start, end


class GeneratePlanView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        ser = GeneratePlanSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        scenario_id = ser.validated_data["scenario_id"]
        provider_name = (
            ser.validated_data.get("provider")
            or ser.validated_data.get("provider_name")
            or request.data.get("provider")
            or request.data.get("provider_name")
            or "dummy"
        )

        params = (
            ser.validated_data.get("params")
            or request.data.get("params")
            or {}
        )

        scenario = Scenario.objects.filter(id=scenario_id, owner=request.user).first()
        if not scenario:
            raise ValidationError({"scenario_id": "Scenario not found."})

        settings_obj = AIServiceSettings.get_solo()

        if (not settings_obj.is_enabled) and (not request.user.is_staff):
            raise ValidationError(
                {"detail": "Генерация план-конспекта временно отключена администратором."}
            )

        start, end = today_range()
        today_count = AIGenerationLog.objects.filter(
            user=request.user,
            created_at__gte=start,
            created_at__lt=end,
        ).count()

        limit = int(getattr(settings_obj, "daily_limit_per_user", 999999) or 999999)
        if (not request.user.is_staff) and (today_count >= limit):
            raise ValidationError(
                {"detail": f"Достигнут лимит генераций на сегодня: {settings_obj.daily_limit_per_user}."}
            )

        items = list(ScenarioItem.objects.filter(scenario=scenario).order_by("position"))
        card_ids = [it.technique_card_id for it in items]
        cards = list(TechniqueCard.objects.filter(id__in=card_ids))
        cards_by_id = {c.id: c for c in cards}

        lesson_input = build_lesson_input(
            scenario=scenario,
            items=items,
            cards_by_id=cards_by_id,
            extra_params=params or {},
        )
        system_prompt = build_multiagent_prompt()

        user_json = json.dumps(lesson_input, ensure_ascii=False, indent=2, default=str)
        prompt = system_prompt + "\n\nLESSON_INPUT_JSON:\n" + user_json

        try:
            provider = get_provider(provider_name)
        except KeyError:
            raise ValidationError(
                {"provider": f"Unknown provider. Available: {list_providers()}"}
            )

        requested_model = (params or {}).get("model", "") or ""

        log = AIGenerationLog.objects.create(
            user=request.user,
            scenario=scenario,
            provider=getattr(provider, "name", provider_name),
            model=requested_model,
            ai_mode=getattr(scenario, "ai_mode", "") or "",
            prompt=prompt,
            params=params or {},
            result="",
        )

        try:
            result = provider.generate_plan(prompt=prompt, params=params)
        except Exception as e:
            try:
                log.result = f"ERROR: {type(e).__name__}: {e}"
                log.save(update_fields=["result"])
            except Exception:
                pass
            raise ValidationError({"detail": f"AI provider failed: {e}"})

        result_text = getattr(result, "text", None) or ""
        result_model = getattr(result, "model", None) or requested_model

        try:
            log.result = result_text
            log.model = result_model
            log.save(update_fields=["result", "model"])
        except Exception:
            pass

        scenario.plan_text = result_text
        scenario.save(update_fields=["plan_text", "updated_at"])

        return Response(
            {
                "scenario_id": str(scenario.id),
                "plan_text": result_text,
                "meta": {"provider": getattr(provider, "name", provider_name), "model": result_model},
            },
            status=status.HTTP_200_OK,
        )
