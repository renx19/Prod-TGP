import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const useFinancialEventStore = create((set, get) => ({
  title: '',
  budget: '0',
  totalExpenses: 0,
  totalDonations: 0,
  expenses: [{ date: '', store: '', particulars: '', cost: '' }],
  donations: [{ date: '', receivedFrom: '', amount: '' }],
  distributions: [{ date: '', location: '', goodsDistributed: '', quantity: '' }],
  financialEvents: [],
  selectedFinancialEvent: null,

  // Setters for title and budget
  setTitle: (title) => set(() => ({ title })),
  setBudget: (budget) => set(() => ({ budget })),

  // Add functions for expenses, donations, and distributions
  addExpense: () =>
    set((state) => ({
      expenses: [...state.expenses, { date: '', store: '', particulars: '', cost: '' }],
    })),

  addDonation: () =>
    set((state) => ({
      donations: [...state.donations, { date: '', receivedFrom: '', amount: '' }],
    })),

  addDistribution: () =>
    set((state) => ({
      distributions: [...state.distributions, { date: '', location: '', goodsDistributed: '', quantity: '' }],
    })),

    

  // Update a specific item in expenses, donations, or distributions
  setField: (type, index, field, value) => set((state) => {
    const newArray = [...state[type]];
    newArray[index][field] = value;
    return { [type]: newArray };
  }),

  // Action to set the financial event data
  setFinancialEvent: (eventData) => set({
    financialEvent: eventData,
    totalExpenses: eventData.totalExpenses,  // Set total expenses
    totalDonations: eventData.totalDonations, // Set total donations
    budget: eventData.budget, // Set budget
    
  }),


  // Action to set the loading state
  setLoading: (isLoading) => set({ loading: isLoading }),

  // Action to set the error state
  setError: (errorMessage) => set({ error: errorMessage }),




  updateExpenses: async (updatedExpenses) => {
    const { selectedFinancialEvent } = get();
    if (!selectedFinancialEvent) return;

    try {
        console.log('Updated Expenses:', updatedExpenses);  // Debug log
        
        // Send updatedExpenses directly as an array, like donations
        const response = await axios.put(`${API_URL}/financial-event/${selectedFinancialEvent._id}/expenses`, updatedExpenses);

        // Assuming the backend now returns the updated expenses directly in response.data
        const newExpenses = response.data.expenses; // The response should return the updated expenses directly
        
        // Update the state with the new expenses data
        set((state) => {
            return { financialEvent: { ...state.financialEvent, expenses: newExpenses } };
        });
    } catch (error) {
        console.error('Error updating expenses:', error.response?.data || error.message);
    }
},


  // Action to update donations and reflect live changes in the DB
  updateDonations: async (updatedDonations) => {
    const { selectedFinancialEvent } = get();
    if (!selectedFinancialEvent) return;

    try {
        // Ensure that the request payload is correctly structured
        const response = await axios.put(`${API_URL}/financial-event/${selectedFinancialEvent._id}/donations`, updatedDonations);
        
        // Ensure the backend response has the expected structure
        const newDonations = response.data.donations;
        
        // Update state with the new donations data
        set((state) => {
            return { financialEvent: { ...state.financialEvent, donations: newDonations } };
        });
    } catch (error) {
        console.error('Error updating donations:', error.response?.data || error.message);
    }
},


  // Action to update distributions and reflect live changes in the DB
  updateDistributions: async (updatedDistributions) => {
    const { selectedFinancialEvent } = get();
    if (!selectedFinancialEvent) return;

    try {
        // Ensure that the request payload is correctly structured
        const response = await axios.put(`${API_URL}/financial-event/${selectedFinancialEvent._id}/distributions`, updatedDistributions);
        
        // Ensure the backend response has the expected structure
        const newDistributions = response.data.distributions;
        
        // Update state with the new distributions data
        set((state) => {
            return { financialEvent: { ...state.financialEvent, distributions: newDistributions } };
        });
    } catch (error) {
        console.error('Error updating distributions:', error.response?.data || error.message);
    }
},



  deleteExpense: async (expenseId, financialEventId) => {
    try {
      const response = await axios.delete(`${API_URL}/financial-event/${financialEventId}/expenses/${expenseId}`);
      console.log('Expense deleted:', response.data);  // Optionally log the server response
  
      set((state) => {
        if (state.financialEvent) {
          const updatedExpenses = state.financialEvent.expenses.filter(expense => expense._id !== expenseId);
          return {
            financialEvent: { ...state.financialEvent, expenses: updatedExpenses },
          };
        }
        return state;
      });
  
      // Optionally show a success message or notification here
      alert('Expense deleted successfully!');
    } catch (error) {
      console.error('Failed to delete expense:', error);
      // Optionally show an error message to the user
      alert('Error deleting expense. Please try again later.');
    }
  },
  
  // Action to delete a donation
  deleteDonation: async (donationId, financialEventId) => {
    try {
      const response = await axios.delete(`${API_URL}/financial-event/${financialEventId}/donations/${donationId}`);
      console.log('Donation deleted:', response.data);
  
      set((state) => {
        if (state.financialEvent) {
          const updatedDonations = state.financialEvent.donations.filter(donation => donation._id !== donationId);
          return {
            financialEvent: { ...state.financialEvent, donations: updatedDonations },
          };
        }
        return state;
      });
  
      alert('Donation deleted successfully!');
    } catch (error) {
      console.error('Failed to delete donation:', error);
      alert('Error deleting donation. Please try again later.');
    }
  },
  
  // Action to delete a distribution
  deleteDistribution: async (distributionId, financialEventId) => {
    try {
      const response = await axios.delete(`${API_URL}/financial-event/${financialEventId}/distributions/${distributionId}`);
      console.log('Distribution deleted:', response.data);
  
      set((state) => {
        if (state.financialEvent) {
          const updatedDistributions = state.financialEvent.distributions.filter(distribution => distribution._id !== distributionId);
          return {
            financialEvent: { ...state.financialEvent, distributions: updatedDistributions },
          };
        }
        return state;
      });
  
      alert('Distribution deleted successfully!');
    } catch (error) {
      console.error('Failed to delete distribution:', error);
      alert('Error deleting distribution. Please try again later.');
    }
  },
  
  addFinancialEvent: async () => {
    const { title,budget, expenses, donations, distributions, fetchFinancialEvents } = get();
    
    // Calculate the current balance instead of using the budget directly
  
    try {
      const response = await axios.post(`${API_URL}/financial-event`, {
        title,
        budget, // Use the calculated current balance as the budget
        expenses,
        donations,
        distributions,
      });
      console.log('Financial Event created:', response.data);
      fetchFinancialEvents(); // Refresh the list of events after creation
    } catch (error) {
      console.error('Error creating financial event:', error);
    }
  },
  

  // Fetch all financial events
  fetchFinancialEvents: async () => {
    try {
      const response = await axios.get(`${API_URL}/financial-event`);
      set({ financialEvents: response.data });
    } catch (error) {
      console.error('Error fetching financial events:', error);
    }
  },

  // Set the selected financial event for updating
  selectFinancialEvent: (event) => {
    if (event) { // Check if event is defined
      set({
        selectedFinancialEvent: event,
        title: event.title,
        budget: event.budget,
        expenses: event.expenses,
        donations: event.donations,
        distributions: event.distributions,
      });
    } else {
      console.warn('Event not found');
      set({ selectedFinancialEvent: null });
    }
  },

// Update a financial event
// Update a financial event
updateFinancialEvent: async (id, data) => {
  const { fetchFinancialEvents } = get();
  try {
    // Only send the fields you intend to update (in this case, only the title)
    const response = await axios.put(`${API_URL}/financial-event/${id}`, data);
    console.log('Financial Event updated:', response.data);
    fetchFinancialEvents(); // Refresh the list of events after updating
  } catch (error) {
    console.error('Error updating financial event:', error);
  }
},


  // Delete a financial event
  deleteFinancialEvent: async (id) => {
    const { fetchFinancialEvents } = get();
    try {
      await axios.delete(`${API_URL}/financial-event/${id}`);
      console.log('Financial Event deleted');
      fetchFinancialEvents(); // Refresh the list of events after deletion
    } catch (error) {
      console.error('Error deleting financial event:', error);
    }
  },
          // Action to insert a new expense
      insertExpense: async (date, store, particulars, cost, eventId) => {
        if (!eventId) return;

        try {
          const response = await axios.post(
            `${API_URL}/financial-event/${eventId}/expenses`,
            { date, store, particulars, cost }
          );

          // Update the state with the new expense and totals
          set({
            financialEvent: {
              ...response.data,
              expenses: response.data.expenses,
              totalExpenses: response.data.totalExpenses,
              totalDonations: response.data.totalDonations,
              budget: response.data.budget,
            },
          });
        } catch (error) {
          console.error('Error inserting expense:', error.response?.data || error.message);
        }
      },

      // Action to insert a new donation
      insertDonation: async (date, receivedFrom, amount, eventId) => {
        if (!eventId) return;

        try {
          const response = await axios.post(
            `${API_URL}/financial-event/${eventId}/donations`,
            { date, receivedFrom, amount }
          );

          // Update the state with the new donation and totals
          set({
            financialEvent: {
              ...response.data,
              donations: response.data.donations,
              totalExpenses: response.data.totalExpenses,
              totalDonations: response.data.totalDonations,
              budget: response.data.budget,
            },
          });
        } catch (error) {
          console.error('Error inserting donation:', error.response?.data || error.message);
        }
      },

      // Action to insert a new distribution
      insertDistribution: async (date, distributedTo, quantity, eventId) => {
        if (!eventId) return;

        try {
          const response = await axios.post(
            `${API_URL}/financial-event/${eventId}/distributions`,
            { date, distributedTo, quantity }
          );

          // Update the state with the new distribution
          set({
            financialEvent: {
              ...response.data,
              distributions: response.data.distributions,
            },
          });
        } catch (error) {
          console.error('Error inserting distribution:', error.response?.data || error.message);
        }
      },
}));



export default useFinancialEventStore;
