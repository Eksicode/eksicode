"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cors_1 = tslib_1.__importDefault(require("cors"));
const express_1 = tslib_1.__importDefault(require("express"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const client_1 = require("@prisma/client");
const config_1 = require("./config");
const error_middleware_1 = require("./middlewares/error.middleware");
const config_2 = require("./config");
class App {
    constructor(routes) {
        this.app = (0, express_1.default)();
        this.env = config_1.NODE_ENV || "development";
        this.port = config_1.PORT || 9000;
        this.prisma = new client_1.PrismaClient();
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`🚀 App listening on the port ${this.port}`);
        });
    }
    getServer() {
        return this.app;
    }
    async connectToDatabase() {
        try {
            await this.prisma.$connect();
            console.log("✅ Connected to the database successfully.");
        }
        catch (error) {
            console.error("❌ Error connecting to the database:", error);
            process.exit(1);
        }
    }
    initializeMiddlewares() {
        const whitelist = (config_2.ALLOWED_ORIGINS === null || config_2.ALLOWED_ORIGINS === void 0 ? void 0 : config_2.ALLOWED_ORIGINS.split(",")) || [
            "https://eksicode.org",
            "https://demo.eksicode.org",
            "https://demo-api.eksicode.org",
            "https://api-demo.eksicode.org"
        ];
        this.app.use((0, morgan_1.default)("dev"));
        this.app.use((0, cors_1.default)({
            origin: function (origin, callback) {
                if (!origin ||
                    process.env.NODE_ENV === "development" ||
                    whitelist.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            credentials: true,
        }));
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json");
            res.header("Cache-Control", "no-store,no-cache,must-revalidate");
            next();
        });
        this.app.use((0, helmet_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, cookie_parser_1.default)());
    }
    initializeRoutes(routes) {
        routes.forEach((route) => {
            this.app.use("/", route.router);
        });
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.errorMiddleware);
    }
    async close() {
        await this.prisma.$disconnect();
        console.log("🛑 Database connection closed.");
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map