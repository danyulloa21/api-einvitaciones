import { Router } from "express";
const router = Router();

import { getUserInfo, updateUserInfo, createUserInfo, deleteUserInfo } from '../controllers/user_info.controller.js';
import { verifyToken } from "../middlewares/jwtMiddleware.js";

router.get('/api/user_info/:id',verifyToken , getUserInfo);
router.put('/api/user_info/:id', verifyToken, updateUserInfo);
router.delete('/api/user_info/:id', verifyToken, deleteUserInfo);
router.post('/api/user_info', verifyToken, createUserInfo);

export default router;