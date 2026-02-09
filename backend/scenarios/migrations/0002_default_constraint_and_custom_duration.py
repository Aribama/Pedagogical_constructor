from django.conf import settings
from django.db import migrations, models
from django.db.models import Q


def dedupe_default_scenarios(apps, schema_editor):
    Scenario = apps.get_model("scenarios", "Scenario")
    # Для каждого owner оставляем один default (минимальный id), остальные удаляем
    # (вместе с items — каскад удалит)
    owners = (
        Scenario.objects
        .filter(name__isnull=True)
        .values_list("owner_id", flat=True)
        .distinct()
    )
    for owner_id in owners:
        qs = Scenario.objects.filter(owner_id=owner_id, name__isnull=True).order_by("id")
        first = qs.first()
        if not first:
            continue
        extras = qs.exclude(id=first.id)
        if extras.exists():
            extras.delete()


class Migration(migrations.Migration):

    dependencies = [
        ("scenarios", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="scenarioitem",
            name="custom_duration_min",
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.RunPython(dedupe_default_scenarios, reverse_code=migrations.RunPython.noop),
        migrations.AddConstraint(
            model_name="scenario",
            constraint=models.UniqueConstraint(
                fields=("owner",),
                condition=Q(name__isnull=True),
                name="uniq_default_scenario_per_owner",
            ),
        ),
    ]
