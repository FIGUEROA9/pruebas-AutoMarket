import { defineConfig, devices } from '@playwright/test';

// Puerto del frontend: el de "npm run dev" de AutoMarketPlus (strictPort en vite.config.ts).
const port = 8080;

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: `http://localhost:${port}`,
    // Guarda la traza solo cuando un test falla y se reintenta: se abre con "pnpm report"
    trace: 'on-first-retry',
  },
  // Lista en la terminal + reporte HTML que abres cuando quieras con "pnpm report"
  reporter: [['list'], ['html', { open: 'never' }]],
  retries: process.env.CI ? 1 : 0,
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Playwright levanta la app (frontend + server functions) con el mismo comando que el equipo.
  webServer: {
    command: 'npm run dev',
    cwd: '..',
    url: `http://localhost:${port}`,
    // El primer arranque compila Vite y migra la BD en memoria: damos margen.
    timeout: 180_000,
    // Siempre un servidor propio: así los tests nunca corren contra un "npm run dev" que
    // tengas abierto con otra BD. Si el puerto 8080 está ocupado, ciérralo antes de correr.
    reuseExistingServer: false,
    // DATABASE_URL vacío = sin BD remota: la app usa PGLite en memoria con los datos semilla
    // de migrations/. Los tests NUNCA tocan Neon ni ninguna BD con datos reales.
    env: { DATABASE_URL: '' },
  },
});
