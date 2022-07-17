import { Router } from "express";

import { auth } from "../middlewares/auth";

import { login, register } from "../controllers/auth";
import { getUser } from "../controllers/user";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/users/:id", auth, getUser);

export default router;
