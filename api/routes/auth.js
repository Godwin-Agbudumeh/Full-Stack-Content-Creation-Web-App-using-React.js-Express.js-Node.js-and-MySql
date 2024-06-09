import express from "express";
import { register, login, logout, forgotPassword, resetPassword } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/forgotPassword", forgotPassword);
router.put("/resetPassword/:id", resetPassword);


export default router;