import { http } from "./http";
import type {
  ScenarioPatch,
  ScenarioRead,
  ScenarioItemPatch,
} from "../types/scenarios";

export async function getDefaultScenario(): Promise<ScenarioRead> {
  const res = await http.get<ScenarioRead>("/scenarios/default/");
  return res.data;
}

export async function listScenarios(): Promise<ScenarioRead[]> {
  const res = await http.get<ScenarioRead[]>("/scenarios/");
  return res.data;
}

export async function getScenario(id: number): Promise<ScenarioRead> {
  const res = await http.get<ScenarioRead>(`/scenarios/${id}/`);
  return res.data;
}

export async function createScenario(payload: ScenarioPatch): Promise<ScenarioRead> {
  const res = await http.post<ScenarioRead>("/scenarios/", payload);
  return res.data;
}

export async function updateScenario(
  id: number,
  patch: ScenarioPatch
): Promise<ScenarioRead> {
  const res = await http.patch<ScenarioRead>(`/scenarios/${id}/`, patch);
  return res.data;
}

export async function saveDefaultAs(name: string): Promise<ScenarioRead> {
  const res = await http.post<ScenarioRead>("/scenarios/save-as/", { name });
  return res.data;
}

export async function saveScenarioAs(
  scenarioId: number,
  name: string
): Promise<ScenarioRead> {
  const res = await http.post<ScenarioRead>(
    `/scenarios/${scenarioId}/save-as/`,
    { name }
  );
  return res.data;
}

export async function duplicateScenario(id: number): Promise<ScenarioRead> {
  const res = await http.post<ScenarioRead>(`/scenarios/${id}/duplicate/`);
  return res.data;
}

export async function deleteScenario(id: number): Promise<void> {
  await http.delete(`/scenarios/${id}/`);
}

export async function autosaveScenarioItems(
  scenarioId: number,
  items: ScenarioItemPatch[]
): Promise<ScenarioRead> {
  const res = await http.put<ScenarioRead>(
    `/scenarios/${scenarioId}/autosave-items/`,
    { items }
  );
  return res.data;
}

export const autosaveItems = autosaveScenarioItems;
export const updateScenarioFields = updateScenario;

export async function saveAsNamed(
  scenarioId: number,
  name: string
): Promise<ScenarioRead> {
  return saveScenarioAs(scenarioId, name);
}
