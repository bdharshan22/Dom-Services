import express from "express";
import {
  getServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
  toggleServiceAvailability,
} from "../controllers/serviceController.js";
import auth from "../middleware/auth.js";

const router = express.Router();


router.get("/", getServices);
router.get("/:id", getServiceById);
router.post("/", auth, addService);
router.put("/:id", auth, updateService);
router.delete("/:id", auth, deleteService);
// Toggle service availability (admin only)
router.patch("/:id/availability", auth, toggleServiceAvailability);

export default router;