import {Router} from 'express';
import { registerPatient, loginPatient, logoutPatient, updatePatientProfile, getPatientProfile } from '../controllers/patient.controller.js';
import { verifyJWTPatient } from '../middlewares/authPatient.middleware.js';




const router = Router();
router.route('/register').post(registerPatient)
router.route('/login').post(loginPatient)

//secured routes
router.route("/logout").post(verifyJWTPatient,logoutPatient)
console.log("Registering /update-profile POST route");
router.route("/update-profile").post(verifyJWTPatient, updatePatientProfile)
router.route("/profile").get(verifyJWTPatient, getPatientProfile)

export default router
