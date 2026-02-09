from django.conf import settings
from django.db import models
from django.utils import timezone

from scenarios.models import Scenario, AIMode

class AISettings(models.Model):
    """
    Singleton-настройки генерации.
    Редактируются админом.
    """
    id = models.PositiveSmallIntegerField(primary_key=True, default=1, editable=False)

    generation_enabled = models.BooleanField(
        default=True,
        help_text="Глобально включает/выключает генерацию план-конспекта (экономия бюджета).",
    )

    daily_generations_per_user = models.PositiveIntegerField(
        default=10,
        help_text="Лимит генераций на одного пользователя в сутки. 0 = запрет всем (кроме staff/superuser при bypass).",
    )

    bypass_limit_for_staff = models.BooleanField(
        default=True,
        help_text="Разрешить staff/superuser игнорировать лимиты и выключатель.",
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "AI Settings"
        verbose_name_plural = "AI Settings"

    def __str__(self) -> str:
        return "AI Settings (singleton)"


class AIGenerationEvent(models.Model):
    """
    Лог событий генерации (для лимитов + аудита).
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ai_generation_events")
    scenario = models.ForeignKey("scenarios.Scenario", on_delete=models.SET_NULL, null=True, blank=True)
    provider = models.CharField(max_length=64, default="", blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    input_chars = models.PositiveIntegerField(default=0)
    output_chars = models.PositiveIntegerField(default=0)
    ok = models.BooleanField(default=True)
    error_code = models.CharField(max_length=64, default="", blank=True)
    error_message = models.TextField(default="", blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "created_at"]),
            models.Index(fields=["created_at"]),
        ]
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.user_id} {self.created_at:%Y-%m-%d %H:%M} ok={self.ok}"
    
class AIGenerationLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ai_generations")
    scenario = models.ForeignKey(Scenario, on_delete=models.CASCADE, related_name="ai_generations")

    provider = models.CharField(max_length=64)
    model = models.CharField(max_length=128, blank=True, default="")
    ai_mode = models.CharField(max_length=16, choices=AIMode.choices, default=AIMode.BALANCED)

    prompt = models.TextField()
    result = models.TextField()
    params = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["scenario", "created_at"]),
            models.Index(fields=["user", "created_at"]),
        ]

    def __str__(self) -> str:
        return f"AI gen {self.provider}:{self.model} ({self.created_at})"

class AIServiceSettings(models.Model):
    """
    Глобальные настройки AI-сервиса (вкл/выкл и лимиты).
    Предполагается одна запись (singleton) с id=1.
    """
    is_enabled = models.BooleanField(default=True)
    daily_limit_per_user = models.PositiveIntegerField(default=20)

    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def get_solo(cls):
        obj, _ = cls.objects.get_or_create(id=1, defaults={
            "is_enabled": True,
            "daily_limit_per_user": 20,
        })
        return obj

    def __str__(self):
        return f"AI settings: enabled={self.is_enabled}, daily_limit={self.daily_limit_per_user}"
