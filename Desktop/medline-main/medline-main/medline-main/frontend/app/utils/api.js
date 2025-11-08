import axios from 'axios';

// Create axios instance with optimized defaults
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for performance optimization
api.interceptors.request.use(
  (config) => {
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with caching and error handling
api.interceptors.response.use(
  (response) => {
    // Log response time for monitoring
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Call: ${response.config.url} took ${duration}ms`);
    }
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.response?.status === 429) {
      // Rate limiting - implement exponential backoff
      return new Promise((resolve) => {
        setTimeout(() => resolve(api.request(error.config)), 1000);
      });
    }
    return Promise.reject(error);
  }
);

// Optimized API functions with caching
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const apiCall = async (method, url, data = null, useCache = false) => {
  const cacheKey = `${method}-${url}-${JSON.stringify(data)}`;
  
  if (useCache && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    cache.delete(cacheKey);
  }

  try {
    const response = await api.request({
      method,
      url,
      data,
    });

    if (useCache) {
      cache.set(cacheKey, {
        data: response,
        timestamp: Date.now(),
      });
    }

    return response;
  } catch (error) {
    throw error;
  }
};

// Specialized API functions
export const appointmentAPI = {
  getByDoctor: (doctorId) => apiCall('GET', `/appointments/doctor/${doctorId}/`, null, true),
  updateStatus: (appointmentId, status) => apiCall('PATCH', `/appointments/${appointmentId}/status/`, { status }),
};

export const prescriptionAPI = {
  create: (data) => apiCall('POST', '/api/prescriptions/create/', data),
  getByAppointment: (appointmentId) => apiCall('GET', `/api/prescriptions/appointment/${appointmentId}/`, null, true),
};

export const billAPI = {
  create: (data) => apiCall('POST', '/api/bills/create/', data),
  getByAppointment: (appointmentId) => apiCall('GET', `/api/bills/appointment/${appointmentId}/`, null, true),
};

export default api;
