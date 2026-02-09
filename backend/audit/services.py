from __future__ import annotations
from typing import Any, Optional
from uuid import UUID

from django.contrib.auth import get_user_model
from .models import AuditLog

User = get_user_model()

def log_event(
    *,
    actor: Optional[User],
    action: str,
    entity_type: str,
    entity_id: Optional[UUID] = None,
    meta: Optional[dict[str, Any]] = None,
) -> AuditLog:
    return AuditLog.objects.create(
        actor=actor,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        meta=meta or {},
    )
