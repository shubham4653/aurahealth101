import express from 'express';
import { verifyJWTPatient } from '../middlewares/authPatient.middleware.js';
import { verifyJWTProvider } from '../middlewares/authProvider.middleware.js';
import { upsertPermission, listPatientPermissions, togglePermission, listProviderPermissions } from '../controllers/permission.controller.js';

const router = express.Router();

// Patient endpoints
router.post('/upsert', verifyJWTPatient, upsertPermission);
router.get('/patient', verifyJWTPatient, listPatientPermissions);
router.post('/toggle', verifyJWTPatient, togglePermission);

// Provider endpoint
router.get('/provider', verifyJWTProvider, listProviderPermissions);

export default router;


