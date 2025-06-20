import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Normalize table data to always return an array of tables
// Accepts arrays or objects with table values
export function normalizeTables(tables) {
  if (!tables) return [];
  if (Array.isArray(tables)) return tables;
  if (typeof tables === 'object') return Object.values(tables);
  return [];
}
