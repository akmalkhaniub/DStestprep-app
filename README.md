# DS Test Prep App Monorepo

This repository is being restructured into a monorepo with separate surfaces for:

- `apps/mobile`: Expo + React Native learner app
- `apps/web`: Next.js learner web app
- `apps/admin`: Next.js admin and instructor app
- `services/api`: FastAPI backend

The original Expo starter app now lives in `apps/mobile`.

## Current Status

- Phase 0 monorepo structure has been scaffolded.
- Mobile source has been moved into `apps/mobile`.
- Web, admin, and API starter scaffolds have been added.
- Dependency installation has not been re-run in this environment.

## Intended Commands

- Mobile: `npm run dev:mobile`
- Web: `npm run dev:web`
- Admin: `npm run dev:admin`
- API: `npm run dev:api`

## Notes

- `pnpm` is the target package manager for the long-term monorepo setup.
- This environment could not fetch `pnpm`, so the repository has been scaffolded without reinstalling dependencies.
