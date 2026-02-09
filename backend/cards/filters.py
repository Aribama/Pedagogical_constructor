from __future__ import annotations

import django_filters
from django.db.models import Q
from rest_framework.exceptions import ValidationError

from .models import TechniqueCard


def _split_csv(value: str | None) -> list[str]:
    if not value:
        return []
    return [v.strip() for v in str(value).split(",") if v.strip()]


def _logic_value(v: str | None, default: str = "any") -> str:
    v = (v or default).lower().strip()
    return v if v in ("any", "all") else default


AUX_KINDS = {
    TechniqueCard.CardKind.AUX_ORG,
    TechniqueCard.CardKind.AUX_TEAM_SPLIT,
    TechniqueCard.CardKind.AUX_WARMUP,
    TechniqueCard.CardKind.AUX_REFLECTION,
}


class TechniqueCardFilter(django_filters.FilterSet):
    q = django_filters.CharFilter(method="filter_q")

    kinds_simple = django_filters.CharFilter(method="filter_kinds_simple")
    card_kind = django_filters.CharFilter(method="filter_card_kind")

    age_levels = django_filters.CharFilter(method="filter_age_levels")
    activity_type = django_filters.CharFilter(field_name="activity_type")
    work_format = django_filters.CharFilter(method="filter_work_format")
    bloom_level = django_filters.CharFilter(field_name="bloom_level")
    skills_4k = django_filters.CharFilter(method="filter_skills_4k")
    lesson_stage = django_filters.CharFilter(method="filter_lesson_stage")

    ordering = django_filters.OrderingFilter(fields=(("title", "title"),))

    class Meta:
        model = TechniqueCard
        fields = [
            "q",
            "kinds_simple",
            "card_kind",
            "age_levels",
            "activity_type",
            "work_format",
            "bloom_level",
            "skills_4k",
            "lesson_stage",
        ]

    def filter_q(self, qs, name, value):
        value = (value or "").strip()
        if not value:
            return qs
        return qs.filter(Q(title__icontains=value) | Q(description_html__icontains=value))

    def filter_kinds_simple(self, qs, name, value):
        selected = set(_split_csv(value))
        if not selected:
            return qs

        allowed = {"main", "aux"}
        unknown = sorted(selected - allowed)
        if unknown:
            raise ValidationError({name: f"Unknown values: {unknown}. Allowed: main, aux"})

        logic = _logic_value(self.request.query_params.get("logic"), default="any")

        group_q = []
        if "main" in selected:
            group_q.append(Q(card_kind=TechniqueCard.CardKind.TECHNIQUE))
        if "aux" in selected:
            group_q.append(Q(card_kind__in=list(AUX_KINDS)))

        if logic == "any":
            cond = Q()
            for qobj in group_q:
                cond |= qobj
            return qs.filter(cond)

        cond = Q()
        for qobj in group_q:
            cond &= qobj
        return qs.filter(cond)

    def filter_card_kind(self, qs, name, value):
        selected = set(_split_csv(value))
        if not selected:
            return qs

        allowed = {k for k, _ in TechniqueCard.CardKind.choices}
        unknown = sorted(selected - allowed)
        if unknown:
            raise ValidationError({name: f"Unknown values: {unknown}. Allowed: {sorted(allowed)}"})

        logic = _logic_value(self.request.query_params.get("logic_kind"), default="any")
        if logic == "any":
            return qs.filter(card_kind__in=list(selected))

        cond = Q()
        for k in selected:
            cond &= Q(card_kind=k)
        return qs.filter(cond)

    def filter_age_levels(self, qs, name, value):
        vals = set(_split_csv(value))
        if not vals:
            return qs
        allowed = {"a1", "a2", "a3"}
        unknown = sorted(vals - allowed)
        if unknown:
            raise ValidationError({name: f"Unknown values: {unknown}. Allowed: a1,a2,a3"})

        logic = _logic_value(self.request.query_params.get("logic_age"), default=_logic_value(self.request.query_params.get("logic"), "any"))

        clauses = []
        if "a1" in vals:
            clauses.append(Q(age_a1=True))
        if "a2" in vals:
            clauses.append(Q(age_a2=True))
        if "a3" in vals:
            clauses.append(Q(age_a3=True))

        if logic == "any":
            cond = Q()
            for c in clauses:
                cond |= c
            return qs.filter(cond)

        cond = Q()
        for c in clauses:
            cond &= c
        return qs.filter(cond)

    def filter_work_format(self, qs, name, value):
        vals = set(_split_csv(value))
        if not vals:
            return qs
        allowed = {"individual", "group"}
        unknown = sorted(vals - allowed)
        if unknown:
            raise ValidationError({name: f"Unknown values: {unknown}. Allowed: individual,group"})

        logic = _logic_value(self.request.query_params.get("logic_work"), default=_logic_value(self.request.query_params.get("logic"), "any"))

        clauses = []
        if "individual" in vals:
            clauses.append(Q(work_individual=True))
        if "group" in vals:
            clauses.append(Q(work_group=True))

        if logic == "any":
            cond = Q()
            for c in clauses:
                cond |= c
            return qs.filter(cond)

        cond = Q()
        for c in clauses:
            cond &= c
        return qs.filter(cond)

    def filter_skills_4k(self, qs, name, value):
        vals = set(_split_csv(value))
        if not vals:
            return qs
        allowed = {"critical", "creative", "communication", "collaboration"}
        unknown = sorted(vals - allowed)
        if unknown:
            raise ValidationError({name: f"Unknown values: {unknown}. Allowed: {sorted(allowed)}"})

        logic = _logic_value(self.request.query_params.get("logic_4k"), default=_logic_value(self.request.query_params.get("logic"), "any"))

        clauses = []
        if "critical" in vals:
            clauses.append(Q(k_critical=True))
        if "creative" in vals:
            clauses.append(Q(k_creative=True))
        if "communication" in vals:
            clauses.append(Q(k_communication=True))
        if "collaboration" in vals:
            clauses.append(Q(k_collaboration=True))

        if logic == "any":
            cond = Q()
            for c in clauses:
                cond |= c
            return qs.filter(cond)

        cond = Q()
        for c in clauses:
            cond &= c
        return qs.filter(cond)

    def filter_lesson_stage(self, qs, name, value):
        vals = set(_split_csv(value))
        if not vals:
            return qs
        allowed = {"start", "core", "final"}
        unknown = sorted(vals - allowed)
        if unknown:
            raise ValidationError({name: f"Unknown values: {unknown}. Allowed: start,core,final"})

        logic = _logic_value(self.request.query_params.get("logic_stage"), default=_logic_value(self.request.query_params.get("logic"), "any"))

        clauses = []
        if "start" in vals:
            clauses.append(Q(stage_start=True))
        if "core" in vals:
            clauses.append(Q(stage_core=True))
        if "final" in vals:
            clauses.append(Q(stage_final=True))

        if logic == "any":
            cond = Q()
            for c in clauses:
                cond |= c
            return qs.filter(cond)

        cond = Q()
        for c in clauses:
            cond &= c
        return qs.filter(cond)
