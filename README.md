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

```
mat-verification-hub/
├── client/               # Vue.js frontend
│   └── src/
│       ├── views/
│       │   ├── LandingPage.vue
│       │   ├── Login.vue
│       │   └── Register.vue
│       ├── router.js
│       ├── App.vue
│       └── main.js
└── server/               # Express.js backend
    ├── models/
    │   └── User.js       # Mongoose user schema
    ├── routes/
    │   └── api.js
    └── server.js
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
