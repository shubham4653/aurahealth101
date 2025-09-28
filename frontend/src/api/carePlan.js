import { api } from './auth';

// Provider API functions
export const getCarePlanByPatientId = async (patientId) => {
    try {
        const response = await api.get(`/care-plan/provider/patient/${patientId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error fetching care plan for patient:', error);
        throw error;
    }
};

export const createOrUpdateCarePlan = async (patientId, tasks, medications) => {
    try {
        const response = await api.post('/care-plan/provider/create-update', {
            patientId,
            tasks,
            medications
        }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error creating/updating care plan:', error);
        throw error;
    }
};

export const addTask = async (patientId, taskName, instructions) => {
    try {
        const response = await api.post('/care-plan/provider/add-task', {
            patientId,
            taskName,
            instructions
        }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error adding task:', error);
        throw error;
    }
};

export const addMedication = async (patientId, name, dosage, frequency) => {
    try {
        const response = await api.post('/care-plan/provider/add-medication', {
            patientId,
            name,
            dosage,
            frequency
        }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error adding medication:', error);
        throw error;
    }
};

export const removeTask = async (patientId, taskId) => {
    try {
        const response = await api.delete('/care-plan/provider/remove-task', {
            data: { patientId, taskId },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error removing task:', error);
        throw error;
    }
};

export const removeMedication = async (patientId, medicationId) => {
    try {
        const response = await api.delete('/care-plan/provider/remove-medication', {
            data: { patientId, medicationId },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error removing medication:', error);
        throw error;
    }
};

// Patient API functions
export const getPatientCarePlan = async () => {
    try {
        const response = await api.get('/care-plan/patient/my-care-plan', { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error fetching patient care plan:', error);
        throw error;
    }
};

export const updateTaskStatus = async (taskId, completed) => {
    try {
        const response = await api.patch('/care-plan/patient/update-task', {
            taskId,
            completed
        }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error updating task status:', error);
        throw error;
    }
};

export const updateMedicationStatus = async (medicationId, completed) => {
    try {
        const response = await api.patch('/care-plan/patient/update-medication', {
            medicationId,
            completed
        }, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error updating medication status:', error);
        throw error;
    }
};
