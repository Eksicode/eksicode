"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const telegram_service_1 = tslib_1.__importDefault(require("../services/telegram.service"));
const pagination_1 = require("../utils/pagination");
class TelegramGroupsController {
    constructor() {
        this.telegramGroupsService = new telegram_service_1.default();
        this.getAllTelegramGroups = async (req, res, next) => {
            try {
                const { page, limit, skip } = (0, pagination_1.getPaginationParams)(req.query);
                const summaryOnly = req.query.summaryOnly === "true";
                const { telegrams, count } = await this.telegramGroupsService.getAllTelegramGroups(skip, limit, summaryOnly);
                const meta = (0, pagination_1.getPaginationMeta)(count, page, limit);
                res.status(200).json({
                    data: telegrams,
                    meta,
                    message: "findAllTelegramGroups",
                });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
        this.getTelegramGroupById = async (req, res) => {
            try {
                const id = parseInt(req.params.id, 10);
                const telegramGroup = await this.telegramGroupsService.getTelegramGroupById(id);
                if (!telegramGroup) {
                    res.status(404).json({ message: "Telegram Group not found" });
                }
                else {
                    res.status(200).json(telegramGroup);
                }
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
        this.createTelegramGroup = async (req, res) => {
            try {
                const telegramGroup = await this.telegramGroupsService.createTelegramGroup(req.body);
                res.status(201).json(telegramGroup);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
        this.updateTelegramGroup = async (req, res) => {
            try {
                const id = parseInt(req.params.id, 10);
                const telegramGroup = await this.telegramGroupsService.updateTelegramGroup(id, req.body);
                res.status(200).json(telegramGroup);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
        this.deleteTelegramGroup = async (req, res) => {
            try {
                const id = parseInt(req.params.id, 10);
                const telegramGroup = await this.telegramGroupsService.deleteTelegramGroup(id);
                res.status(200).json({ message: "Telegram Group deleted successfully", telegramGroup });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
    }
}
exports.default = TelegramGroupsController;
//# sourceMappingURL=telegram.controller.js.map