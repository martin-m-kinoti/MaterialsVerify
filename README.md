# MaterialsVerify Hub

Kenya's construction materials verification and marketplace platform. Buyers, contractors, and suppliers can verify product batches against KEBS standards, purchase from certified suppliers, and flag substandard materials.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vue.js 2, Vue Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Styling | CSS |

## Project Structure

The project is organized into weekly iteration snapshots, each building on the previous. The latest iteration is `week7/`.

```
mat-verification-hub/
├── week1/                # Initial MEVN scaffold
├── week2/                # Views: Dashboard, Materials, Orders, OrderTracking
├── week3/                # Auth: User model, password strength component
├── week4/                # Password reset flow (ForgotPassword, ResetPassword, email utils)
├── week5/                # Google OAuth callback view
├── week6/                # Admin: AdminUsers view, user management routes
└── week7/                # Current iteration
    ├── client/                   # Vue.js 2 frontend
    │   ├── public/               # Static assets (images, index.html)
    │   └── src/
    │       ├── assets/
    │       ├── components/
    │       │   ├── AppLayout.vue
    │       │   └── PasswordStrength.vue
    │       ├── views/
    │       │   ├── LandingPage.vue
    │       │   ├── Login.vue
    │       │   ├── Register.vue
    │       │   ├── Dashboard.vue
    │       │   ├── Materials.vue
    │       │   ├── Orders.vue
    │       │   ├── OrderTracking.vue
    │       │   ├── ForgotPassword.vue
    │       │   ├── ResetPassword.vue
    │       │   ├── GoogleCallback.vue
    │       │   └── AdminUsers.vue
    │       ├── router.js
    │       ├── App.vue
    │       └── main.js
    ├── server/                   # Express.js backend
    │   ├── models/
    │   │   └── User.js           # Mongoose user schema
    │   ├── routes/
    │   │   └── api.js
    │   ├── utils/
    │   │   ├── sendMail.js       # Nodemailer email helper
    │   │   └── validate.js       # Input validation helpers
    │   └── server.js
    └── screenshots/              # Feature screenshots
```

## Getting Started

**Client**
```bash
cd client
npm install
npm run serve
```

**Server**
```bash
cd server
npm install
npm run serve
```

Create a `.env` file in `server/` with:
```
PORT=9000
MONGO_URI=your_mongodb_connection_string
```

## Features

- Batch ID verification against KEBS certification records
- Supplier and buyer registration with Kenya county support
- Role-based access: Buyer, Supplier, Quality Inspector, Admin
- Flag and report substandard materials
- Google OAuth sign-in support (in progress)
