import express, { Router } from "express";
import {
  getAllUser,
  createUser,
  getUserById,getUserCount,getUserIsAdmin,loginUser,deleteUser
} from "../controllers/user.controller";
import authUser from "../middleware/auth";
const router: Router = express.Router();

router.get("/", getAllUser);
router.get("/:id", getUserById);
router.get('/get/count',getUserCount);
router.get('/get/admin',getUserIsAdmin)
router.post("/register", createUser);
router.post('/login',loginUser);
router.delete('/:id',authUser,deleteUser)

export default router;
