# Contributing

## Getting Set Up

See the [root README](README.md) for install and env setup for `client/` and `server/`.
Run `npm run seed` in `server/` once so you have sample destinations/blogs/users to work
against locally.

## Branching & Commits

- Branch off `main` for each change; name branches after the feature/fix
  (e.g. `itinerary-cost-validation`, `fix-review-like-count`).
- Keep commits scoped to one logical change; write messages that explain *why*, not just
  *what*.
- Open a pull request into `main` when ready for review.

## Before Opening a PR

- **Backend:** start the server (`npm run dev` in `server/`) and exercise the endpoint(s)
  you touched — there's no automated test suite yet, so manual verification against a
  running server is the check.
- **Frontend:** run `npm run dev` in `client/` and click through the affected page(s) in
  the browser, including the logged-out and logged-in states where relevant.
- Check the browser console and server logs for new errors/warnings.

## Code Conventions

- Backend: CommonJS, one controller file per resource (`server/controllers/`), thin routes
  (`server/routes/`) that just wire HTTP verbs to controller functions, `asyncHandler` around
  every async route handler, ownership checks (`created_by`/`author`/`userId` vs
  `req.user._id`, or `role === 'admin'`) before mutating another user's data.
- Frontend: feature-oriented `client/src/lib/<feature>/` for API calls, `client/src/pages/`
  for routes, `client/src/components/<feature>/` for feature-specific UI, `common/` for
  shared UI. Protected routes go through `ProtectedRoute` in `App.jsx`, not ad-hoc redirects.
- Match existing patterns (e.g. `like_count`/`dislike_count` + toggle handlers via
  `server/utils/reactionHandlers.js`) rather than introducing a new approach for the same
  problem.

## Env Vars & Secrets

- Never commit `.env`, `.env.development`, or `.env.production` — they're gitignored. If you
  add a new required variable, add its **name** (no value) to `server/.env.example` or
  `client/.env.example` and document it in `server/README.md` / `client/README.md`.

## Docs

If you change an API route's request/response shape, add a field, or add a route, update
[`docs/api.md`](docs/api.md) in the same PR. If you change routing, folder structure, or a
model, update the relevant `README.md` / [`docs/architecture.md`](docs/architecture.md) too.
