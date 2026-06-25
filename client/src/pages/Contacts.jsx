import ContactForm from '../components/ContactForm';
import Reveal from '../components/Reveal';
import './Contacts.css';

export default function Contacts() {
  return (
    <div className="contacts-page">
      <section className="section">
        <div className="container contacts-layout">
          <Reveal>
            <p className="eyebrow">Связаться с нами</p>
            <h1 className="contacts-title">Свяжитесь с AKTAUVEND</h1>
            <p className="contacts-lead">
              Есть вопрос по работе автомата, предложение о сотрудничестве или идея новой локации —
              напишите нам, и мы ответим в течение рабочего дня.
            </p>

            <div className="contacts-info-list">
              <div className="contacts-info-item">
                <span className="contacts-info-label">Телефон</span>
                <a href="tel:+77000000000">+7 700 000 00 00</a>
              </div>
              <div className="contacts-info-item">
                <span className="contacts-info-label">Email</span>
                <a href="mailto:info@aktauvend.kz">info@aktauvend.kz</a>
              </div>
              <div className="contacts-info-item">
                <span className="contacts-info-label">Город</span>
                <span>Актау, Мангистауская область</span>
              </div>
              <div className="contacts-info-item">
                <span className="contacts-info-label">Поддержка</span>
                <span>Пн–Сб, 9:00–19:00</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="contacts-form-card">
              <h2>Форма обратной связи</h2>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
