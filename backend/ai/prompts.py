# backend/ai/prompts.py
from __future__ import annotations

from typing import Any, Dict, List


def _get_first_attr(obj: Any, names: List[str], default=None):
    for n in names:
        if hasattr(obj, n):
            v = getattr(obj, n)
            if v is not None and v != "":
                return v
    return default


def build_lesson_input(*, scenario, items, cards_by_id: Dict[int, Any], extra_params: Dict[str, Any] | None = None) -> Dict[str, Any]:
    """
    lesson_input (user-json для DeepSeek):
      passport: общая информация
      techniques: список дидактических приёмов по сценарию (items)
      subject_content: текст пользователя / материалы урока
    """
    extra_params = extra_params or {}

    passport = {
        "title": _get_first_attr(scenario, ["title", "name"], default=""),
        "subject": _get_first_attr(scenario, ["subject", "lesson_subject", "course"], default=""),
        "grade": _get_first_attr(scenario, ["grade", "class_number", "grade_number"], default=""),
        "lesson_goal": _get_first_attr(scenario, ["goal", "lesson_goal", "purpose"], default=""),
        "group_characteristics": _get_first_attr(scenario, ["group_characteristics", "group_description"], default=""),
        "conditions": _get_first_attr(scenario, ["conditions", "lesson_conditions", "environment"], default=""),
        "duration_min_total": _get_first_attr(scenario, ["duration_min", "duration_total_min"], default=None),
    }

    subject_content = extra_params.get("subject_content")
    if not subject_content:
        subject_content = _get_first_attr(
            scenario,
            ["subject_content", "materials", "materials_text", "content", "user_text", "topic_text"],
            default="",
        )

    techniques = []
    for it in items:
        card = cards_by_id.get(it.technique_card_id)
        if not card:
            continue

        custom_duration = getattr(it, "custom_duration_min", None)
        duration = custom_duration or getattr(card, "duration_min", None) or 0

        techniques.append(
            {
                "position": it.position,
                "card_id": it.technique_card_id,
                "title": getattr(card, "title", "") or getattr(card, "name", ""),
                "description": getattr(card, "description", "") or "",
                "duration_min": int(duration),
            }
        )

    return {
        "passport": passport,
        "techniques": techniques,
        "subject_content": subject_content or "",
    }


def build_multiagent_prompt() -> str:
    """
    System prompt для DeepSeek. Входные данные приходят отдельным user-json: lesson_input.
    """
    return (
        "..."
    )
