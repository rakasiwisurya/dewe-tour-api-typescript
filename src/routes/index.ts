import { Router } from "express";

import { auth } from "../middlewares/auth";

import { login, register } from "../controllers/auth";
import { getUser, updateUser } from "../controllers/user";
import { addCountry, getCountries } from "../controllers/country";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/users/:id", auth, getUser);
router.put("/users/:id", auth, updateUser);

router.post("/countries", auth, addCountry);
router.get("/countries", auth, getCountries);

export default router;
