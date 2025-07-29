// store/zone-store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useZoneStore = create(
  persist(
    (set, get) => ({
      zones: [],

      addZone: (zone) => set((state) => ({
        zones: [...state.zones, zone],
      })),

      editZone: (id, updatedZone) => set((state) => ({
        zones: state.zones.map((zone) =>
          zone.id === id ? { ...zone, ...updatedZone } : zone
        ),
      })),

      deleteZone: (id) => set((state) => ({
        zones: state.zones.filter((zone) => zone.id !== id),
      })),

      clearZones: () => set({ zones: [] }),
    }),
    {
      name: 'zone-storage', // localStorage key
    }
  )
);