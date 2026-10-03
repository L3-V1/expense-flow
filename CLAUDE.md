# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Expense Flow is a single-page personal expense tracker (UI and code identifiers in pt-BR). There is no build step, no package.json, no test suite and no linter: everything is plain ES modules plus CDN libraries loaded from `index.html` (Tailwind Play CDN, Alpine.js 3, Chart.js 4.4.4, Google Fonts).

## Running

ES modules don't load over `file://`, so serve the folder over HTTP and open `index.html`, e.g.:

```sh
npx serve .            # or: python -m http.server 8000
```

Verify changes by driving the app in a browser (e.g. Playwright). Data lives in `localStorage` under the key `expenseFlow.v1` (`{ expenses, budget }`); clear it to get the empty state.

The site is published by GitHub Pages straight from the root of `main` (no build, no workflow; `.nojekyll` keeps files served as-is), so every path in `index.html` must stay relative. Alpine and Chart.js are pinned to exact CDN versions; keep them pinned (the Tailwind Play CDN has no version pin).

## Architecture

- **`index.html`** holds all markup, the Tailwind config, and the custom CSS (design tokens as CSS variables on `:root`: `--paper`, `--ink`, `--gold`, …, plus `.sheet`-style classes). The whole UI is one Alpine component: `<div x-data="expenseFlow()">`.
- **`src/main.js`** only exposes the component factory as `window.expenseFlow`. It is a module script placed *before* the deferred Alpine script so the global exists when Alpine boots; keep that order.
- **`src/controllers/expenseFlowController.js`** is the Alpine component: reactive state (expenses, form, errors, budget, filters, toasts, delete-confirmation target), getters for derived values, and actions. `init()` sets `$watch`ers that persist to storage and re-render the chart.
- **`src/models/`** are pure functions with no Alpine/DOM dependency: form validation and expense CRUD helpers (`expense.js`), budget math (`budget.js`), the fixed `CATEGORIES` list with label/color (`categories.js`), and per-category aggregation (`categoryTotals.js`). Keep business logic here and have the controller delegate to it.
- **`src/services/`** wrap side effects: `storageService.js` (localStorage, failures silently ignored) and `chartService.js` (destroys and recreates the Chart.js doughnut on every render; uses the global `Chart` from the CDN).
- **`src/utils/format.js`**: `formatCurrency` (pt-BR / BRL).

Expense shape: `{ id, valor, descricao, categoria }`, where `categoria` is a key from `CATEGORIES`. The chart and category totals use the *filtered* expenses; the budget balance uses the full total.

### Chart gotcha

The donut `<canvas>` lives inside `<template x-if="expenses.length > 0">`. Do not reach it via `x-ref`/`$refs`: Alpine caches `$refs` on first access and won't see refs created later by `x-if`. `renderChart()` queries `this.$root.querySelector('[data-chart="donut"]')`, and the canvas calls `renderChart()` from its own `x-init`. `renderDonutChart` destroys the old instance when the canvas is gone. See `docs/plans/correcao-grafico-primeiro-lancamento.md`.

## Conventions

- Domain vocabulary is defined in `GLOSSARY.md` (e.g. the canonical term for a recorded item is *lançamento*).
- All user-facing text is Brazilian Portuguese; domain names in code are too (`valor`, `descricao`, `categoria`, `saldoDisponivel`, `orcamentoEstourado`).
- User actions give feedback via `notify(message, type)` toasts; form errors are custom pt-BR messages in `errors`, not native browser validation.
- Approved plans are saved to `docs/plans/<slug>.md` with frontmatter (`titulo`, `data`, `status`).
