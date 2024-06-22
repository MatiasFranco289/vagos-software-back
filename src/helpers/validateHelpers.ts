import { validationResult } from "express-validator";
import { Request, Response, Next } from "express";
import { ApiResponse } from "../constants.ts";

export const validateResult = (req: Request, res: Response, next: Next) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (err) {
    let statusCode: number = 403;

    let response: ApiResponse<null> = {
      code: 403,
      message: "Bad request, some parameters are not correct.",
      data: err.array(),
    };

    res.status(statusCode).json(response);
  }
};
