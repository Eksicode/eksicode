"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const menu_service_1 = tslib_1.__importDefault(require("../services/menu.service"));
const pagination_1 = require("../utils/pagination");
class MenuController {
    constructor() {
        this.menuService = new menu_service_1.default();
        this.getAllMenus = async (req, res, next) => {
            try {
                const { page, limit, skip } = (0, pagination_1.getPaginationParams)(req.query);
                const summaryOnly = req.query.summaryOnly === "true";
                const { menus, count } = await this.menuService.getAllMenus(skip, limit, summaryOnly);
                const meta = (0, pagination_1.getPaginationMeta)(count, page, limit);
                res.status(200).json({
                    data: menus,
                    meta,
                    message: "findAllMenus",
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getMenuById = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id, 10);
                const menu = await this.menuService.getMenuById(id);
                res.status(200).json({ data: menu, message: "findMenu" });
            }
            catch (error) {
                next(error);
            }
        };
        this.createMenu = async (req, res, next) => {
            try {
                const menu = await this.menuService.createMenu(req.body);
                res.status(201).json({ data: menu, message: "created" });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateMenu = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id, 10);
                const menu = await this.menuService.updateMenu(id, req.body);
                res.status(200).json({ data: menu, message: "updated" });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteMenu = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id, 10);
                const menu = await this.menuService.deleteMenu(id);
                res.status(200).json({ data: menu, message: "deleted" });
            }
            catch (error) {
                next(error);
            }
        };
        this.getMenusByCategory = async (req, res, next) => {
            try {
                const categoryId = parseInt(req.params.categoryId, 10);
                const { page, limit, skip } = (0, pagination_1.getPaginationParams)(req.query);
                const { menus, count } = await this.menuService.getMenusByCategory(categoryId, skip, limit);
                const meta = (0, pagination_1.getPaginationMeta)(count, page, limit);
                res.status(200).json({
                    data: menus,
                    meta,
                    message: "findMenusByCategory",
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = MenuController;
//# sourceMappingURL=menu.controller.js.map