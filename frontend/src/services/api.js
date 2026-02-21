import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getItems = () => api.get('/items/');
export const createItem = (item) => api.post('/items/', item);
export const predictRisk = (data) => api.post('/prediction/predict/', data);

export default api;
