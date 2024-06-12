import { Router } from "express";
const router = Router();

import { getUsers } from '../controllers/users.controller.js';
import { verifyToken } from '../middlewares/jwtMiddleware.js';



router.get('/api/users', verifyToken, getUsers);
// router.post('/', jwtMiddleware, createUser);
// router.put('/:id', jwtMiddleware, updateUser);
// router.delete('/:id', jwtMiddleware, deleteUser);

export default router;