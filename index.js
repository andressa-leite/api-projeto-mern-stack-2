/* const express = require('express');
const app = express();
const userRoute = require('./src/routes/user.route')
const conectDatabase = require('./src/database/db') */
import express from "express";
import userRoute from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";
import newsRoute from "./src/routes/news.route.js";
import conectDatabase from "./src/database/db.js";
import dotenv from "dotenv"
dotenv.config();
/* ********************************** */
import swaggerRoute from "./src/routes/swagger.route.cjs";
/* ********************************** */

const port = process.env.PORT || 3000
const app = express();

conectDatabase();
app.use(express.json());
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/news", newsRoute);
/* ********************************** */
app.use('/doc', swaggerRoute);
/* ********************************** */


app.listen(port, () => console.log(`Running at ${port}`));
 