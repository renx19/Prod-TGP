import axios from 'axios';

const API_URL =
    import.meta.env.VITE_API_URL;

// Fetch all events
export const fetchEvents = async() => {
    const { data } = await axios.get(`${API_URL}/events`, { withCredentials: true });
    return data;
};

// Fetch event by ID
export const fetchEventById = async(id) => {
    const { data } = await axios.get(`${API_URL}/events/${id}`, { withCredentials: true });
    return data;
};

// Create event
export const createEvent = async(eventData) => {
    const formData = new FormData();
    Object.entries(eventData).forEach(([key, value]) => {
        if (key === 'images') {
            value.forEach((file) => formData.append('images', file));
        } else {
            formData.append(key, value);
        }
    });

    const { data } = await axios.post(`${API_URL}/create-event`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
    });
    return data;
};

// Update event
export const updateEvent = async(id, eventData) => {
    const formData = new FormData();
    Object.entries(eventData).forEach(([key, value]) => {
        if (key === 'images') {
            value.forEach((file) => formData.append('images', file));
        } else {
            formData.append(key, value);
        }
    });

    const { data } = await axios.put(`${API_URL}/events/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
    });
    return data;
};

// Delete event
export const deleteEvent = async(id) => {
    const { data } = await axios.delete(`${API_URL}/events/${id}`, { withCredentials: true });
    return data;
};

// Fetch event titles
export const fetchEventTitles = async() => {
    const { data } = await axios.get(`${API_URL}/event-titles`, { withCredentials: true });
    return data;
};