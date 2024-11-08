import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Get the API URL from the environment variable

export const useMemberStore = create((set, get) => ({
  formData: {
    user: '',
    fullName: '',
    address: '',
    phoneNumber: '',
    batchName: '',
    dateOfIR: '',
    sponsorName: '',
    gt: '',
    mww: '',
    almaMater: '',
    birthday: '',
    status: '',
    memberNumber: '',
    alexisName: '',
    gender: '',
    image: null,
  },
  users: [],
  members: [],
  availableUsers: [],
  error: null,

  setFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data },
  })),
  setUsers: (users) => set({ users }),
  setAvailableUsers: (users) => set({ availableUsers: users }),
  setError: (error) => set({ error }),

  fetchAvailableUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/available-users`);
      set({ availableUsers: response.data, error: null });
    } catch (error) {
      console.error('Error fetching available users:', error);
      set({ error: 'Failed to fetch available users. Please try again.' });
    }
  },

  fetchMembers: async () => {
    try {
      const response = await axios.get(`${API_URL}/members`);
      set({ members: response.data, error: null });
    } catch (error) {
      console.error('Error fetching members:', error);
      set({ error: 'Failed to fetch members. Please try again.' });
    }
  },

  fetchAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      set({ users: response.data, error: null });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ error: 'Failed to fetch users. Please try again.' });
    }
  },

  fetchMemberDetails: async (memberId) => {
    if (!memberId) {
      set({ error: 'Member ID is required to fetch member details.' });
      return;
    }

    if (!/^[0-9a-fA-F]{24}$/.test(memberId)) {
      set({ error: 'Invalid Member ID format.' });
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/member/details/${memberId}`);
      set({ formData: response.data, error: null });
    } catch (error) {
      console.error('Error fetching member details:', error);
      set({ error: 'Failed to fetch member details. Please try again.' });
    }
  },

  fetchMyMemberDetails: async (userId) => {
    if (!userId) {
      set({ error: 'Member ID is required to fetch member details.' });
      return;
    }

    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      set({ error: 'Invalid Member ID format.' });
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/member/${userId}`);
      set({ formData: response.data, error: null });
    } catch (error) {
      console.error('Error fetching member details:', error);
      set({ error: 'Failed to fetch member details. Please try again.' });
    }
  },

  deleteMember: async (memberId) => {
    if (!memberId) {
      set({ error: 'Member ID is required to delete a member.' });
      return;
    }

    if (!/^[0-9a-fA-F]{24}$/.test(memberId)) {
      set({ error: 'Invalid Member ID format.' });
      return;
    }

    try {
      await axios.delete(`${API_URL}/member/${memberId}`);
      set((state) => ({
        members: state.members.filter((member) => member._id !== memberId),
        error: null,
      }));
    } catch (error) {
      console.error('Error deleting member:', error);
      set({ error: 'Failed to delete member. Please try again.' });
    }
  },

  updateMember: async (memberId, updatedData) => {
    if (!memberId) {
      set({ error: 'User ID is required to update a member.' });
      return;
    }

    if (!/^[0-9a-fA-F]{24}$/.test(memberId)) {
      set({ error: 'Invalid User ID format.' });
      return;
    }

    try {
      const { image, ...otherFields } = updatedData;

      // Upload image if provided and get the image URL
      const imageUrl = image ? await get().uploadImage(image) : null;

      // Prepare member data
      const memberData = {
        ...otherFields,
        ...(imageUrl && { imageUrl }), // Only include imageUrl if it's defined
      };

      const response = await axios.put(`${API_URL}/admin/member/${memberId}`, memberData);

      set((state) => ({
        members: state.members.map((member) =>
          member._id === memberId ? { ...member, ...response.data } : member
        ),
        formData: {
          user: '',
          fullName: '',
          address: '',
          phoneNumber: '',
          batchName: '',
          dateOfIR: '',
          sponsorName: '',
          gt: '',
          mww: '',
          almaMater: '',
          birthday: '',
          status: '',
          memberNumber: '',
          image: null,
          alexisName: '',
          gender: '',
        },
        error: null,
      }));

      return response.data;
    } catch (error) {
      console.error('Error updating member:', error);
      set({ error: 'Failed to update member. Please check the provided data.' });
      throw error;
    }
  },

  updateUserDetails: async (userId, userDetails) => {
    if (!userId) {
      set({ error: 'User ID is required to update user details.' });
      return;
    }

    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      set({ error: 'Invalid User ID format.' });
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/admin/user/${userId}`, userDetails);

      set((state) => ({
        users: state.users.map((user) =>
          user._id === userId ? { ...user, ...response.data } : user
        ),
        error: null,
      }));

      return response.data;
    } catch (error) {
      console.error('Error updating user details:', error);
      set({ error: 'Failed to update user details. Please check the provided data.' });
      throw error;
    }
  },

  uploadImage: async (image) => {
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await axios.post(`${API_URL}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      set({ error: 'Failed to upload image. Please try again.' });
      throw error;
    }
  },

  createMember: async () => {
    try {
      const { image, ...otherFields } = get().formData;

      const imageUrl = image ? await get().uploadImage(image) : null;

      const memberData = {
        user: otherFields.user,
        fullName: otherFields.fullName,
        address: otherFields.address,
        phoneNumber: otherFields.phoneNumber,
        batchName: otherFields.batchName,
        dateOfIR: otherFields.dateOfIR,
        sponsorName: otherFields.sponsorName,
        gt: otherFields.gt,
        mww: otherFields.mww,
        almaMater: otherFields.almaMater,
        birthday: otherFields.birthday,
        status: otherFields.status,
        alexisName: otherFields.alexisName,
        gender: otherFields.gender,
        imageUrl,
      };

      const response = await axios.post(`${API_URL}/members`, memberData);
      set({
        formData: {
          user: '',
          fullName: '',
          address: '',
          phoneNumber: '',
          batchName: '',
          dateOfIR: '',
          sponsorName: '',
          gt: '',
          mww: '',
          almaMater: '',
          birthday: '',
          status: '',
          memberNumber: '',
          image: null,
          alexisName: '',
          gender: '',
        },
        error: null,
      });

      return response.data;
    } catch (error) {
      console.error('Error creating member:', error);
      set({ error: 'Failed to create member. Please check the provided data.' });
      throw error;
    }
  },
}));

export default useMemberStore;
