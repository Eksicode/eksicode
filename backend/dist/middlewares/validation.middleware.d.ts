import { RequestHandler } from 'express';
declare const validationMiddleware: (type: any, value?: string | "body" | "query" | "params", skipMissingProperties?: boolean) => RequestHandler;
export default validationMiddleware;
