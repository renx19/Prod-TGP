import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const useEventStore = create((set, get) => ({
  title: '',
  description: '',
  month: '',
  year: '',
  isLoading: false,
  events: [],
  currentEvent: null,

  // Setters
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setMonth: (month) => set({ month }),
  setYear: (year) => set({ year }),

  resetForm: () =>
    set({
      title: '',
      description: '',
      month: '',
      year: '',
    }),

  // CREATE event with image upload (files passed as argument)
  createEvent: async ({ title, description, month, year, images }) => {
    if (!title || !description || !images.length || !month || !year) {
      console.warn('Validation failed: Missing fields');
      return {
        success: false,
        message: 'Please fill out all fields and upload at least one image.',
      };
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('month', month);
    formData.append('year', year);
    images.forEach((file) => formData.append('images', file));

    set({ isLoading: true });

    try {
      await axios.post(`${API_URL}/create-event`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      await get().fetchAllEvents();
      get().resetForm();

      return { success: true };
    } catch (error) {
      console.error('Create error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.error || 'Failed to create event.',
      };
    } finally {
      set({ isLoading: false });
    }
  },

  // GET all events
  fetchAllEvents: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/events`, { withCredentials: true });
      set({ events: response.data });
    } catch (error) {
      console.error('Fetch events error:', error.response?.data || error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  // GET event by ID
  fetchEventById: async (id) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/events/${id}`, { withCredentials: true });
      set({ currentEvent: response.data });
    } catch (error) {
      console.error('Fetch event by ID error:', error.response?.data || error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  

  // UPDATE event
  updateEvent: async (id, { title, description, month, year, images = [], existingImageUrls = [] }) => {
    const formData = new FormData();

    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    if (month) formData.append('month', month);
    if (year) formData.append('year', year);

    if (images.length > 0) {
      images.forEach((file) => {
        formData.append('images', file);
      });
    } else {
      existingImageUrls.forEach((url) => {
        formData.append('imageUrls', url);
      });
    }

    set({ isLoading: true });

    try {
      const response = await axios.put(`${API_URL}/events/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      console.log('Updated event:', response.data);
      await get().fetchAllEvents();
      get().resetForm();
    } catch (error) {
      console.error('Update error:', error.response?.data || error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  // DELETE event
  deleteEvent: async (id) => {
    set({ isLoading: true });
    try {
      await axios.delete(`${API_URL}/events/${id}`, { withCredentials: true });
      console.log('Event deleted');
      await get().fetchAllEvents();
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
    } finally {
      set({ isLoading: false });
    }
  },

  // GET event titles
  fetchEventTitles: async () => {
    try {
      const response = await axios.get(`${API_URL}/event-titles`, { withCredentials: true });
      set({ eventTitles: response.data });
    } catch (error) {
      console.error('Error fetching titles:', error.response?.data || error.message);
    }
  },
}));

export default useEventStore;

// store/useEventStore.js

// import { create } from 'zustand';

// const useEventStore = create((set) => ({
//   // Form fields
//   title: '',
//   description: '',
//   month: '',
//   year: '',
//   images: [],

//   // Selected item (for admin/member pages)
//   selectedEvent: null,

//   // Setters
//   setTitle: (title) => set({ title }),
//   setDescription: (description) => set({ description }),
//   setMonth: (month) => set({ month }),
//   setYear: (year) => set({ year }),
//   setImages: (images) => set({ images }),
//   setSelectedEvent: (event) => set({ selectedEvent: event }),

//   // Reset form
//   resetForm: () =>
//     set({
//       title: '',
//       description: '',
//       month: '',
//       year: '',
//       images: [],
//     }),
// }));

// export default useEventStore;

