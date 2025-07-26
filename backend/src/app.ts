import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { Routes } from "./interfaces/routes.interface";
import { errorMiddleware } from "./middlewares/error.middleware";
import EmailService from "./services/email.service";
import config from "./config";
import { prisma } from "./config/database";

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

    // Use the singleton Prisma client to prevent multiple connections
    this.prisma = prisma;
    
    this.emailService = new EmailService();
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes(this.prisma, this.emailService));
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 App listening on the port ${this.port}`);
      console.log("🧿🧿🧿🧿🧿🧿🧿🧿🧿🧿🧿🧿🧿🧿");
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
    // Trust proxy - configure to trust only the nginx container
    // In Docker networking, nginx container will be on the same network
    // We trust the first proxy (nginx) but not unlimited proxies
    this.app.set('trust proxy', 1);
    
    // Enable response compression early in the middleware stack
    this.app.use(compression({
      level: 6, // Compression level (0-9, where 9 is best compression but slowest)
      threshold: 1024, // Only compress responses larger than 1KB
      filter: (req, res) => {
        // Don't compress if client doesn't support it
        if (req.headers['x-no-compression']) {
          return false;
        }
        
        // Don't compress images, videos, or already compressed files
        const contentType = res.getHeader('Content-Type');
        if (typeof contentType === 'string' && (
          contentType.includes('image/') ||
          contentType.includes('video/') ||
          contentType.includes('application/zip') ||
          contentType.includes('application/gzip') ||
          contentType.includes('application/pdf')
        )) {
          return false;
        }
        
        // Use default compression filter for everything else
        return compression.filter(req, res);
      }
    }) as any);
    
    const whitelist = config.allowedOrigins || [
      "http://localhost:3000",
      "https://eksicode.org",
      "https://www.eksicode.org",
      "https://demo.eksicode.org",
      "https://api.eksicode.org",
      "https://api-demo.eksicode.org"
    ];
    
    this.app.use(morgan("dev"));
    
    // Add CORS pre-flight handling
    this.app.options('*', cors() as any);
    
    // Serve static files from uploads directory
    this.app.use('/uploads', express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads')));
    
    // Configure CORS with proper error handling
    this.app.use(
      cors({
        origin: function (origin, callback) {
          if (
            !origin ||
            config.nodeEnv === "development" ||
            whitelist.includes(origin)
          ) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        exposedHeaders: ["Content-Length", "X-Requested-With", "Authorization"],
      })
    );
    
    // Ensure CORS headers are set on all responses, including errors
    this.app.use(function (req, res, next) {
      // Ensure the CORS headers are sent with every response, even errors
      const origSend = res.send;
      res.send = function (body) {
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization"
        );
        res.header("Cache-Control", "no-store,no-cache,must-revalidate");
        
        // Ensure Access-Control-Allow-Origin is set properly
        const origin = req.headers.origin;
        if (origin && (config.nodeEnv === "development" || whitelist.includes(origin))) {
          res.header("Access-Control-Allow-Origin", origin);
        }
        
        return origSend.call(res, body);
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
