/* const userService = require("../services/user.service"); */
import userService from "../services/user.service.js";

const create = async (req, res) => {
  try {
    const body = req.body;

    const user = await userService.createService(body);

    return res.status(201).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/* ****************************** */

const findAll = async (req, res) => {
  try {
    const users = await userService.findAllService();
    return res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
/* ****************************** */
const findById = async (req, res) => {
  const { id: userId } = req.params;
  const userIdLogged = req.userId;
  try {
    const user = await userService.findByIdService(userId, userIdLogged);
    res.send(user);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/* ****************************** */
const update = async (req, res) => {
  const body = req.body;
  const userId = req.userId;
  try {
    const response = await userService.updateService(body, userId);

    return { message: "user successfully updated", data: user };
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/* module.exports = { create, findAll, findById, update }; */
export default { create, findAll, findById, update };
