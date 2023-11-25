import bcrypt from "bcrypt";
import { loginService, generateToken } from "../services/auth.service.js";

const login = async (req, res) => {
	const {email, password} = req.body;
	try{
		
	const user = await loginService(email);
	
	if (!user) {
		return res.status(404).send({message: "user not found"});
	}

	const passwordIsValid = await bcrypt.compare(password, user.password);
	//const passwordIsValid = bcrypt.compareSync(password, user.password);

	if (!passwordIsValid) {
		return res.status(400).send({ message: "Invalid Password" });
	}
	
//if (!user || !bcrypt.compareSync(password, user.password) {}


	const token = generateToken(user.id)
	res.send({token}) 
	// res.send(user);
	}
	catch{
	res.status(500).send(err.message);
	}
}

export { login }