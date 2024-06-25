import express from "express";
import { tagsController } from "../controllers/TagsController";
import { validateCreate, validateUpdate } from "../validators/Tags";

export const tagsRoute = express.Router();

//GET
tagsRoute.get("/", tagsController.get);
tagsRoute.get("/all", tagsController.get_tags);

//POST
tagsRoute.post("/create", validateCreate, tagsController.create_tag);

//PUT
tagsRoute.put("/update/:tag_id", validateUpdate, tagsController.update_tag);
