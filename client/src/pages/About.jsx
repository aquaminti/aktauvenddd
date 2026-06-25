import Reveal from '../components/Reveal';
import './About.css';

const VALUES = [
  {
    title: 'Кто мы',
    text:
      'AKTAUVEND — компания из Актау, специализирующаяся на размещении и обслуживании автоматов питьевой воды. Мы работаем в городе и понимаем, какие точки действительно нужны жителям.',
  },
  {
    title: 'Чем занимаемся',
    text:
      'Устанавливаем, обслуживаем и пополняем автоматы питьевой воды в жилых комплексах, у остановок и в местах с высокой проходимостью. Следим за качеством воды и техническим состоянием оборудования.',
  },
  {
    title: 'Доступная цена',
    text:
      '1 литр очищенной питьевой воды стоит 10 тенге — это в несколько раз дешевле бутилированной воды из магазина.',
  },
  {
    title: 'Почему выбирают нас',
    text:
      'Мы не просто ставим автоматы — мы поддерживаем их в рабочем состоянии каждый день. Клиенты возвращаются, потому что автомат всегда заполнен, чист и исправен.',
  },
];

const PROCESS = [
  { step: 'Заявка', text: 'Вы оставляете заявку на размещение или сотрудничество через сайт.' },
  { step: 'Оценка локации', text: 'Специалист выезжает на место и оценивает проходимость и условия.' },
  { step: 'Установка', text: 'Монтируем автомат, подключаем и тестируем все системы.' },
  { step: 'Обслуживание', text: 'Регулярно пополняем автомат и следим за его техническим состоянием.' },
];

export default function About() {
  return (
    <div className="about-page">
      <section className="section about-hero">
        <div className="container">
          <Reveal>
            <p className="eyebrow">О компании</p>
            <h1 className="about-title">AKTAUVEND — питьевая вода, которая работает каждый день</h1>
            <p className="about-lead">
              Мы строим сеть автоматов питьевой воды в Актау так, чтобы чистая вода была рядом
              с домом, работой и привычным маршрутом по городу.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-grid">
            {VALUES.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <div className="about-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section process-section">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Как мы работаем</p>
            <h2 className="section-title">От заявки до работающего автомата</h2>
          </Reveal>

          <div className="process-list">
            {PROCESS.map((item, i) => (
              <Reveal key={item.step} delay={i * 80} className="process-item">
                <span className="process-index">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h4>{item.step}</h4>
                  <p>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
