import express from 'express';
import { logInUser, registerUser } from '../Controllers/authController.js';

const router = express.Router();



router.post('/register',registerUser);
router.post('/login',logInUser);

export default router;