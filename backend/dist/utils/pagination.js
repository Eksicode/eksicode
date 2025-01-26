"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationMeta = exports.getPaginationParams = void 0;
const getPaginationParams = (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};
exports.getPaginationParams = getPaginationParams;
const getPaginationMeta = (total, page, limit) => ({
    page,
    pageSize: limit,
    totalPages: Math.ceil(total / limit),
    total,
});
exports.getPaginationMeta = getPaginationMeta;
//# sourceMappingURL=pagination.js.map