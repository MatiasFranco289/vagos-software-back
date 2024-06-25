import express from "express";
import { projectController } from "../controllers/ProjectController.ts";
import { validateCreate, validateUpdate } from "../validators/Projects.ts";

export const projectRoute = express.Router();

// GET
projectRoute.get("/", projectController.get);
projectRoute.get("/all", projectController.get_projects);

// POST
projectRoute.post("/create", validateCreate, projectController.create_project);

//PUT
projectRoute.put(
  "/update/:project_id",
  validateUpdate,
  projectController.update_project
);
