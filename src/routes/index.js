import { Router } from "express";
import userRouter from "./user.route.js";
import AuthRouter from "./auth.route";
import NewsRouter from "./news.route.js";
import swaggerRouter from "./swagger.route.cjs";

const router = Router();

router.use("/user", userRouter);
router.use("/auth", AuthRouter);
router.use("/news", NewsRouter);
router.use("/doc", swaggerRouter);

export default router;