import express from 'express'
import { deleteUser, getUser, updateUser } from '../Controllers/userController.js';

const router = express.Router();

router.get('/:id',getUser);
router.put('/:id',updateUser);
router.delete('/:id',deleteUser);

export default router;