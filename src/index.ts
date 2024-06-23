import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import { MONGO_URI, NODE_ENV } from "./config";

import generalRoutes from "./routes/general.routes";
import adminRoutes from './routes/admin.routes';
import userRoutes from './routes/user.routes';

import { IError } from "./interfaces/error.interface";
import mongoose from "mongoose";

const app: Express = express();

// ---------- Midllewares ------------
app.use(express.json());

if (NODE_ENV === "dev") app.use(morgan("dev"));

// ----------- Routes ------------------
app.use("/api", generalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
// ----------- Error Handling ------------
app.use("*", (req: Request, res: Response, next: NextFunction) => {
  const error: IError = {
    status: 404,
    message: "Endpoint not found",
  };

  next(error);
});

app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    type: "error",
    message,
  });
});


(async function () {
  try {
    console.log("Connecting to MongoDb...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDb successfully ✅");

    app.listen(process.env.PORT, () => {
      console.log(
        `Server is running on http://127.0.0.1:${process.env.PORT} 🚀`,
      );
    });
  } catch (error) {
    console.error("Error occured when starting server", error);
  }
})();
