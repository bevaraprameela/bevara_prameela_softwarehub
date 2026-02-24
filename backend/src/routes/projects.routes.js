import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { auth, permitRoles } from "../middleware/auth.js";
import { listProjects, updateProjectDetails, setAssignedEmployees, employeeUpdateStatus, uploadProjectDocument } from "../controllers/projects.controller.js";

const router = Router();

router.use(auth);

router.get("/", listProjects);

router.put("/:id", permitRoles("Admin"), updateProjectDetails);
router.put("/:id/assign", permitRoles("Admin"), setAssignedEmployees);
router.put("/:id/status", permitRoles("Employee"), employeeUpdateStatus);

// Bonus: file upload for admin
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(process.cwd(), "backend", "uploads", "projects", req.params.id);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (_req, file, cb) {
    const ts = Date.now();
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${base}_${ts}${ext}`);
  },
});
const upload = multer({ storage });

router.post("/:id/documents", permitRoles("Admin"), upload.single("file"), uploadProjectDocument);

export default router;
