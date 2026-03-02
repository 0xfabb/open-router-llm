import "dotenv/config";
import express from "express";
import llmRoutes from "./routes/LLMRoutes";
import authRoutes from "./routes/AuthRoutes";
import userRoutes from "./routes/UserRoutes";
import { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let requests = 0;

app.use((req: Request, res: Response, next) => {
  requests++;
  console.log("Total Requests:", requests);
  next();
});

app.get("/", async (req: Request, res: Response) => {
  res.json({ msg: "Hello world" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/llms", llmRoutes);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
