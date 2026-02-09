import React, { useEffect, useMemo, useState } from "react";
import type { TechniqueCard } from "../../types/cards";
import { getCard } from "../../api/cards";

type Props = {
  card: TechniqueCard | null; // карточка из списка (короткая)
  open: boolean;
  onClose: () => void;
  onAdd?: () => void;
};

const bloomRu: Record<string, string> = {
  remember: "Запоминание",
  understand: "Понимание",
  apply: "Применение",
  analyze: "Анализ",
  evaluate: "Оценка",
  create: "Создание",
};

const auxKindRu: Record<string, string> = {
  aux_org: "Вспомогательная: организационный момент",
  aux_team_split: "Вспомогательная: деление на группы",
  aux_warmup: "Вспомогательная: разминка",
  aux_reflection: "Вспомогательная: рефлексия",
  technique: "Методика",
};

function getMethodTypeLabel(c: TechniqueCard) {
  // ✅ устойчивость к отсутствующим полям
  const kind = (c as any).card_kind ?? "technique";
  const activity = (c as any).activity_type ?? "calm";

  if (kind !== "technique") return auxKindRu[kind] ?? "Вспомогательная методика";
  return activity === "active" ? "Активная методика" : "Спокойная методика";
}

function getHeaderBadgeStyle(c: TechniqueCard): React.CSSProperties {
  const kind = (c as any).card_kind ?? "technique";
  const activity = (c as any).activity_type ?? "calm";

  if (kind !== "technique") {
    return { background: "#ffffff", border: "1px solid rgba(0,0,0,0.14)", color: "#334155" };
  }
  if (activity === "active") {
    return { background: "#ffe4f1", border: "1px solid rgba(244,63,94,0.45)", color: "#9f1239" };
  }
  return { background: "#e7f2ff", border: "1px solid rgba(14,165,233,0.45)", color: "#075985" };
}

function getAgeText(c: TechniqueCard) {
  const parts: string[] = [];
  if ((c as any).age_a1) parts.push("1–4");
  if ((c as any).age_a2) parts.push("5–8");
  if ((c as any).age_a3) parts.push("9–11");
  return parts.length ? `${parts.join(", ")} классы` : "—";
}

function getWorkText(c: TechniqueCard) {
  const parts: string[] = [];
  if ((c as any).work_individual) parts.push("Индивидуальная работа");
  if ((c as any).work_group) parts.push("Групповая работа");
  return parts.length ? parts.join(", ") : "—";
}

function get4KText(c: TechniqueCard) {
  const parts: string[] = [];
  if ((c as any).k_critical) parts.push("Критическое мышление");
  if ((c as any).k_creative) parts.push("Креативность");
  if ((c as any).k_communication) parts.push("Коммуникация");
  if ((c as any).k_collaboration) parts.push("Коллаборация");
  return parts.length ? parts.join(", ") : "—";
}

function getStageText(c: TechniqueCard) {
  const parts: string[] = [];
  if ((c as any).stage_start) parts.push("Начало");
  if ((c as any).stage_core) parts.push("Середина");
  if ((c as any).stage_final) parts.push("Завершение");
  return parts.length ? parts.join(", ") : "—";
}

function getBloomText(level: string) {
  const key = (level || "").toLowerCase();
  return bloomRu[key] ?? level ?? "—";
}

