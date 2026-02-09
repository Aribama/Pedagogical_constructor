# backend/ai/providers/deepseek.py
import os
import requests
from dataclasses import dataclass

from .base import GeneratePlanResult


@dataclass
class DeepSeekProvider:
    name: str = "deepseek"

    def __init__(self):
        self.api_key = os.getenv("DEEPSEEK_API_KEY", "").strip()
        self.base_url = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com").rstrip("/")
        self.model = os.getenv("DEEPSEEK_MODEL", "deepseek-chat").strip()

        if not self.api_key:
            raise RuntimeError("DEEPSEEK_API_KEY is not set")

    def generate_plan(self, *, prompt: str, params: dict) -> GeneratePlanResult:
        lesson_input = params.get("lesson_input", {})
        messages = [
            {"role": "system", "content": prompt},
            {"role": "user", "content": self._to_user_content(lesson_input)},
        ]

        url = f"{self.base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": params.get("temperature", 0.2),
        }

        r = requests.post(url, headers=headers, json=payload, timeout=90)
        r.raise_for_status()
        data = r.json()

        text = (data.get("choices") or [{}])[0].get("message", {}).get("content", "") or ""
        return GeneratePlanResult(text=text, model=self.model, raw=data)

    def _to_user_content(self, lesson_input: dict) -> str:
        import json
        return json.dumps(lesson_input, ensure_ascii=False, indent=2)
