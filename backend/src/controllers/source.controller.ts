import { Request, Response, NextFunction } from "express";
import SourceService from "../services/source.service";
import { getPaginationParams, getPaginationMeta } from "../utils/pagination";

class SourceController {
    private sourceService = new SourceService();

    public getAllSources = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { page, limit, skip } = getPaginationParams(req.query);
            const { sources, count } = await this.sourceService.getAllSources(
                skip,
                limit
            );

            const meta = getPaginationMeta(count, page, limit);

            res.status(200).json({
                data: sources,
                meta,
                message: "findAllSources",
            });
        } catch (error) {
            next(error);
        }
    };

    public getSourceById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            const source = await this.sourceService.getSourceById(id);
            if (!source) {
                res.status(404).json({ message: "Source not found" });
                return;
            };
            res.status(200).json({ data: source, message: "findSource" });
        } catch (error) {
            next(error);
        };
    };

    public createSource = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const source = await this.sourceService.createSource(req.body);
            res.status(201).json({ data: source, message: "created" });
        } catch (error) {
            next(error);
        }
    };

    public updateSource = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            const source = await this.sourceService.updateSource(id, req.body);
            res.status(200).json({ data: source, message: "updated" });
        } catch (error) {
            next(error);
        };
    };

    public deleteSource = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = parseInt(req.params.id, 10);
            await this.sourceService.deleteSource(id);
            res.status(200).json({ message: "deleted" });
        } catch (error) {
            next(error);
        }
    };

};

export default SourceController;