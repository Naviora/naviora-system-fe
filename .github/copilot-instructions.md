# Naviora Frontend – Copilot Instructions

## Quick facts

- Next.js 15 App Router with React 19 and TypeScript (strict, `paths` aliases like `@/lib/*`).
- UI stack: shadcn/ui, Tailwind CSS v4 via `@tailwindcss/postcss`, Framer Motion animations, Sonner toasts.
- Default dev server runs `npm run dev` on port 3001 with Turbopack; `npm run build` also uses Turbopack.

## Layout & providers

- `app/layout.tsx` wraps everything in `AppProvider`, which nests `ThemeProvider`, `QueryProvider`, and `RoleProvider`, and mounts the Sonner `<Toaster>`.
- `QueryProvider` instantiates a single QueryClient with sensible defaults (stale 60s, retry 3) and exposes React Query Devtools.
- The main app shell lives under `app/(main)/layout.tsx`: it gates content behind `AuthGuard`, then composes `SidebarProvider`, `AppSidebar`, and `Navbar` inside a greyscale-themed container.

## Routing & navigation

- Route groups separate auth (`app/(auth)`) from the protected app (`app/(main)`); URLs stay flat (no `/main` prefix).
- `AuthGuard` checks `isLoggedIn()` and stored role, redirects to `/login` if needed, and lets you pass `allowedRoles` for fine-grained gating.
- `useRoleNavigation` pulls role data from context and maps it through `getNavigationConfig` (`lib/constants/navigation.ts`) so sidebars stay role-aware; new routes should update that config.

## Data & API patterns

- Always go through `apiClient` (`lib/api/client.ts`); it injects auth headers, retries refresh tokens, logs requests via `log.api`, and resolves calls to the nested `data` payload (`ApiResponse<T>`).
- Cache keys live in `QUERY_KEYS` (`lib/constants/config.ts`); reuse them to keep Query cache coherent.
- For CRUD resources, prefer `createEntityHooks` (`hooks/api/use-entity.ts`) to scaffold list/detail/create/update/delete hooks with automatic cache invalidation.
- Centralized error handling is via `ErrorHandler` (`lib/utils/error-handler.ts`) and constants in `lib/constants/{codes,messages}.ts`—surface friendly text with `ErrorHandler.getErrorMessage`.

## Auth & role handling

- `useLogin` stores tokens and the current role in `localStorage` (`lib/utils/auth-storage.ts`); logout/refresh helpers clear them.
- `RoleProvider` fetches `/roles` via `useRoles`, converts each `RoleDto` to a `RoleOption` (permissions parsed from CSV), and exposes `activeRole` based on persisted storage.
- Redirect destinations should respect `getDefaultRouteForRole` so users land on the right dashboard after auth.

## UI & design system

- Follow the kebab-case file rule documented in `docs/kebab-case-refactoring.md`; component exports stay PascalCase.
- Theme tokens and the auto-inverting `greyscale-*` palette are defined in `app/globals.css`; avoid hardcoded colors—use semantic classes (`bg-card`, `text-muted-foreground`) or greyscale shades as described in `docs/theme-refactoring.md`.
- Shared UI primitives live under `components/ui/` with shadcn-augmented variants (e.g., `input-group`, `sidebar`, `data-table`, `loading`). Import from the barrel `components/ui/index.ts` when possible.
- Loading and error conventions: use `LoadingSpinner` / `LoadingPage` (`components/ui/loading.tsx`) and `ErrorBoundary` (`components/ui/error-boundary.tsx`).

## Modules & feature examples

- Lecturer module pages (`app/(main)/lecturer/modules/page.tsx`) use data from `lib/data/lecturer-modules.ts` plus cards/toolbars in `components/lecturer/modules/`; follow that pattern for new role-specific dashboards.
- Docs in `docs/` capture implementation decisions like layout height (`layout-height-implementation.md`), navbar refactor, and module page behavior—consult them before diverging.

## Developer workflows

- `npm run lint`, `npm run lint:fix`, and `npm run type-check` gate PR quality; `npm run format` applies Prettier.
- `npm run clean` removes `.next`, `out`, and cache directories—run it if Turbopack artifacts misbehave.
- Production builds use `next build --turbopack` and the multi-stage `Dockerfile` (standalone output copied into the runtime stage).
- Configure environments through `.env.local`; `API_CONFIG.BASE_URL` reads `NEXT_PUBLIC_API_URL`. Remote images must be whitelisted in `next.config.ts`.

## Debugging & observability

- Use the exported `log` helpers from `lib/utils/logger.ts` for structured logging; production errors funnel into localStorage for retrieval via `logger.getErrorLogs()`.
- React Query Devtools are enabled by default; open them to inspect cache state.
- Toast user feedback should go through `sonner` (already wired via `<Toaster position="top-right" richColors />`).

## Further references

- Review `README.md` for onboarding scripts, and the markdown guides in `docs/` for detailed component and layout conventions.
- When adding new docs or patterns, update this file so future agents stay in sync.
