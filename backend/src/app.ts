import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { NODE_ENV, PORT } from "./config";
import { Routes } from "./interfaces/routes.interface";
import { errorMiddleware } from "./middlewares/error.middleware";
import { ALLOWED_ORIGINS } from "./config";

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  private prisma: PrismaClient;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = PORT || 9000;

    this.prisma = new PrismaClient();
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
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
    const whitelist = ALLOWED_ORIGINS?.split(",") || [
      "https://eksicode.org",
      "https://demo.eksicode.org",
      "https://demo-api.eksicode.org",
      "https://api-demo.eksicode.org",
    ];

    this.app.use(morgan("dev"));

    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || process.env.NODE_ENV === "development") {
            return callback(null, true);
          }

          if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(new Error(`Origin ${origin} not allowed by CORS`));
          }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
          "Origin",
          "X-Requested-With",
          "Content-Type",
          "Accept",
          "Authorization"
        ],
        exposedHeaders: ["Access-Control-Allow-Origin"]
      })
    );

    this.app.use(
      helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        crossOriginOpenerPolicy: { policy: "same-origin" }
      })
    );
    
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.options("*", cors());
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