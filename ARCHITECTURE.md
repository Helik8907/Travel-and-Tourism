# Travel & Tourism App — Architecture & Planning Doc

## 1. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React (Vite) | Component-based, fast dev server |
| Styling | Tailwind CSS | Fast responsive/mobile-first styling |
| Backend | Node.js + Express | REST API |
| Database | MongoDB + Mongoose | Matches brief's data model guidance |
| Auth | JWT + bcrypt | Stateless auth, gate user-owned resources |
| Image storage | Cloudinary | Store URL only in DB, not binary data |
| Maps (bonus) | Leaflet.js + OpenStreetMap | Free, no billing setup like Google Maps |
| Weather (bonus) | OpenWeatherMap API | Free tier, cache responses |
| Currency (bonus) | ExchangeRate-API | Free tier, cache responses |
| Deployment | Frontend: Vercel/Netlify · Backend: Render/Railway · DB: MongoDB Atlas | Free tiers available |

---

## 2. Folder Structure

```
travel-tourism/
├── client/                        # React frontend
│   ├── src/
│   │   ├── api/                   # axios instances, API call functions
│   │   │   ├── auth.js
│   │   │   ├── destinations.js
│   │   │   ├── itineraries.js
│   │   │   └── reviews.js
│   │   ├── components/
│   │   │   ├── common/            # Navbar, Footer, Pagination, Loader, ErrorMessage
│   │   │   ├── destination/       # DestinationCard, DestinationGrid, FilterBar
│   │   │   ├── itinerary/         # ItineraryBuilder, DayCard, StopForm
│   │   │   ├── reviews/           # ReviewForm, ReviewList, RatingStars
│   │   │   └── auth/              # LoginForm, RegisterForm, ProtectedRoute
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Explore.jsx        # search/filter/listing
│   │   │   ├── DestinationDetail.jsx
│   │   │   ├── MyTrips.jsx        # user's saved itineraries
│   │   │   ├── ItineraryDetail.jsx
│   │   │   ├── Login.jsx / Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── NotFound.jsx
│   │   ├── context/                # AuthContext (current user, token)
│   │   ├── hooks/                  # useAuth, useFetch, useDebounce (search)
│   │   ├── utils/                  # validators, formatters
│   │   └── App.jsx / main.jsx
│   └── package.json
│
├── server/                        # Express backend
│   ├── models/
│   │   ├── User.js
│   │   ├── Destination.js
│   │   ├── Itinerary.js
│   │   └── Review.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── destinationController.js
│   │   ├── itineraryController.js
│   │   └── reviewController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── destinationRoutes.js
│   │   ├── itineraryRoutes.js
│   │   └── reviewRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # verify JWT, attach req.user
│   │   ├── ownerCheck.js          # verify resource belongs to req.user
│   │   ├── errorHandler.js        # centralized error responses
│   │   └── validate.js            # request body validation
│   ├── config/
│   │   ├── db.js                  # mongoose connection
│   │   └── cloudinary.js
│   ├── utils/
│   │   └── apiCache.js            # simple in-memory/Redis cache for 3rd-party APIs
│   ├── seed/
│   │   └── seedDestinations.js    # sample data script
│   └── server.js
│
├── .env.example
└── README.md
```

---

## 3. Database Schema (MongoDB / Mongoose)

**User**
```
{ _id, name, email (unique), passwordHash, createdAt }
```

**Destination** (shared content — same for all users)
```
{
  _id, name, country, city, type (enum: beach|mountain|heritage|adventure|city|...),
  description, images: [String],       // Cloudinary URLs
  budgetRange (enum: budget|mid|luxury),
  bestTimeToVisit, avgWeather, entryRequirements,
  avgRating (computed), reviewCount (computed),
  createdAt
}
```

**Itinerary** (user-owned)
```
{
  _id, userId (ref User), title, startDate, endDate,
  days: [
    {
      dayNumber,
      stops: [
        { destinationId (ref Destination), notes, order }
      ]
    }
  ],
  totalBudget (optional),
  createdAt, updatedAt
}
```

**Review** (user-owned, linked to shared content)
```
{ _id, userId (ref User), destinationId (ref Destination), rating (1-5), comment, createdAt }
```

