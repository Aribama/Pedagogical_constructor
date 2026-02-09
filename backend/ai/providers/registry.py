# /srv/lessonapp/backend/ai/providers/registry.py

from typing import Dict, List

from .base import AIProvider
from .dummy import DummyProvider


def list_providers() -> List[str]:
    return ["dummy", "deepseek"]


def get_provider(name: str) -> AIProvider:
    name = (name or "").lower().strip()

    if name == "deepseek":
        from .deepseek import DeepSeekProvider
        return DeepSeekProvider()

    return DummyProvider()
