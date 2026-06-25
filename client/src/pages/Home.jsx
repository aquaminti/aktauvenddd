import { Link } from 'react-router-dom';
import heroBg from '../assets/hero-bg.png';
import WeatherWidget from '../components/WeatherWidget';
import StatCounter from '../components/StatCounter';
import Reveal from '../components/Reveal';
import { useSiteStats } from '../hooks/useSiteStats';
import './Home.css';

const ADVANTAGES = [
  {
    title: 'Удобное расположение',
    text: 'Автоматы питьевой воды установлены в жилых микрорайонах, рядом с остановками и проходными зонами.',
    icon: '📍',
  },
  {
    title: 'Доступная цена',
    text: '1 литр очищенной питьевой воды — всего 10 тенге. Без переплаты за бутилированную воду в магазине.',
    icon: '💧',
  },
  {
    title: 'Надёжная работа',
    text: 'Ежедневный контроль качества воды и технического состояния каждой точки сети.',
    icon: '🛠️',
  },
  {
    title: 'Быстрое обслуживание',
    text: 'Среднее время налива воды — менее 8 секунд. Поддержка отвечает в течение часа.',
    icon: '⚡',
  },
];

export default function Home() {
  const { stats } = useSiteStats();

  return (
    <>
      <section className="hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="container hero-inner">
          <h1 className="hero-title">Автоматы питьевой воды в Актау</h1>
          <p className="hero-subtitle">
            Сеть автоматов очищенной питьевой воды с удобным расположением по всему городу.
            <p>1 литр — 10 тенге.</p>
          </p>
          <div className="hero-actions">
            <Link to="/map" className="btn btn-primary">
              Посмотреть автоматы
            </Link>
            <Link to="/contacts" className="btn btn-ghost">
              Связаться с нами
            </Link>
          </div>
          <WeatherWidget />
        </div>
      </section>

      <section className="section advantages-section">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Почему мы</p>
            <h2 className="section-title">Что делает сеть AKTAUVEND надёжной</h2>
          </Reveal>

          <div className="advantages-grid">
            {ADVANTAGES.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="advantage-card">
                  <span className="advantage-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section stats-section">
        <div className="container stats-grid">
          {stats.map((item) => (
            <StatCounter
              key={item.key}
              value={item.value}
              suffix={item.suffix || ''}
              label={item.label}
            />
          ))}
        </div>
      </section>

      <section className="section cta-section">
        <div className="container cta-inner">
          <Reveal>
            <h2 className="section-title">Хотите разместить автомат у себя?</h2>
            <p className="cta-text">
              Расскажите нам о вашем здании или территории — подберём подходящее место
              для автомата питьевой воды и обсудим условия размещения.
            </p>
            <Link to="/contacts" className="btn btn-primary">
              Оставить заявку
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
