# MAT Verification Hub — Week 6

## Overview

A MEVN (MongoDB, Express, Vue 3, Node.js) application for managing and verifying construction materials. Week 6 adds a full Admin User Management portal with complete CRUD operations backed by MongoDB Atlas.

---

## Functionalities Implemented

The application exposes two layers of CRUD — one for public users managing their own account, and one for admins managing all users.

---

### 1. User Self-Service (CRUD)

#### Create — Sign Up

- **Endpoint:** `POST /api/user`
- Any visitor can register with first name, last name, email, county, role, and password.
- Input is validated by `validateRegister` before hitting the database.
- Password is hashed using bcrypt.

#### Create (OAuth) — Sign Up / Sign In with Google

- **Endpoint:** `GET /api/auth/google` → `GET /api/auth/google/callback`
- Passport.js Google OAuth 2.0 strategy; links to an existing account if the email already exists, otherwise creates a new user record.
- **View:** `GoogleCallback.vue`

#### Read — Sign In

- **Endpoint:** `POST /api/auth/login`
- Accepts email + password, compares against the stored bcrypt hash, and opens an express-session on success.
- **Endpoint:** `GET /api/auth/session` — reads the active session and returns live user data (name, email, role, avatar) from MongoDB.
- **Endpoint:** `POST /api/auth/logout` — destroys the session and clears the cookie.
- **View:** `Login.vue`

#### Update — Reset / Change Password

- **Endpoint:** `POST /api/auth/forgot-password`
  - Generates a `crypto.randomBytes(32)` token, stores it on the user document with a 1-hour expiry, and emails a reset link via Nodemailer.
- **Endpoint:** `POST /api/auth/reset-password/:token`
  - Validates the token and expiry, sets the new password, and clears the token fields. The Mongoose pre-save hook re-hashes the new password automatically.
- **Views:** `ForgotPassword.vue`, `ResetPassword.vue`

---

### 2. Admin User Management (CRUD)

Admins manage all registered users through a dedicated portal at `/admin/users`. Every route is guarded by `requireAdmin` middleware — requests without an active admin session are rejected with `401` or `403`.

#### Create — Add a new user

- **Endpoint:** `POST /api/admin/users`
- Admin fills in first name, last name, email, role, county, and password via a modal form.
- Duplicate email check returns `409 Conflict` before insertion.

#### Read — List and search users

- **Endpoint:** `GET /api/admin/users?search=&role=`
- Returns all users sorted by newest first; passwords and reset tokens are excluded from the response.
- Supports live search by name or email (`$regex`, case-insensitive) and filtering by role (`buyer`, `supplier`, `inspector`, `admin`).
- **Endpoint:** `GET /api/admin/users/:id` — fetch a single user record.

#### Update — Edit a user

- **Endpoint:** `PUT /api/admin/users/:id`
- Admin can update any field (name, email, role, county, password).
- Password is optional on edit; leaving it blank keeps the existing hash.

#### Delete — Remove a user

- **Endpoint:** `DELETE /api/admin/users/:id`
- A confirmation dialog is shown in the UI before the request is sent.
- Self-delete guard: admins cannot delete their own account (`400 Bad Request`).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3 (Options API), Vue Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | express-session, Passport.js (Google OAuth), bcryptjs |
| Email | Nodemailer |

---

## API Reference

### User Auth Routes (public)

| Method | Route | CRUD | Description |
|---|---|---|---|
| `POST` | `/api/user` | Create | Register a new user |
| `POST` | `/api/auth/login` | Read | Sign in and open a session |
| `GET` | `/api/auth/session` | Read | Return current session user data |
| `POST` | `/api/auth/logout` | Read | Destroy session and clear cookie |
| `POST` | `/api/auth/forgot-password` | Update | Generate and email a password reset token |
| `POST` | `/api/auth/reset-password/:token` | Update | Validate token and set new password |
| `GET` | `/api/auth/google` | Create/Read | Initiate Google OAuth flow |
| `GET` | `/api/auth/google/callback` | Create/Read | Google OAuth callback; creates or links account |

### Admin User Routes (requires `role: admin`)

| Method | Route | CRUD | Description |
|---|---|---|---|
| `GET` | `/api/admin/users` | Read | List users (supports `?search=` and `?role=`) |
| `GET` | `/api/admin/users/:id` | Read | Get a single user |
| `POST` | `/api/admin/users` | Create | Create a new user |
| `PUT` | `/api/admin/users/:id` | Update | Update an existing user |
| `DELETE` | `/api/admin/users/:id` | Delete | Delete a user |

---

## Project Structure

```
week6/
├── client/                  # Vue 3 frontend
│   └── src/
│       ├── views/
│       │   ├── AdminUsers.vue       # Admin CRUD portal
│       │   ├── Dashboard.vue
│       │   ├── Materials.vue
│       │   ├── Orders.vue
│       │   ├── Login.vue / Register.vue
│       │   ├── ForgotPassword.vue / ResetPassword.vue
│       │   └── GoogleCallback.vue
│       └── components/
│           ├── AppLayout.vue
│           └── PasswordStrength.vue
└── server/                  # Express backend
    ├── models/
    │   └── User.js          # Mongoose schema with bcrypt pre-save hook
    ├── routes/
    │   └── api.js
    ├── utils/
    │   ├── sendMail.js
    │   └── validate.js
    └── server.js            # All API routes + admin CRUD endpoints
```

---

## Setup

```bash
# Server
cd server
npm install
# create .env with MONGODB_URI, SESSION_SECRET, GOOGLE_CLIENT_ID,
# GOOGLE_CLIENT_SECRET, CLIENT_URL, ADMIN_EMAIL, ADMIN_PASSWORD
npm start

# Client
cd client
npm install
npm run serve
```
