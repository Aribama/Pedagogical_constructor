import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
export function WikiPage() {
  return (
    <div className="container knowledge-page">
      <span className="eyebrow">Методическая опора</span>
      <h1>База знаний</h1>
      <p className="page-description">
        Три шага к осмысленному сценарию занятия.
      </p>
      <div className="knowledge-grid">
        {[
          [
            "01",
            "Начните с результата",
            "Что ученики смогут объяснить, применить или создать к концу занятия? Сформулируйте цель и подберите уровень таксономии Блума в каталоге.",
          ],
          [
            "02",
            "Выстройте ритм",
            "Чередуйте индивидуальную и групповую работу. В начале создайте интерес, в основной части оставьте время на исследование, а в конце — на рефлексию.",
          ],
          [
            "03",
            "Добавьте контекст",
            "Соберите приёмы в сценарий, укажите предмет, класс и тему. Используйте генерацию плана как основу и проверьте результат с учётом своей группы.",
          ],
        ].map(([n, title, text]) => (
          <article className="knowledge-card" key={n}>
            <span className="eyebrow">{n}</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <div className="knowledge-cta">
        <BookOpen size={22} />
        <div>
          <h2>От теории к практике</h2>
          <p>Выберите приёмы под задачу вашего занятия.</p>
        </div>
        <Link className="btn btn-primary" to="/catalog">
          Открыть каталог <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
export default WikiPage;
