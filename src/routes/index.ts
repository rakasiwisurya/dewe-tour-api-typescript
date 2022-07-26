import { Router } from "express";

import { adminOnly, auth } from "../middlewares/auth";
import { uploadFile, uploadFiles } from "../middlewares/fileHandler";

import { login, register } from "../controllers/auth";
import { deleteUser, getUser, updateAvatar, updateUser } from "../controllers/user";
import { addCountry, getCountries } from "../controllers/country";
import { addTrip, deleteTrip, getTrip, getTrips } from "../controllers/trip";
import {
  addTransaction,
  approveTransaction,
  deleteTransaction,
  getIncomeTransactions,
  getTransaction,
  getTransactions,
  rejectTransaction,
  uploadProofPayment,
} from "../controllers/transaction";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/users/:id", auth, getUser);
router.put("/users/data/:id", auth, updateUser);
router.put("/users/image/:id", auth, uploadFile("avatar", "uploads/avatars"), updateAvatar);
router.delete("/users/:id", auth, adminOnly, deleteUser);

router.post("/countries", auth, adminOnly, addCountry);
router.get("/countries", auth, adminOnly, getCountries);

router.post("/trips", auth, adminOnly, uploadFiles("trip_images", "uploads/trips"), addTrip);
router.get("/trips", getTrips);
router.get("/trips/:id", getTrip);
router.delete("/trips/:id", auth, adminOnly, deleteTrip);

router.post("/transactions", auth, addTransaction);
router.get("/transactions/income_transaction", auth, adminOnly, getIncomeTransactions);
router.get("/transactions", auth, getTransactions);
router.get("/transactions/:id", auth, getTransaction);
router.put(
  "/transactions/proof/:id",
  auth,
  uploadFile("proof_payment", "uploads/proofs"),
  uploadProofPayment
);
router.put("/transactions/approve/:id", auth, adminOnly, approveTransaction);
router.put("/transactions/reject/:id", auth, adminOnly, rejectTransaction);
router.delete("/transactions/:id", auth, adminOnly, deleteTransaction);

export default router;
