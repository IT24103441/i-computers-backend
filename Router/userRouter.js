import express from "express";
import { createUser,getUser, loginUser,updatePassword,updateProfile } from "../controllers/userController.js";

const userRouter = express.Router()

userRouter.post("/",createUser)
userRouter.post("/login", loginUser)
userRouter.get("/me", getUser)
userRouter.post("/profile",updateProfile)
userRouter.post("/password",updatePassword)


export default userRouter;