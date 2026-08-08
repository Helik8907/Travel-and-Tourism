# Server (API)

Express + MongoDB (Mongoose) REST API for the Travel & Tourism app.

## Entry Point

`server.js` — sets up Express, CORS (origin checked against `CLIENT_URL`, plus
`localhost:5173`/`127.0.0.1:5173` in development), cookie-parser, JSON body parsing,
request logging, mounts the routes below, connects to MongoDB, and registers a global
error handler.

## Environment Variables

Loaded via `config/config.js`: first `.env`, then `.env.<NODE_ENV>` (defaults to
`.env.development`), validated with Joi. See `.env.example` for the template — **names
only, no values are committed.**

| Variable | Required | Notes |
|---|---|---|
| `NODE_ENV` | yes | `development` \| `production` \| `test` |
| `PORT` | no (default `3000`) | server port |
| `MONGO_URL` | yes | MongoDB connection string |
| `JWT_SECRET` | yes | JWT signing secret |
| `CLIENT_URL` | no | comma-separated list of allowed CORS origins |

## Routes

| Base path | File | Purpose |
|---|---|---|
| `/api/login` | `routes/login.js` | authenticate, issue JWT |
| `/api/signup` | `routes/signup.js` | register new user |
| `/api/logout` | `routes/logout.js` | clear auth cookie |
| `/api/me` | `routes/me.js` | current user profile |
| `/api/destinations` | `routes/destination.js` | destination CRUD + listing |
| `/api/reviews` | `routes/review.js` | review CRUD |
| `/api/itineraries` | `routes/itinerary.js` | itinerary/trip planner CRUD |
| `/api/blogs` | `routes/blog.js` | blog CRUD |
| `/api/get-amenities` | `routes/serch.js` | search/amenities lookup |

## Auth

JWT-based. Token is accepted via `Authorization: Bearer <token>` header or `token` cookie.
`middleware/auth.js` exports:

- `protect` — verifies the JWT and attaches `req.user`
- `restrictTo(...roles)` — role gate (`user` / `admin`)

## Models (`models/`)

- `user_model.js` — auth fields, role, liked/created/disliked arrays for destinations,
  blogs and reviews, itineraries array; password hashed via a bcrypt pre-save hook
- `destination_model.js`
- `blog_model.js`
- `review_model.js`
- `itinerary_model.js`

## Middleware (`middleware/`)

- `auth.js` — `protect` / `restrictTo`
- `asyncHandler.js` — wraps async route handlers to forward errors to `errorHandler`
- `errorHandler.js` — global error handler
- `requestLogger.js` — logs incoming requests

## Utilities (`utils/`)

- `weather.js` — current weather by lat/lng via Open-Meteo (free, no API key)
- `reactionHandlers.js` — like/dislike logic shared across resources
- `colors.js` — console log color helpers

## Seeding

```bash
npm run seed
```

Runs `seed/index.js`, which uses `seed/adminSeeder.js`, `seed/blogSeeder.js` and
`seed/sample.js` to populate sample data.

## Scripts

```bash
npm start   # node server.js
npm run dev # nodemon server.js
npm run seed
```
