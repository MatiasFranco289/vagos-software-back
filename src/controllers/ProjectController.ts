// TODO: Deberia ser capaz de crear un proyecto
// TODO: Deberia ser capaz de obtener todos los proyectos
import { Request, Response } from "express";
import { ApiResponse } from "../constants.js";
import { Projects } from "../models/Projects.js";

export const projectController = {
  get: (req: Request, res: Response<ApiResponse<null>>) => {
    let statusCode: number = 200;
    let response: ApiResponse<null> = {
      code: statusCode,
      message: "Hi Projects!",
      data: [],
    };

    res.status(statusCode).json(response);
  },
  create_project: (req: Request, res: Response<ApiResponse<null>>) => {
    const {
      title,
      thumbnail_url,
      start_date,
      end_date,
      description,
      project_status_id,
      user_id,
      tags,
    } = req.body;

    res.status(200).send("Ta bien");
  },
  get_projects: async (
    req: Request,
    res: Response<ApiResponse<Projects | null>>
  ) => {
    let statusCode = 200;
    let response: ApiResponse<Projects | null>;

    try {
      const projects = await Projects.findAll();

      response = {
        code: statusCode,
        message: "Projects successfully retrieved.",
        data: projects,
      };
    } catch (err) {
      console.error(
        "The following error has occurred when trying to recover the projects: " +
          err
      );
      statusCode = 500;

      response = {
        code: statusCode,
        message: `An unexpected error has occurred while trying 
            to recover the projects. Check the applications logs to get
            more info.`,
        data: [],
      };
    }

    res.status(statusCode).json(response);
  },
};
