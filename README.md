# QuickBite

A full-stack food ordering web application featuring authentic Ethiopian cuisine. Users can browse the menu, add items to a cart, and place delivery orders. Orders are persisted in PostgreSQL.

Built as a beginner full-stack learning project.

---

## Technologies

| Layer    | Technology                     |
|----------|--------------------------------|
| Frontend | HTML, CSS, Vanilla JavaScript  |
| Backend  | Node.js, Express.js            |
| Database | PostgreSQL                     |
| API      | REST                           |

---

## Features

- Browse 10 authentic Ethiopian dishes
- View food details and pricing in ETB
- Add items to a cart (stored in localStorage)
- Adjust quantities and remove items
- Checkout with name, phone, and delivery address
- Orders persisted in PostgreSQL with full transaction support
- Order confirmation page with order summary

---

## Project Structure

```
QuickBite/
├── frontend/               # HTML, CSS, JavaScript frontend
│   ├── css/style.css
│   ├── img/                # Food images
│   ├── js/
│   │   ├── app.js          # Shared: API_BASE, cart helpers, food loader
│   │   ├── menu.js
│   │   ├── cart.js
│   │   ├── checkout.js
│   │   └── food-details.js
│   ├── home.html
│   ├── menu.html
│   ├── cart.html
│   ├── checkout.html
│   ├── food-details.html
│   └── order-confirmation.html
│
├── backend/                # Express REST API
│   ├── src/
│   │   ├── app.js          # Express app, CORS, routes
│   │   ├── server.js       # HTTP server entry point
│   │   ├── config/db.js    # PostgreSQL pool
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── services/
│   ├── .env                # Local environment variables (not committed)
│   ├── .env.example        # Template — copy this to .env
│   └── package.json
│
└── database/
    ├── 01_schema.sql       # Creates all tables
    └── 02_seed.sql         # Inserts Ethiopian food data
```

---

## API Endpoints

| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | /api/health        | API + database status    |
| GET    | /api/foods         | List all foods           |
| GET    | /api/foods/:id     | Get a single food        |
| POST   | /api/orders        | Place a new order        |
| GET    | /api/orders/:id    | Get an order by ID       |

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in your values:

```env
DB_USER=your_database_user
DB_HOST=your_database_host
DB_NAME=your_database_name
DB_PASSWORD=your_database_password
DB_PORT=5432

PORT=3000

# Set to true when using a hosted PostgreSQL provider (Render, Railway, Supabase, etc.)
DB_SSL=false

# Your deployed frontend URL — used for CORS in production
FRONTEND_URL=http://localhost:5500
```

**Never commit `.env` to Git.** It is already listed in `.gitignore`.

---

## Running Locally

### 1. Start PostgreSQL and create the database

```sql
CREATE DATABASE quickbite;
```

### 2. Run the database setup scripts

```bash
psql -U postgres -d quickbite -f database/01_schema.sql
psql -U postgres -d quickbite -f database/02_seed.sql
```

### 3. Configure the backend

```bash
cd backend
cp .env.example .env
# Edit .env with your local PostgreSQL credentials
```

### 4. Install dependencies and start the backend

```bash
cd backend
npm install
npm start
```

The API runs on `http://localhost:3000`.

### 5. Open the frontend

Open `frontend/index.html` using VS Code Live Server (or any local HTTP server).

> Do not open frontend files directly as `file://` URLs — the browser will block the `fetch()` API calls.

---

## Changing the API URL

All API calls go through a single constant in `frontend/js/app.js`:

```js
const API_BASE = "http://localhost:3000";
```

When deploying, change this one value to your production backend URL:

```js
const API_BASE = "https://your-backend.onrender.com";
```

---

## Database Setup

Run the scripts in order:

1. `database/01_schema.sql` — creates `foods`, `orders`, `order_items` tables
2. `database/02_seed.sql` — inserts the 10 Ethiopian food items

The seed script uses `ON CONFLICT DO NOTHING` so it is safe to re-run.

---

## Deployment Architecture

```
Browser (frontend)
       ↓  HTTPS
  Static host (Netlify / GitHub Pages / Render Static)
       ↓  HTTPS fetch()
  Express API (Render / Railway / Fly.io)
       ↓  SSL
  PostgreSQL (Render / Railway / Supabase / Neon)
```

### Checklist before deploying

- [ ] Set all environment variables on your hosting provider
- [ ] Set `DB_SSL=true` if your PostgreSQL provider requires SSL
- [ ] Set `FRONTEND_URL` to your deployed frontend URL
- [ ] Update `API_BASE` in `frontend/js/app.js` to your deployed backend URL
- [ ] Run `01_schema.sql` and `02_seed.sql` on your production database
- [ ] Test `GET /api/health` on the deployed URL

---

## Security Notes

- Database credentials are stored only in environment variables
- `.env` is excluded from Git via `.gitignore`
- Phone numbers are validated to digits-only on both frontend and backend
- Backend calculates order totals from DB prices — the frontend total is display-only
- All order inserts use PostgreSQL transactions (BEGIN / COMMIT / ROLLBACK)
- All SQL queries use parameterized statements — no string concatenation
