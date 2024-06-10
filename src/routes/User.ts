import express from "express";
import { userController } from "../controllers/UserController.js";

export const userRoute = express.Router();

userRoute.get("/", userController.get);
userRoute.get("/login", userController.get_login);
userRoute.post("/logout", userController.post_logout);
userRoute.get("/status", userController.get_session_info);

userRoute.get("/test-create-name", userController.test_create_name);
userRoute.get("/test-show-name", userController.test_show_name);
userRoute.post("/test-delete-session", userController.test_delete_session);
