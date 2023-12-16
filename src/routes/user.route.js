/* const route = require("express").Router();
const userController = require("../controllers/user.controller");
const { validId, validUser } = require("../middlewares/global.middlewares"); */

import express from 'express';
const userRouter = express.Router();
import userController from '../controllers/user.controller.js';
import {validId, validUser}  from '../middlewares/global.middlewares.js';


userRouter.post("/", userController.create);
userRouter.get("/", userController.findAll);
userRouter.get("/:id", validId, validUser, userController.findById);
userRouter.patch("/:id",  validId, validUser, userController.update);

/* module.exports = route; */
export default userRouter;
