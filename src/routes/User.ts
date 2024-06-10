import express from "express";
import { userController } from "../controllers/UserController.js";

export const userRoute = express.Router();

// GET
userRoute.get("/", userController.get);
userRoute.get("/login", userController.get_login);
userRoute.get("/status", userController.get_session_info);

// POST
userRoute.post("/logout", userController.post_logout);
