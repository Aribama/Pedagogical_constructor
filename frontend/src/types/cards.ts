export type CardStatus = "draft" | "pending" | "public" | "rejected" | "archived";

export type TechniqueCard = {
  id: number;
  title: string;
  description_html: string;
  duration_min: number;

  status: CardStatus;
  activity_type: "active" | "calm";
  bloom_level: string;

  age_a1: boolean; age_a2: boolean; age_a3: boolean;
  work_individual: boolean; work_group: boolean;

  k_critical: boolean; k_creative: boolean; k_communication: boolean; k_collaboration: boolean;

  stage_start: boolean; stage_core: boolean; stage_final: boolean;
  card_kind:
  | "technique"
  | "aux_team_split"
  | "aux_warmup"
  | "aux_reflection"
  | "aux_org";
};

export type CardsListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: TechniqueCard[];
};

