import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import connectToDatabase from "./config/db";
import authRouter from "./routes/auth.route";
import AppError from "./utils/appError";
import cookieparser from "cookie-parser";
import cors from "cors";
import path from "node:path";
import next from "next";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev, dir: path.join(__dirname, "../../frontent") }); 
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  app.use(express.json());
  app.use(cookieparser());

  app.use(
    cors({
      origin: "https://macauthenticate.onrender.com",
      credentials: true,
    })
  );

  app.use("/api/auth", authRouter);

  // Global error handler
  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      console.log(`Error: ${err.message}`);
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
        code: err.errorCode || "UNKNOWN_ERROR",
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      code: "INTERNAL_ERROR",
    });
    console.log(err);
  });

  // Handle all Next.js routes (pages, middleware, SSR, etc.)
  app.use((req, res) => {
    return handle(req, res);
  });

 

  app.listen(PORT, () => {
    connectToDatabase();
    console.log(`Server is running at http://localhost:${PORT}`);
  });
});
