/* const route = require("express").Router();
const userController = require("../controllers/user.controller");
const { validId, validUser } = require("../middlewares/global.middlewares"); */

import express from 'express';
const router = express.Router();
import userController from '../controllers/user.controller.js';
import {validId, validUser}  from '../middlewares/global.middlewares.js';


router.post("/", userController.create);
router.get("/", userController.findAll);
router.get("/:id", validId, validUser, userController.findById);
router.patch("/:id",  validId, validUser, userController.update);

/* module.exports = route; */
export default router
