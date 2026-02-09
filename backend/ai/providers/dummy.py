from .base import AIProvider, GeneratePlanResult

class DummyProvider:
    name = "dummy"

    def generate_plan(self, *, prompt: str, params: dict) -> GeneratePlanResult:
        html = (
            "<h2>План-конспект (заглушка)</h2>"
            "<p>Это временный результат генерации.</p>"
            "<p><b>AI mode:</b> {mode}</p>"
        ).format(mode=params.get("ai_mode","balanced"))
        return GeneratePlanResult(text=html, model="dummy-1", raw={"ok": True})
