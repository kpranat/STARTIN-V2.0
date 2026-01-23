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
      // Redirect to appropriate login based on current path
      const currentPath = window.location.pathname;
      if (currentPath.includes('/company')) {
        window.location.href = '/company/login';
      } else {
        window.location.href = '/student-login';
      }
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
        
      case 'company_signup':
        response = await axios.post(`${API_BASE_URL}/auth/CompanySignup`, data);
        return response.data;
        
      case 'company_verify_otp':
        response = await axios.post(`${API_BASE_URL}/auth/CompanyVerifyOTP`, data);
        return response.data;
        
      case 'company_login':
        response = await axios.post(`${API_BASE_URL}/auth/CompanyLogin`, data);
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
    checkProfile: (studentId: string | number) => 
      apiClient.post('/check/StudentProfile', { student_id: studentId }),
    setupProfile: (formData: FormData) => 
      apiClient.post('/setup/StudentProfile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
    updateProfile: (formData: FormData) => 
      apiClient.post('/update/StudentProfile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
    getProfile: () => apiClient.get('/student/profile'),
    getJobs: () => apiClient.post('/get/JobDetails'),
    applyJob: (data: { studentid: string | number; companyid: string | number; jobid: string | number }) => 
      apiClient.post('/get/applicants', data),
    getAppliedJobs: () => apiClient.get('/student/applied-jobs'),
  },
  
  // Company endpoints
  company: {
    checkProfile: (companyId: string | number) => 
      apiClient.post('/check/CompanyProfile', { company_id: companyId }),
    setupProfile: (data: any) => 
      apiClient.post('/setup/CompanyProfile', data),
    updateProfile: (data: any) => 
      apiClient.post('/update/CompanyProfile', data),
    getProfile: () => apiClient.get('/company/profile'),
    postJob: (data: any) => apiClient.post('/set/JobDetails', data),
    getJobs: (data: any) => apiClient.post('/get/CompanyJobs', data),
    getApplicants: (data: { companyid: string | number }) => 
      apiClient.post('/get/applicants', data),
  },
};

export default apiClient;