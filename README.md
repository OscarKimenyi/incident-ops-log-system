# IncidentApp — Incident & Operations Log System

A full-stack web application for operational teams to report, monitor, and resolve incidents efficiently.

![Dashboard Preview](https://res.cloudinary.com/dhyo79gy1/image/upload/v1775717569/dashboard_ahgfx0.png)

## Tech Stack

- **Backend**: Laravel 11, MySQL, Laravel Sanctum (API token auth)
- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router v6, Axios

---

## Project Structure
```
incident-app/
├── backend/          # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── IncidentController.php
│   │   │   │   └── UserController.php
│   │   │   └── Middleware/
│   │   │       └── RoleMiddleware.php
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Incident.php
│   │       └── IncidentUpdate.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
└── frontend/         # React + Vite
└── src/
├── api/         # Axios instance
├── context/     # Auth context
├── components/  # Reusable UI components
└── pages/       # Page components
```

## Setup Instructions

### Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 20
- MySQL

---

### Backend Setup

```bash
cd backend
```

### Install PHP dependencies
```bash
composer install
```

### Copy environment file
```bash
cp .env.example .env
```

### Generate application key
```bash
php artisan key:generate
```

### Configure your .env file:
```env
DB_DATABASE=incident_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

### Run migrations
```bash
php artisan migrate
```

### Seed the database with demo data
```bash
php artisan db:seed
```

### Start the backend server
```bash
php artisan serve
```

## Frontend Setup

```bash
cd frontend
```

### Install Node dependencies
```bash
npm install
```

### Start the development server
```bash
npm run dev
```

---

### Access the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

---

## Demo Accounts

| Role     | Email                        | Password   |
|----------|------------------------------|------------|
| Admin    | admin@incidentlog.com        | password   |
| Operator | operator@incidentlog.com     | password   |
| Reporter | reporter@incidentlog.com     | password   |

---

## Role Capabilities

| Feature                    | Reporter | Operator | Admin |
|----------------------------|----------|----------|-------|
| Create incidents           | ✅       | ✅       | ✅    |
| View own incidents         | ✅       | ✅       | ✅    |
| View all incidents         | ❌       | ✅       | ✅    |
| Update incident status     | ❌       | ✅       | ✅    |
| Add comments               | ✅       | ✅       | ✅    |
| Assign incidents           | ❌       | ❌       | ✅    |
| Manage users               | ❌       | ❌       | ✅    |

## Status Workflow

open → investigating → resolved → closed

Status steps cannot be skipped. Every transition is logged in the audit trail.
