import {Router} from 'express';
import { registerProvider } from '../controllers/provider.controller.js';



const router = Router();
router.route('/register').post(registerProvider)



export default router 