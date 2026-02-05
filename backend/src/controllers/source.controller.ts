import { Request, Response, NextFunction } from "express";
import SourceService from "../services/source.service";
import { getPaginationParams } from "../utils/pagination";

class SourceController {
    private sourceService = new SourceService();

    public getAllSources = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { page, limit, skip } = getPaginationParams(req.query);
            const all = req.query.all === "true";
            const approved =
                req.query.approved === undefined
                    ? undefined
                    : req.query.approved === "true";
            const { sources, count } = await this.sourceService.getAllSources(
                skip,
                limit,
                approved,
                all
            );

            // const meta = getPaginationMeta(count, page, limit);

            res.status(200).json({
                data: sources,
                meta: {
                    total: count,
                    skip,
                    limit,
                    currentPage: Math.floor(skip / limit) + 1,
                    totalPages: Math.ceil(count / limit),
                  },
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

    public searchSources = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { q } = req.query;
            const { page, limit, skip } = getPaginationParams(req.query);

            if (!q || typeof q !== "string") {
                res.status(400).json({ message: "Search term is required" });
                return;
            }

            const approved =
                req.query.approved === undefined
                    ? undefined
                    : req.query.approved === "true";
            const { sources, count } = await this.sourceService.searchSources(
                q,
                skip,
                limit,
                approved
            );

            res.status(200).json({
                data: sources,
                meta: {
                    total: count,
                    skip,
                    limit,
                    currentPage: Math.floor(skip / limit) + 1,
                    totalPages: Math.ceil(count / limit),
                },
                message: "searchSources",
            });
        } catch (error) {
            next(error);
        }
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