import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError, any } from 'zod';

export const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: 'Validation error',
          errors: error.issues,
        });
        return;
      }
      next(error);
    }
  }; 