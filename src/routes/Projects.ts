import express from "express";
import { projectController } from "../controllers/ProjectController.js";
import { validateCreate } from "../validators/Projects.js";

export const projectRoute = express.Router();

// GET
projectRoute.get("/", projectController.get);
projectRoute.get("/all", projectController.get_projects);

// POST

projectRoute.post("/create", validateCreate, projectController.create_project);
