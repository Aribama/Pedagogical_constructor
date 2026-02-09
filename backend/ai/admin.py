from django.contrib import admin
from .models import AISettings, AIGenerationEvent

from .models import AIGenerationLog

@admin.register(AISettings)
class AISettingsAdmin(admin.ModelAdmin):
    list_display = ("id", "generation_enabled", "daily_generations_per_user", "bypass_limit_for_staff", "updated_at")
    readonly_fields = ("id", "updated_at")

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(AIGenerationEvent)
class AIGenerationEventAdmin(admin.ModelAdmin):
    list_display = ("created_at", "user", "scenario", "provider", "ok", "error_code")
    list_filter = ("ok", "provider", "created_at")
    search_fields = ("user__username", "user__email", "error_code", "error_message")
    readonly_fields = (
        "user", "scenario", "provider", "created_at",
        "input_chars", "output_chars", "ok", "error_code", "error_message"
    )
    
@admin.register(AIGenerationLog)
class AIGenerationLogAdmin(admin.ModelAdmin):
    list_display = ("created_at", "user", "scenario", "provider", "model", "ai_mode")
    list_filter = ("provider", "ai_mode")
    search_fields = ("user__username", "user__email", "scenario__name", "prompt")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
