import express from "express";
import { userController } from "../controllers/UserController.js";

export const userRoute = express.Router();

userRoute.get("/", userController.get);
userRoute.get("/login", userController.get_login);
userRoute.get("/info", userController.get_user_data);
userRoute.get("/status", userController.is_session_active);
