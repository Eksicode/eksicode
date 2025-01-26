"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const page_service_1 = tslib_1.__importDefault(require("../services/page.service"));
const pagination_1 = require("../utils/pagination");
class PagesController {
    constructor() {
        this.pageService = new page_service_1.default();
        this.getAllPages = async (req, res, next) => {
            try {
                const { page, limit, skip } = (0, pagination_1.getPaginationParams)(req.query);
                const summaryOnly = req.query.summaryOnly === "true";
                const { pages, count } = await this.pageService.getAllPages(skip, limit, summaryOnly);
                const meta = (0, pagination_1.getPaginationMeta)(count, page, limit);
                res.status(200).json({
                    data: pages,
                    meta,
                    message: "findPages",
                });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
        this.getPageBySlug = async (req, res) => {
            try {
                const slug = req.params.slug;
                const page = await this.pageService.getPageBySlug(slug);
                if (!page) {
                    res.status(404).json({ message: "Page not found" });
                }
                else {
                    res.status(200).json(page);
                }
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
        //   public getPageById = async (req: Request, res: Response): Promise<void> => {
        //     try {
        //       const id = parseInt(req.params.id, 10);
        //       const page = await this.pageService.getPageById(id);
        //       if (!page) {
        //         res.status(404).json({ message: "Page not found" });
        //       } else {
        //         res.status(200).json(page);
        //       }
        //     } catch (error) {
        //       res.status(500).json({ message: error.message });
        //     }
        //   };
        this.createPage = async (req, res) => {
            try {
                const page = await this.pageService.createPage(req.body);
                res.status(201).json(page);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
        this.updatePage = async (req, res) => {
            try {
                const id = parseInt(req.params.id, 10);
                const page = await this.pageService.updatePage(id, req.body);
                res.status(200).json(page);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
        this.deletePage = async (req, res) => {
            try {
                const id = parseInt(req.params.id, 10);
                const page = await this.pageService.deletePage(id);
                res.status(200).json({ message: "Page deleted successfully", page });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
    }
}
exports.default = PagesController;
//# sourceMappingURL=page.controller.js.map