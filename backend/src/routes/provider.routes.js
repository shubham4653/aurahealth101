import {Router} from 'express';
import { registerProvider } from '../controllers/provider.controller.js';



const router = Router();
router.route('/register').post(registerProvider)
router.route('/login').post(loginProvider)

//secured routes
router.route("/logout").post(verifyJWTProvider, logoutProvider)

export default router 