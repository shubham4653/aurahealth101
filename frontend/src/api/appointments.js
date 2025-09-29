import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

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

export const scheduleAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/appointment/schedule', appointmentData);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getPatientAppointments = async () => {
  try {
    const response = await api.get('/appointment/patient');
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getProviderAppointments = async () => {
  try {
    const response = await api.get('/appointment/provider');
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateAppointmentStatus = async (appointmentId, status) => {
    try {
        const response = await api.patch(`/appointment/update-status/${appointmentId}`, { status });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const cancelAppointment = async (appointmentId) => {
    try {
        const response = await api.delete(`/appointment/${appointmentId}`);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};


export const getAllProviders = async () => {
    try {
      const response = await api.get('/provider/all');
      return response.data;
    } catch (error) {
      return error.response.data;
    }
};
