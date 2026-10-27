export type SwapPrefs = {
  any: boolean;
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  mileageMax?: number;
  condition?: string;
  fuel?: string;
  transmission?: string;
  bodyType?: string;
  city?: string;
  priceMin?: number;
  priceMax?: number;
};

export type SwapVehicleShape = {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  fuel: string;
  transmission: string;
  bodyType: string;
  city: string;
  price: number;
};

export function parseSwapPrefs(raw: string | null | undefined, swapAny = true): SwapPrefs {
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as SwapPrefs;
      if (parsed && typeof parsed === "object") {
        return { ...parsed, any: Boolean(parsed.any) };
      }
    } catch {
      /* ignore */
    }
  }
  return { any: swapAny };
}

export function vehicleMatchesPrefs(vehicle: SwapVehicleShape, prefs: SwapPrefs | null | undefined) {
  if (!prefs || prefs.any) return true;
  if (prefs.brand && vehicle.brand !== prefs.brand) return false;
  if (prefs.model && !vehicle.model.toLowerCase().includes(prefs.model.toLowerCase())) return false;
  if (prefs.yearMin != null && vehicle.year < prefs.yearMin) return false;
  if (prefs.yearMax != null && vehicle.year > prefs.yearMax) return false;
  if (prefs.mileageMax != null && vehicle.mileage > prefs.mileageMax) return false;
  if (prefs.condition && vehicle.condition !== prefs.condition) return false;
  if (prefs.fuel && vehicle.fuel !== prefs.fuel) return false;
  if (prefs.transmission && vehicle.transmission !== prefs.transmission) return false;
  if (prefs.bodyType && vehicle.bodyType !== prefs.bodyType) return false;
  if (prefs.city && vehicle.city !== prefs.city) return false;
  if (prefs.priceMin != null && vehicle.price < prefs.priceMin) return false;
  if (prefs.priceMax != null && vehicle.price > prefs.priceMax) return false;
  return true;
}

export function emptySwapPrefs(): SwapPrefs {
  return { any: true };
}
