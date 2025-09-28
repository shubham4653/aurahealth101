import { Router } from 'express';
import { 
    createOrUpdateCarePlan,
    getCarePlanByPatientId,
    getPatientCarePlan,
    updateTaskStatus,
    updateMedicationStatus,
    addTask,
    addMedication,
    removeTask,
    removeMedication
} from '../controllers/carePlan.controller.js';
import { verifyJWTPatient } from '../middlewares/authPatient.middleware.js';
import { verifyJWTProvider } from '../middlewares/authProvider.middleware.js';

const router = Router();

// Test route to verify care plan routes are loaded
router.get('/test', (req, res) => {
    res.json({ message: 'Care plan routes are working!' });
});

// Provider routes (require provider authentication)
router.route('/provider/patient/:patientId')
    .get(verifyJWTProvider, getCarePlanByPatientId);

router.route('/provider/create-update')
    .post(verifyJWTProvider, createOrUpdateCarePlan);

router.route('/provider/add-task')
    .post(verifyJWTProvider, addTask);

router.route('/provider/add-medication')
    .post(verifyJWTProvider, addMedication);

router.route('/provider/remove-task')
    .delete(verifyJWTProvider, removeTask);

router.route('/provider/remove-medication')
    .delete(verifyJWTProvider, removeMedication);

// Patient routes (require patient authentication)
router.route('/patient/my-care-plan')
    .get(verifyJWTPatient, getPatientCarePlan);

router.route('/patient/update-task')
    .patch(verifyJWTPatient, updateTaskStatus);

router.route('/patient/update-medication')
    .patch(verifyJWTPatient, updateMedicationStatus);

export default router;
