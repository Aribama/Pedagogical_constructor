from rest_framework import serializers
from .models import TechniqueCard, CardStatus

class TechniqueCardSerializer(serializers.ModelSerializer):
    card_kind = serializers.ChoiceField(choices=TechniqueCard.CardKind.choices)

    class Meta:
        model = TechniqueCard
        fields = [
            "id",
            "title",
            "description_html",
            "card_kind",
            "duration_min",
            "activity_type",
            "bloom_level",
            "age_a1", "age_a2", "age_a3",
            "work_individual", "work_group",
            "k_critical", "k_creative", "k_communication", "k_collaboration",
            "stage_start", "stage_core", "stage_final",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

class TechniqueCardListSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechniqueCard
        fields = [
            "id","title","duration_min","status",
            "card_kind",
            "activity_type","bloom_level",
            "age_a1","age_a2","age_a3",
            "work_individual","work_group",
            "k_critical","k_creative","k_communication","k_collaboration",
            "stage_start","stage_core","stage_final",
            "author","created_at","updated_at",
        ]


class TechniqueCardDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechniqueCard
        fields = [
            "id","title","description_html","duration_min",
            "status","activity_type","bloom_level",
            "age_a1","age_a2","age_a3",
            "work_individual","work_group",
            "k_critical","k_creative","k_communication","k_collaboration",
            "stage_start","stage_core","stage_final",
            "author","moderated_by","moderated_at","archived_at",
            "created_at","updated_at",
        ]
        read_only_fields = ["author","moderated_by","moderated_at","archived_at","created_at","updated_at","status"]


class TechniqueCardCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechniqueCard
        fields = [
            "title","description_html","duration_min",
            "activity_type","bloom_level",
            "age_a1","age_a2","age_a3",
            "work_individual","work_group",
            "k_critical","k_creative","k_communication","k_collaboration",
            "stage_start","stage_core","stage_final",
        ]

    def validate(self, attrs):
        if not (attrs.get("work_individual", False) or attrs.get("work_group", False)):
            raise serializers.ValidationError("Нужно выбрать индивидуальная и/или групповая работа.")
        if not (attrs.get("age_a1", False) or attrs.get("age_a2", False) or attrs.get("age_a3", False)):
            raise serializers.ValidationError("Нужно выбрать хотя бы один возрастной уровень.")
        if not (attrs.get("stage_start", False) or attrs.get("stage_core", False) or attrs.get("stage_final", False)):
            raise serializers.ValidationError("Нужно выбрать хотя бы один этап занятия.")
        if attrs.get("duration_min", 0) <= 0:
            raise serializers.ValidationError("duration_min должен быть > 0.")
        return attrs


class CardSubmitSerializer(serializers.Serializer):
    pass


class CardModerationSerializer(serializers.Serializer):
    reason = serializers.CharField(required=False, allow_blank=True, default="")
