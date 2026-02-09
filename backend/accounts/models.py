from django.conf import settings
from django.db import models


class UserRole(models.TextChoices):
    USER = "user", "Преподаватель"
    MODERATOR = "moderator", "Методист"
    ADMIN = "admin", "Администратор"


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    role = models.CharField(max_length=16, choices=UserRole.choices, default=UserRole.USER)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.user.username} ({self.role})"

