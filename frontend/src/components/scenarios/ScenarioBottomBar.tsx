import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  Layers,
  Clock,
  ChevronDown,
  ChevronUp,
  Save,
  Trash2,
  GripVertical,
  X,
} from "lucide-react";

import { autosaveItems, getDefaultScenario } from "../../api/scenarios";
import { listCards } from "../../api/cards";
import type { ScenarioRead } from "../../types/scenarios";
import type { TechniqueCard } from "../../types/cards";

type Chip = { id: string; cardId: number; title: string };

// ---------- UI helpers (как в каталоге) ----------
function getCardBg(c?: Partial<TechniqueCard> | null) {
  if (!c) return "#ffffff";

  // ✅ Вспомогательные карточки всегда белые (независимо от activity_type)
  if (c.card_kind && c.card_kind !== "technique") return "#ffffff";

  if (c.activity_type === "active") return "#ffe4f1";
  if (c.activity_type === "calm") return "#e7f2ff";
  return "#ffffff";
}

const auxKindRu: Record<string, string> = {
  aux_org: "Орг. момент",
  aux_team_split: "Деление на группы",
  aux_warmup: "Разминка",
  aux_reflection: "Рефлексия",
};

function getAuxLabel(c?: Partial<TechniqueCard> | null) {
  if (!c) return "";
  if (c.card_kind && c.card_kind !== "technique") {
    return auxKindRu[c.card_kind] ?? "Вспомогательная";
  }
  return "";
}

function isTechniqueStep(c?: Partial<TechniqueCard> | null) {
  return !c?.card_kind || c.card_kind === "technique";
}

