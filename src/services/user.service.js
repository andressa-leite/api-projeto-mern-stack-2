import userRepositories from "../repositories/user.repositories.js";
import authService from "../services/auth.service.js";
import bcrypt from "bcryptjs";

const createService = async (body) => {
const body = { name, username, email, password, avatar }

  if (!name || !username || !email || !password || !avatar || !background)
    throw new Error("All fields must be submitted");

  const foundUser = await userRepositories.findByEmailRepository(email);

  if (!foundUser) throw new Error("User already registered");

  const user = await userRepositories.createRepository(body);

  if (!user) throw new Error("Error creating User");

  /* if (!user) {
    return res.status(400).send({ message: "Error creating User" });
  } */

  const token = authService.generateToken(user.id);

  return {
    message: "User created successfully",
    user: { id: user._id, name, username, email, avatar, background },
    token,
  };
};
/* ****************************** */

const findAllService = async () => {

  const users = await userRepositories.findAllRepository();

  if (users.length === 0) throw new Error("there are no users registered");

  return users;
};
/* ****************************** */
const findByIdService = async (userId, userIdLogged) => {
  let idParam;
  if (!userId) {
    userId = userIdLogged;
    idParam = userId;
  } else {
    idParam = userId;
  }
  if (!idParam) throw new Error("ID number needed as a parameter");

  const user = await userRepositories.findByIdRepository(idParam);

  return user;
};

/* ****************************** */
const updateService = async (body, userId) => {
  const { name, username, email, password, avatar } = body
  
  if (!name && !username && !email && !password && !avatar && !background)
    throw new Error({ message: "Submit at least one field" });

  const user = await userRepositories.findByIdRepository(userId);

  if (user._id != req.userId)
    throw new Error("Permission denied, unable to update user");
  /* {
      return res.status(400).send({
        message: "Permission denied, unable to update user"
      });
    } */

  if (password) {
    password = await bcrypt.hash(password, 10);
  }

  await userRepositories.updateRepository(body);

  /* res.send({ message: "user successfully updated", data: user }); */

  return { message: "user successfully updated" };
};

export default { createService, findAllService, findByIdService, updateService };
