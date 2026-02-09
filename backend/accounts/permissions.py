from rest_framework.permissions import BasePermission, SAFE_METHODS

from accounts.models import UserRole


class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)


class IsModeratorOrAdmin(BasePermission):
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        role = getattr(getattr(request.user, "profile", None), "role", UserRole.USER)
        return role in (UserRole.MODERATOR, UserRole.ADMIN) or request.user.is_staff or request.user.is_superuser


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        role = getattr(getattr(request.user, "profile", None), "role", UserRole.USER)
        return role == UserRole.ADMIN or request.user.is_superuser


class IsOwnerOrReadOnly(BasePermission):
    owner_field = "author"

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        owner = getattr(obj, self.owner_field, None)
        return bool(request.user and request.user.is_authenticated and owner == request.user)