// ---------- Sortable horizontal card ----------
function SortableScenarioCard({
  id,
  title,
  meta,
  onRemove,
}: {
  id: string;
  title: string;
  meta: Partial<TechniqueCard> | null;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const bg = getCardBg(meta);
  const auxLabel = getAuxLabel(meta);
  const duration = meta?.duration_min;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: bg,
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 14,
    padding: 10,
    boxShadow: isDragging
      ? "0 10px 30px rgba(0,0,0,0.18)"
      : "0 1px 0 rgba(0,0,0,0.03)",
    opacity: isDragging ? 0.95 : 1,
    userSelect: "none",
    width: 240, // фикс ширина — лента ровная
    flex: "0 0 auto",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        {/* handle */}
        <button
          type="button"
          title="Перетащить"
          {...attributes}
          {...listeners}
          className="btn"
          style={{
            padding: 6,
            borderRadius: 10,
            background: "rgba(255,255,255,0.65)",
            border: "1px solid rgba(0,0,0,0.10)",
            cursor: "grab",
            lineHeight: 0,
          }}
        >
          <GripVertical size={16} />
        </button>

        {/* content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: 13,
              lineHeight: "16px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
            title={title}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 6,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {typeof duration === "number" ? (
              <span
                style={{
                  fontSize: 12,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.65)",
                  border: "1px solid rgba(0,0,0,0.10)",
                }}
                title="Длительность"
              >
                ⏱ {duration} мин.
              </span>
            ) : null}

            {!!auxLabel ? (
              <span
                style={{
                  fontSize: 12,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "rgba(0,0,0,0.06)",
                  border: "1px solid rgba(0,0,0,0.10)",
                }}
                title="Тип вспомогательной методики"
              >
                {auxLabel}
              </span>
            ) : null}
          </div>
        </div>

        {/* remove */}
        <button
          type="button"
          className="btn"
          title="Удалить шаг"
          onClick={onRemove}
          style={{
            padding: 6,
            borderRadius: 10,
            background: "rgba(255,255,255,0.65)",
            border: "1px solid rgba(0,0,0,0.10)",
            lineHeight: 0,
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function ScenarioBottomBar({
  requestAddCardRef,
}: {
  addCard?: (cardId: number, title: string) => void;
  requestAddCardRef?: React.MutableRefObject<
    ((cardId: number, title: string) => void) | null
  >;
}) {
  const nav = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const [scenario, setScenario] = useState<ScenarioRead | null>(null);
  const [chips, setChips] = useState<Chip[]>([]);
  const [saving, setSaving] = useState(false);

  const [cardMap, setCardMap] = useState<Record<number, Partial<TechniqueCard>>>(
    {}
  );

  // ✅ Загружаем все карточки одним запросом (как в каталоге), чтобы card_kind был всегда.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const all = await listCards({
          mode: "simple",
          logic: "any",
          age_levels: [],
          work_format: [],
          skills_4k: [],
          lesson_stage: [],
        });

        if (!alive) return;
        const next: Record<number, Partial<TechniqueCard>> = {};
        for (const c of all) next[c.id] = c;
        setCardMap(next);
      } catch {
        if (!alive) return;
        setCardMap({});
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const load = async () => {
    const s = await getDefaultScenario();
    setScenario(s);
    const mapped = (s.items || [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((it) => ({
        id: String(it.id),
        cardId: it.technique_card,
        title: (it.title ?? it.technique_card_title ?? cardMap[it.technique_card]?.title ?? "") || `Card #${it.technique_card}`,
      }));
    setChips(mapped);
  };

  useEffect(() => {
    load();
  }, []);

  const doAutosave = async (next: Chip[]) => {
    if (!scenario) return;
    setSaving(true);
    try {
      await autosaveItems(
        scenario.id,
        next.map((c, idx) => ({ technique_card: c.cardId, position: idx + 1 }))
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async (cardId: number, title: string) => {
    const next = [...chips, { id: `tmp-${Date.now()}-${cardId}`, cardId, title }];
    setChips(next);
    await doAutosave(next);
    await load();
  };

  useEffect(() => {
    if (requestAddCardRef) requestAddCardRef.current = handleAdd;
  }, [requestAddCardRef, chips, scenario]);

  const ids = useMemo(() => chips.map((c) => c.id), [chips]);

  const stepsCount = useMemo(() => {
    return chips.reduce(
      (acc, c) => (isTechniqueStep(cardMap[c.cardId] ?? null) ? acc + 1 : acc),
      0
    );
  }, [chips, cardMap]);

  const totalMinutes = useMemo(() => {
    return chips.reduce((acc, c) => acc + (cardMap[c.cardId]?.duration_min ?? 0), 0);
  }, [chips, cardMap]);

  if (collapsed) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => setCollapsed(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setCollapsed(false);
        }}
        style={{
          position: "fixed",
          left: 16,
          bottom: 16,
          zIndex: 40,
          width: 280,
          padding: 12,
          borderRadius: 14,
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.12)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
          cursor: "pointer",
          userSelect: "none",
        }}
        title="Нажми, чтобы развернуть"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Layers size={18} />
          <div style={{ fontWeight: 900 }}>Сценарий занятия</div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: 0.85,
            }}
          >
            <span
              style={{
                fontSize: 12,
                padding: "2px 8px",
                borderRadius: 999,
                background: "rgba(0,0,0,0.06)",
              }}
            >
              шагов: {stepsCount}
            </span>
            <ChevronUp size={18} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 40,
        borderRadius: 16,
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.12)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.14)",
        overflow: "hidden",
      }}
    >
      {/* header */}
      <div
        style={{
          padding: 12,
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <Layers size={18} />
          <div style={{ fontWeight: 900 }}>Сценарий занятия</div>

          <span
            style={{
              fontSize: 12,
              padding: "2px 8px",
              borderRadius: 999,
              background: "rgba(0,0,0,0.06)",
              whiteSpace: "nowrap",
            }}
            title="Количество шагов без вспомогательных"
          >
            шагов: {stepsCount}
          </span>

          <span
            style={{
              fontSize: 12,
              padding: "2px 8px",
              borderRadius: 999,
              background: "rgba(0,0,0,0.06)",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
            title="Суммарная длительность"
          >
            <Clock size={14} /> {totalMinutes} мин
          </span>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span className="small text-muted">{saving ? "сохранение..." : ""}</span>

          <button
            className="btn"
            title="Сохранить сценарий"
            disabled={!scenario || saving}
            onClick={async () => {
              if (!scenario) return;
              await doAutosave(chips);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <Save size={16} />
          </button>

          <button
            className="btn"
            title="Очистить сценарий"
            disabled={!scenario || chips.length === 0 || saving}
            onClick={async () => {
              const next: Chip[] = [];
              setChips(next);
              await doAutosave(next);
              await load();
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <Trash2 size={16} />
          </button>

          <button
            className="btn"
            title="Свернуть"
            onClick={() => setCollapsed(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <ChevronDown size={16} />
          </button>

          <button
            className="btn btn-primary"
            disabled={!scenario}
            onClick={() => nav(`/scenario/${scenario?.id}`)}
            title="Открыть полный сценарий занятия"
          >
            Открыть
          </button>
        </div>
      </div>

      {/* content: horizontal ribbon */}
      <div
        style={{
          padding: 12,
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {chips.length === 0 ? (
          <div className="small text-muted">Пока пусто — добавь карточки из каталога.</div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={async (event) => {
              const { active, over } = event;
              if (!over || active.id === over.id) return;

              const oldIndex = chips.findIndex((c) => c.id === String(active.id));
              const newIndex = chips.findIndex((c) => c.id === String(over.id));
              if (oldIndex < 0 || newIndex < 0) return;

              const next = arrayMove(chips, oldIndex, newIndex);
              setChips(next);
              await doAutosave(next);
              await load();
            }}
          >
            <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
              <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
                {chips.map((c, idx) => (
                  <div key={c.id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <SortableScenarioCard
                      id={c.id}
                      title={c.title}
                      meta={cardMap[c.cardId] ?? null}
                      onRemove={async () => {
                        const next = chips.filter((x) => x.id !== c.id);
                        setChips(next);
                        await doAutosave(next);
                        await load();
                      }}
                    />
                    {idx < chips.length - 1 ? (
                      <div
                        style={{
                          width: 24,
                          height: 2,
                          background: "rgba(0,0,0,0.12)",
                          borderRadius: 999,
                          alignSelf: "center",
                        }}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

export default ScenarioBottomBar;