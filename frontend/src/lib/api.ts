import axios, { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';

import { config } from './config';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });

    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string, enrollmentNumber: string, year: number) => {
    const response = await api.post('/auth/register', { name, email, password, enrollmentNumber, year });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Volunteer API functions
export const volunteerAPI = {
  getActivities: async () => {
    const response = await api.get('/volunteer/activities');
    return response.data;
  },

  donate: async (donationData: any) => {
    const response = await api.post('/volunteer/donate', donationData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/volunteer/profile');
    return response.data;
  },
};

// Admin API functions
export const adminAPI = {
  getDonations: async () => {
    const response = await api.get('/admin/donations');
    return response.data;
  },

  getVolunteers: async () => {
    const response = await api.get('/admin/volunteers');
    return response.data;
  },

  approveDonation: async ({ donationid, credits }: { donationid: string, credits: number }) => {
    return await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/approve`,
      { donationid, credits },
      { withCredentials: true }
    )
  },

  rejectDonation: async({donationid}:{donationid:string})=>{
    return await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/reject`,
      { donationid },
      { withCredentials: true }
    )
  }
};

// // Utility function to decode JWT token from cookies
// export const getTokenFromCookies = () => {
//   if (typeof document === 'undefined') return null;
  
//   const token = document.cookie
//     .split('; ')
//     .find((row) => row.startsWith('access_token='))
//     ?.split('=')[1];
  
//   return token || null;
// };

// // Utility function to decode user from token
// export const decodeUserFromToken = (token: string) => {
//   try {
//     return jwtDecode(token);
//   } catch (error) {
//     console.error('Error decoding token:', error);
//     return null;
//   }
// };

export default api; 