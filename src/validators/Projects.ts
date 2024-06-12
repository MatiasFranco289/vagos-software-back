import { check } from "express-validator";
import { validateResult } from "../helpers/validateHelpers.js";
import { Request, Response, Next } from "express";

export const validateCreate = [
  check("title").exists().not().isEmpty().isString(),
  check("thumbnail_url").exists().not().isEmpty().isNumeric(),
  (req: Request, res: Response, next: Next) => {
    validateResult(req, res, next);
  },
];
