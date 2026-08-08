import express from "express";
import { createUser, getUser, loginUser, updatePassword, updateProfile, googleLogin,sendOTP,getAllUsers,switchRole,updateUserState, verifyOTP  } from "../controllers/userController.js";

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
userRouter.post("/verify-otp",verifyOTP)
userRouter.get("/all/:pageNumber/:pageSize",getAllUsers)

userRouter.put("/state/:email",updateUserState)
userRouter.put("/role/:email",switchRole)

export default userRouter;