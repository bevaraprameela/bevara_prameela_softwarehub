import { Router } from "express";
import { body } from "express-validator";
import { auth, permitRoles } from "../middleware/auth.js";
import { createServiceRequest, listMyServiceRequests, listAllServiceRequests, setApprovalStatus } from "../controllers/serviceRequests.controller.js";

const router = Router();

// Client creates a service request
router.post("/", auth, permitRoles("Client"), [body("serviceId").notEmpty()], createServiceRequest);
router.get("/my", auth, permitRoles("Client"), listMyServiceRequests);

// Admin views and approves/rejects
router.get("/", auth, permitRoles("Admin"), listAllServiceRequests);
router.put("/:id/approval", auth, permitRoles("Admin"), [body("status").isIn(["Approved", "Rejected"])], setApprovalStatus);

export default router;

