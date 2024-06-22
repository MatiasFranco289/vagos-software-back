// TODO: Deberia ser capaz de crear un proyecto
// TODO: Deberia ser capaz de obtener todos los proyectos
import { Request, Response } from "express";
import { ApiResponse } from "../constants.ts";
import { Projects } from "../models/Projects.ts";

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

  create_project: async (req: Request, res: Response<ApiResponse<null>>) => {
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

    const newProject = await Projects.create({
      title: title,
      thumbnail: thumbnail_url,
      startDate: start_date,
      endDate: end_date,
      description: description,
      project_status_id: project_status_id,
      created_by: user_id,
      Tags: tags,
    });

    res.status(200).json(newProject);
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

  update_project: async (
    req: Request,
    res: Response<ApiResponse<null | Projects>>
  ) => {
    const { project_id } = req.params;
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
    let statusCode = 200;
    let response: ApiResponse<null | Projects>;

    const project = await Projects.findByPk(project_id);

    if (!project) {
      statusCode = 404;
      response = {
        code: statusCode,
        message: "The project with the given id was not found",
        data: [],
      };

      return res.status(statusCode).json(response);
    }

    try {
      project.title = title || project.dataValues.title;
      project.thumbnail = thumbnail_url || project.dataValues.thumbnail;
      project.startDate = start_date || project.dataValues.startDate;
      project.endDate = end_date || project.dataValues.endDate;
      project.description = description || project.dataValues.description;
      project.project_status_id =
        project_status_id || project.dataValues.project_status_id;
      project.created_by = user_id || project.dataValues.created_by;
      project.Tags = tags || project.dataValues.Tags;

      await project.save();
    } catch (err) {
      console.error(`The following error has ocurred while trying to update the
        project with id ${project.dataValues.project_id}: ${err}`);

      statusCode = 500;
      response = {
        code: statusCode,
        message: `An unexpected error has ocurred while trying to update the
          project. Check the console for more info.`,
        data: [],
      };
    }

    res.status(statusCode).json(response);
  },
};
