import { Router } from "express";
const router = Router();

import { getUserInfo, updateUserInfo, createUserInfo, deleteUserInfo } from '../controllers/user_info.controller.js';
import { verifyToken } from "../middlewares/jwtMiddleware.js";

router.get('/user_info',verifyToken , getUserInfo);
router.put('/user_info', verifyToken, updateUserInfo);
router.delete('/user_info', verifyToken, deleteUserInfo);
router.post('/user_info', verifyToken, createUserInfo);

export default router;