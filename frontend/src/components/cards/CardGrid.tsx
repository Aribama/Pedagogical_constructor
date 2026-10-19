import { ArrowUpRight, Clock3, GraduationCap, Plus, Users } from "lucide-react";
import type { TechniqueCard } from "../../types/cards";

type CardGridProps = { cards: TechniqueCard[]; onOpen: (card: TechniqueCard) => void; onAdd?: (card: TechniqueCard) => void };
const bloomRu: Record<string, string> = { remember: "Запоминание", understand: "Понимание", apply: "Применение", analyze: "Анализ", evaluate: "Оценка", create: "Создание" };
const kindRu: Record<string, string> = { aux_org: "Орг. момент", aux_team_split: "Деление на группы", aux_warmup: "Разминка", aux_reflection: "Рефлексия" };

export function CardGrid({ cards, onOpen, onAdd }: CardGridProps) {
  return <div className="technique-grid">{cards.map((c) => {
    const age = [c.age_a1 && "1–4", c.age_a2 && "5–8", c.age_a3 && "9–11"].filter(Boolean).join(", ");
    const skills = [c.k_critical && "Критическое мышление", c.k_communication && "Коммуникация", c.k_collaboration && "Сотрудничество", c.k_creative && "Креативность"].filter(Boolean);
    const kind = c.card_kind !== "technique" ? "aux" : c.activity_type;
    return <article key={c.id} className={`technique-card technique-card--${kind}`}>
      <div className="technique-top"><span className="technique-kind"><span className="status-dot" />{kindRu[c.card_kind] || (c.activity_type === "active" ? "Активный приём" : "Спокойный приём")}</span><ArrowUpRight size={16} /></div>
      <button className="technique-open" onClick={() => onOpen(c)}><h3>{c.title}</h3><span>{bloomRu[c.bloom_level] || c.bloom_level || "Педагогический приём"}</span></button>
      <div className="technique-meta"><span><Clock3 size={14}/>{c.duration_min} мин</span>{age && <span><GraduationCap size={14}/>{age} кл.</span>}<span title="Формат работы"><Users size={14}/>{[c.work_individual && "Индивидуально", c.work_group && "В группе"].filter(Boolean).join(" / ") || "Любой формат"}</span></div>
      {skills.length > 0 && <p className="technique-skills">{skills.join(" · ")}</p>}
      <div className="technique-bottom"><div className="stage-indicator" aria-label={`Этапы: ${[c.stage_start && "начало", c.stage_core && "основная часть", c.stage_final && "завершение"].filter(Boolean).join(", ")}`}><span className={c.stage_start ? "on" : ""} title="Начало"/><span className={c.stage_core ? "on" : ""} title="Основная часть"/><span className={c.stage_final ? "on" : ""} title="Завершение"/></div>{onAdd && <button type="button" className="add-technique" onClick={() => onAdd(c)} aria-label={`Добавить «${c.title}» в сценарий`}><Plus size={15}/> В сценарий</button>}</div>
    </article>;
  })}</div>;
}
export default CardGrid;
