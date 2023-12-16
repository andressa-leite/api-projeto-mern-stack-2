import { Router } from "express";
const authRouter = Router();
import { login } from "../controllers/auth.controller.js";

//router.post('/', authController.login);
router.post('/', login);

export default authRouter;