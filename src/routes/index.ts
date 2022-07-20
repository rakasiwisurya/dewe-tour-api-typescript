import { Router } from "express";

import { auth } from "../middlewares/auth";
import { uploadFile, uploadFiles } from "../middlewares/fileHandler";

import { login, register } from "../controllers/auth";
import { deleteUser, getUser, updateAvatar, updateUser } from "../controllers/user";
import { addCountry, getCountries } from "../controllers/country";
import { addTrip, deleteTrip, getTrip, getTrips } from "../controllers/trip";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/users/:id", auth, getUser);
router.put("/users/data/:id", auth, updateUser);
router.put("/users/image/:id", auth, uploadFile("avatar", "uploads/avatars"), updateAvatar);
router.delete("/users/:id", auth, deleteUser);

router.post("/countries", auth, addCountry);
router.get("/countries", auth, getCountries);

router.post("/trips", auth, uploadFiles("trip_images", "uploads/trips"), addTrip);
router.get("/trips", getTrips);
router.get("/trips/:id", getTrip);
router.delete("/trips/:id", auth, deleteTrip);

export default router;
