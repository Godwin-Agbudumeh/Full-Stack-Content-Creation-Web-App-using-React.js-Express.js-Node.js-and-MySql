import express from "express";
import {user, post} from "../controllers/admin.js";

const router = express.Router();

router.delete("/user/:id", user);
router.delete("/post/:id", post);

export default router;