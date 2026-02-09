from __future__ import annotations
from dataclasses import dataclass
from typing import Protocol

@dataclass
class GeneratePlanResult:
    text: str
    model: str = ""
    raw: dict | None = None

class AIProvider(Protocol):
    name: str
    def generate_plan(self, *, prompt: str, params: dict) -> GeneratePlanResult: ...
