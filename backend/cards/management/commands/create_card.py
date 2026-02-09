from __future__ import annotations

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from cards.models import TechniqueCard


class Command(BaseCommand):
    help = "Create a single TechniqueCard from CLI"

    def add_arguments(self, parser):
        parser.add_argument("--owner", required=True, help="Owner username or email")
        parser.add_argument("--title", required=True)
        parser.add_argument("--description", required=True)

        parser.add_argument(
            "--kind",
            dest="card_kind",
            choices=[
                "technique",
                "aux_org",
                "aux_team_split",
                "aux_warmup",
                "aux_reflection",
            ],
            default="technique",
            help="Card kind",
        )

        parser.add_argument("--duration", type=int, default=0)
        parser.add_argument("--activity", choices=["active", "calm"], default="calm")
        parser.add_argument(
            "--bloom",
            choices=["remember", "understand", "apply", "analyze", "evaluate", "create"],
            default="understand",
        )

        # возраст
        parser.add_argument("--a1", action="store_true")
        parser.add_argument("--a2", action="store_true")
        parser.add_argument("--a3", action="store_true")

        # формат
        parser.add_argument("--individual", action="store_true")
        parser.add_argument("--group", action="store_true")

        # 4K
        parser.add_argument("--critical", action="store_true")
        parser.add_argument("--creative", action="store_true")
        parser.add_argument("--communication", action="store_true")
        parser.add_argument("--collaboration", action="store_true")

        # этапы
        parser.add_argument("--stage-start", dest="stage_start", action="store_true")
        parser.add_argument("--stage-core", dest="stage_core", action="store_true")
        parser.add_argument("--stage-final", dest="stage_final", action="store_true")

        # публикация
        parser.add_argument("--public", action="store_true", help="Create as public card")

    def handle(self, *args, **opts):
        User = get_user_model()

        owner_key = opts["owner"]
        owner = (
            User.objects.filter(username=owner_key).first()
            or User.objects.filter(email=owner_key).first()
        )
        if not owner:
            raise CommandError(f"Owner not found by username/email: {owner_key}")

        # Минимальные проверки
        if not (opts["a1"] or opts["a2"] or opts["a3"]):
            raise CommandError("Select at least one age level: --a1/--a2/--a3")

        if not (opts["stage_start"] or opts["stage_core"] or opts["stage_final"]):
            raise CommandError(
                "Select at least one lesson stage: "
                "--stage-start/--stage-core/--stage-final"
            )

        if not (opts["individual"] or opts["group"]):
            raise CommandError(
                "Select at least one work format: --individual and/or --group"
            )

        if opts["card_kind"] == "aux_team_split" and not opts["group"]:
            raise CommandError("aux_team_split should be group-based: add --group")

        card = TechniqueCard(
            owner=owner,
            author=owner,
            title=opts["title"],
            description_html=opts["description"],
            card_kind=opts["card_kind"],
            duration_min=opts["duration"],
            activity_type=opts["activity"],
            bloom_level=opts["bloom"],
            age_a1=opts["a1"],
            age_a2=opts["a2"],
            age_a3=opts["a3"],
            work_individual=opts["individual"],
            work_group=opts["group"],
            k_critical=opts["critical"],
            k_creative=opts["creative"],
            k_communication=opts["communication"],
            k_collaboration=opts["collaboration"],
            stage_start=opts["stage_start"],
            stage_core=opts["stage_core"],
            stage_final=opts["stage_final"],
            status="public" if opts["public"] else "draft",
            created_at=timezone.now(),
        )

        card.save()

        self.stdout.write(
            self.style.SUCCESS(
                f"Card created: id={card.id}, kind={card.card_kind}, "
                f"status={card.status}, title='{card.title}'"
            )
        )
