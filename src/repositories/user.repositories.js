import User from "../models/User.js";

const createRepository = (body) => User.create(body);

const findAllRepository = () => User.find();

const findByIdRepository = (idUser) => User.findById(idUser);

const findByEmailRepository = (email) => User.findOne({ email: email });

const updateRepository = (id, body) => {
  return User.findOneAndUpdate(
    { _id: id },
    { body },
    {rawResult: true}
  );
};

export default {
  createRepository,
  findAllRepository,
  findByIdRepository,
  findByEmailRepository,
  updateRepository,
};
