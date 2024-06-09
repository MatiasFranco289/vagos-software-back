import express from "express";
import { userController } from "../controllers/UserController.js";

export const userRoute = express.Router();

userRoute.get("/", userController.get);
userRoute.get("/login", userController.get_login);
userRoute.get("/status", userController.is_session_active);
