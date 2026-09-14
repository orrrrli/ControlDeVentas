# Control de Ventas — Sales & Inventory Management System

A Vue 2 + Vuetify single-page application for running a small retail operation:
inventory, purchasing, sales, customers, suppliers, users and roles, plus
date-ranged reports and PDF exports.

This repository holds the **frontend**. It talks to an ASP.NET Core Web API backed by
SQL Server, which lives separately — see [Backend](#backend).

Built as a university project (UABC, 2023).

---

## Modules

Thirteen screens across six domains, each routed and backed by its own API controller:

| Domain | Screens | What it does |
|---|---|---|
| **Almacén** | Artículos · Categorías | Product catalogue, barcode lookup, category assignment |
| **Compras** | Ingresos · Proveedores | Purchase entries with line items, supplier registry |
| **Ventas** | Ventas · Clientes | Sales with line items, customer registry |
| **Consultas** | Compras · Ventas | Date-range queries, drill-down into document line items |
| **Gráficas** | Ingresos · Ventas | 12-month purchase and sales totals |
| **Usuarios** | Usuarios · Roles | User accounts and role assignment |

---

## Stack

| Layer | Technology |
|---|---|
| **Framework** | Vue 2.6 (Options API) · Vue CLI |
| **UI** | Vuetify 2.6 · Material Design Icons |
| **Routing** | Vue Router 3 — 13 named routes |
| **State** | Vuex 3 |
| **HTTP** | axios, with `baseURL` configured globally in `main.js` |
| **Charts** | Chart.js 2.9 |
| **PDF export** | jsPDF · jspdf-autotable |
| **Linting** | ESLint (standard config) + eslint-plugin-vue |

---

## Design notes

Three decisions in here are worth pointing out, because they are what separate this
from a tutorial CRUD.

### Nothing is ever deleted

There is not a single `axios.delete` call in the codebase. Every "remove" action is a
`PUT` to `Activar`/`Desactivar`:

```
PUT api/Articulos/DesactivarArticulos/{id}
PUT api/Articulos/ActivarArticulos/{id}
```

Sales records reference articles, articles reference categories, and purchase entries
reference suppliers. Hard-deleting any of them would either break referential
integrity or silently orphan historical documents. Deactivation keeps the audit trail
intact and keeps old invoices readable — and it makes the action reversible, so a
mis-click is not a data-loss event.

### One `Personas` table, two roles

Customers and suppliers are the same entity server-side, distinguished by type:

```
GET api/Personas/ListarCliente
GET api/Personas/ListarProvedores
POST api/Personas/InsertarPersona     ← shared by both
```

They carry identical fields (name, tax ID, address, phone, email), so splitting them
into two tables would have duplicated the schema to encode nothing but a label.

### Master–detail documents

Purchases and sales are headers with line items. The list endpoint returns headers;
the detail is fetched on demand:

```
GET api/Ingresos/ListarIngresos
GET api/Ingresos/ListarDetalleIngreso/{id}     ← only when a row is expanded
```

Reports are range-scoped rather than paged (`ListadoRangoFechas/{from}/{to}`), which
suits how the screens are actually used — you ask for a month, not for page 4.

---

## API surface

Seven controllers:

| Controller | Operations |
|---|---|
| `Articulos` | list · lookup by barcode · insert · modify · activate/deactivate |
| `Categorias` | list · select · insert · modify · activate/deactivate |
| `Ingresos` | list · detail · date range · chart data · insert · deactivate |
| `Ventas` | list · detail · date range · chart data · deactivate |
| `Personas` | list customers · list suppliers · select · insert · modify |
| `Usuarios` | list · insert · modify · activate/deactivate |
| `Roles` | list · select · insert · modify · activate/deactivate |

### PDF export

Six of the twelve screens export their current table via jsPDF + autotable:
Artículos, Categorías, Clientes, Proveedores, Usuarios and Roles.

Note which ones are missing it — Ventas, Ingresos and both Consultas screens. The
master-data catalogues can be exported; the transactional records and the date-ranged
reports, which are the ones an owner would actually want on paper, cannot.

---

## Running locally

```bash
npm install
npm run serve      # http://localhost:8080
```

The API base URL is set in `src/main.js`:

```js
axios.defaults.baseURL = 'https://localhost:7189'
```

Point it at your backend before the app will load any data.

### Backend

Not included in this repository. It is an ASP.NET Core Web API over SQL Server
exposing the seven controllers listed above, served on `https://localhost:7189` in
development.

---

## Known limitations

Stated rather than hidden:

- **PDF export is missing from the reporting screens** — see above.
- **`vue-chartjs` is an unused dependency** — it is in `package.json` but imported
  nowhere.
- **`categorias.vue` and `roles.vue` hardcode the absolute API URL** instead of using
  the configured `baseURL`, so they ignore the setting in `main.js`.
- **No authentication.** The app manages users and roles as data, but nothing gates
  access to the screens themselves.
- **Validation is hand-rolled** — each form builds a `ValidaMensajes` array in a
  `validar()` method rather than using Vuetify's `:rules`, so the messages are
  consistent within a form but not across them.
