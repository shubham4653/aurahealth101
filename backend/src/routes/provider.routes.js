import {Router} from 'express';
import { registerProvider,loginProvider,logoutProvider,getAllProviders,updateProviderProfile,getProviderProfile,} from '../controllers/provider.controller.js';
import { verifyJWTProvider } from '../middlewares/authProvider.middleware.js';


const router = Router();
router.route('/register').post(registerProvider)
router.route('/login').post(loginProvider)
router.route('/all').get(getAllProviders)

//secured routes
router.route("/logout").post(verifyJWTProvider, logoutProvider)
router.route("/update-profile").post(verifyJWTProvider, updateProviderProfile)
router.route("/profile").get(verifyJWTProvider, getProviderProfile)


export default router
