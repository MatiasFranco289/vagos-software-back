import { check } from "express-validator";
import { validateResult } from "../helpers/validateHelpers.ts";
import { Request, Response, Next } from "express";

export const validateCreate = [
  check("status_name").exists().notEmpty().isString(),
  (req: Request, res: Response, next: Next) => {
    validateResult(req, res, next);
  },
];

export const validateDelete = [
  check("status_id").exists().notEmpty().isNumeric(),
  (req: Request, res: Response, next: Next) => {
    validateResult(req, res, next);
  },
];
