"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GMAIL_EMAIL_PASSWORD = exports.GMAIL_EMAIL_ADDRESS = exports.ALLOWED_REDIRECT_URLS = exports.ALLOWED_ORIGINS = exports.AWS_S3_REGION = exports.AWS_SES_MAIL_SOURCE = exports.AWS_SES_REGION = exports.AWS_SECRET_KEY = exports.AWS_ACCESS_KEY = exports.AUTHENTICATION_CODE_SECRET_KEY = exports.SECRET_KEY = exports.DATABASE_URL = exports.PORT = exports.NODE_ENV = exports.tokenExpiresIn = exports.cookieExpriresIn = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: `.env` });
exports.cookieExpriresIn = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
exports.tokenExpiresIn = 7 * 24 * 60 * 60; // 7 days in seconds
_a = process.env, exports.NODE_ENV = _a.NODE_ENV, exports.PORT = _a.PORT, exports.DATABASE_URL = _a.DATABASE_URL, exports.SECRET_KEY = _a.SECRET_KEY, exports.AUTHENTICATION_CODE_SECRET_KEY = _a.AUTHENTICATION_CODE_SECRET_KEY, exports.AWS_ACCESS_KEY = _a.AWS_ACCESS_KEY, exports.AWS_SECRET_KEY = _a.AWS_SECRET_KEY, exports.AWS_SES_REGION = _a.AWS_SES_REGION, exports.AWS_SES_MAIL_SOURCE = _a.AWS_SES_MAIL_SOURCE, exports.AWS_S3_REGION = _a.AWS_S3_REGION, exports.ALLOWED_ORIGINS = _a.ALLOWED_ORIGINS, exports.ALLOWED_REDIRECT_URLS = _a.ALLOWED_REDIRECT_URLS, exports.GMAIL_EMAIL_ADDRESS = _a.GMAIL_EMAIL_ADDRESS, exports.GMAIL_EMAIL_PASSWORD = _a.GMAIL_EMAIL_PASSWORD;
//# sourceMappingURL=index.js.map