from django.conf import settings
from django.db import models
from django.db.models import Q

from cards.models import TechniqueCard


class Emotionality(models.TextChoices):
    CALM = "calm", "Спокойная и собранная"
    MODERATE = "moderate", "Умеренно активная"
    VERY_ACTIVE = "very_active", "Очень активная и энергичная"
    TIRES_FAST = "tires_fast", "Быстро утомляемая"
    ANXIOUS = "anxious", "Тревожная / неуверенная"
    DISCONNECTED = "disconnected", "Разобщённая / требует вовлечения"


class DayTime(models.TextChoices):
    BEGIN = "begin", "Начало дня"
    MIDDLE = "middle", "Середина дня"
    END = "end", "Конец дня"


class AIMode(models.TextChoices):
    STRICT = "strict", "Strict"
    BALANCED = "balanced", "Balanced"
    FREE = "free", "Free"


class Scenario(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="scenarios",
    )

    name = models.CharField(max_length=255, null=True, blank=True)
    note = models.TextField(blank=True, default="")


    grade = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        help_text="Номер класса (например: 5, 7, 10)",
    )
    subject = models.CharField(
        max_length=128,
        null=True,
        blank=True,
        help_text="Учебный предмет (например: Математика)",
    )
    goal = models.TextField(
        null=True,
        blank=True,
        help_text="Цель занятия (свободный текст)",
    )


    emotionality = models.CharField(
        max_length=16, choices=Emotionality.choices, default=Emotionality.MODERATE
    )
    day_time = models.CharField(
        max_length=16, choices=DayTime.choices, default=DayTime.MIDDLE
    )
    group_size = models.PositiveSmallIntegerField(default=0)
    duration_min = models.PositiveSmallIntegerField(default=45)
    teacher_notes = models.TextField(blank=True, default="")

    subject_content = models.TextField(blank=True, default="")
    plan_text = models.TextField(blank=True, default="")
    ai_mode = models.CharField(max_length=16, choices=AIMode.choices, default=AIMode.BALANCED)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["owner", "name"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["owner"],
                condition=Q(name__isnull=True),
                name="uniq_default_scenario_per_owner",
            ),
        ]

    def __str__(self) -> str:
        return self.name or f"Default scenario ({self.owner_id})"


class ScenarioItem(models.Model):
    scenario = models.ForeignKey(Scenario, on_delete=models.CASCADE, related_name="items")
    technique_card = models.ForeignKey(
        TechniqueCard, on_delete=models.PROTECT, related_name="scenario_items"
    )
    position = models.PositiveIntegerField()

    custom_duration_min = models.PositiveSmallIntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["scenario", "position"], name="uniq_scenario_position"),
        ]
        indexes = [
            models.Index(fields=["scenario", "position"]),
        ]

    def __str__(self) -> str:
        return f"{self.scenario_id}:{self.position} -> {self.technique_card_id}"
