import { check } from "express-validator";
import { validateResult } from "../helpers/validateHelpers.ts";
import { Request, Response, Next } from "express";

export const validateCreate = [
  check("title").exists().notEmpty().isString(),
  check("thumbnail_url").exists().notEmpty().isURL(),
  check("start_date").exists().notEmpty().isDate(),
  check("end_date").optional().isDate(),
  check("description").exists().notEmpty().isString(),
  check("project_status_id").exists().notEmpty().isNumeric(),
  check("user_id").exists().notEmpty().isNumeric(),
  check("tags").exists().notEmpty().isArray(),
  (req: Request, res: Response, next: Next) => {
    validateResult(req, res, next);
  },
];
export const validateUpdate = [
  check("title").optional().notEmpty().isString(),
  check("thumbnail_url").optional().notEmpty().isURL(),
  check("start_date").optional().notEmpty().isDate(),
  check("end_date").optional().isDate(),
  check("description").optional().notEmpty().isString(),
  check("project_status_id").optional().notEmpty().isNumeric(),
  check("user_id").optional().notEmpty().isNumeric(),
  check("tags").optional().notEmpty().isArray(),
  (req: Request, res: Response, next: Next) => {
    validateResult(req, res, next);
  },
];
