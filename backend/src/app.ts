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
    ];
    this.app.use(morgan("dev"));
    this.app.use(
      cors({
        origin: function (origin, callback) {
          if (
            !origin ||
            process.env.NODE_ENV === "development" ||
            whitelist.includes(origin)
          ) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true,
      })
    );
    this.app.use(function (req, res, next) {
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
      );
      res.header("Cache-Control", "no-store,no-cache,must-revalidate");
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