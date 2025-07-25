declare namespace Express {
    export interface Request {
        user?: any;
        userId?: number;
        token?: string;
    }
    export interface Response {
        user: any;
    }
  }