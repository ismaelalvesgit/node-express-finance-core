import { AnySchema } from "joi";
import { curryN } from "ramda";
import { NextFunction, Request, Response } from "express";
import { Logger } from "@infrastructure/logger/logger";
import { InvalidProperties } from "@infrastructure/exceptions/errorException";

export const validator = curryN(
    4,
    (schema: AnySchema, req: Request, res: Response, next: NextFunction) => {
      const validation = schema.validate(req, {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: true,
      });
      const requestId = req.requestId;
      if (validation.error) {
        Logger.debug(
          {
            class: "Validator",
            classType: "HttpMiddleware",
            details: validation.error.details,
          },
          `invalid request params request ${requestId}`,
        );
  
        return next(
          new InvalidProperties(`Invalid request params request ${requestId}`, validation.error.details),
        );
      }
  
      Object.assign(req, validation.value);
  
      return next();
    },
  );
  