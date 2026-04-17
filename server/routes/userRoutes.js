import express from "express";
import {
  registerUser,
  loginUser,
  getUserById,
  getUserResumes
} from "../controllers/userController.js";

import protect from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

// AUTH
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// PROTECTED ROUTES
userRouter.get("/data", protect, getUserById);
userRouter.get("/resumes", protect, getUserResumes);

export default userRouter;