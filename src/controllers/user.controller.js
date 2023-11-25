/* const userService = require("../services/user.service"); */
import userService from '../services/user.service.js'

const create = async (req, res) => {
  try {
    const { nome, username, email, password, avatar } = req.body;

    if (!nome || !username || !email || !password || !avatar) {
      res.status(400).send({ message: "All fields must be submitted" });
    }

    const user = await userService.createService(req.body);
    if (!user) {
      return res.status(400).send({ message: "Error creating User" });
    }
    //res.status(201).send({ message: "User created successfully", data: user });
    //outra opção
    res.status(201).send({
      message: "User created successfully",
      data: { id: user._id , nome, username, email, avatar },
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/* ****************************** */

const findAll = async (req, res) => {
  try {
    const users = await userService.findAllService();

    if (users.length === 0) {
      return res.status(400).send({ message: "there are no users registered" });
    }
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
/* ****************************** */
const findById = async (req, res) => {
  try {
    await userService.findByIdService(req.params.avatarid)
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/* ****************************** */
const update = async (req, res) => {
  try {
    const { nome, username, email, password, avatar } = req.body;

    if (!nome && !username && !email && !password && !avatar) {
      res.status(400).send({ message: "Submit at least one field" });
    }

    /*   const id = req.id;
  const user = req.user; */
    const { id, user } = req;

    await userService.updateService(
      id,
      nome,
      username,
      email,
      password,
      avatar
    );

    res.send({ message: "user successfully updated", data: user });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

/* module.exports = { create, findAll, findById, update }; */
export default  { create, findAll, findById, update }
