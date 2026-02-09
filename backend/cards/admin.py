from django.contrib import admin

from .models import TechniqueCard, CardStatus


@admin.register(TechniqueCard)
class TechniqueCardAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "status",
        "author",
        "activity_type",
        "bloom_level",
        "duration_min",
        "updated_at",
    )
    list_filter = (
        "status",
        "activity_type",
        "bloom_level",
        "age_a1",
        "age_a2",
        "age_a3",
        "work_individual",
        "work_group",
        "k_critical",
        "k_creative",
        "k_communication",
        "k_collaboration",
        "stage_start",
        "stage_core",
        "stage_final",
    )
    search_fields = ("title", "description_html", "author__username", "author__email")
    readonly_fields = ("created_at", "updated_at", "moderated_at", "archived_at")
    ordering = ("title",)

    fieldsets = (
        ("Основное", {"fields": ("title", "description_html", "duration_min")}),
        ("Категории", {"fields": ("activity_type", "bloom_level")}),
        ("Возраст", {"fields": ("age_a1", "age_a2", "age_a3")}),
        ("Формат работы", {"fields": ("work_individual", "work_group")}),
        ("4K", {"fields": ("k_critical", "k_creative", "k_communication", "k_collaboration")}),
        ("Этап", {"fields": ("stage_start", "stage_core", "stage_final")}),
        ("Модерация", {"fields": ("status", "author", "moderated_by", "moderated_at", "archived_at")}),
        ("Служебное", {"fields": ("created_at", "updated_at")}),
    )
