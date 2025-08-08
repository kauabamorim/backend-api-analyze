import chalk from "chalk";
import express, { Request, Response } from "express";
import analyzeRouter from "./routes/analyze";
import userRoutes from "./routes/users";
import { authenticateToken } from "./middlewares/auth";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

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

app.use("/api/analyze", authenticateToken, analyzeRouter);
app.use("/api/user", userRoutes);

app.listen(port, () => {
  console.log(
    chalk.yellowBright(`Server is running on http://localhost:${port}`)
  );
});
