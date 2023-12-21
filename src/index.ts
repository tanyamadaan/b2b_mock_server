import express, { Express, Request, Response } from "express";
import { b2bRouter } from "./controllers";
const app: Express = express();
const port = 3000;
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("Mock Server for NP");
});

app.use("/api/b2b", b2bRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:3000`);
});
