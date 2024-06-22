import express from "express";
import { projectStatusController } from "../controllers/ProjectsStatusController";
import { validateCreate, validateDelete } from "../validators/ProjectsStatus";

export const projectStatusRoute = express.Router();

// GET
projectStatusRoute.get("/", projectStatusController.get);
projectStatusRoute.get("/all", projectStatusController.get_projects_status);

// POST
projectStatusRoute.post(
  "/create",
  validateCreate,
  projectStatusController.create_project_status
);

//DELETE
projectStatusRoute.delete(
  "/delete/:status_id",
  validateDelete,
  projectStatusController.delete_project_status
);
