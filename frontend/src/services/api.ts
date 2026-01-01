// src/services/api.ts
import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';

const API_BASE_URL = 'http://127.0.0.1:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      removeToken();
      window.location.href = '/student-login';
    }
    return Promise.reject(error);
  }
);

// Authentication endpoints (no token required)
export const connectToBackend = async (actionType: string, data: any) => {
  console.log(`[Backend Service] Sending ${actionType}`, data);

  try {
    let response;
    
    switch(actionType) {
      case 'student_signup':
        response = await axios.post(`${API_BASE_URL}/auth/StudentSignup`, data);
        return response.data;
        
      case 'verify_otp':
        response = await axios.post(`${API_BASE_URL}/auth/VerifyOTP`, data);
        return response.data;
        
      case 'student_login':
        response = await axios.post(`${API_BASE_URL}/auth/StudentLogin`, data);
        return response.data;
        
      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  } catch (error) {
    console.error(`Error in ${actionType}:`, error);
    throw error;
  }
};

// Protected API calls (automatically includes JWT token)
export const api = {
  // Student endpoints
  student: {
    getProfile: () => apiClient.get('/student/profile'),
    updateProfile: (data: any) => apiClient.put('/student/profile', data),
    getJobs: () => apiClient.get('/student/jobs'),
    applyJob: (jobId: string) => apiClient.post(`/student/jobs/${jobId}/apply`),
    getAppliedJobs: () => apiClient.get('/student/applied-jobs'),
  },
  
  // Company endpoints
  company: {
    getProfile: () => apiClient.get('/company/profile'),
    updateProfile: (data: any) => apiClient.put('/company/profile', data),
    postJob: (data: any) => apiClient.post('/company/jobs', data),
    getJobs: () => apiClient.get('/company/jobs'),
    getApplicants: (jobId: string) => apiClient.get(`/company/jobs/${jobId}/applicants`),
  },
};

export default apiClient;