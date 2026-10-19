# КоЗА — конструктор занятий

<div align="center">

**Сервис для поддержки проектирования учебных занятий с использованием генеративного искусственного интеллекта**

[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/downloads/)
[![Django](https://img.shields.io/badge/Django-5.2-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791.svg)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Educational-orange.svg)]()


</div>

---

## 📖 О проекте

**Цифровой педагогический конструктор** — это инновационное решение для учителей, обеспечивающее удобный подбор педагогических приёмов и их адаптацию к предметному содержанию урока с помощью AI.
Можно опробовать по [ссылке](http://212.193.61.137/)

### Решаемая проблема

Проект помогает преодолеть сложность ориентирования в большом количестве методических механик и трудность их органичного встраивания в канву конкретного урока.

---

## Основные возможности

<table>
<tr>
<td width="50%">

### 🔍 Гибкая фильтрация

Поиск приёмов по педагогическим параметрам:

- 📚 Предмет и класс
- 👥 Уровень учебной группы
- ⏰ Этап занятия
- 🤝 Формат работы
- ⚡ Уровень активности
- 🎯 Таксономия Блума

</td>
<td width="50%">

### Интеграция с AI

Умная генерация планов:

- ✍️ Автоматическое встраивание приёмов
- 📝 Подробный сценарий занятия
- 🧠 Мультиагентный алгоритм
- 🎨 Адаптация к контексту

</td>
</tr>
<tr>
<td width="50%">

### Методическая база

База проверенных приёмов:

- 🗂️ Структурированное хранение
- ✅ Экспертная классификация
- 📖 Готовые проверенные методики
- 🔄 Регулярное обновление

</td>
<td width="50%">

### Конструктор сценариев

Удобное создание уроков:

- 🖱️ Drag & drop интерфейс
- ⏱️ Учёт хронометража
- 💾 Сохранение сценариев
- 📋 Копирование и адаптация

</td>
</tr>
</table>

---

## 🛠 Стек технологий

<div align="center">

### Backend

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/DRF-ff1709?style=for-the-badge&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

**Django 5.2** • **Django REST Framework** • **PostgreSQL 15** • **psycopg 3.3**

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

**React 19** • **TypeScript** • **Vite 7** • **React Router 7** • **Bootstrap 5** • **Axios** • **DnD Kit**

</div>

---

## Запуск в Docker

Для локального запуска установите и откройте Docker Desktop. В состав окружения входят PostgreSQL 15, Django с Gunicorn и Nginx с собранным интерфейсом.

```bash
cp .env.example .env
```

В корневом `.env` замените `SECRET_KEY` и `DATABASE_PASSWORD` случайными значениями. `APP_PORT=8080` задаёт локальный порт.

```bash
docker compose up --build -d
docker compose exec backend python manage.py createsuperuser
```

Приложение: <http://localhost:8080>. Администрирование: <http://localhost:8080/admin/>. Используйте созданную учётную запись для входа. Новая база пустая; карточки можно добавить в админке или командой `create_card`, описанной ниже.

Миграции и сбор статики выполняются при старте backend. Данные PostgreSQL и загруженные файлы хранятся в постоянных Docker volumes и сохраняются при обычной остановке:

```bash
docker compose down
docker compose up -d
```

Проверить состояние и журналы:

```bash
docker compose ps
docker compose logs --tail=100 backend
```

Чтобы получить изменения и пересобрать приложение:

```bash
git pull --ff-only
docker compose up --build -d
```

Порт открыт только на локальном компьютере. Для генерации через внешний ИИ отдельно настройте провайдера в административном разделе. Файл `.env` с секретами не хранится в Git.

## Установка и запуск

### 📋 Требования

<table>
<tr>
<td align="center" width="33%">

<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="60"/>

**Python**

`3.12+`

[Скачать](https://www.python.org/downloads/)

</td>
<td align="center" width="33%">

<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="60"/>

**Node.js**

`20+`

[Скачать](https://nodejs.org/)

</td>
<td align="center" width="33%">

<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="60"/>

**PostgreSQL**

`15+`

[Скачать](https://www.postgresql.org/)

</td>
</tr>
</table>

> **Совет:** Также понадобится **Git** для клонирования репозитория

---

### Шаг 1: Клонирование репозитория

```bash
git clone https://github.com/Aribama/Pedagogical_constructor.git
```

```bash
cd Pedagogical_constructor
```

---

### Шаг 2: Настройка PostgreSQL

#### 2.1 Запустите PostgreSQL

**macOS/Linux:**
```bash
sudo service postgresql start
```

**Windows:**
```powershell
# Запустите через "Службы" или pgAdmin
```

#### 2.2 Создайте базу данных

Войдите в PostgreSQL:
```bash
psql -U postgres
```

Выполните SQL команды:
```sql
CREATE DATABASE lessonapp_db;
```

```sql
CREATE USER lessonapp_user WITH PASSWORD 'postgres';
```

```sql
ALTER ROLE lessonapp_user SET client_encoding TO 'utf8';
ALTER ROLE lessonapp_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE lessonapp_user SET timezone TO 'Europe/Moscow';
```

```sql
GRANT ALL PRIVILEGES ON DATABASE lessonapp_db TO lessonapp_user;
```

Выйдите из psql:
```sql
\q
```

> База данных готова!

---

### Шаг 3: Настройка Backend (Django)

#### 3.1 Перейдите в папку backend

```bash
cd backend
```

#### 3.2 Создайте виртуальное окружение

Создайте venv:
```bash
python -m venv venv
```

Активируйте окружение:

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```powershell
venv\Scripts\activate
```

> После активации в терминале появится `(venv)`

#### 3.3 Установите зависимости

```bash
pip install -r requirements.lock.txt
```

#### 3.4 Создайте файл .env

Скопируйте пример:
```bash
cp .env.example .env
```

Отредактируйте `.env` при необходимости:

```env
# Django Settings
SECRET_KEY=django-insecure-CHANGE-ME-IN-PRODUCTION
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

# PostgreSQL Database
DATABASE_NAME=lessonapp_db
DATABASE_USER=lessonapp_user
DATABASE_PASSWORD=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
```

> **Важно:** Для production измените `SECRET_KEY` и `DATABASE_PASSWORD`

#### 3.5 Примените миграции

```bash
python manage.py migrate
```

Вы увидите:
```
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  ...
```

#### 3.6 Создайте суперпользователя

```bash
python manage.py createsuperuser
```

Введите данные:
```
Username: admin
Email: admin@example.com
Password: ********
```

#### 3.7 Запустите сервер

```bash
python manage.py runserver 8000
```

**Backend запущен!**

<table>
<tr>
<td>

**🌐 Главная**
`http://localhost:8000`

</td>
<td>

**Админка**
`http://localhost:8000/admin`

</td>
<td>

**📡 API**
`http://localhost:8000/api`

</td>
</tr>
</table>

---

### Шаг 4: Настройка Frontend (React)

> **Не закрывайте терминал с backend!** Откройте новый терминал.

#### 4.1 Перейдите в папку frontend

```bash
cd frontend
```

> Или `cd lesson-constructor-frontend` если папка называется так

#### 4.2 Установите pnpm (если ещё не установлен)

```bash
npm install -g pnpm
```

#### 4.3 Установите зависимости

```bash
pnpm install
```

> Альтернатива: можно использовать `npm install` или `yarn install`


#### 4.4 Запустите dev-сервер

```bash
pnpm dev
```

**Frontend запущен!**

<div align="center">

### 🌐 Откройте приложение

**http://localhost:5173**

</div>

> **Готово!** Войдите используя созданные учётные данные администратора

---

## Создание карточек педагогических приёмов

### Команда create_card

Для наполнения базы используйте management команду:

```bash
python manage.py create_card [параметры]
```

<details>
<summary><b>📖 Полный список параметров</b></summary>

```bash
python manage.py create_card \
  --owner <username> \              # Владелец карточки (опционально)
  --kind <тип> \                    # Тип карточки
  --title "Название" \              # Название приёма
  --description "<HTML>" \          # Описание в HTML формате
  \
  --duration <минуты> \             # Длительность (минуты)
  \
  --activity <уровень> \            # Уровень активности
  --bloom <уровень> \               # Уровень по Блуму
  \
  --a1 \                            # 1–4 классы
  --a2 \                            # 5–8 классы
  --a3 \                            # 9–11 классы
  \
  --individual \                    # Индивидуальная работа
  --group \                         # Групповая работа
  \
  --critical \                      # Критическое мышление (4K)
  --creative \                      # Креативность (4K)
  --communication \                 # Коммуникация (4K)
  --collaboration \                 # Кооперация (4K)
  \
  --stage-start \                   # Начало занятия
  --stage-core \                    # Основная часть
  --stage-final \                   # Завершение
  \
  --public                          # Публичная карточка (по умолчанию)
```

</details>

### 📚 Значения параметров

<table>
<tr>
<td width="50%">

**--kind** (тип карточки):
- `technique` — педагогический приём
- `aux_org` — организационный момент
- `aux_team_split` — деление на команды
- `aux_warmup` — разогрев/разминка
- `aux_reflection` — рефлексия

**--activity** (уровень активности):
- `active` — активный
- `calm` — спокойный

</td>
<td width="50%">

**--bloom** (таксономия Блума):
- `remember` — запоминание
- `understand` — понимание
- `apply` — применение
- `analyze` — анализ
- `evaluate` — оценка
- `create` — создание

</td>
</tr>
</table>

### Примеры создания карточек

<details>
<summary><b>Пример 1: Дыхательное упражнение</b></summary>

```bash
python manage.py create_card \
  --owner admin \
  --kind technique \
  --title "Дыхательное упражнение" \
  --description "<p><strong>Цель:</strong> Настроить учеников на работу, снять напряжение.</p>
<p><strong>Ход упражнения:</strong></p>
<ol>
  <li>Ученики садятся удобно, закрывают глаза</li>
  <li>Делают медленный вдох на 4 счёта</li>
  <li>Задерживают дыхание на 4 счёта</li>
  <li>Медленный выдох на 6 счётов</li>
  <li>Повторяют 5 раз</li>
</ol>
<p><strong>Рефлексия:</strong> Что почувствовали? Изменилось ли ваше состояние?</p>" \
  --duration 5 \
  --activity calm \
  --bloom understand \
  --a1 --a2 --a3 \
  --individual \
  --critical --creative \
  --stage-start \
  --public
```

</details>

<details>
<summary><b>Пример 2: Групповая дискуссия "Аквариум"</b></summary>

```bash
python manage.py create_card \
  --owner admin \
  --kind technique \
  --title "Аквариум" \
  --description "<p><strong>Описание:</strong> Класс делится на две группы. 
Одна группа (внутренний круг) обсуждает проблему, 
вторая группа (внешний круг) наблюдает и анализирует.</p>
<p><strong>Этапы:</strong></p>
<ol>
  <li>Формирование двух кругов</li>
  <li>Внутренний круг обсуждает тему (10 мин)</li>
  <li>Внешний круг фиксирует аргументы</li>
  <li>Круги меняются местами</li>
  <li>Общее обсуждение наблюдений</li>
</ol>" \
  --duration 25 \
  --activity active \
  --bloom evaluate \
  --a2 --a3 \
  --group \
  --critical --communication --collaboration \
  --stage-core \
  --public
```

</details>

<details>
<summary><b>Пример 3: Рефлексия "Три звезды и желание"</b></summary>

```bash
python manage.py create_card \
  --owner admin \
  --kind aux_reflection \
  --title "Три звезды и желание" \
  --description "<p>Каждый ученик называет:</p>
<ul>
  <li>Три момента урока, которые понравились</li>
  <li>Одно пожелание на будущее</li>
</ul>" \
  --duration 5 \
  --activity calm \
  --bloom evaluate \
  --a1 --a2 --a3 \
  --individual --group \
  --critical --creative --communication \
  --stage-final \
  --public
```

</details>

---

## 🛠 Полезные команды

### Backend (Django)

<details>
<summary><b>Работа с виртуальным окружением</b></summary>

Активация:
```bash
source venv/bin/activate  # macOS/Linux
```
```powershell
venv\Scripts\activate     # Windows
```

Деактивация:
```bash
deactivate
```

</details>

<details>
<summary><b>Запуск сервера</b></summary>

```bash
python manage.py runserver
```

На другом порту:
```bash
python manage.py runserver 8001
```

</details>

<details>
<summary><b>Работа с базой данных</b></summary>

Создание миграций:
```bash
python manage.py makemigrations
```

Применение миграций:
```bash
python manage.py migrate
```

Откат миграции:
```bash
python manage.py migrate app_name migration_name
```

</details>

<details>
<summary><b>Управление пользователями</b></summary>

Создать суперпользователя:
```bash
python manage.py createsuperuser
```

Изменить пароль:
```bash
python manage.py changepassword username
```

</details>

<details>
<summary><b>🔧 Другие команды</b></summary>

Django shell:
```bash
python manage.py shell
```

Сбор статики:
```bash
python manage.py collectstatic
```

Запуск тестов:
```bash
python manage.py test
```

Создание карточки:
```bash
python manage.py create_card --help
```

</details>

---

### Frontend (React + pnpm)

<details>
<summary><b>Управление зависимостями</b></summary>

Установка всех зависимостей:
```bash
pnpm install
```

Добавить пакет:
```bash
pnpm add package-name
```

Добавить dev-зависимость:
```bash
pnpm add -D package-name
```

Удалить пакет:
```bash
pnpm remove package-name
```

Обновить зависимости:
```bash
pnpm update
```

</details>

<details>
<summary><b>Запуск и сборка</b></summary>

Dev-сервер:
```bash
pnpm dev
```

Production сборка:
```bash
pnpm build
```

Preview production:
```bash
pnpm preview
```

</details>

<details>
<summary><b>🔍 Линтинг и проверка</b></summary>

Запуск ESLint:
```bash
pnpm lint
```

Автофикс:
```bash
pnpm lint --fix
```

</details>

---

### PostgreSQL

<details>
<summary><b>🗄️ Работа с базой данных</b></summary>

Вход в psql:
```bash
psql -U postgres
```

Подключение к базе:
```sql
\c lessonapp_db
```

Список таблиц:
```sql
\dt
```

Описание таблицы:
```sql
\d cards_techniquecard
```

Выполнение SQL:
```sql
SELECT * FROM cards_techniquecard LIMIT 10;
```

Выход:
```sql
\q
```

</details>

<details>
<summary><b>💾 Бэкап и восстановление</b></summary>

Создание дампа:
```bash
pg_dump -U lessonapp_user lessonapp_db > backup.sql
```

Восстановление:
```bash
psql -U lessonapp_user lessonapp_db < backup.sql
```

</details>

---

## Устранение проблем

### Проблема: Порт уже занят

**Ошибка:**
```
Error: That port is already in use.
```

**Решение:**

```bash
# Найдите процесс на порту
# macOS/Linux:
lsof -i :8000
lsof -i :5173

# Windows:
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# Остановите процесс
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Или запустите на другом порту
python manage.py runserver 8001
npm run dev -- --port 3000
```

### Проблема: База данных не подключается

**Ошибка:**
```
django.db.utils.OperationalError: could not connect to server
```

**Решение:**

1. Проверьте, что PostgreSQL запущен:
   ```bash
   # macOS/Linux
   sudo service postgresql status
   sudo service postgresql start
   
   # Windows - через службы
   ```

2. Проверьте настройки в `.env`:
   ```env
   DATABASE_HOST=127.0.0.1  # не localhost!
   DATABASE_PORT=5432
   DATABASE_NAME=lessonapp_db
   DATABASE_USER=lessonapp_user
   DATABASE_PASSWORD=postgres
   ```

3. Проверьте доступ к БД:
   ```bash
   psql -U lessonapp_user -d lessonapp_db -h 127.0.0.1
   ```

### Проблема: ModuleNotFoundError

**Ошибка:**
```
ModuleNotFoundError: No module named 'django'
```

**Решение:**

```bash
# Убедитесь что виртуальное окружение активировано
source venv/bin/activate

# Переустановите зависимости
pip install -r requirements.lock.txt
```

### Проблема: CORS ошибка

**Ошибка:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Решение:**

Убедитесь что в `vite.config.ts` настроен proxy:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
    },
  },
}
```

### Проблема: Страница белая после сборки

**Решение:**

```bash
# Очистите кэш и пересоберите
rm -rf node_modules dist
npm install
npm run build
```
---

## 📚 Дополнительная документация

### Архитектура системы

Проект построен на принципе разделения:

1. **Пользователь** → задаёт параметры занятия через веб-интерфейс
2. **Frontend (React)** → отправляет запросы к API
3. **Backend (Django)** → обрабатывает запросы, работает с БД
4. **AI модуль** → формирует промпты и генерирует планы
5. **База данных** → хранит приёмы, сценарии, пользователей

### Мультиагентный алгоритм

Система использует специализированную схему для работы с AI:

1. Анализ параметров занятия
2. Формирование контекста из выбранных приёмов
3. Создание структурированного промпта
4. Генерация плана-конспекта
5. Постобработка и форматирование

### API Endpoints

```
GET  /api/cards/               # Список карточек приёмов
GET  /api/cards/{id}/          # Детали карточки
GET  /api/scenarios/           # Список сценариев пользователя
POST /api/scenarios/           # Создать сценарий
GET  /api/scenarios/{id}/      # Детали сценария
PUT  /api/scenarios/{id}/      # Обновить сценарий
DELETE /api/scenarios/{id}/    # Удалить сценарий
POST /api/ai/generate-plan/    # Сгенерировать план
```

---

## 📄 Лицензия

Проект создан в образовательных целях.

</div>
