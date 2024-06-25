import { Request, Response } from "express";
import { ApiResponse } from "../constants";
import { ProjectStatus } from "../models/ProjectStatus";

export const projectStatusController = {
  get: (req: Request, res: Response<ApiResponse<null>>) => {
    let statusCode = 200;
    let response: ApiResponse<null> = {
      code: statusCode,
      message: "Hi project status!",
      data: [],
    };

    res.status(statusCode).json(response);
  },

  create_project_status: async (
    req: Request,
    res: Response<ApiResponse<ProjectStatus | null>>
  ) => {
    let statusCode = 201;
    let response: ApiResponse<ProjectStatus | null>;
    const { status_name } = req.body;

    try {
      const newProjectStatus = await ProjectStatus.create({
        status_name: status_name,
      });

      response = {
        code: statusCode,
        message: "Successfully created.",
        data: [newProjectStatus],
      };
    } catch (err) {
      console.error(
        `The following error has ocurred while trying
            to create the new project status: ` + err
      );
      statusCode = 500;

      response = {
        code: statusCode,
        message: `An unexpected error has ocurred while trying to create
            the project status. Check the console for more info.`,
        data: [],
      };
    }

    res.status(statusCode).json(response);
  },

  get_projects_status: async (
    req: Request,
    res: Response<ApiResponse<null | null>>
  ) => {
    let statusCode = 200;
    let response: ApiResponse<ProjectStatus | null>;

    try {
      const projectsStatus = await ProjectStatus.findAll();

      response = {
        code: statusCode,
        message: "Projects status successfully retrieved.",
        data: projectsStatus,
      };
    } catch (err) {
      console.error(
        "The following error has ocurred when trying to recover the projects status: " +
          err
      );
      statusCode = 500;

      response = {
        code: statusCode,
        message: `An unexpected error has occurred while trying 
                to recover the projects status. Check the applications
                logs to get more info.`,
        data: [],
      };
    }

    res.status(statusCode).json(response);
  },

  delete_project_status: async (
    req: Request,
    res: Response<ApiResponse<null>>
  ) => {
    const { status_id } = req.params;
    let statusCode = 200;

    let response: ApiResponse<null>;

    try {
      const deletedRows = await ProjectStatus.destroy({
        where: {
          project_status_id: status_id,
        },
      });

      if (deletedRows === 1) {
        response = {
          code: statusCode,
          message: "Successfully deleted.",
          data: [],
        };

        res.status(statusCode).json(response);
      } else {
        statusCode = 404;

        response = {
          code: statusCode,
          message:
            "The project status corresponding to the given status_id was not found.",
          data: [],
        };
      }
    } catch (err) {
      console.error(
        "The following error has ocurred while trying to delete a project status: " +
          err
      );

      statusCode = 500;
      response = {
        code: statusCode,
        message: `An unexpected error has ocurred while trying to delete the project status.
        Check the console for more info.`,
        data: [],
      };
    }

    res.status(statusCode).json(response);
  },
};
