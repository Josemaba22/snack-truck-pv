# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Markesitas (package name `markesitas-v2`) is an Angular 21 point-of-sale application for a snack truck ("snack-truck-pv-db" is the IndexedDB database name). It is an offline-first PWA: the UI only reads and writes IndexedDB (Dexie), and a sync layer talks to the REST API (`snack-truck-pv-api`, `API_BASE_URL` in `src/app/core/api-config.ts`) whenever there is a connection.

## Commands

- `npm start` / `ng serve` — run the dev server at `http://localhost:4200/`
- `ng build` — production build, output to `dist/`
- `ng build --configuration development` — dev build
- `npm test` / `ng test` — run unit tests via Vitest (Angular's `@angular/build:unit-test` builder)
- `ng test --watch=false` — single run without watch mode (useful for CI-style checks)
- To run a single spec file, pass it through Vitest directly, e.g. `npx vitest run src/app/pages/pos/pos.spec.ts`
- `ng generate component <path> --skip-tests` — scaffold a new component without a spec file (this is the convention used throughout the repo; see `commands/COMMPONENTS.md` for the full list of components that were scaffolded this way)

There is no configured linter (no ESLint config present) — rely on `tsc` (strict mode, see below) and Prettier for formatting. Prettier config lives in `package.json` (`printWidth: 100`, single quotes, `angular` parser for `.html`).

## Architecture

### Structure

- `src/app/pages/` — top-level routed pages: `pos`, `kitchen`, `orders-history`, `cash-closing`. Each is a standalone component with its own `.ts`/`.html`/`.css`.
- `src/app/components/` — feature components grouped by domain: `order/`, `orders-history/`, `payment/`, `products/`. These are composed into the pages above.
- `src/app/shared/` — reusable, domain-agnostic UI primitives (`button`, `dialog`, `menu`). `shared/button` also has an `example/` folder used as a live component lab for showcasing button variants/sizes — check it when adding new shared components.
- `src/app/services/` — `*-api.ts` (thin HttpClient wrappers, only used by the sync layer), `local-db.ts` (Dexie schema), `catalog-repository.ts`, `orders-repository.ts`, `orders-store.ts`, `sync.ts`.
- `src/app/core/` — `order-math.ts` (price calculation mirroring the API), `local-time.ts`, `api-config.ts`.
- `src/app/models/` — `api/` (request/response shapes of the API), `local/` (`LocalOrder`, `OutboxEntry`), `ui/` (models carrying UI state, e.g. `CartItemUi`).

### Data layer (offline-first)

- `LocalDb` (`local-db.ts`) owns the Dexie schema: a mirror of the API catalog (`categories`, `products`, `ingredients`, `recipeDetails`), `orders` (`LocalOrder`) and the `outbox` of pending changes.
- Catalog is read from IndexedDB (components use `liveQuery` → `toSignal`); `CatalogRepository.refresh()` replaces it all-or-nothing from the API.
- Orders are created/changed locally (`OrdersRepository`, via `OrdersStore`) and queued in `outbox`. `LocalOrder.id` is the `clientOrderId` sent to the API (idempotent create); `serverId` is the API id. Unsynced orders show a provisional number (`L-<n>`) in `displayNumber`.
- `SyncService` flushes the outbox in order (create before status changes), then pulls orders; network/5xx errors keep the queue, 4xx rejections mark the entry `failed` (blocks later entries of that order until `retryFailed()`). Orders with pending outbox entries are never overwritten by server data.
- Status transitions in `OrdersRepository` must match the API's `ALLOWED_TRANSITIONS` (including `COMPLETED → READY`). Orders are never cancelled (paid upfront, no refunds).
- Tests use `fake-indexeddb` (`src/test-setup.ts`); set `Dexie.dependencies.indexedDB = new IDBFactory()` in `beforeEach` for isolation.
- PWA: `ngsw-config.json` + `public/manifest.webmanifest`; the service worker is only enabled in production builds. Icons in `public/icons` are placeholders.

### Component conventions

Components are standalone by default (no `standalone: true` needed in Angular 21). Follow the patterns in `.agents/skills/angular-component/SKILL.md`, which this repo has explicitly adopted:
- Signal-based `input()`/`output()`, not decorator-based `@Input()`/`@Output()`
- `host: {...}` object for host bindings/listeners — never `@HostBinding`/`@HostListener`
- Native control flow (`@if`, `@for`, `@switch`) — never `*ngIf`/`*ngFor`/`*ngSwitch` or `ngClass`/`ngStyle`
- `OnPush`-friendly, signal-driven state

`tsconfig.json` enables full `strict` mode plus `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, and Angular's `strictTemplates`/`strictInjectionParameters`/`strictInputAccessModifiers` — keep new code compliant with these rather than loosening them.
