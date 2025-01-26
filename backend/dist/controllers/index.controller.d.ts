import { NextFunction, Request, Response } from 'express';
declare class IndexController {
    index: (req: Request, res: Response, next: NextFunction) => void;
}
export default IndexController;
