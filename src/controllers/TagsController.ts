import { Request, Response } from "express";
import { ApiResponse } from "../constants";
import { Tags } from "../models/Tags";

export const tagsController = {
  get: (req: Request, res: Response<ApiResponse<null>>) => {
    let statusCode = 200;
    let response: ApiResponse<null> = {
      code: statusCode,
      message: "Hi Tags!",
      data: [],
    };

    res.status(statusCode).json(response);
  },

  get_tags: async (req: Request, res: Response<ApiResponse<Tags | null>>) => {
    let statusCode = 200;
    let response: ApiResponse<Tags | null>;

    try {
      const tags = await Tags.findAll();

      response = {
        code: statusCode,
        message: "Successfully retrieved.",
        data: tags,
      };
    } catch (err) {
      console.error(
        `The following error has ocurred while trying to recover tags: ` + err
      );

      statusCode = 500;
      response = {
        code: statusCode,
        message: `An unexpected error has occurred while trying 
                to recover tags. Check the applications
                logs to get more info.`,
        data: [],
      };
    }

    res.status(statusCode).json(response);
  },

  create_tag: async (req: Request, res: Response<ApiResponse<Tags | null>>) => {
    let statusCode = 201;
    let response: ApiResponse<Tags | null>;

    const { name } = req.body;

    try {
      const newTag = await Tags.create({ tag_name: name });

      response = {
        code: statusCode,
        message: "Successfully createda.",
        data: [newTag],
      };
    } catch (err) {
      console.error(
        `The following error has ocurred while trying to create the new tags: ${err}`
      );

      statusCode = 500;
      response = {
        code: statusCode,
        message: `An unexpected error has ocurred while trying to create the tag.
            Check the console to get more info.`,
        data: [],
      };
    }

    res.status(statusCode).json(response);
  },

  update_tag: async (req: Request, res: Response<ApiResponse<null>>) => {
    const { tag_id } = req.params;
    const { name } = req.body;

    let statusCode = 200;
    let response: ApiResponse<null>;

    const tag = await Tags.findByPk(tag_id);

    if (!tag) {
      statusCode = 404;
      response = {
        code: statusCode,
        message: "The tag with the given id was not found.",
        data: [],
      };

      return res.status(statusCode).json(response);
    }

    try {
      tag.tag_name = name;
      await tag.save();

      response = {
        code: statusCode,
        message: "Successfully updated.",
        data: [],
      };
    } catch (err) {
      console.error(`The following error has ocurred while trying to update the
            tag with the id ${tag_id}`);

      statusCode = 500;
      response = {
        code: statusCode,
        message: `An unexpected error has ocurred while trying to update the tag.
            Check the console to get more info.`,
        data: [],
      };
    }

    res.status(statusCode).json(response);
  },
};
