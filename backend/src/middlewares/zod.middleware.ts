import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError, any } from 'zod';
import { HttpException } from '../exceptions/HttpException';

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
        // Log validation errors in development for debugging
        if (process.env.NODE_ENV === 'development') {
          console.warn('Validation error:', {
            path: req.path,
            method: req.method,
            body: req.body,
            errors: error.issues
          });
        }
        
        // Format validation errors into a readable message
        const errorMessages = error.issues.map(issue => {
          const path = issue.path.join('.');
          return `${path}: ${issue.message}`;
        });
        
        const errorMessage = errorMessages.length === 1 
          ? errorMessages[0] 
          : `Validation failed: ${errorMessages.join(', ')}`;
        
        // Throw HttpException to use consistent error handling
        throw new HttpException(400, errorMessage, {
          validationErrors: error.issues,
          formattedErrors: errorMessages
        });
      }
      next(error);
    }
  }; 