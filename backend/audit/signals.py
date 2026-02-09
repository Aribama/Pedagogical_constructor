from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver

from .models import AuditAction, EntityType
from .services import log_event


@receiver(user_logged_in)
def on_login_success(sender, request, user, **kwargs):
    ip = request.META.get("REMOTE_ADDR")
    log_event(
        actor=user,
        action=AuditAction.LOGIN,
        entity_type=EntityType.USER,
        entity_id=None,
        meta={"ip": ip},
    )
