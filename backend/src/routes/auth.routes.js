import { Router } from "express";
import { body } from "express-validator";
import { auth } from "../middleware/auth.js";
import { login, me, adminCreateUser, updateProfile, forgotPassword, resetPassword, googleInit } from "../controllers/auth.controller.js";
import { permitRoles } from "../middleware/auth.js";

const router = Router();

router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  login
);

router.get("/me", auth, me);

router.post(
  "/create-user",
  auth,
  permitRoles("Admin"),
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["Employee", "Client"])
  ],
  adminCreateUser
);

router.put("/profile", auth, updateProfile);

router.post("/forgot", [body("email").isEmail()], forgotPassword);
router.post("/reset", [body("token").notEmpty(), body("password").isLength({ min: 6 })], resetPassword);
router.get("/google/init", googleInit);

export default router;
