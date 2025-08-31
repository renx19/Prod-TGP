// api/financialEvents.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL =
    import.meta.env.VITE_API_URL;

export const fetchFinancialEvents = async() => {
    const { data } = await axios.get(`${API_URL}/financial-event`);
    return data;
};

export const fetchFinancialEventById = async(id) => {
    const { data } = await axios.get(`${API_URL}/financial-event/${id}`);
    return data;
};

export const useFinancialEvents = () => useQuery(['financialEvents'], fetchFinancialEvents);
export const useFinancialEventById = (id) => useQuery(['financialEvent', id], () => fetchFinancialEventById(id));

export const useCreateFinancialEvent = () => {
    const queryClient = useQueryClient();
    return useMutation((newEvent) => axios.post(`${API_URL}/financial-event`, newEvent), {
        onSuccess: () => queryClient.invalidateQueries(['financialEvents']),
    });
};

export const useUpdateFinancialEvent = () => {
    const queryClient = useQueryClient();
    return useMutation(({ id, updatedEvent }) => axios.put(`${API_URL}/financial-event/${id}`, updatedEvent), {
        onSuccess: () => queryClient.invalidateQueries(['financialEvents']),
    });
};

export const useDeleteFinancialEvent = () => {
    const queryClient = useQueryClient();
    return useMutation((id) => axios.delete(`${API_URL}/financial-event/${id}`), {
        onSuccess: () => queryClient.invalidateQueries(['financialEvents']),
    });
};