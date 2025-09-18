import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
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

export const getAllProviders = async () => {
    try {
      const response = await api.get('/provider/all');
      return response.data;
    } catch (error) {
      return error.response.data;
    }
};
