import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BookOpen, Check, Clock3, FolderOpen, Layers2, Plus, Sparkles } from "lucide-react";
import { useAuth } from "../app/providers/AuthProvider";

export function HomePage() {
  const { user } = useAuth();
  return <div className="workspace-home">
    <div className="home-topline"><span className="eyebrow">Ваше рабочее пространство</span><span className="quiet-label">От идеи к занятию</span></div>
    <section className="home-hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <div className="hero-greeting">Здравствуйте{user?.username ? `, ${user.username}` : ""}.</div>
        <h1 id="home-title">Занятия, которые<br /><span>увлекают.</span></h1>
        <p>Собирайте педагогические приёмы в цельный сценарий.<br className="desktop-break" /> Адаптируйте его к своему предмету с помощью ИИ.</p>
        <div className="hero-actions"><Link to="/scenario" className="btn btn-primary"><Plus size={18} /> Создать занятие</Link><Link to="/catalog" className="text-action">Выбрать приёмы <ArrowRight size={16} /></Link></div>
        <div className="hero-note"><Check size={14} /> Ваш подход. Ваш предмет. Ваш сценарий.</div>
      </div>
      <div className="lesson-preview" aria-label="Пример структуры занятия">
        <div className="preview-top"><span><span className="status-dot" /> Структура занятия</span><Layers2 size={17} /></div>
        <h2>От интереса<br />к открытию</h2>
        <div className="preview-subtitle">Пример сценария <span>·</span> <Clock3 size={13} /> 45 мин</div>
        <div className="lesson-timeline">
          {[["01", "Вовлечь", "Вопрос, который заставит задуматься", "5 мин"], ["02", "Исследовать", "Найти решение вместе", "30 мин"], ["03", "Осмыслить", "Заметить, что получилось", "10 мин"]].map(([n, title, text, time]) => <div className="timeline-row" key={n}><span className="timeline-number">{n}</span><div><strong>{title}</strong><span>{text}</span></div><small>{time}</small></div>)}
        </div>
        <div className="preview-bottom"><Sparkles size={15} /><span>Продуманный ритм. Пространство для идей.</span></div>
      </div>
    </section>
    <section className="home-tools" aria-labelledby="tools-title">
      <div className="section-heading"><h2 id="tools-title">Всё для следующего занятия</h2><span>Начните с того, что нужно сейчас</span></div>
      <div className="tool-grid">
        {[
          { to: "/catalog", icon: BookOpen, n: "01", title: "Каталог приёмов", text: "Подберите методику по возрасту, формату работы и цели занятия.", action: "Исследовать каталог" },
          { to: "/cabinet", icon: FolderOpen, n: "02", title: "Мои занятия", text: "Вернитесь к сохранённым сценариям и адаптируйте их для нового класса.", action: "Открыть пространство" },
          { to: "/wiki", icon: Sparkles, n: "03", title: "База знаний", text: "Разберитесь с этапами занятия и принципами педагогического дизайна.", action: "Перейти к материалам" },
        ].map(({ to, icon: Icon, n, title, text, action }) => <Link className="tool-card" key={to} to={to}><div className="tool-card-top"><Icon size={23} strokeWidth={1.5} /><span>{n}</span></div><h3>{title}</h3><p>{text}</p><div className="tool-card-action">{action}<ArrowUpRight size={17} /></div></Link>)}
      </div>
    </section>
    <section className="workflow-note"><span className="eyebrow">Простой процесс</span><p>Выберите приёмы <ArrowRight size={15} /> Соберите сценарий <ArrowRight size={15} /> Добавьте свой контекст</p><Link to="/catalog" aria-label="Начать с каталога"><ArrowUpRight size={22} /></Link></section>
  </div>;
}
export default HomePage;
