import { Router } from "express";
import { body } from "express-validator";
import { auth, permitRoles } from "../middleware/auth.js";
import { listUsers, getUser, updateUser, deleteUser } from "../controllers/users.controller.js";

const router = Router();

router.use(auth, permitRoles("Admin"));

router.get("/", listUsers);
router.get("/:id", getUser);
router.put("/:id", [body("name").optional().isString()], updateUser);
router.delete("/:id", deleteUser);

export default router;

