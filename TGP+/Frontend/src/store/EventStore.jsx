import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const useEventStore = create((set, get) => ({
  title: '',
  description: '',
  uploadedImageUrls: [],
  isImageUploaded: false,
  isUploading: false,
  isCreatingEvent: false,
  month: '',
  year: '',
  eventTitles: [],
  events: [], // Store all events
  currentEvent: null, // Store details of a specific event

  setMonth: (month) => set((state) => ({ ...state, month })),
  setYear: (year) => set((state) => ({ ...state, year })),
  setTitle: (title) => set((state) => ({ ...state, title })),
  setDescription: (description) => set((state) => ({ ...state, description })),

  handleImageUpload: async (imageFiles) => {
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    set({ isUploading: true });

    try {
      const uploadResponse = await axios.post(`${API_URL}/upload-images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      const { imageUrls } = uploadResponse.data;
      set({ uploadedImageUrls: imageUrls, isImageUploaded: true });
      console.log('Images uploaded successfully:', imageUrls);
      return imageUrls;
    } catch (error) {
      console.error('Error uploading images:', error.response ? error.response.data : error.message);
      set({ isImageUploaded: false });
    } finally {
      set({ isUploading: false });
    }
    return null;
  },

  handleEventSubmit: async () => {
    const { title, description, year, month, uploadedImageUrls, fetchAllEvents } = get();
    const eventData = { title, description, imageUrls: uploadedImageUrls || [], year, month };
    set({ isCreatingEvent: true });

    try {
      const eventResponse = await axios.post(`${API_URL}/create-event`, eventData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      if (eventResponse.status === 201) {
        console.log('Event created successfully:', eventResponse.data);

        // Clear fields after successful creation
        set({ title: '', description: '', uploadedImageUrls: [], month: '', year: '' });

        // Fetch updated events list
        await fetchAllEvents(); // Refresh events list after creating an event
      } else {
        console.error('Error creating event:', eventResponse.statusText);
      }
    } catch (error) {
      console.error('Error creating event:', error.response ? error.response.data : error.message);
    } finally {
      set({ isCreatingEvent: false });
    }
  },

  fetchEventTitles: async () => {
    try {
      const response = await axios.get(`${API_URL}/events`, { withCredentials: true });
      const titles = response.data.map(event => event.title);
      set({ eventTitles: titles });
    } catch (error) {
      console.error('Error fetching event titles:', error.response ? error.response.data : error.message);
    }
  },

  fetchAllEvents: async () => {
    try {
      const response = await axios.get(`${API_URL}/events`, { withCredentials: true });
      set({ events: response.data });
    } catch (error) {
      console.error('Error fetching events:', error.response ? error.response.data : error.message);
    }
  },

  fetchEventById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/events/${id}`, { withCredentials: true });
      set({ currentEvent: response.data });
    } catch (error) {
      console.error('Error fetching event:', error.response ? error.response.data : error.message);
    }
  },
}));

export default useEventStore;
