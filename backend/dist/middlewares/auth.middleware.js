"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = require("../config");
const HttpException_1 = require("../exceptions/HttpException");
const authMiddleware = async (req, res, next) => {
    var _a;
    try {
        const Authorization = req.cookies['Authorization'] || ((_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split('Bearer ')[1]);
        if (Authorization) {
            const secretKey = config_1.SECRET_KEY || '';
            const verificationResponse = (0, jsonwebtoken_1.verify)(Authorization, secretKey);
            req.user = verificationResponse;
            next();
        }
        else {
            next(new HttpException_1.HttpException(404, 'Authentication token missing'));
        }
    }
    catch (error) {
        next(new HttpException_1.HttpException(401, 'Wrong authentication token'));
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map