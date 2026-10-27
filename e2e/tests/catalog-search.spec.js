import { expect, test } from '@playwright/test';

test('should list only the matching vehicles when searching the catalog by model', async ({
  page,
}) => {
  // Arrange: el catálogo trae vehículos semilla; "Corolla" debe estar antes de buscar
  await page.goto('/catalogo');
  const search = page.getByRole('textbox', { name: 'Buscar vehículos' });
  const duster = page.getByRole('heading', { name: 'Renault Duster Intens 2019' });
  const corolla = page.getByRole('heading', { name: /Toyota Corolla/ });
  await expect(corolla.first()).toBeVisible();

  // Act + Assert: la página se renderiza en el servidor y React tarda un instante en
  // "hidratar" el campo; si se escribe antes, el filtro no se entera. toPass repite el
  // bloque hasta que la app responde (sin esperas fijas) y deja el mismo resultado.
  await expect(async () => {
    await search.fill('Duster');
    await expect(duster.first()).toBeVisible({ timeout: 1_000 });
    await expect(corolla).toHaveCount(0, { timeout: 1_000 });
  }).toPass({ timeout: 10_000 });
});
