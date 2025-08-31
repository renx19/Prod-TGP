// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const API_URL = import.meta.env.VITE_API_URL;

// export const useAuthStore = create(
//   persist(
//     (set,) => ({
//       isAuthenticated: false,
//       loading: false,
//       role: null,
//       user: null,
//       error: null,

//       initialize: async () => {
//         const accessToken = Cookies.get('accessToken');
//         const refreshToken = Cookies.get('refreshToken');

//         if (accessToken && refreshToken) {
//           try {
//             const response = await axios.post(`${API_URL}/refresh-token`, {}, { withCredentials: true });

//             if (response.data.success) {
//               set({
//                 isAuthenticated: true,
//                 role: response.data.role,
//                 user: response.data.user,
//                 member: response.data.member,
//               });
//             } else {
//               Cookies.remove('accessToken');
//               Cookies.remove('refreshToken');
//             }
//           } catch (error) {
//             console.error('Token refresh error:', error);
//             Cookies.remove('accessToken');
//             Cookies.remove('refreshToken');
//           }
//         }
//       },

//       login: async (email, password) => {
//         set({ loading: true, error: null });
//         try {
//           const response = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });

//           if (response.data.success) {
//             set({
//               isAuthenticated: true,
//               role: response.data.role,
//               user: response.data.user,
//               member: response.data.member,
//             });
//             Cookies.set('accessToken', response.data.accessToken, { secure: true, sameSite: 'Strict' });
//             Cookies.set('refreshToken', response.data.refreshToken, { secure: true, sameSite: 'Strict' });
//           }
//         } catch (error) {
//           console.error('Login error:', error);
//           set({ error: error.response?.data?.message || 'Login failed' });
//         } finally {
//           set({ loading: false });
//         }
//       },

//       signup: async (username, email, password, role) => {
//         set({ loading: false, error: null });
//         try {
//           const response = await axios.post(`${API_URL}/signup`, { username, email, password, role }, { withCredentials: true });

//           if (response.data.success) {
//             set({
//               isAuthenticated: true,
//               role: response.data.role,
//               user: response.data.user,
//               member: response.data.member,
//             });
//             Cookies.set('accessToken', response.data.accessToken, { secure: true, sameSite: 'Strict' });
//             Cookies.set('refreshToken', response.data.refreshToken, { secure: true, sameSite: 'Strict' });
//           }
//         } catch (error) {
//           console.error('Signup error:', error);
//           set({ error: error.response?.data?.message || 'Signup failed' });
//         } finally {
//           set({ loading: false });
//         }
//       },

//       logout: async () => {
//         set({ loading: true, error: null });
//         try {
//           await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
//           Cookies.remove('accessToken');
//           Cookies.remove('refreshToken');
//           set({ isAuthenticated: false, role: null, user: null, member: null });

//           useAuthStore.persist.clearStorage();
//         } catch (error) {
//           console.error('Logout error:', error);
//           set({ error: error.response?.data?.message || 'Logout failed' });
//         } finally {
//           set({ loading: false });
//         }
//       },
//     }),
//     {
//       name: 'auth-session-storage',
//       getStorage: () => sessionStorage,
//     }
//   )
// );

// export default useAuthStore;


import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  loading: false,
  role: null,
  user: null,
  member: null,
  error: null,

  // Initialize auth state using refresh token
 initialize: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/refresh-token`, {}, { withCredentials: true });

      if (response.data.success) {
        set({
          isAuthenticated: true,
          role: response.data.role || null,
          user: response.data.user || null,
          member: response.data.member || null,
          loading: false,
        });
      } else {
        set({
          isAuthenticated: false,
          role: null,
          user: null,
          member: null,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      set({
        isAuthenticated: false,
        role: null,
        user: null,
        member: null,
        loading: false,
      });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });

      if (response.data.success) {
        // After login, we still need to fetch the user data via refresh token
        const userRes = await axios.post(`${API_URL}/refresh-token`, {}, { withCredentials: true });

        set({
          isAuthenticated: true,
          role: userRes.data.role,
          user: userRes.data.user,
          member: userRes.data.member,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      set({
        error: error.response?.data?.message || 'Login failed',
        loading: false,
      });
    }
  },
  signup: async (username, email, password, role) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, { username, email, password, role }, { withCredentials: true });

      if (response.data.success) {
        // After signup, fetch user data via refresh token
        const userRes = await axios.post(`${API_URL}/refresh-token`, {}, { withCredentials: true });

        set({
          isAuthenticated: true,
          role: userRes.data.role,
          user: userRes.data.user,
          member: userRes.data.member,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      set({
        error: error.response?.data?.message || 'Signup failed',
        loading: false,
      });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      set({
        isAuthenticated: false,
        role: null,
        user: null,
        member: null,
        loading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
      set({
        error: error.response?.data?.message || 'Logout failed',
        loading: false,
      });
    }
  },
}));

export default useAuthStore;
