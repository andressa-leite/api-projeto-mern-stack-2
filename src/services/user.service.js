import User from '../models/User.js';
/* const User = require('../models/User'); */


const createService = (body) => User.create(body);

const findAllService = () => User.find();

const findByIdService = (id) => User.findById(id)

const updateService = (id, nome, username, email, password, avatar) => { 
    return User.findOneAndUpdate({_id: id}, {nome, username, email, password, avatar})
}

/* module.exports = { createService, findAllService, findByIdService, updateService } */

export default { createService, findAllService, findByIdService, updateService }
 





