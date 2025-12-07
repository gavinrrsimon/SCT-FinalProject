import express, { Express } from "express";
import { HTTP_STATUS } from "./constants/httpConstants"
import morgan from "morgan";
import employeesRoutes from "./api/v1/routes/employeesRoutes";
import branchesRoutes from './api/v1/routes/branchesRoutes'

const app: Express = express();

// Use morgan for HTTP request logging
app.use(morgan("combined"));
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Hello, world");
});

app.get("/api/v1/health", (req, res) => {
    res.json({
        status: HTTP_STATUS.OK,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

app.use('/api/v1', employeesRoutes);
app.use('/api/v1', branchesRoutes);


export default app;
