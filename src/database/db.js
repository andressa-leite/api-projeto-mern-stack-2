/* const mongoose = require('mongoose'); */
import mongoose from "mongoose";

const conectDatabase = () => {
  console.log("trying to connect to a database, please wait");
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to Mongo DB"))
    .catch((error) => console.log(error));
};

/* module.exports = conectDatabase; */
export default conectDatabase;
