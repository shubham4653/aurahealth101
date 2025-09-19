import {Router} from 'express';
import { registerPatient, loginPatient, logoutPatient, updatePatientProfile, getPatientProfile, getAllPatients } from '../controllers/patient.controller.js';
import { verifyJWTPatient } from '../middlewares/authPatient.middleware.js';
import { verifyJWTProvider } from '../middlewares/authProvider.middleware.js';


const router = Router();
router.route('/register').post(registerPatient)
router.route('/login').post(loginPatient)

//secured routes
router.route("/logout").post(verifyJWTPatient,logoutPatient)
router.route("/update-profile").post(verifyJWTPatient, updatePatientProfile)
router.route("/profile").get(verifyJWTPatient, getPatientProfile)
router.route("/").get(verifyJWTProvider, getAllPatients);
router.route("/profile/:id").get(verifyJWTProvider, getPatientProfile);

export default router
