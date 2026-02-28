import "dotenv/config";
import express from "express";
import llmRoutes from "./routes/LLMRoutes";
import authRoutes from "./routes/AuthRoutes";
const app = express();
import { Request, Response } from "express";

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req: Request, res: Response) => {
  res.json({ msg: "Hello world" });
});

const requests = 0;

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/llms", llmRoutes);

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
