import chalk from "chalk";
import express, { Request, Response } from "express";
import analyzeRouter from "./routes/analyze";
import userRoutes from "./routes/users";
import { authenticateToken } from "./middlewares/auth";
import cors from "cors";

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);

app.get("/", (req: Request, res: Response) => {
  res.send("Testing EC2 API");
});

app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/analyze/:id", authenticateToken, analyzeRouter);
app.use("/api/analyze", authenticateToken, analyzeRouter);
app.use("/api/user/history", authenticateToken, userRoutes);
app.use("/api/user", userRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor rodando em http://0.0.0.0:${port}`);
});
