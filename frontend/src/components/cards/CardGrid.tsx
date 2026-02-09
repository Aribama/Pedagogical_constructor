import React from "react";
import type { TechniqueCard } from "../../types/cards";

type CardGridProps = {
  cards: TechniqueCard[];
  onOpen: (card: TechniqueCard) => void;
  onAdd?: (card: TechniqueCard) => void;
};

const bloomRu: Record<string, string> = {
  remember: "Запоминание",
  understand: "Понимание",
  apply: "Применение",
  analyze: "Анализ",
  evaluate: "Оценка",
  create: "Создание",
};

const auxTypeRu: Record<TechniqueCard["card_kind"], string> = {
  technique: "",
  aux_org: "Орг. момент",
  aux_team_split: "Деление на группы",
  aux_warmup: "Разминка",
  aux_reflection: "Рефлексия",
};

function getAgeText(c: TechniqueCard) {
  const parts: string[] = [];
  if (c.age_a1) parts.push("1-4");
  if (c.age_a2) parts.push("5-8");
  if (c.age_a3) parts.push("9-11");
  return parts.length ? `${parts.join(", ")} кл.` : "—";
}

function getBloomText(level: string) {
  const key = (level || "").toLowerCase();
  return bloomRu[key] ?? level ?? "—";
}

function isAuxCard(c: TechniqueCard) {
  return c.card_kind !== "technique";
}

function getCardBg(c: TechniqueCard) {
  // Вспомогательные — нейтральные
  if (isAuxCard(c)) return "#ffffff";

  // Основные — по активности
  if (c.activity_type === "active") return "#ffe4f1"; // розовый
  if (c.activity_type === "calm") return "#e7f2ff"; // голубой

  // На всякий случай fallback
  return "#ffffff";
}

function getAuxLabel(c: TechniqueCard) {
  if (!isAuxCard(c)) return "";
  // card_kind гарантированно один из aux_*
  return auxTypeRu[c.card_kind] || "Вспомогательная";
}

function StageBar({
  start,
  core,
  fin,
}: {
  start: boolean;
  core: boolean;
  fin: boolean;
}) {
  const segStyle: React.CSSProperties = {
    flex: 1,
    height: 8,
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "#f3f5f7",
  };

  const filledStyle: React.CSSProperties = {
    ...segStyle,
    background: "rgba(0,0,0,0.18)",
  };

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <div style={start ? filledStyle : segStyle} title="Начало" />
      <div style={core ? filledStyle : segStyle} title="Середина" />
      <div style={fin ? filledStyle : segStyle} title="Окончание" />
    </div>
  );
}

function Icons4KRow({
  critical,
  communication,
  collaboration,
  creative,
}: {
  critical: boolean;
  communication: boolean;
  collaboration: boolean;
  creative: boolean;
}) {
  const cell: React.CSSProperties = {
    width: "25%",
    textAlign: "center",
    lineHeight: "20px",
    height: 20,
    fontSize: 16,
    opacity: 0.85,
  };

  const empty = <span style={{ opacity: 0 }}>•</span>;

  return (
    <div style={{ display: "flex", gap: 0 }}>
      <div style={cell} title="Критическое мышление">
        {critical ? "❓" : empty}
      </div>
      <div style={cell} title="Коммуникация">
        {communication ? "💬" : empty}
      </div>
      <div style={cell} title="Коллаборация">
        {collaboration ? "🤝" : empty}
      </div>
      <div style={cell} title="Креативность">
        {creative ? "💡" : empty}
      </div>
    </div>
  );
}

export function CardGrid({ cards, onOpen, onAdd }: CardGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 12,
      }}
    >
      {cards.map((c) => {
        const bg = getCardBg(c);
        const auxLabel = getAuxLabel(c);

        const ageText = getAgeText(c);
        const bloomText = getBloomText(c.bloom_level);

        const workIcons = [c.work_individual ? "👤" : "", c.work_group ? "👥" : ""]
          .filter(Boolean)
          .join("");

        return (
          <div
            key={c.id}
            role="button"
            tabIndex={0}
            onClick={() => onOpen(c)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onOpen(c);
            }}
            style={{
              cursor: "pointer",
              background: bg,
              border: "1px solid rgba(0,0,0,0.10)",
              borderRadius: 16,
              padding: 12,
              boxShadow: "0 1px 0 rgba(0,0,0,0.03)",
              userSelect: "none",
            }}
          >
            {/* 1) Заголовок + бейдж для вспомогательных */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                alignItems: "flex-start",
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  lineHeight: "18px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
                title={c.title}
              >
                {c.title}
              </div>

              {!!auxLabel && (
                <span
                  style={{
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "rgba(0,0,0,0.06)",
                    whiteSpace: "nowrap",
                    alignSelf: "flex-start",
                  }}
                  title="Тип вспомогательной методики"
                >
                  {auxLabel}
                </span>
              )}
            </div>

            {/* 2) 4K иконки */}
            <Icons4KRow
              critical={c.k_critical}
              communication={c.k_communication}
              collaboration={c.k_collaboration}
              creative={c.k_creative}
            />

            {/* 3) Блум */}
            <div
              style={{
                marginTop: 6,
                display: "flex",
                gap: 6,
                alignItems: "center",
                fontSize: 12,
                opacity: 0.9,
              }}
            >
              <span title="Уровень по Блуму">📈</span>
              <span>{bloomText}</span>
            </div>

            {/* 4) Длительность + формат */}
            <div
              style={{
                marginTop: 6,
                display: "flex",
                gap: 8,
                alignItems: "center",
                fontSize: 12,
                opacity: 0.9,
              }}
            >
              <span title="Длительность">⏱</span>
              <span>
                {c.duration_min} мин.{" "}
                {workIcons ? (
                  <span style={{ marginLeft: 6 }} title="Формат работы">
                    {workIcons}
                  </span>
                ) : null}
              </span>

              {/* кнопка добавить справа (если onAdd задан) */}
              {onAdd ? (
                <button
                  className="btn"
                  style={{
                    marginLeft: "auto",
                    padding: "2px 8px",
                    borderRadius: 999,
                    fontSize: 12,
                    background: "rgba(255,255,255,0.65)",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onAdd(c);
                  }}
                  title="Добавить в сценарий"
                >
                  +
                </button>
              ) : null}
            </div>

            {/* 5) Возраст */}
            <div
              style={{
                marginTop: 6,
                display: "flex",
                gap: 6,
                alignItems: "center",
                fontSize: 12,
                opacity: 0.9,
              }}
            >
              <span title="Возраст">📚</span>
              <span>{ageText}</span>
            </div>

            {/* 6) Этап занятия */}
            <div style={{ marginTop: 10 }}>
              <StageBar start={c.stage_start} core={c.stage_core} fin={c.stage_final} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CardGrid;
