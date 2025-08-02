import {Router} from 'express';
import { registerPatient, loginPatient } from '../controllers/patient.controller.js';
import { verifyJWTPatient } from '../middlewares/authPatient.middleware.js';



const router = Router();
router.route('/register').post(registerPatient)
router.route('/login').post(loginPatient)

//secured routes
router.route("/logout").post(verifyJWTPatient,logoutPatient)

export default router 