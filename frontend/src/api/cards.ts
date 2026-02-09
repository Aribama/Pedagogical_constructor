import { http } from "./http";
import type { CardsListResponse, TechniqueCard } from "../types/cards";

export type Logic = "any" | "all";
export type Mode = "simple" | "advanced";

export type CardsQuery = {
  q?: string;

  activity_type?: string[];
  bloom_levels?: string[];

  age_levels?: string[];
  work_format?: string[];
  skills_4k?: string[];
  lesson_stage?: string[];

  duration_max?: number;

  mode?: Mode;

  logic?: Logic;

  logic_activity?: Logic;
  logic_bloom?: Logic;
  logic_age?: Logic;
  logic_work?: Logic;
  logic_4k?: Logic;
  logic_stage?: Logic;
};

export function toParams(q: CardsQuery): URLSearchParams {
  const p = new URLSearchParams();

  if (q.q) p.set("q", q.q);

  const mode: Mode = q.mode ?? "simple";
  const globalLogic: Logic = q.logic ?? "any";

  p.set("mode", mode);

  if (q.logic) p.set("logic", q.logic);

  if (mode === "simple") {
    p.set("logic_activity", globalLogic);
    p.set("logic_bloom", globalLogic);
    p.set("logic_age", globalLogic);
    p.set("logic_work", globalLogic);
    p.set("logic_4k", globalLogic);
    p.set("logic_stage", globalLogic);
  } else {
    if (q.logic_activity) p.set("logic_activity", q.logic_activity);
    if (q.logic_bloom) p.set("logic_bloom", q.logic_bloom);

    if (q.logic_age) p.set("logic_age", q.logic_age);
    if (q.logic_work) p.set("logic_work", q.logic_work);
    if (q.logic_4k) p.set("logic_4k", q.logic_4k);
    if (q.logic_stage) p.set("logic_stage", q.logic_stage);
  }

  if (q.activity_type?.length) p.set("activity_type", q.activity_type.join(","));
  if (q.bloom_levels?.length) p.set("bloom_level", q.bloom_levels.join(","));

  if (q.age_levels?.length) p.set("age_levels", q.age_levels.join(","));
  if (q.work_format?.length) p.set("work_format", q.work_format.join(","));
  if (q.skills_4k?.length) p.set("skills_4k", q.skills_4k.join(","));
  if (q.lesson_stage?.length) p.set("lesson_stage", q.lesson_stage.join(","));

  if (q.duration_max != null) p.set("duration_max", String(q.duration_max));

  return p;
}

export async function listCards(query: CardsQuery): Promise<TechniqueCard[]> {
  const params = toParams(query);
  const res = await http.get<TechniqueCard[] | CardsListResponse>(`/cards/?${params.toString()}`);

  const data = res.data;
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function getCard(id: number): Promise<TechniqueCard> {
  const res = await http.get<TechniqueCard>(`/cards/${id}/`);
  return res.data;
}
