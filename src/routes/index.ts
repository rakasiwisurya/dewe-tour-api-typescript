import { Router } from "express";

import { auth } from "../middlewares/auth";

import { login, register } from "../controllers/auth";
import { getUser, updateUser } from "../controllers/user";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/users/:id", auth, getUser);
router.put("/users/:id", auth, updateUser);

export default router;
