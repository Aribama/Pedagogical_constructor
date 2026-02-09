import uuid

from django.conf import settings
from django.db import models


class AuditAction(models.TextChoices):
    LOGIN = "login", "Успешный вход"
    CREATE = "create", "Создание"
    UPDATE = "update", "Изменение"
    DELETE = "delete", "Удаление"
    SUBMIT = "submit", "Отправка на модерацию"
    APPROVE = "approve", "Одобрение"
    REJECT = "reject", "Отклонение"
    ARCHIVE = "archive", "Архивирование"
    GENERATE = "generate", "AI-генерация"


class EntityType(models.TextChoices):
    USER = "user", "Пользователь"
    CARD = "card", "Карточка"
    SCENARIO = "scenario", "Сценарий"
    AI_GENERATION = "ai_generation", "AI генерация"


class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    actor = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    action = models.CharField(max_length=16, choices=AuditAction.choices)
    entity_type = models.CharField(max_length=32, choices=EntityType.choices)
    entity_id = models.UUIDField(null=True, blank=True)

    meta = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["entity_type", "entity_id", "created_at"]),
            models.Index(fields=["actor", "created_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.action} {self.entity_type}:{self.entity_id}"
