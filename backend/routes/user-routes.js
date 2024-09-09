import { Router } from "express";
import { userLogin, userRegister } from "../controllers/authcontrollers.js";
import { generateCode, validateCode } from "../controllers/codecontrollers.js";
const userRoutes = Router();

userRoutes.post('/login', userLogin)
userRoutes.post('/register', userRegister)
userRoutes.post('/generate-code', generateCode)
userRoutes.post('/validate-code', validateCode)

export default userRoutes;