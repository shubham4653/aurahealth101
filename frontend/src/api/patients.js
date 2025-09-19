import { api } from './auth';

export const getAllPatients = async () => {
    try {
        const response = await api.get('/patient');
        return response.data;
    } catch (error) {
        console.error('Error fetching all patients:', error);
        throw error;
    }
};

export const getPatientById = async (id) => {
    try {
        const response = await api.get(`/patient/profile/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching patient by id:', error);
        throw error;
    }
};
