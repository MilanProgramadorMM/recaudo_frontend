import { BackendDate } from '../services/cartera.service';

/**
 * Convierte la fecha que devuelve el backend a un string 'yyyy-MM-dd' consistente.
 *
 * Por qué es necesario: Jackson serializa LocalDate por defecto como un array
 * [year, month, day] (no como string ISO), como se puede confirmar en las
 * respuestas reales de /portfolio-snapshots/*: "fecha": [2026, 7, 15].
 * Esta función normaliza ese formato, y también soporta el caso en que el
 * backend cambie a serializar como string ISO en el futuro, sin romper el
 * frontend.
 */
export function normalizeBackendDate(raw: BackendDate): string {
  if (Array.isArray(raw)) {
    const [year, month, day] = raw;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  return raw;
}

/** Convierte la fecha del backend a un objeto Date de JS (medianoche local). */
export function backendDateToJsDate(raw: BackendDate): Date {
  const iso = normalizeBackendDate(raw);
  return new Date(`${iso}T00:00:00`);
}