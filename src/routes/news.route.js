import { Router } from "express";
const NewsRouter = Router();
import { create, update, findAll, findById, topNews, searchByTitle, byUser, erase, likeNews, addComment, deleteComment } from "../controllers/news.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

NewsRouter.post("/", authMiddleware, create);
NewsRouter.patch("/:id", authMiddleware, update);
NewsRouter.get("/", findAll);
NewsRouter.get("/top", topNews);
NewsRouter.get("/search", searchByTitle)
NewsRouter.get("/byUser", authMiddleware, byUser)
NewsRouter.get("/:id", authMiddleware, findById);
NewsRouter.delete("/:id", authMiddleware, erase);
NewsRouter.patch('/likes/:id', authMiddleware, likeNews);
NewsRouter.patch('/comment/:id', authMiddleware, addComment);
NewsRouter.patch("/comment/:idNews/:idComment", authMiddleware, deleteComment);

export default NewsRouter;
