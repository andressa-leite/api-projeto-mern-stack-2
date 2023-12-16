import { Router } from "express";
const postRouter = Router();
import { create, update, findAll, findById, topPost, searchByTitle, byUser, erase, likePost, addComment, deleteComment } from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

postRouter.post("/", authMiddleware, create);
postRouter.patch("/:id", authMiddleware, update);
postRouter.get("/", findAll);
postRouter.get("/top", topPost);
postRouter.get("/search", searchByTitle)
postRouter.get("/byUser", authMiddleware, byUser)
postRouter.get("/:id", authMiddleware, findById);
postRouter.delete("/:id", authMiddleware, erase);
postRouter.patch('/likes/:id', authMiddleware, likePost);
postRouter.patch('/comment/:id', authMiddleware, addComment);
postRouter.patch("/comment/:idPost/:idComment", authMiddleware, deleteComment);

export default postRouter;
