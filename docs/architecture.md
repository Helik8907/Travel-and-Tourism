# Architecture Overview

## System Diagram

Browser (React SPA) → Axios (`client/src/lib/api.js`) → Express routes → Controllers →
Mongoose models → MongoDB

## Request Flow Example (Destinations)

1. `client/src/pages/DestinationsPage.jsx` calls a helper in `client/src/lib/destinations/`
2. That helper calls the shared `api.js` Axios instance (cookie-based auth)
3. Request hits `server/routes/destination.js` → `server/controllers/destinationsController.js`
4. Controller queries `server/models/destination_model.js` via Mongoose
5. JSON response flows back to the React component

## Auth Flow

1. `POST /api/login` or `/api/signup` — server verifies credentials / creates a user and
   issues a JWT (httpOnly cookie)
2. Subsequent requests include the JWT via cookie (or `Authorization` header)
3. `server/middleware/auth.js`'s `protect` verifies the token and loads `req.user`;
   `restrictTo(...roles)` gates admin-only routes
4. On the client, `ProtectedRoute` (`client/src/components/auth/ProtectedRoute.jsx`)
   mirrors this by checking auth state before rendering protected routes

## Third-Party Integrations

- **Open-Meteo** (`server/utils/weather.js`) — free weather API, no key required, used
  for destination current-weather display
- **Leaflet / React-Leaflet** (client) — interactive maps for destinations

## Deployment Topology

- Frontend: Vercel (static SPA build, `client/vercel.json` rewrite rule)
- Backend: separately hosted Node process, configuration driven by `NODE_ENV` and the
  matching `server/.env.<env>` file
