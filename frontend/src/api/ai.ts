import { http } from "./http";

type GeneratePlanParams = Record<string, any>;

function normalizeScenarioId(input: any): number {
  if (typeof input === "number") {
    return input;
  }

  if (input && typeof input === "object") {
    if (typeof input.scenario_id === "number") {
      return input.scenario_id;
    }

    if (
      input.scenario_id &&
      typeof input.scenario_id === "object" &&
      typeof input.scenario_id.scenario_id === "number"
    ) {
      return input.scenario_id.scenario_id;
    }
  }

  throw new Error("Invalid scenario_id for AI generation");
}

export async function generatePlan(
  scenarioId: number | any,
  provider: "dummy" | "deepseek" = "deepseek",
  params: GeneratePlanParams = {}
) {
  const normalizedScenarioId = normalizeScenarioId(scenarioId);

  return http.post("/ai/generate-plan/", {
    scenario_id: normalizedScenarioId,
    provider,
    params,
  });
}
