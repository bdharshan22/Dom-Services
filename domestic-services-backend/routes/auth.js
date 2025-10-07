import express from "express";
import { registerUser, loginUser, getMe, requestPasswordReset, resetPassword } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", auth, getMe);

// Password reset
router.post("/reset-password", requestPasswordReset); // expects { email }
router.post("/reset-password/confirm", resetPassword); // expects { token, password }

export default router;