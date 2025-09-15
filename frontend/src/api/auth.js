import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


export const registerPatient = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/patient/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const loginPatient = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/patient/login`, credentials);
        if (response.data?.data?.accessToken) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Login failed' };
    }
};



export const registerProvider = async (providerData) => {
    try {
        const response = await axios.post(`${API_URL}/provider/register`, providerData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};


export const loginProvider = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/provider/login`, credentials);
        if (response.data?.data?.accessToken) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Login failed' };
    }
};


export const logoutPatient = async () => {
    try {
        const response = await api.post(`/patient/logout`);
        localStorage.removeItem('accessToken');
        return response.data;
    } catch (error) {
        localStorage.removeItem('accessToken');
        throw error.response?.data || { message: 'Logout failed' };
    }
};

export const logoutProvider = async () => {
    try {
        const response = await api.post(`/provider/logout`);
        localStorage.removeItem('accessToken');
        return response.data;
    } catch (error) {
        localStorage.removeItem('accessToken');
        throw error.response?.data || { message: 'Logout failed' };
    }
};
