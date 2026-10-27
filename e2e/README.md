# E2E — AutoMarketPlus (Playwright)

Los tests abren un navegador real contra la app. Playwright levanta `npm run dev` por su cuenta, con una BD **en memoria** (PGLite) y los datos semilla de `migrations/`, así que no necesitas Docker ni tocar la BD de desarrollo.

## Preparación (una vez por equipo)

```bash
npm install                                   # en la raíz del repo
cd e2e
pnpm install
pnpm exec playwright install chromium         # descarga el navegador (~110 MB)
```

## Correr

```bash
cd e2e
pnpm test            # headless
pnpm test:ui         # modo interactivo, paso a paso
pnpm report          # reporte HTML de la última ejecución
```

> Cierra cualquier `npm run dev` abierto antes de correr: el puerto 8080 debe estar libre.

## Reglas del grupo

- Un test por integrante, sobre un flujo distinto, con commit con **su propio usuario de Git**.
- Locators por rol o etiqueta (`getByRole`, `getByLabel`), sin `waitForTimeout` ni selectores CSS frágiles.
- Estructura AAA y nombre `should [esperado] when [condición]`.
- Cada test se hizo fallar a propósito al menos una vez antes del commit.
