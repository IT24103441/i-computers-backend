import express from "express";
import { createUser, getUser, loginUser, updatePassword, updateProfile, googleLogin,sendOTP } from "../controllers/userController.js";

const userRouter = express.Router()

userRouter.post("/", createUser)
userRouter.post("/login", loginUser)
userRouter.post("/google-login", googleLogin)
userRouter.post("/google", googleLogin)
userRouter.get("/me", getUser)
userRouter.post("/profile", updateProfile)
userRouter.post("/password", updatePassword)
userRouter.post("/google-login",googleLogin)
userRouter.post("/otp",sendOTP)

export default userRouter;