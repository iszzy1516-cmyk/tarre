# TAREÉ Jewelry API

FastAPI backend for the TAREÉ luxury Nigerian jewelry e-commerce platform.

## Tech Stack

- **FastAPI** + Pydantic v2
- **SQLAlchemy 2.0** (async) + **asyncpg**
- **PostgreSQL**
- **Alembic** migrations
- **Paystack** & **Flutterwave** payment integrations
- **JWT** cookie-based auth

## Quick Start

### 1. Environment

```bash
cp .env.example .env
# Edit .env with your secrets
```

### 2. Docker Compose (Recommended)

```bash
docker compose up --build
```

This starts PostgreSQL and the API with hot-reload.

### 3. Local Development (without Docker)

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Start PostgreSQL locally, then:
alembic upgrade head
uvicorn app.main:app --reload
```

### 4. Seed Demo Data

```bash
source .venv/bin/activate
python scripts/seed.py
```

## API Endpoints

| Prefix | Description |
|--------|-------------|
| `POST /api/v1/auth/register` | Create account |
| `POST /api/v1/auth/login` | Login (sets HTTP-only cookies) |
| `POST /api/v1/auth/refresh` | Refresh access token |
| `POST /api/v1/auth/logout` | Clear cookies |
| `GET /api/v1/auth/me` | Current user |
| `GET /api/v1/products` | List products (filter, sort, paginate) |
| `GET /api/v1/products/featured` | Featured products |
| `GET /api/v1/products/new-arrivals` | New arrivals |
| `GET /api/v1/products/{slug}` | Product detail |
| `GET /api/v1/categories` | List categories |
| `GET /api/v1/categories/{slug}/products` | Products by category |
| `POST /api/v1/orders` | Create order |
| `GET /api/v1/orders` | My orders |
| `POST /api/v1/payments/initialize` | Initialize payment |
| `POST /api/v1/payments/verify` | Verify payment |
| `GET /api/v1/admin/stats` | Dashboard stats |
| `GET /api/v1/admin/orders` | All orders (admin) |
| `PATCH /api/v1/admin/orders/{id}/status` | Update order (admin) |

## Project Structure

```
taree-api/
├── alembic/              # Database migrations
├── app/
│   ├── models/           # SQLAlchemy ORM models
│   ├── schemas/          # Pydantic request/response models
│   ├── routers/          # API route handlers
│   ├── services/         # External integrations (Paystack, Flutterwave)
│   ├── utils/            # Security, validators
│   ├── dependencies.py   # Auth dependencies
│   ├── config.py         # Pydantic settings
│   ├── database.py       # SQLAlchemy engine/session
│   └── main.py           # FastAPI app factory
├── scripts/
│   └── seed.py           # Demo data seeder
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── .env.example
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL async connection string |
| `JWT_SECRET_KEY` | Min 32 chars, change in production |
| `FRONTEND_URL` | CORS origin (e.g. `http://localhost:5173`) |
| `PAYSTACK_SECRET_KEY` | Paystack live/test secret |
| `FLUTTERWAVE_SECRET_KEY` | Flutterwave live/test secret |
| `CLOUDINARY_*` | Cloudinary image upload credentials |

## Admin Credentials (after seeding)

- **Email:** `admin@tareejewelry.com`
- **Password:** `Admin@1234`

## License

Proprietary — TAREÉ Jewelry.