export function CardModal({ card, open, onClose, onAdd }: Props) {
  // Полная карточка (с description_html), но мы её будем МЕРДЖИТЬ с базовой
  const [full, setFull] = useState<Partial<TechniqueCard> | null>(null);
  const [loading, setLoading] = useState(false);

  const id = card?.id ?? null;

  // ESC закрывает
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Блокируем прокрутку страницы, пока модалка открыта
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Догружаем полную карточку при открытии
  useEffect(() => {
    if (!open || !id) {
      setFull(null);
      setLoading(false);
      return;
    }

    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const detailed = await getCard(id);

        // ✅ КЛЮЧЕВОЕ: сохраняем именно detailed как partial,
        // а отображение делаем через merge (base + detailed).
        if (alive) setFull(detailed);
      } catch {
        if (alive) setFull(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [open, id]);

  // ✅ Отображаемая карточка = базовая из списка + детальная (если пришла)
  const viewCard = useMemo(() => {
    if (!card) return null;
    if (!full) return card;
    return { ...card, ...full } as TechniqueCard;
  }, [card, full]);

  if (!open || !card || !viewCard) return null;

  const badgeStyle = getHeaderBadgeStyle(viewCard);
  const methodLabel = getMethodTypeLabel(viewCard);

  const bloomText = getBloomText((viewCard as any).bloom_level || "");
  const ageText = getAgeText(viewCard);
  const workText = getWorkText(viewCard);
  const k4Text = get4KText(viewCard);
  const stageText = getStageText(viewCard);

  const descriptionHtml = ((viewCard as any).description_html ?? "") as string;

  const styles: Record<string, React.CSSProperties> = {
    backdrop: {
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.55)",
      zIndex: 2000,
    },
    wrap: {
      position: "fixed",
      inset: 0,
      zIndex: 2001,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    },
    dialog: {
      width: "min(920px, 100%)",
      maxHeight: "min(92vh, 920px)",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      padding: 14,
      borderBottom: "1px solid rgba(15,23,42,0.08)",
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
    },
    body: {
      padding: 14,
      overflow: "auto",
    },
    footer: {
      padding: 12,
      borderTop: "1px solid rgba(15,23,42,0.08)",
      display: "flex",
      gap: 8,
      justifyContent: "flex-end",
      background: "rgba(248,250,252,1)",
    },
    badge: {
      ...badgeStyle,
      fontSize: 12,
      padding: "4px 10px",
      borderRadius: 999,
      fontWeight: 800,
      lineHeight: "16px",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      whiteSpace: "nowrap",
    },
    pill: {
      background: "rgba(15,23,42,0.06)",
      border: "1px solid rgba(15,23,42,0.08)",
      color: "#334155",
      fontSize: 12,
      padding: "4px 10px",
      borderRadius: 999,
      fontWeight: 800,
      lineHeight: "16px",
      whiteSpace: "nowrap",
    },
    closeBtn: {
      border: 0,
      background: "transparent",
      fontSize: 22,
      lineHeight: "22px",
      padding: 6,
      borderRadius: 10,
      cursor: "pointer",
      color: "rgba(100,116,139,1)",
    },
    infoCard: {
      border: "1px solid rgba(15,23,42,0.08)",
      borderRadius: 12,
      padding: 10,
      background: "#fff",
    },
    infoLabel: {
      fontSize: 12,
      fontWeight: 800,
      color: "rgba(100,116,139,1)",
      display: "flex",
      gap: 8,
      alignItems: "center",
    },
    descBox: {
      border: "1px solid rgba(15,23,42,0.08)",
      background: "rgba(248,250,252,1)",
      borderRadius: 12,
      padding: 12,
      maxHeight: "45vh",
      overflow: "auto",
    },
  };

  return (
    <>
      <div style={styles.backdrop} onClick={onClose} aria-hidden="true" />

      <div style={styles.wrap} role="dialog" aria-modal="true" aria-label="Карточка методики">
        <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div style={styles.header}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <span style={styles.badge} title="Тип методики">
                  {methodLabel}
                </span>
                <span style={styles.pill} title="Длительность">
                  ⏱ {(viewCard as any).duration_min} мин.
                </span>
                {loading ? (
                  <span style={{ fontSize: 12, color: "rgba(100,116,139,1)" }}>Загрузка описания…</span>
                ) : null}
              </div>

              <div
                style={{
                  marginTop: 8,
                  fontWeight: 900,
                  fontSize: 18,
                  lineHeight: "22px",
                  wordBreak: "break-word",
                }}
              >
                {(viewCard as any).title}
              </div>
            </div>

            <button type="button" onClick={onClose} style={styles.closeBtn} aria-label="Закрыть">
              ×
            </button>
          </div>

          {/* Body */}
          <div style={styles.body}>
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>📈 Цели по Блуму</div>
                  <div style={{ marginTop: 6 }}>{bloomText}</div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>📚 Возраст</div>
                  <div style={{ marginTop: 6 }}>{ageText}</div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>👥 Формат работы</div>
                  <div style={{ marginTop: 6 }}>{workText}</div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>✨ Навыки 4К</div>
                  <div style={{ marginTop: 6 }}>{k4Text}</div>
                </div>
              </div>

              <div className="col-12">
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>▮ Этап занятия</div>
                  <div style={{ marginTop: 6 }}>{stageText}</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "rgba(100,116,139,1)" }}>Описание</div>

              <div style={{ marginTop: 8, ...styles.descBox }}>
                {descriptionHtml ? (
                  <div style={{ lineHeight: 1.35 }} dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                ) : (
                  <div style={{ color: "rgba(100,116,139,1)" }}>—</div>
                )}
              </div>
            </div>
          </div>

          {/* Footer: только одно действие */}
          <div style={styles.footer}>
            {onAdd ? (
              <button type="button" className="btn btn-primary" onClick={onAdd}>
                Добавить в сценарий
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default CardModal;
