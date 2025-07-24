import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { Routes } from "./interfaces/routes.interface";
import { errorMiddleware } from "./middlewares/error.middleware";
import EmailService from "./services/email.service";
import config from "./config";
import compression from "compression";

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  private prisma: PrismaClient;
  private emailService: EmailService;

  constructor(routes: (prisma: PrismaClient, emailService: EmailService) => Routes[]) {
    this.app = express();
    this.env = config.nodeEnv || "development";
    this.port = config.port || 9000;

    this.prisma = new PrismaClient();
    this.emailService = new EmailService();
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes(this.prisma, this.emailService));
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 App listening on the port ${this.port}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    try {
      await this.prisma.$connect();
      console.log("✅ Connected to the database successfully.");
    } catch (error) {
      console.error("❌ Error connecting to the database:", error);
      process.exit(1);
    }
  }

  private initializeMiddlewares() {
    this.app.set("trust proxy", 1);
    this.app.use(compression() as any);

    const defaultWhitelist = [
      "http://localhost:3000",
      "https://eksicode.org",
      "https://www.eksicode.org",
      "https://demo.eksicode.org",
      "https://api.eksicode.org",
      "https://api-demo.eksicode.org"
    ];

    const envOrigins = config.allowedOrigins || [];
    const whitelist = [...new Set([...defaultWhitelist, ...envOrigins])];

    this.app.use(morgan("dev"));

    this.app.use(
      cors({
        origin: function (origin, callback) {
          if (!origin || config.nodeEnv === "development" || whitelist.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
      })
    );

    this.app.use(function (req, res, next) {
      const origin = req.headers.origin;
      if (origin && (config.nodeEnv === "development" || whitelist.includes(origin))) {
        res.header("Access-Control-Allow-Origin", origin);
      }

      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization");
      res.header("Cache-Control", "no-store,no-cache,must-revalidate");

      // Ensure CORS headers are set on error responses too
      const originalSend = res.send;
      res.send = function(body) {
        if (origin && (config.nodeEnv === "development" || whitelist.includes(origin))) {
          res.header("Access-Control-Allow-Origin", origin);
        }
        res.header("Access-Control-Allow-Credentials", "true");
        return originalSend.call(this, body);
      };

      next();
    });

    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public async close() {
    await this.prisma.$disconnect();
    console.log("🛑 Database connection closed.");
  }
}

export default App;
