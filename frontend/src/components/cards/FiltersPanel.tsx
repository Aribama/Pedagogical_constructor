import type { CardsQuery, Logic, Mode } from "../../api/cards";

type Props = {
  query: CardsQuery;
  onChange: (patch: Partial<CardsQuery>) => void;
};

function toggleInList(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

function ChipButton({
  active,
  onClick,
  children,
  colorVariant,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  colorVariant?: "indigo" | "rose" | "sky" | "slate";
}) {
  const base =
    "lc-chip " +
    (active ? "lc-chip--active " : "lc-chip--idle ") +
    (colorVariant ? `lc-chip--${colorVariant}` : "lc-chip--indigo");

  return (
    <button type="button" className={base} onClick={onClick}>
      {children}
    </button>
  );
}

function Section({
  title,
  right,
  hint,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  hint?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="lc-section">
      <div className="lc-section__header">
        <label className="lc-label">{title}</label>
        {right}
      </div>
      {hint}
      {children ? <div className="lc-section__body">{children}</div> : null}
    </section>
  );
}

function Segmented({
  value,
  onChange,
  left,
  right,
}: {
  value: "any" | "all";
  onChange: (v: Logic) => void;
  left: string;
  right: string;
}) {
  return (
    <div className="lc-seg">
      <button
        type="button"
        className={"lc-seg__btn " + (value === "all" ? "lc-seg__btn--active" : "")}
        onClick={() => onChange("all")}
      >
        {left}
      </button>
      <button
        type="button"
        className={"lc-seg__btn " + (value === "any" ? "lc-seg__btn--active" : "")}
        onClick={() => onChange("any")}
      >
        {right}
      </button>
    </div>
  );
}

function LogicSwitch({
  mode,
  globalLogic,
  value,
  onChange,
}: {
  mode: Mode;
  globalLogic: Logic;
  value: Logic;
  onChange: (v: Logic) => void;
}) {
  // Простой режим: логика “горизонтальная” — единая, переключатель показываем только в секции "Режим логики"
  // Расширенный: логика появляется в каждой секции.
  const shownValue = mode === "simple" ? globalLogic : value;

  return (
    <Segmented
      value={shownValue}
      onChange={(v) => {
        // В простом режиме этот переключатель не должен менять “локальную” логику (она берётся из globalLogic)
        // В расширенном — меняем конкретное поле
        if (mode === "advanced") onChange(v);
      }}
      left="И"
      right="ИЛИ"
    />
  );
}

export function FiltersPanel({ query, onChange }: Props) {
  const mode: Mode = query.mode || "simple";
  const globalLogic: Logic = query.logic || "any";

  const resetFilters = () => {
    onChange({
      // режим панели
      mode: "simple",
      logic: "any",

      // поиск
      q: "",

      // фильтры
      activity_type: [],
      duration_max: undefined,
      bloom_levels: [],
      age_levels: [],
      work_format: [],
      skills_4k: [],
      lesson_stage: [],

      // логики для расширенного режима (сбросим)
      logic_activity: "any",
      logic_bloom: "any",
      logic_age: "any",
      logic_work: "any",
      logic_4k: "any",
      logic_stage: "any",
    });
  };

  const css = `
    .lc-panel {
      background: #fff;
      border: 1px solid rgba(15,23,42,.08);
      border-radius: 12px;
      padding: 12px;
    }

    .lc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 2px 10px 2px;
    }
    .lc-title { font-weight: 700; }
    .lc-icon-btn {
      border: 0;
      background: transparent;
      padding: 6px;
      border-radius: 10px;
      color: rgba(100,116,139,1);
      cursor: pointer;
    }
    .lc-icon-btn:hover { background: rgba(148,163,184,.18); }

    .lc-section { margin-top: 14px; }
    .lc-section__header { display: flex; justify-content: space-between; align-items: center; }
    .lc-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: rgba(148,163,184,1);
      display: block;
      margin-bottom: 6px;
    }
    .lc-help {
      cursor: help;
      font-size: 14px;
      color: rgba(100,116,139,1);
      user-select: none;
      margin-left: 6px;
    }
    .lc-hint {
      font-size: 10px;
      color: rgba(148,163,184,1);
      font-style: italic;
      margin-top: 4px;
      line-height: 1.25;
    }

    .lc-row { display: flex; flex-wrap: wrap; gap: 8px; }
    .lc-grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }

    /* Segmented */
    .lc-seg {
      display: flex;
      background: rgba(241,245,249,1);
      padding: 4px;
      border-radius: 10px;
      gap: 4px;
    }
    .lc-seg__btn {
      flex: 1;
      border: 0;
      background: transparent;
      padding: 6px 8px;
      font-size: 11px;
      font-weight: 800;
      border-radius: 8px;
      color: rgba(100,116,139,1);
      cursor: pointer;
      transition: all .12s ease;
      white-space: nowrap;
    }
    .lc-seg__btn--active {
      background: #fff;
      color: rgba(79,70,229,1);
      box-shadow: 0 1px 2px rgba(15,23,42,.08);
    }

    /* Chips */
    .lc-chip {
      border: 1px solid rgba(226,232,240,1);
      background: #fff;
      color: rgba(71,85,105,1);
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 12px;
      cursor: pointer;
      transition: all .12s ease;
      user-select: none;
      line-height: 1.1;
    }
    .lc-chip--idle:hover { border-color: rgba(129,140,248,1); background: rgba(248,250,252,1); }

    .lc-chip--indigo.lc-chip--active { background: rgba(79,70,229,1); border-color: rgba(79,70,229,1); color: #fff; }
    .lc-chip--rose.lc-chip--active { background: rgba(255,241,242,1); border-color: rgba(244,63,94,1); color: rgba(159,18,57,1); }
    .lc-chip--sky.lc-chip--active { background: rgba(240,249,255,1); border-color: rgba(14,165,233,1); color: rgba(3,105,161,1); }
    .lc-chip--slate.lc-chip--active { background: rgba(248,250,252,1); border-color: rgba(100,116,139,1); color: rgba(51,65,85,1); }

    /* Duration slider */
    .lc-range {
      width: 100%;
      height: 6px;
      border-radius: 999px;
      background: rgba(226,232,240,1);
      appearance: none;
      outline: none;
      cursor: pointer;
      accent-color: rgba(79,70,229,1);
    }
    .lc-range::-webkit-slider-thumb {
      appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 999px;
      background: rgba(79,70,229,1);
      border: 0;
    }
    .lc-range-values {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: rgba(100,116,139,1);
      margin-bottom: 6px;
    }

    .lc-mini {
      font-size: 10px;
      padding: 6px 0;
      border-radius: 8px;
      border: 1px solid rgba(226,232,240,1);
      background: rgba(248,250,252,1);
      cursor: pointer;
      transition: all .12s ease;
    }
    .lc-mini:hover { background: #fff; border-color: rgba(129,140,248,1); }
  `;

  // значения фильтров
  const activity = query.activity_type ?? [];
  const bloom = query.bloom_levels ?? [];
  const age = query.age_levels ?? [];
  const work = query.work_format ?? [];
  const k4 = query.skills_4k ?? [];
  const stage = query.lesson_stage ?? [];
  const uiMax = query.duration_max ?? 60;

  // логика по секциям (для расширенного режима)
  const logic_activity = query.logic_activity || "any";
  const logic_bloom = query.logic_bloom || "any";
  const logic_age = query.logic_age || "any";
  const logic_work = query.logic_work || "any";
  const logic_4k = query.logic_4k || "any";
  const logic_stage = query.logic_stage || "any";

  const logicHint =
    "Глобальная логика (в простом режиме) влияет только на мульти-выбор внутри каждого пункта.\n" +
    "Пример: если выбраны 1–4 и 5–8, то\n" +
    "• ИЛИ → подходят карточки 1–4 или 5–8\n" +
    "• И → подходят карточки, где отмечены оба возраста.\n" +
    "При этом разные фильтры между собой всегда сочетаются через AND (пересечение).";

  return (
    <div className="lc-panel">
      <style>{css}</style>

      {/* Заголовок + сброс */}
      <div className="lc-header">
        <div className="lc-title">Фильтры</div>
        <button
          className="lc-icon-btn"
          onClick={resetFilters}
          title="Сбросить все фильтры"
          aria-label="Сбросить"
          type="button"
        >
          ↺
        </button>
      </div>

      {/* 1) Режим панели (сверху) */}
      <Section
        title="Режим панели"
        right={
          <div className="lc-seg">
            <button
              type="button"
              className={"lc-seg__btn " + (mode === "simple" ? "lc-seg__btn--active" : "")}
              onClick={() => onChange({ mode: "simple" })}
            >
              Простой
            </button>
            <button
              type="button"
              className={"lc-seg__btn " + (mode === "advanced" ? "lc-seg__btn--active" : "")}
              onClick={() => onChange({ mode: "advanced" })}
            >
              Расширенный
            </button>
          </div>
        }
      />

      {/* 2) Режим логики (показываем только в простом режиме) */}
      {mode === "simple" && (
        <Section
          title="Режим логики"
          right={<Segmented value={globalLogic} onChange={(v) => onChange({ logic: v })} left="И" right="ИЛИ" />}
          hint={
            <div className="lc-hint">
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                Логика мульти
                <span className="lc-help" title={logicHint}>
                  ⓘ
                </span>
              </span>
            </div>
          }
        />
      )}

      {/* 3) Поиск */}
      <Section title="Поиск">
        <input
          className="form-control form-control-sm"
          value={query.q || ""}
          onChange={(e) => onChange({ q: e.target.value })}
          placeholder="по названию и описанию..."
        />
      </Section>

      {/* 4) Тип методики */}
      <Section
        title="Тип методики"
        right={
          mode === "advanced" ? (
            <LogicSwitch
              mode={mode}
              globalLogic={globalLogic}
              value={logic_activity}
              onChange={(v) => onChange({ logic_activity: v })}
            />
          ) : undefined
        }
      >
        <div className="lc-row">
          <ChipButton
            active={activity.includes("active")}
            onClick={() => onChange({ activity_type: toggleInList(activity, "active") })}
            colorVariant="rose"
          >
            Активные
          </ChipButton>
          <ChipButton
            active={activity.includes("passive")}
            onClick={() => onChange({ activity_type: toggleInList(activity, "passive") })}
            colorVariant="sky"
          >
            Спокойные
          </ChipButton>
          <ChipButton
            active={activity.includes("aux")}
            onClick={() => onChange({ activity_type: toggleInList(activity, "aux") })}
            colorVariant="slate"
          >
            Вспомогательные
          </ChipButton>
        </div>
      </Section>

      {/* 5) Длительность */}
      <Section title="Длительность (мин)">
        <div className="lc-range-values">
          <span>1</span>
          <span>{uiMax >= 60 ? "60+" : `${uiMax}`}</span>
        </div>
        <input
          type="range"
          min={1}
          max={60}
          value={uiMax}
          className="lc-range"
          onChange={(e) => {
            const v = Number(e.target.value);
            onChange({ duration_max: v >= 60 ? undefined : v });
          }}
        />
        <div className="lc-grid4" style={{ marginTop: 10 }}>
          {[3, 7, 15, 40].map((val) => (
            <button key={val} type="button" className="lc-mini" onClick={() => onChange({ duration_max: val })}>
              до {val}
            </button>
          ))}
        </div>
      </Section>

      {/* 6) Цели по Блуму — МУЛЬТИ */}
      <Section
        title="Цели по Блуму"
        right={
          mode === "advanced" ? (
            <LogicSwitch
              mode={mode}
              globalLogic={globalLogic}
              value={logic_bloom}
              onChange={(v) => onChange({ logic_bloom: v })}
            />
          ) : undefined
        }
      >
        <div className="lc-row">
          {[
            ["remember", "Запоминание"],
            ["understand", "Понимание"],
            ["apply", "Применение"],
            ["analyze", "Анализ"],
            ["evaluate", "Оценка"],
            ["create", "Создание"],
          ].map(([val, label]) => (
            <ChipButton
              key={val}
              active={bloom.includes(val)}
              onClick={() => onChange({ bloom_levels: toggleInList(bloom, val) })}
            >
              {label}
            </ChipButton>
          ))}
        </div>
      </Section>

      {/* 7) Возраст */}
      <Section
        title="Возраст"
        right={
          mode === "advanced" ? (
            <LogicSwitch
              mode={mode}
              globalLogic={globalLogic}
              value={logic_age}
              onChange={(v) => onChange({ logic_age: v })}
            />
          ) : undefined
        }
      >
        <div className="lc-row">
          <ChipButton active={age.includes("a1")} onClick={() => onChange({ age_levels: toggleInList(age, "a1") })}>
            1–4 классы
          </ChipButton>
          <ChipButton active={age.includes("a2")} onClick={() => onChange({ age_levels: toggleInList(age, "a2") })}>
            5–8 классы
          </ChipButton>
          <ChipButton active={age.includes("a3")} onClick={() => onChange({ age_levels: toggleInList(age, "a3") })}>
            9–11 классы
          </ChipButton>
        </div>
      </Section>

      {/* 8) Формат */}
      <Section
        title="Формат"
        right={
          mode === "advanced" ? (
            <LogicSwitch
              mode={mode}
              globalLogic={globalLogic}
              value={logic_work}
              onChange={(v) => onChange({ logic_work: v })}
            />
          ) : undefined
        }
      >
        <div className="lc-row">
          <ChipButton active={work.includes("individual")} onClick={() => onChange({ work_format: toggleInList(work, "individual") })}>
            Индивидуальная работа
          </ChipButton>
          <ChipButton active={work.includes("group")} onClick={() => onChange({ work_format: toggleInList(work, "group") })}>
            Групповая работа
          </ChipButton>
        </div>
      </Section>

      {/* 9) Навыки 4K */}
      <Section
        title="Навыки 4K"
        right={
          mode === "advanced" ? (
            <LogicSwitch
              mode={mode}
              globalLogic={globalLogic}
              value={logic_4k}
              onChange={(v) => onChange({ logic_4k: v })}
            />
          ) : undefined
        }
      >
        <div className="lc-row">
          <ChipButton active={k4.includes("critical")} onClick={() => onChange({ skills_4k: toggleInList(k4, "critical") })}>
            ❓ Критическое мышление
          </ChipButton>
          <ChipButton active={k4.includes("creative")} onClick={() => onChange({ skills_4k: toggleInList(k4, "creative") })}>
            💡 Креативность
          </ChipButton>
          <ChipButton active={k4.includes("communication")} onClick={() => onChange({ skills_4k: toggleInList(k4, "communication") })}>
            💬 Коммуникация
          </ChipButton>
          <ChipButton active={k4.includes("collaboration")} onClick={() => onChange({ skills_4k: toggleInList(k4, "collaboration") })}>
            🤝 Коллаборация
          </ChipButton>
        </div>
      </Section>

      {/* 10) Этап занятия */}
      <Section
        title="Этап занятия"
        right={
          mode === "advanced" ? (
            <LogicSwitch
              mode={mode}
              globalLogic={globalLogic}
              value={logic_stage}
              onChange={(v) => onChange({ logic_stage: v })}
            />
          ) : undefined
        }
      >
        <div className="lc-row">
          <ChipButton active={stage.includes("start")} onClick={() => onChange({ lesson_stage: toggleInList(stage, "start") })}>
            Начало
          </ChipButton>
          <ChipButton active={stage.includes("core")} onClick={() => onChange({ lesson_stage: toggleInList(stage, "core") })}>
            Середина
          </ChipButton>
          <ChipButton active={stage.includes("final")} onClick={() => onChange({ lesson_stage: toggleInList(stage, "final") })}>
            Завершение
          </ChipButton>
        </div>
      </Section>
    </div>
  );
}
