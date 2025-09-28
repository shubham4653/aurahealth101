import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { CarePlan } from '../models/carePlan.model.js';
import { Patient } from '../models/patient.model.js';
import { Provider } from '../models/provider.model.js';

// Create or update care plan for a patient
const createOrUpdateCarePlan = asyncHandler(async (req, res) => {
    const { patientId, tasks, medications } = req.body;
    const providerId = req.provider?._id;

    if (!patientId) {
        throw new ApiError(400, 'Patient ID is required');
    }

    if (!providerId) {
        throw new ApiError(401, 'Provider authentication required');
    }

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
        throw new ApiError(404, 'Patient not found');
    }

    // Check if care plan already exists
    let carePlan = await CarePlan.findOne({ patientId });

    if (carePlan) {
        // Update existing care plan
        carePlan.tasks = tasks || carePlan.tasks;
        carePlan.medications = medications || carePlan.medications;
        carePlan.providerId = providerId;
        await carePlan.save();
    } else {
        // Create new care plan
        carePlan = await CarePlan.create({
            patientId,
            providerId,
            tasks: tasks || [],
            medications: medications || []
        });
    }

    return res.status(200).json(
        new ApiResponse(200, carePlan, "Care plan updated successfully")
    );
});

// Get care plan for a patient (for providers)
const getCarePlanByPatientId = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const providerId = req.provider?._id;

    if (!providerId) {
        throw new ApiError(401, 'Provider authentication required');
    }

    const carePlan = await CarePlan.findOne({ patientId })
        .populate('patientId', 'name email')
        .populate('providerId', 'name email');

    if (!carePlan) {
        return res.status(200).json(
            new ApiResponse(200, null, "No care plan found for this patient")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, carePlan, "Care plan retrieved successfully")
    );
});

// Get patient's own care plan
const getPatientCarePlan = asyncHandler(async (req, res) => {
    const patientId = req.patient?._id;

    if (!patientId) {
        throw new ApiError(401, 'Patient authentication required');
    }

    const carePlan = await CarePlan.findOne({ patientId })
        .populate('providerId', 'name email');

    if (!carePlan) {
        return res.status(200).json(
            new ApiResponse(200, null, "No care plan assigned yet")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, carePlan, "Care plan retrieved successfully")
    );
});

// Update task completion status
const updateTaskStatus = asyncHandler(async (req, res) => {
    const { taskId, completed } = req.body;
    const patientId = req.patient?._id;

    if (!patientId) {
        throw new ApiError(401, 'Patient authentication required');
    }

    if (!taskId || completed === undefined) {
        throw new ApiError(400, 'Task ID and completion status are required');
    }

    const carePlan = await CarePlan.findOne({ patientId });
    if (!carePlan) {
        throw new ApiError(404, 'Care plan not found');
    }

    const task = carePlan.tasks.id(taskId);
    if (!task) {
        throw new ApiError(404, 'Task not found');
    }

    task.completed = completed;
    await carePlan.save();

    return res.status(200).json(
        new ApiResponse(200, carePlan, "Task status updated successfully")
    );
});

// Update medication completion status
const updateMedicationStatus = asyncHandler(async (req, res) => {
    const { medicationId, completed } = req.body;
    const patientId = req.patient?._id;

    if (!patientId) {
        throw new ApiError(401, 'Patient authentication required');
    }

    if (!medicationId || completed === undefined) {
        throw new ApiError(400, 'Medication ID and completion status are required');
    }

    const carePlan = await CarePlan.findOne({ patientId });
    if (!carePlan) {
        throw new ApiError(404, 'Care plan not found');
    }

    const medication = carePlan.medications.id(medicationId);
    if (!medication) {
        throw new ApiError(404, 'Medication not found');
    }

    medication.completed = completed;
    await carePlan.save();

    return res.status(200).json(
        new ApiResponse(200, carePlan, "Medication status updated successfully")
    );
});

// Add new task to care plan
const addTask = asyncHandler(async (req, res) => {
    const { patientId, taskName, instructions } = req.body;
    const providerId = req.provider?._id;

    if (!patientId || !taskName) {
        throw new ApiError(400, 'Patient ID and task name are required');
    }

    if (!providerId) {
        throw new ApiError(401, 'Provider authentication required');
    }

    let carePlan = await CarePlan.findOne({ patientId });
    
    if (!carePlan) {
        carePlan = await CarePlan.create({
            patientId,
            providerId,
            tasks: [],
            medications: []
        });
    }

    carePlan.tasks.push({
        taskName,
        instructions: instructions || '',
        completed: false
    });

    await carePlan.save();

    return res.status(200).json(
        new ApiResponse(200, carePlan, "Task added successfully")
    );
});

// Add new medication to care plan
const addMedication = asyncHandler(async (req, res) => {
    const { patientId, name, dosage, frequency } = req.body;
    const providerId = req.provider?._id;

    if (!patientId || !name || !dosage || !frequency) {
        throw new ApiError(400, 'Patient ID, medication name, dosage, and frequency are required');
    }

    if (!providerId) {
        throw new ApiError(401, 'Provider authentication required');
    }

    let carePlan = await CarePlan.findOne({ patientId });
    
    if (!carePlan) {
        carePlan = await CarePlan.create({
            patientId,
            providerId,
            tasks: [],
            medications: []
        });
    }

    carePlan.medications.push({
        name,
        dosage,
        frequency,
        completed: false
    });

    await carePlan.save();

    return res.status(200).json(
        new ApiResponse(200, carePlan, "Medication added successfully")
    );
});

// Remove task from care plan
const removeTask = asyncHandler(async (req, res) => {
    const { patientId, taskId } = req.body;
    const providerId = req.provider?._id;

    if (!patientId || !taskId) {
        throw new ApiError(400, 'Patient ID and task ID are required');
    }

    if (!providerId) {
        throw new ApiError(401, 'Provider authentication required');
    }

    const carePlan = await CarePlan.findOne({ patientId });
    if (!carePlan) {
        throw new ApiError(404, 'Care plan not found');
    }

    carePlan.tasks.pull(taskId);
    await carePlan.save();

    return res.status(200).json(
        new ApiResponse(200, carePlan, "Task removed successfully")
    );
});

// Remove medication from care plan
const removeMedication = asyncHandler(async (req, res) => {
    const { patientId, medicationId } = req.body;
    const providerId = req.provider?._id;

    if (!patientId || !medicationId) {
        throw new ApiError(400, 'Patient ID and medication ID are required');
    }

    if (!providerId) {
        throw new ApiError(401, 'Provider authentication required');
    }

    const carePlan = await CarePlan.findOne({ patientId });
    if (!carePlan) {
        throw new ApiError(404, 'Care plan not found');
    }

    carePlan.medications.pull(medicationId);
    await carePlan.save();

    return res.status(200).json(
        new ApiResponse(200, carePlan, "Medication removed successfully")
    );
});

export {
    createOrUpdateCarePlan,
    getCarePlanByPatientId,
    getPatientCarePlan,
    updateTaskStatus,
    updateMedicationStatus,
    addTask,
    addMedication,
    removeTask,
    removeMedication
};
