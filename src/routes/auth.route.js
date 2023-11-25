import { Router } from "express";
const router = Router();
import { login } from "../controllers/auth.controller.js";

//router.post('/', authController.login);
router.post('/', login);

export default router;