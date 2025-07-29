// 1. ZUSTAND STORE (event-store.js)
// store/useEventStore.js
// store/useEventStore.js


import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export const useEventStore = create(
  persist(
    (set, get) => ({
      events: [],

      // Replace all events (e.g. from backend)
      setEvents: (events) => set({ events }),

      // Add event and sync to backend
      addEvent: async (event) => {
        set((state) => ({ events: [...state.events, event] }));
        try {
          await axios.post('/api/history', event);
        } catch (error) {
          console.error('Error syncing to backend:', error);
        }
      },
    }),
    {
      name: 'event-storage',
    }
  )
);











// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// // Assume you get userId from your auth provider or auth context
// const userId = localStorage.getItem('userId') || 'guest';

// export const useEventStore = create(
//   persist(
//     (set) => ({
//       events: [],

//       setEvents: (events) => set({ events }),

//       addEvent: (newEvent) =>
//         set((state) => ({ events: [newEvent, ...state.events] })),

//       updateEvent: (id, updatedFields) =>
//         set((state) => ({
//           events: state.events.map((event) =>
//             event.id === id ? { ...event, ...updatedFields } : event
//           ),
//         })),

//       deleteEvent: (id) =>
//         set((state) => ({
//           events: state.events.filter((event) => event.id !== id),
//         })),

//       clearEvents: () => set({ events: [] }),
//     }),
//     {
//       name: `event-store-${userId}`, // store separate per user
//       partialize: (state) => ({ events: state.events }),
//     }
//   )
// );





















// store/useEventStore.js

// export const useEventStore = create((set) => ({
//   events: [],
//   setEvents: (events) => set({ events }),
// }));




















// const useEventStore = create((set) => ({
//   events: [],
//   filters: {
//     camera: '',
//     type: '',
//     dateRange: { from: '', to: '' },
//     search: '',
//   },
//   setEvents: (data) => set({ events: data }),
//   setFilter: (key, value) =>
//     set((state) => ({ filters: { ...state.filters, [key]: value } })),
// }));

// export default useEventStore;














// import { create } from 'zustand';

// const useEventStore = create((set) => ({
//   events: [],
//   filters: {
//     camera: '',
//     type: '',
//     dateRange: { from: '', to: '' },
//     search: '',
//   },
//   setEvents: (data) => set({ events: data }),
//   setFilter: (key, value) =>
//     set((state) => ({ filters: { ...state.filters, [key]: value } })),
// }));

// export default useEventStore;