# Client (Frontend)

React 18 SPA bundled with Vite, styled with Tailwind CSS v4.

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL for backend API calls (falls back to `/api` if unset) |

See `.env.example` for the template.

## Routing (`src/App.jsx`)

Uses `react-router-dom` v6.

- Standalone (no layout): `/login`, `/signup`
- Wrapped in `Layout`, publicly accessible (`ProtectedRoute requireAuth={false}`):
  `/`, `/destinations`, `/blog`, `/blog/:id`, `/destinationDetail/:id`, `/planner`, `/about`
- Wrapped in `Layout`, auth-required (`ProtectedRoute`):
  `/itineraries`, `/planner/:id`, `/bookNow`, `/experiences`, `/profile`,
  `/profile/:section`, `/destinations/new`, `/destinations/:id/edit`, `/blog/new`,
  `/blog/:id/edit`
- Catch-all: `*` → `NotFound`

## Structure

- `src/pages/` — route-level page components
- `src/components/` — shared UI (`Navbar`, `Hero`, `ScrollToTop`) plus feature subfolders:
  `auth/`, `blogs/`, `common/`, `destination/`, `itinerary/`, `profile/`, `reviews/`
- `src/lib/` — API/data-access layer per feature (`auth/`, `blogs/`, `destinations/`,
  `itineraries/`, `profile/`, `reviews/`), plus a shared `api.js` Axios instance
  (`baseURL` from `VITE_API_URL`, `withCredentials: true` for cookie-based auth) and
  `countries.js`

## Scripts

```bash
npm run dev       # vite dev server, http://localhost:5173
npm run build      # production build → dist/
npm run preview   # preview the production build
```

## Deployment

Vercel — `vercel.json` rewrites all routes to `index.html` for client-side routing.
