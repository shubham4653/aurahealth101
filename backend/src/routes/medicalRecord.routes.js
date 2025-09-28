import express from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWTPatient } from '../middlewares/authPatient.middleware.js';
import { verifyJWTProvider } from '../middlewares/authProvider.middleware.js';
import {
  uploadRecord,
  getPatientRecords,
  getProviderRecords,
  grantAccess,
  revokeAccess,
  verifyFileIntegrity
} from '../controllers/medicalRecord.controller.js';

const router = express.Router();

// Upload record (Provider only)
router.post('/upload', verifyJWTProvider, upload.single('file'), uploadRecord);

// Get patient records (Patient only)
router.get('/patient', verifyJWTPatient, getPatientRecords);

// Get provider records (Provider only)
router.get('/provider', verifyJWTProvider, getProviderRecords);

// Grant access to provider (Patient only)
router.post('/grant-access', verifyJWTPatient, grantAccess);

// Revoke access from provider (Patient only)
router.post('/revoke-access', verifyJWTPatient, revokeAccess);

// Verify file integrity (Anyone with record access)
router.post('/verify/:recordId', verifyFileIntegrity);

// Debug endpoint to check auth status
router.get('/auth-status', (req, res) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    res.json({
        hasToken: !!token,
        tokenLength: token?.length,
        authHeader: req.header("Authorization"),
        cookies: req.cookies
    });
});

export default router;
