import { Property } from "@/types";
import { seedProperties } from "@/data/seed-properties";

const STORAGE_KEY = "jaminsetu_properties";

export const storageAdapter = {
  initialize: () => {
    if (typeof window === "undefined") return;

    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProperties));
    }
  },

  getAll: (): Property[] => {
    if (typeof window === "undefined") return seedProperties;

    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return seedProperties;
    }
    try {
      return JSON.parse(data);
    } catch {
      return seedProperties;
    }
  },

  getById: (id: string): Property | null => {
    const all = storageAdapter.getAll();
    return all.find((p) => p.id === id) || null;
  },

  add: (property: Property) => {
    const all = storageAdapter.getAll();
    all.push(property);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }
  },

  update: (id: string, updates: Partial<Property>) => {
    const all = storageAdapter.getAll();
    const index = all.findIndex((p) => p.id === id);
    if (index !== -1) {
      all[index] = { ...all[index], ...updates, updatedAt: new Date().toISOString() };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      }
    }
  },

  delete: (id: string) => {
    const all = storageAdapter.getAll();
    const filtered = all.filter((p) => p.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  },

  reset: () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProperties));
    }
  },
};
