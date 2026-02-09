from rest_framework import serializers

class GeneratePlanSerializer(serializers.Serializer):
    scenario_id = serializers.UUIDField()
    provider = serializers.CharField(default="dummy")
    params = serializers.DictField(required=False, default=dict)
