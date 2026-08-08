# Travel & Tourism

A full-stack travel and tourism web app: browse destinations, read/write reviews and blogs,
plan itineraries, and check live weather for destinations.

## Tech Stack

**Frontend** (`client/`): React 18, Vite, React Router v6, Tailwind CSS v4, Axios,
React Hook Form, Leaflet / React-Leaflet (maps), Framer Motion, React Toastify.

**Backend** (`server/`): Node.js, Express 4, MongoDB (Mongoose), JWT auth
(jsonwebtoken + bcryptjs), Joi (env validation), Open-Meteo API integration (weather,
no API key required).

## Monorepo Layout

```text
├── client/    React SPA (Vite)
└── server/    Express REST API
```

## Prerequisites

- Node.js (LTS)
- A MongoDB instance (local or Atlas)

## Setup

### Backend

```bash
cd server
npm install
# create server/.env.development (see server/.env.example) with:
#   NODE_ENV, PORT, MONGO_URL, JWT_SECRET, CLIENT_URL
npm run dev    # nodemon, http://localhost:3000
npm run seed   # optional: seed sample data
```

### Frontend

```bash
cd client
npm install
# create client/.env (see client/.env.example) with:
#   VITE_API_URL
npm run dev    # vite, http://localhost:5173
```

## Documentation

- [Backend API reference](server/README.md)
- [Frontend guide](client/README.md)
- [Architecture overview](docs/architecture.md)
- [API contracts (requests/responses)](docs/api.md)
- [Contributing guide](CONTRIBUTING.md)

## Deployment

- Frontend: Vercel (`client/vercel.json` rewrites all paths to `index.html` for SPA routing)
- Backend: hosted separately, configured per-environment via `.env.development` / `.env.production`
