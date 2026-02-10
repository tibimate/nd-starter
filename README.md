# ND Starter

Full-stack starter with Next.js (App Router) on the frontend and Django + DRF + SimpleJWT on the backend. Includes shadcn/ui, Tailwind CSS, next-auth integration, and a basic account area.

## Tech Stack

- Frontend: Next.js 16+, React, TypeScript, Tailwind CSS, shadcn/ui
- Backend: Django, Django REST Framework, SimpleJWT
- Auth: next-auth (frontend) + JWT (backend)

## Requirements

- Node.js 18+
- Python 3.11+

## Setup

### 1) Environment

Copy the example env files and update values as needed:

```bash
copy env.example .env.local
copy backend\project\env.example backend\project\.env
```

### 2) Install Dependencies

Frontend:

```bash
npm install
```

Backend:

```bash
cd backend\project
python -m venv .venv
.venv\Scripts\activate
pip install -r ..\requirements.txt
```

### 3) Database

```bash
cd backend\project
python manage.py migrate
python manage.py createsuperuser
```

### 4) Run Dev Servers

Backend (Django):

```bash
cd backend\project
python manage.py runserver
```

Frontend (Next.js):

```bash
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:8000

## Authentication Notes

- Django exposes JWT endpoints via SimpleJWT.
- Next.js uses next-auth for session handling and can exchange credentials for JWTs.
- Update providers, callbacks, and token handling in the next-auth route if you change backend auth behavior.

## Project Structure

```
app/                # Next.js App Router
components/         # UI components (shadcn/ui)
config/             # Site config
hooks/              # Client hooks and services
lib/                # Shared utilities
pages/api/          # next-auth API route
backend/            # Django + DRF project
```

## Useful Commands

Frontend:

```bash
npm run dev
npm run build
npm run start
```

Backend:

```bash
python manage.py runserver
python manage.py test
```

## Support

If you find this project helpful, consider supporting my work:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/tibimate)

## License

MIT
