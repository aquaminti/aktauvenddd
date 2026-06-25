

Коммерческий веб-проект для компании AKTAUVEND (Актау): React + Node.js/Express + MongoDB, интерактивная карта Leaflet, фотогалерея, авторизация, админ-панель, формы обратной связи и интеграция с API погоды.



| Слой | Технологии |
|------|------------|
| Front-end | React 19, Vite, React Router, Leaflet |
| Back-end | Node.js 18+, Express 5, JWT, bcrypt |
| База данных | MongoDB, Mongoose |
| Инфраструктура | Docker Compose (MongoDB) |





```bash
docker compose up -d
```

Или используйте [MongoDB Atlas](https://www.mongodb.com/atlas) — укажите строку подключения в `server/.env`.



```bash
cd server
npm install
cp .env.example .env
npm run dev
```

API: http://localhost:5000
При первом подключении к БД автоматически создаются: 7 точек автоматов, настройки статистики, администратор.

**Учётные данные администратора:**
- Email: `admin@aktauvend.kz`
- Пароль: `admin123`



```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Сайт: http://localhost:5173



```bash
cd client
npm run build
```



```
aktauvend/
├── client/                 # React SPA
│   └── src/
│       ├── pages/          # Home, Map, Gallery, Admin, Dashboard…
│       ├── components/     # Navbar, MachineMap, ContactForm…
│       ├── hooks/          # useAuth, useMachines, useSiteStats
│       └── services/       # api.js, storage.js
├── server/                 # Express API
│   ├── models/             # User, Machine, Submission, SiteStats
│   ├── controllers/        # auth, machines, stats, submissions
│   ├── routes/             # REST-маршруты
│   └── database/           # connection, seed
└── docker-compose.yml      # MongoDB
```




- Главная страница с hero-блоком, погодой и статистикой
- Интерактивная карта автоматов (Leaflet)
- Фотогалерея с лайтбоксом
- Страница «О компании» и «Контакты»
- Форма обратной связи с валидацией


- Регистрация и вход (JWT + httpOnly cookie)
- История заявок пользователя
- Защищённые маршруты


- **Обзор** — статистика пользователей, автоматов, заявок
- **Автоматы** — добавление, редактирование и удаление точек
- **Пользователи** — назначение ролей client / admin
- **Статистика** — настройка блока на главной (авто из БД или вручную)
- **Заявки** — просмотр и смена статуса (новая / в работе / закрыта)



| Метод | Путь | Доступ |
|-------|------|--------|
| GET | `/api/health` | Публичный |
| GET | `/api/stats` | Публичный |
| GET/POST | `/api/auth/*` | Регистрация, вход |
| GET | `/api/machines` | Публичный |
| POST/PUT/DELETE | `/api/machines` | Admin |
| POST | `/api/submissions` | Публичный |
| GET/PATCH | `/api/submissions` | Admin |
| GET/PUT | `/api/admin/*` | Admin |



| Коллекция | Назначение |
|-----------|------------|
| users | Пользователи и роли |
| machines | Точки автоматов |
| submissions | Заявки обратной связи |
| sitestats | Настройки статистики главной |





| Переменная | Описание |
|------------|----------|
| PORT | Порт API (5000) |
| MONGODB_URI | Строка подключения MongoDB |
| JWT_SECRET | Секрет для JWT |
| JWT_EXPIRES_IN | Срок жизни токена (7d) |
| CLIENT_ORIGIN | Origin клиента для CORS |



| № | Адрес | Район |
|---|-------|-------|
| 1 | 27-й микрорайон, 8/2 | 27-й микрорайон |
| 2 | ЖК Birlik, 19-й микрорайон, 36/1 | 19-й микрорайон |
| 3 | 17-й микрорайон | 17-й микрорайон |
| 4 | ЖК Мамыр, 3-й микрорайон, 8 | 3-й микрорайон |
| 5 | 8-й микрорайон, 28 | 8-й микрорайон |
| 6 | 4-й микрорайон, 31 | 4-й микрорайон |
| 7 | 11-й микрорайон, 11/2 | 11-й микрорайон |

Фотографии: `server/public/images/{id}/{id}.{n}.png`



- [ ] `docker compose up -d` — MongoDB запущена
- [ ] `cd server && npm run dev` — API на порту 5000
- [ ] `cd client && npm run dev` — сайт на http://localhost:5173
- [ ] Вход администратора → `/admin`
- [ ] Добавление новой точки автомата
- [ ] Изменение статистики на главной
- [ ] Смена роли пользователя
- [ ] Отправка заявки через форму контактов
- [ ] Карта и галерея работают корректно
- [ ] `npm run build` в client — сборка без ошибок