> Ownership rule: any write to `Itinerary` or `Review` must check `resource.userId === req.user.id`. `Destination` writes are admin-only (or none, if seeded once).

---

## 4. API Endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register | – | create account |
| POST | /api/auth/login | – | get JWT |
| GET | /api/destinations | – | list, paginated, `?page&limit&type&budget&search` |
| GET | /api/destinations/:id | – | detail + reviews |
| GET | /api/itineraries | ✅ | list current user's trips |
| POST | /api/itineraries | ✅ | create trip |
| GET | /api/itineraries/:id | ✅ (owner) | trip detail |
| PUT | /api/itineraries/:id | ✅ (owner) | edit trip / add-remove stops |
| DELETE | /api/itineraries/:id | ✅ (owner) | delete trip |
| POST | /api/destinations/:id/reviews | ✅ | add review |
| GET | /api/destinations/:id/reviews | – | list reviews, paginated |
| DELETE | /api/reviews/:id | ✅ (owner) | delete own review |

Bonus endpoints (add only after core is done):
- `GET /api/weather?city=` (cached)
- `GET /api/currency?from&to` (cached)
- `POST /api/ai/generate-itinerary` (destination + days → AI draft)
- `POST /api/itineraries/:id/expenses` + split logic

---

## 5. Page / User Flow Map

```
Home ──▶ Explore (search/filter/paginated grid) ──▶ Destination Detail
  │                                                     │
  │                                                     ├─▶ Reviews (read/write, auth required to write)
  │                                                     └─▶ "Add to itinerary" (auth required)
  │
  ├─▶ Login / Register
  │
  └─▶ My Trips (auth required) ──▶ Itinerary Detail ──▶ Itinerary Builder (CRUD days/stops)
```

---

## 6. Feature Checklist (for tracking progress)

### Core (must-have, graded baseline)
- [ ] User registration/login (JWT)
- [ ] Protected routes (My Trips, Profile only visible when logged in)
- [ ] Destination listing with images, description, rating, best time/weather/entry info
- [ ] Search by city/country
- [ ] Filter by type + budget range
- [ ] Pagination (10-20 per page)
- [ ] Itinerary CRUD (create trip, add/edit/remove day-by-day stops, delete trip)
- [ ] Reviews: submit rating + text, display list, average rating shown on destination
- [ ] Responsive layout (mobile-first)
- [ ] Form validation (client + server): dates, budget, review text length
- [ ] Error handling: empty search results, destination not found, network/API failure states

### Bonus (pick 1-2 after core is solid)
- [ ] Map integration (Leaflet) — plot destinations / itinerary stops
- [ ] AI trip planner (destination + days → auto itinerary)
- [ ] Cost splitting for group trips
- [ ] Weather widget (cached)
- [ ] Offline support (localStorage/IndexedDB for saved itinerary)
- [ ] Photo gallery uploads (Cloudinary, user-submitted)
- [ ] Currency converter (cached)
- [ ] Recommendations based on saved/liked destinations

---

## 7. Cross-Cutting Concerns
- **Pagination**: never return unbounded lists; standard `?page=&limit=` on all list endpoints.
- **Rate limiting / caching**: wrap all 3rd-party API calls (weather, currency, AI) in a cache layer with TTL to avoid hitting free-tier limits.
- **Image storage**: never store binary/base64 in MongoDB — Cloudinary URL only.
- **Content vs user data**: `Destination` = shared; `Itinerary`/`Review` = user-owned — enforce with ownership middleware, not just UI hiding.
- **Validation**: mirror rules client + server side (dates valid range, budget numeric/positive, review 1-5 stars + non-empty text).

---

## 8. Suggested Build Phases (for team task splitting)

1. **Foundation**: repo setup, DB connection, User model + auth (register/login/JWT middleware)
2. **Content**: Destination model, seed data, listing + detail pages, pagination
3. **Discovery**: search + filter (backend query params, frontend filter UI)
4. **Trip planning**: Itinerary model + full CRUD + builder UI
5. **Social proof**: Reviews (create/list/delete), rating aggregation
6. **Polish**: responsive pass, validation pass, error/empty states, loading states
7. **Bonus round**: pick 1-2 features from the list above based on remaining time

