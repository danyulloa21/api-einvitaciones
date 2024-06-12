import { Router } from "express";
const router = Router();

import {login} from "../controllers/auth.controller.js";

// router.post('/register', authController.register);
router.post('/api', login);

export default router;