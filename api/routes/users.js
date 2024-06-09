import express from "express";
import { getUser, updateUser, getSingleUser} from "../controllers/user.js";

const router = express.Router();

router.get("/", getUser)
router.put("/", updateUser)
router.get("/:id", getSingleUser)

export default router;