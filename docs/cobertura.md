# Cobertura — AutoMarketPlus

La cobertura se mide con **c8** (cobertura V8 nativa de Node) sobre las pruebas que ya corre el proyecto (`node --test`). El proyecto no usa Vitest, por eso no se usa `@vitest/coverage-v8`. Con `"all": true` los archivos que ningún test carga **cuentan como 0%**: así el porcentaje no se infla.

AutoMarketPlus es TanStack Start (una sola app con rutas React y *server functions*), así que "frontend" y "backend" son dos grupos de archivos del mismo repo, medidos por separado.

| Comando | Qué mide | Configuración |
|---|---|---|
| `npm run test:coverage:backend` | Server functions y lógica del servidor | [`.c8rc.backend.json`](../.c8rc.backend.json) |
| `npm run test:coverage:frontend` | Rutas, componentes y utilidades de UI | [`.c8rc.frontend.json`](../.c8rc.frontend.json) |

Primera vez: `npm install --save-dev --save-exact c8` (fija la versión exacta y actualiza `package-lock.json`).

## Qué se mide

- **Backend**: `src/lib/market.ts` (server functions), `src/lib/swap.ts`, `src/lib/app-data/**` y la autenticación del servidor (`src/lib/auth/*.server.ts`, `server.ts`, `middleware.ts`, etc.).
- **Frontend**: `src/routes/**`, `src/components/**`, `src/lib/format.ts` y los módulos de UI de `src/lib/auth/` (`gates.tsx`, `provider.tsx`, `use-current-user.ts`, `client.ts`).

## Qué queda fuera y por qué

| Archivo | Motivo |
|---|---|
| `src/lib/db.ts`, `src/lib/auth/pglite-dialect.ts` | Adaptadores de BD: se prueban con integración real en la semana 6 |
| `src/lib/auth/mail.ts` | Adaptador SMTP: se reemplaza con un doble en la semana 5 |
| `src/lib/auth/popup.server.ts` | Manejador de popup OAuth solo de desarrollo (`apply: "serve"`): no corre en producción |
| `src/routeTree.gen.ts` | Archivo generado por TanStack Router |
| `src/router.tsx`, `vite.config.ts`, `scripts/**` | Arranque, configuración y herramientas de build |
| `src/lib/preview-*.ts`, `src/lib/multiplayer/**` | Puente con el host de previsualización, no es lógica de negocio |
| `**/*.test.ts` | Los tests no cuentan como código a cubrir |

## Línea base (Semana 1)

Los tests E2E de Playwright **no suman** a esta cobertura: prueban el sistema desde afuera.

| Parte | Línea base (líneas) | Umbral configurado |
|---|---|---|
| Frontend | 0 % (ningún test unitario carga estos archivos) | 0 |
| Backend | _anotar el valor que imprime `npm run test:coverage:backend`_ | _igual, redondeado hacia abajo_ |

El umbral está en los `.c8rc.*.json` (`lines`, `branches`, `functions`, `statements`). **Nunca baja**; desde la semana 2 sube hasta el 80 %.

## Comprobar que el umbral muerde

1. Pon `"lines": 99` en `.c8rc.backend.json`.
2. Corre `npm run test:coverage:backend`: debe **fallar**.
3. Devuelve el valor a la línea base.
