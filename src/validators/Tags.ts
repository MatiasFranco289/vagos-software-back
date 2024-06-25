import { check } from "express-validator";
import { validateResult } from "../helpers/validateHelpers.ts";
import { Request, Response, Next } from "express";

export const validateCreate = [
  check("name").exists().notEmpty().isString(),
  (req: Request, res: Response, next: Next) => {
    validateResult(req, res, next);
  },
];

export const validateUpdate = [
  check("tag_id").exists().notEmpty().isNumeric(),
  check("name").exists().notEmpty().isString(),
  (req: Request, res: Response, next: Next) => {
    validateResult(req, res, next);
  },
];
