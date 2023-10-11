import express from "express";
import { registerUser, userLogin } from "../controllers/auth";
import { validatorLogin, validatorRegister } from "../validators/auth";

const router = express.Router();

router.post("/signup", validatorRegister, registerUser);

router.post("/login", validatorLogin, userLogin);

export default router;