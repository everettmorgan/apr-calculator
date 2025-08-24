# Affirm APR Calculator

A small, embeddable APR estimator built with TypeScript and Web Components (Lit). The library exposes a single initializer and renders an interactive APR/payment estimate UI into a host container.

- Built with: `TypeScript`, `lit`, `typedi`, `zod`, `lodash`
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
This runs `tsc` and bundles `js/index.js` to `dist/apr_calculator.js`.

3. Add to your page
- Add a container to mount the widget:
```html
<div id="affirm-apr-calculator"></div>
```
- Include the built bundle and initialize (example):
```html
<script src="./dist/apr_calculator.js"></script>
<script>
  AffirmAprCalculator.Initialize({
    apiKey: 'YOUR_API_KEY_HERE',
    initialPurchaseAmount: 1500,     // dollars
    initialSelectedApr: 0.10,        // decimal (e.g. 10% => 0.10)
    minPurchaseAmount: 100,
    maxPurchaseAmount: 30000,
    plans: [
      { apr: 0.10, months: 12 },
      { apr: 0.10, months: 24 },
      { apr: 0.10, months: 36 },
      { apr: 0.20, months: 12 },
      { apr: 0.20, months: 24 },
      { apr: 0.20, months: 36 },
      { apr: 0.30, months: 12 },
      { apr: 0.30, months: 24 },
      { apr: 0.30, months: 36 }
    ],
    // optional:
    // title: 'Pay over time',
    // subtitle: 'Choose a plan that works for you',
    // color: '#1a73e8',
  });
</script>
```

## API / Options

Call the initializer exposed globally as `AffirmAprCalculator.Initialize(...)` with the following shape:

- `apiKey` (string) — required. API key used by the client.
- `initialPurchaseAmount` (number) — required. Initial purchase amount in dollars.
- `initialSelectedApr` (number) — required. Decimal APR (e.g. 0.10).
- `minPurchaseAmount` (number) — required. Minimum allowed purchase amount.
- `maxPurchaseAmount` (number) — required. Maximum allowed purchase amount.
- `plans` (Array<{ apr: number; months: number }>) — required. Each plan defines an APR (decimal) and length in months.
- `title`, `subtitle`, `disclaimer`, `color` — optional UI customizations.

Mount point: The widget replaces the contents of `document.querySelector('#affirm-apr-calculator')`.

## Project structure (important files)
- `src/index.ts` — entry; exposes `Initialize`.
- `src/controller.ts` — application controller (initialization, event handling).
- `src/view.ts` — renders and updates the Lit root component.
- `src/elements/` — web component implementations (amount input, APR list, estimates).
- `dist/apr_calculator.js` — bundled output after `yarn build`.

## Development notes
- The view uses Web Components via `lit`.
- Services are wired with `typedi`.
- Input validation uses `zod`.
- Calls to the remote estimation API are performed via the included `affirm.client` abstraction.

## Scripts
- `yarn build` — compiles and bundles to `dist/apr_calculator.js`.
- `yarn lint` — run ESLint and auto-fix where possible.

## License
MPL 2.0