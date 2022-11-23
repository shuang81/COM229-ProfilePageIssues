import { Router } from 'express';
import { processLogin,
        processLogout, 
        processRegistration,
        GetProfile,
        Get, 
        EditProfile } from '../../controllers/api/auth-api-controller.js';

const router = Router();

router.post('/login',processLogin);
router.post('/register', processRegistration);
router.get('/logout', processLogout);
router.get('/profile', GetProfile);
router.get('/:id', Get);
router.put('/profile/:id', EditProfile);

export default router;