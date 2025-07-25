import chalk from "chalk";
import express, { Request, Response } from "express";
import analyzeRouter from "./routes/analyze";

const app = express();
const port = process.env.PORT || 3000;

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello from Express with TypeScript!");
// });

app.use(express.json());

app.use("/api/analyze", analyzeRouter);

app.listen(port, () => {
  console.log(
    chalk.yellowBright(`Server is running on http://localhost:${port}`)
  );
});
