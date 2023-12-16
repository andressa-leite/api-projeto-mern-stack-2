/* const express = require('express');
const app = express();
const userRoute = require('./src/routes/user.route')
const conectDatabase = require('./src/database/db') */
import express from "express";
/* import "dotenv/config"  */
import cors from "cors";
import conectDatabase from "./src/database/db.js";
import router from "./src/routes/index.js";

const app = express();

conectDatabase();
app.use(cors());
app.use(express.json());
app.use(router);

export default app;
