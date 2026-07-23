import axios, { AxiosError, AxiosResponse } from 'axios';

// Get base URL from env or use default for development
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const axiosClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Allows sending cookies with requests
    withCredentials: true,
});

// Interceptor for Request
axiosClient.interceptors.request.use(
    (config) => {
        // You can attach token here if you store it in localStorage instead of cookies
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor for Response
axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Return only the data from the response to simplify components
        return response.data;
    },
    (error: AxiosError) => {
        // Handle common errors like 401 Unauthorized globally
        if (error.response?.status === 401) {
            // Optional: Dispatch a logout action or redirect to login
            console.error('Unauthorized, redirecting to login...');
            localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default axiosClient;
