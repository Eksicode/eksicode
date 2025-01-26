import express from "express";
import { Routes } from "./interfaces/routes.interface";
declare class App {
    app: express.Application;
    env: string;
    port: string | number;
    private prisma;
    constructor(routes: Routes[]);
    listen(): void;
    getServer(): express.Application;
    private connectToDatabase;
    private initializeMiddlewares;
    private initializeRoutes;
    private initializeErrorHandling;
    close(): Promise<void>;
}
export default App;
