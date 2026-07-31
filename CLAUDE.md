# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Markesitas (package name `markesitas-v2`) is an Angular 21 point-of-sale application for a snack truck ("snack-truck-pv-db" is the IndexedDB database name). It runs entirely client-side: all data (categories, products, addons, orders) is persisted locally in the browser via Dexie/IndexedDB — there is no backend API.

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
- `src/app/services/` — `indexeddb.ts` (the Dexie database service), `products-repository.ts` (query layer that joins products/categories/addons into view models), `seed-data.ts` (dev-only sample data seeding).
- `src/app/models/` — split by layer:
  - `db/` — raw Dexie table shapes (`CategoryDb`, `ProductDb`, `ProductAddonDb`, `ProductDetailDb`)
  - `view/` — read models composed from multiple db tables for display (e.g. `ProductView` = `ProductDb` + resolved `category` + resolved `addons`)
  - `ui/` — models that carry local UI state alongside db fields (e.g. `CategoryUi` adds a `dropdown` flag)

### Data layer

`IndexedDbService` (`src/app/services/indexeddb.ts`) extends `Dexie` directly and owns the schema (`categories`, `products`, `addons`, `productDetails` tables) plus low-level CRUD methods. `ProductsRepository` sits on top of it and is responsible for joining raw db rows into `ProductView` objects (resolving a product's `category` and its list of `addons`, applying `priceOverride` from `productDetails` when present). Prefer extending `ProductsRepository` (or adding a sibling repository) for new read models rather than joining data in components.

### Routing state

`app.routes.ts` currently has no routes registered, and `app.ts` wires up top-level components (e.g. `Catalog`, the button `Example` lab) directly rather than through the router. Pages under `src/app/pages/` exist but are not yet connected — when wiring navigation, add routes here rather than assuming they already work.

### Component conventions

Components are standalone by default (no `standalone: true` needed in Angular 21). Follow the patterns in `.agents/skills/angular-component/SKILL.md`, which this repo has explicitly adopted:
- Signal-based `input()`/`output()`, not decorator-based `@Input()`/`@Output()`
- `host: {...}` object for host bindings/listeners — never `@HostBinding`/`@HostListener`
- Native control flow (`@if`, `@for`, `@switch`) — never `*ngIf`/`*ngFor`/`*ngSwitch` or `ngClass`/`ngStyle`
- `OnPush`-friendly, signal-driven state

`tsconfig.json` enables full `strict` mode plus `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, and Angular's `strictTemplates`/`strictInjectionParameters`/`strictInputAccessModifiers` — keep new code compliant with these rather than loosening them.
