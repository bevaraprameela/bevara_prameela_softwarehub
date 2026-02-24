import { Router } from "express";
import { body } from "express-validator";
import { auth, permitRoles } from "../middleware/auth.js";
import { createService, listServices, updateService, deleteService } from "../controllers/services.controller.js";

const router = Router();

router.get("/", auth, listServices);

router.post(
  "/",
  auth,
  permitRoles("Admin"),
  [body("name").notEmpty(), body("price").optional().isNumeric()],
  createService
);

router.put(
  "/:id",
  auth,
  permitRoles("Admin"),
  [body("name").optional(), body("price").optional().isNumeric()],
  updateService
);

router.delete("/:id", auth, permitRoles("Admin"), deleteService);

export default router;

