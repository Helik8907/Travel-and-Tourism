# API Reference

Base URL: `http://localhost:3000/api` in development (see `VITE_API_URL` on the client).

All authenticated routes expect the JWT via the `token` httpOnly cookie (set automatically
on login/signup) or an `Authorization: Bearer <token>` header. Error responses are JSON:
`{ "message": "..." }`, generally with a 4xx/5xx status.

---

## Auth — `/api/login`, `/api/signup`, `/api/logout`, `/api/me`

### `POST /api/signup`
Create an account and log in.

**Body**
```json
{ "name": "string", "email": "string", "password": "string", "resident": "Country name" }
```
`resident` must be one of the country names in `server/models/user_model.js`.

**Responses**
- `201` `{ "user": { id, name, email, role, destinations_liked, destinations_disliked, reviews_liked, reviews_disliked } }` (sets `token` cookie)
- `400` missing fields
- `409` email already registered

### `POST /api/login`
**Body:** `{ "email": "string", "password": "string" }`
**Responses:** `200` same user shape as signup (sets cookie) · `400` missing fields · `401` invalid credentials

### `POST /api/logout` *(auth required)*
Clears the `token` cookie. `200 { "message": "Logged out successfully" }`

### `GET /api/me` *(auth required)*
`200 { "user": {...} }` — same safe-user shape as login/signup.

### `PUT /api/me` *(auth required)*
**Body:** `{ "name": "string", "resident": "Country name" }`
`200 { "user": {...} }` · `400` if either field is missing.

### `GET /api/me/profile` *(auth required)*
Full profile: liked/disliked/created destinations, reviews, and blogs, populated with
display fields. Used by `ProfilePage` / `ProfileListPage`.

---

## Destinations — `/api/destinations`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/` | no | List all, or `?city=<query>` for a fuzzy Atlas Search on name/city/state/country |
| GET | `/:id` | no | Single destination |
| GET | `/:id/weather` | no | Live weather via Open-Meteo, based on stored coordinates |
| POST | `/` | yes | Create |
| PUT | `/:id` | yes (owner or admin) | Update |
| DELETE | `/:id` | yes (owner or admin) | Delete |
| POST | `/:id/like` | yes | Toggle like (clears an existing dislike) |
| POST | `/:id/dislike` | yes | Toggle dislike (clears an existing like) |

**Create/edit body** (validated in `destinationsController.js`):
```json
{
  "name": "string",
  "city": "string",
  "state": "string",
  "country": "Country name (enum)",
  "type": ["Beach", "Mountain", "..."],
  "cordinates": { "lat": 0, "lng": 0 },
  "description": "string",
  "images": ["url"],
  "cost_range": { "min": 100, "max": 500 },
  "time_take": { "min": 2, "max": 5 },
  "best_months": ["January", "..."],
  "weather": { "min_temp": 10, "max_temp": 30, "condition": "string" },
  "entry_req": ["string"]
}
```
Validation rules: `cost_range.min > 0`; `cost_range.max` is `0` (unlimited) or `> min`; same
pattern for `time_take`; `weather.max_temp` (if given) must be `0` or `> min_temp`. Duplicate
coordinates on create return `409`.

Like/dislike response: `{ "liked": true, "like_count": 4, "dislike_count": 0 }` (or `"disliked"` for the dislike endpoint).

---

## Reviews — `/api/reviews`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/destination/:destinationId` | no | Reviews for a destination |
| POST | `/destination/:destinationId` | yes | Create a review on a destination |
| GET | `/blog/:blogId` | no | Reviews for a blog |
| POST | `/blog/:blogId` | yes | Create a review on a blog |
| PUT | `/:id` | yes (owner or admin) | Edit `rating`/`comment` |
| DELETE | `/:id` | yes (owner or admin) | Delete |
| POST | `/:id/like` | yes | Toggle like |
| POST | `/:id/dislike` | yes | Toggle dislike |

**Create/edit body:** `{ "rating": 0-5, "comment": "string" }`

Creating or deleting a destination review recalculates that destination's `avg_rating` and
`review_count`.

---

## Blogs — `/api/blogs`

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/` | no | List all (author populated) |
| GET | `/:id` | no | Single blog (author + linked destinations populated) |
| POST | `/` | yes | Create |
| PUT | `/:id` | yes (owner or admin) | Update |
| DELETE | `/:id` | yes (owner or admin) | Delete |
| POST | `/:id/like` | yes | Toggle like |
| POST | `/:id/dislike` | yes | Toggle dislike |

**Create/edit body:**
```json
{
  "title": "string",
  "description": "string",
  "content": "string",
  "destinations": ["destinationId"],
  "images": ["url"]
}
```
`title`, `description`, `content` are required.

---

## Itineraries — `/api/itineraries`

All routes require auth and are scoped to `req.user`.

| Method | Path | Notes |
|---|---|---|
| GET | `/` | Current user's itineraries, newest first |
| GET | `/:id` | Single itinerary (403 if not the owner) |
| POST | `/` | Create |
| PUT | `/:id` | Update (403 if not the owner) |
| DELETE | `/:id` | Delete |

**Create/edit body:**
```json
{
  "title": "string",
  "startDate": "2026-08-01",
  "endDate": "2026-08-05",
  "avg_cost": 500,
  "cost_range": { "min": 300, "max": 700 },
  "days": [
    {
      "dayNumber": 1,
      "entries": [
        { "destinationId": "id", "time": "10:00", "cost": 50, "notes": "string", "order": 1 }
      ]
    }
  ]
}
```
Validation: `title` required; `endDate >= startDate`; `avg_cost > 0`; `cost_range` follows
the same min/max rules as destinations; every day needs a `dayNumber > 0` and an `entries`
array; every entry needs `destinationId`, a string `time`, and `cost >= 0`.

---

## Search — `/api/get-amenities`

### `POST /api/get-amenities`
Proxies OpenStreetMap Nominatim for hotel search by location text.

**Body:** `{ "locationQuery": "Mumbai" }`

**Response:** array of `{ id, name, address, rating, type, priceLevel, isVegetarian }`.
`rating`, `priceLevel`, and `isVegetarian` are **mocked** client-side placeholders — OSM has
no such data — do not treat them as real values.
