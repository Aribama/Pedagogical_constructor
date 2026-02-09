from __future__ import annotations

from django.db.models import Q
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.filters import OrderingFilter

from accounts.permissions import IsOwnerOrReadOnly, IsModeratorOrAdmin
from audit.models import AuditAction, EntityType
from audit.services import log_event

from .models import TechniqueCard, CardStatus
from .serializers import (
    TechniqueCardListSerializer,
    TechniqueCardDetailSerializer,
    TechniqueCardCreateUpdateSerializer,
    CardSubmitSerializer,
    CardModerationSerializer,
)

from .filters import TechniqueCardFilter

class TechniqueCardViewSet(viewsets.ModelViewSet):
    """
    list:
      GET /api/cards/?search=...&any=field1,field2&all=field3&activity_type=active&bloom_level=apply&ordering=title
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    search_fields = ["title", "description_html"]
    ordering_fields = ["title", "created_at", "updated_at", "duration_min"]
    ordering = ["title"]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = TechniqueCardFilter
    

    def get_queryset(self):
        qs = TechniqueCard.objects.all()

        qs = qs.filter(archived_at__isnull=True)

        user = self.request.user
        if not user.is_authenticated:
            return qs.filter(status=CardStatus.PUBLIC)

        return qs.filter(Q(status=CardStatus.PUBLIC) | Q(owner=user)).distinct()
    def get_serializer_class(self):
        if self.action == "list":
            return TechniqueCardListSerializer
        if self.action == "retrieve":
            return TechniqueCardDetailSerializer
        if self.action in ("create", "update", "partial_update"):
            return TechniqueCardCreateUpdateSerializer
        if self.action == "submit":
            return CardSubmitSerializer
        if self.action in ("approve", "reject"):
            return CardModerationSerializer
        return TechniqueCardDetailSerializer

    def perform_create(self, serializer):
        obj = serializer.save(author=self.request.user, status=CardStatus.DRAFT)
        log_event(
            actor=self.request.user,
            action=AuditAction.CREATE,
            entity_type=EntityType.CARD,
            entity_id=obj.id,
            meta={"title": obj.title},
        )

    def perform_update(self, serializer):
        obj = serializer.save()
        log_event(
            actor=self.request.user,
            action=AuditAction.UPDATE,
            entity_type=EntityType.CARD,
            entity_id=obj.id,
            meta={"title": obj.title},
        )

    def update(self, request, *args, **kwargs):
        card = self.get_object()
        if card.author != request.user:
            raise PermissionDenied("Редактировать может только автор (в MVP).")
        if card.status in (CardStatus.PENDING, CardStatus.PUBLIC):
            raise ValidationError("Нельзя редактировать карточку в статусе pending/public. Снимите с публикации или создайте копию.")
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def submit(self, request, pk=None):
        card = self.get_object()
        if card.author != request.user:
            raise PermissionDenied("Отправить на модерацию может только автор.")
        if card.status not in (CardStatus.DRAFT, CardStatus.REJECTED):
            raise ValidationError("Отправка на модерацию возможна только из draft/rejected.")

        card.status = CardStatus.PENDING
        card.save(update_fields=["status","updated_at"])

        log_event(
            actor=request.user,
            action=AuditAction.SUBMIT,
            entity_type=EntityType.CARD,
            entity_id=card.id,
            meta={},
        )
        return Response({"status": card.status}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[IsModeratorOrAdmin])
    def approve(self, request, pk=None):
        card = self.get_object()
        if card.status != CardStatus.PENDING:
            raise ValidationError("Одобрить можно только карточку в статусе pending.")

        card.status = CardStatus.PUBLIC
        card.moderated_by = request.user
        card.moderated_at = timezone.now()
        card.save(update_fields=["status","moderated_by","moderated_at","updated_at"])

        log_event(
            actor=request.user,
            action=AuditAction.APPROVE,
            entity_type=EntityType.CARD,
            entity_id=card.id,
            meta={},
        )
        return Response({"status": card.status}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[IsModeratorOrAdmin])
    def reject(self, request, pk=None):
        card = self.get_object()
        if card.status != CardStatus.PENDING:
            raise ValidationError("Отклонить можно только карточку в статусе pending.")

        ser = CardModerationSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        card.status = CardStatus.REJECTED
        card.moderated_by = request.user
        card.moderated_at = timezone.now()
        card.save(update_fields=["status","moderated_by","moderated_at","updated_at"])

        log_event(
            actor=request.user,
            action=AuditAction.REJECT,
            entity_type=EntityType.CARD,
            entity_id=card.id,
            meta={"reason": ser.validated_data.get("reason","")},
        )
        return Response({"status": card.status}, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        card = self.get_object()
        if card.author != request.user and not IsModeratorOrAdmin().has_permission(request, self):
            raise PermissionDenied("Архивировать может автор или модератор/админ.")

        card.status = CardStatus.ARCHIVED
        card.archived_at = timezone.now()
        card.save(update_fields=["status","archived_at","updated_at"])

        log_event(
            actor=request.user,
            action=AuditAction.ARCHIVE,
            entity_type=EntityType.CARD,
            entity_id=card.id,
            meta={},
        )
        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_permissions(self):
        if self.action in ("update", "partial_update", "destroy", "archive", "submit"):
            return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
        if self.action in ("approve", "reject"):
            return [permissions.IsAuthenticated(), IsModeratorOrAdmin()]
        if self.action == "create":
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticatedOrReadOnly()]
