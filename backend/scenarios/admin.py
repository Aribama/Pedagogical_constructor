from django.contrib import admin

from .models import Scenario, ScenarioItem


class ScenarioItemInline(admin.TabularInline):
    model = ScenarioItem
    extra = 0
    autocomplete_fields = ("technique_card",)
    ordering = ("position",)


@admin.register(Scenario)
class ScenarioAdmin(admin.ModelAdmin):
    list_display = ("id", "owner", "name", "ai_mode", "duration_min", "updated_at")
    list_filter = ("ai_mode", "day_time", "emotionality")
    search_fields = ("name", "owner__username", "owner__email")
    readonly_fields = ("created_at", "updated_at")
    inlines = (ScenarioItemInline,)


@admin.register(ScenarioItem)
class ScenarioItemAdmin(admin.ModelAdmin):
    list_display = ("scenario", "position", "technique_card", "created_at")
    list_filter = ("scenario",)
    search_fields = ("scenario__name", "technique_card__title")
    ordering = ("scenario", "position")
