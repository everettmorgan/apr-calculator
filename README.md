# Affirm APR Calculator

A small, embeddable APR estimator built with TypeScript and Web Components (Lit). The library exposes a fluent builder API and renders an interactive APR/payment estimate UI into a host container.

- Built with: `TypeScript`, `lit`, `typedi`, `zod`
- Output: `dist/apr_calculator.js` (bundled, minified, global name `AffirmAprCalculator`)

## Quick start

1. Install dependencies:
```bash
yarn install
```

2. Build:
```bash
yarn build
```
This runs `tsc` and bundles `js/index.js` to `dist/apr_calculator.js` via `esbuild`.

3. Add to your page
- Include the built bundle and initialize using the builder API:
```html
<div id="affirm-apr-calculator"></div>

<script src="./dist/apr_calculator.js"></script>
<script>
  AffirmAprCalculator.create({ apiKey: 'YOUR_API_KEY_HERE' })
    .withPlans([
      { apr: 0.10, months: 12 },
      { apr: 0.10, months: 24 },
      { apr: 0.10, months: 36 },
      { apr: 0.20, months: 12 },
      { apr: 0.20, months: 24 },
      { apr: 0.20, months: 36 },
      { apr: 0.30, months: 12 },
      { apr: 0.30, months: 24 },
      { apr: 0.30, months: 36 },
    ])
    .withInitialState({ purchaseAmount: 1500, selectedApr: 0.10 })
    .withViewOptions({
      title: 'Pay over time',
      subtitle: 'Choose a plan that works for you',
      color: '#1a73e8',
      mountSelector: '#affirm-apr-calculator',
    })
    .mount();
</script>
```

## API

The library exposes a single `create()` function globally as `AffirmAprCalculator.create(...)`. It returns a builder with the following methods:

### `create(apiConfig?)`
Creates a new builder instance. Optionally accepts `{ apiKey: string }`.

### `.withApiKey(apiKey: string)`
Sets the API key used by the estimate client.

### `.withPlans(plans: Array<{ apr: number; months: number }>)`
Defines the available financing plans. Each plan specifies:
- `apr` — decimal APR (e.g. `0.10` for 10%)
- `months` — loan length in months

### `.withInitialState({ purchaseAmount: number; selectedApr: number })`
Sets the initial purchase amount (dollars) and initially selected APR (decimal).

### `.withViewOptions(options)`
Optional UI customizations:
- `title` (string) — widget heading
- `subtitle` (string) — widget subheading
- `color` (string) — accent color (CSS color value)
- `mountSelector` (string) — CSS selector for the mount container (default: `#affirm-apr-calculator`)

### `.mount(selector?)`
Validates the configuration and mounts the widget. Optionally accepts a CSS selector to override `mountSelector`.

## Project structure (important files)
- `src/index.ts` — entry; exposes `create`.
- `src/controller.ts` — application controller (initialization, event handling).
- `src/view.ts` — renders and updates the Lit root component.
- `src/elements/` — web component implementations (amount input, APR list, estimates).
- `src/config/options.ts` — TypeScript interfaces for config types.
- `src/config/validation.ts` — Zod schema for runtime validation.
- `dist/apr_calculator.js` — bundled output after `yarn build`.

## Development notes
- The view uses Web Components via `lit`.
- Services are wired with `typedi`.
- Input validation uses `zod`.
- Calls to the remote estimation API are performed via the included `affirm.client` abstraction.

## Scripts
- `yarn build` — compiles TypeScript and bundles to `dist/apr_calculator.js`.
- `yarn lint` — run ESLint and auto-fix where possible.
- `yarn test` — run the full test suite once.
- `yarn test:watch` — run tests in watch mode.

## License
MIT
