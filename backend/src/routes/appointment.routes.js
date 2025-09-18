import { Router } from 'express';
import {
  createAppointment,
  getPatientAppointments,
  getProviderAppointments,
  updateAppointmentStatus,
} from '../controllers/appointment.controller.js';
import { verifyJWTPatient as authPatient } from '../middlewares/authPatient.middleware.js';
import { verifyJWTProvider as authProvider } from '../middlewares/authProvider.middleware.js';


const router = Router();

// Patient routes
router.route('/schedule').post(authPatient, createAppointment);
router.route('/patient').get(authPatient, getPatientAppointments);

// Provider routes
router.route('/provider').get(authProvider, getProviderAppointments);
router.route('/update-status/:appointmentId').patch(authProvider, updateAppointmentStatus);

export default router;
