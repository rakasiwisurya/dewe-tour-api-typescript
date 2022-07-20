import { Router } from "express";

import { auth } from "../middlewares/auth";
import { uploadFiles } from "../middlewares/fileHandler";

import { login, register } from "../controllers/auth";
import { getUser, updateUser } from "../controllers/user";
import { addCountry, getCountries } from "../controllers/country";
import { addTrip } from "../controllers/trip";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/users/:id", auth, getUser);
router.put("/users/:id", auth, updateUser);

router.post("/countries", auth, addCountry);
router.get("/countries", auth, getCountries);

router.post("/trips", auth, uploadFiles("trip_images", "uploads/trips"), addTrip);

export default router;
