import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import type { Session } from 'next-auth';
import type { APISession } from '@/types/models';

declare module 'next-auth' {
  interface Session {
    user: APISession;
  }
}

const baseURL = process.env.NEXT_PUBLIC_NODE_ENV === "development" 
  ? process.env.NEXT_PUBLIC_DEV_API_URL 
  : process.env.NEXT_PUBLIC_API_URL;

// Create Axios instance for authenticated requests
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests for session auth
});

// Create Axios instance for public/unauthenticated requests (no 401 interceptor)
export const publicAxios = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get session data
    const session = await getSession();
    if (session && session.user) {
      // Use standard Authorization header
      config.headers['Authorization'] = `Bearer ${session.user.access}`;
      // Keep the old header for backward compatibility
      config.headers['X-Access-Token'] = `Bearer ${session.user.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors (e.g., 401)
let isHandling401 = false;

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Prevent multiple 401 handlers from running simultaneously
      if (!isHandling401) {
        isHandling401 = true;
        console.warn("Unauthorized (401) - Session invalid. Clearing session and redirecting to login...");
        
        try {
          // Clear all cookies and session data
          // This will trigger NextAuth to clear the session
          await signOut({ 
            redirect: false, // Don't redirect yet, we'll handle it manually
            callbackUrl: '/auth/login' 
          });
          
          // Small delay to ensure session is cleared
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Force redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        } catch (err) {
          console.error("Error during session cleanup:", err);
          // Force redirect as fallback
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
