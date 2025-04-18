import express from 'express';
import { 
    login, 
    logout, 
    register, 
    getUser, 
    verifyOTP, 
    forgotPassword, 
    resetPassword 
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP); // Fixed the route path from "verify.otp" to "verify-otp"
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.post("/password/forgot", forgotPassword); // Changed from GET to POST since it accepts email in request body
router.post("/password/reset/:token", resetPassword); // Added the missing resetPassword route

export default router;