import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Axios Request Interceptor: Attach Bearer JWT Token if logged in
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (err) {
        console.error('Error parsing userInfo from localStorage', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
