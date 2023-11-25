//import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import userService from "../services/user.service.js";

//dotenv.config();

export const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.sendStatus(401);
  }
  const parts = authorization.split(" ");

  const [schema, token] = parts; //const schema = parts[0]  //  const token = parts[1]
  if (parts.length !== 2) {
    return res.sendStatus(401);
  }
  /* if (parts[0] !== Bearer){
      return res.sendStatus(401);
    } */
  if (schema !== "Bearer") {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.SECRETE_JWT, async (error, decoded) => {
    if (error) {
      return res.sendStatus(401);
    }
    /* console.log(decoded); */
    const user = await userService.findByIdService(decoded.id);

    if (!user || !user.id) {
      return res.status(401).send({ message: "invalid Token" });
    }

    req.userId = user.id;
    return next();
  });
  /* next(); */
};
