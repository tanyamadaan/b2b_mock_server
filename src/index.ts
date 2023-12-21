import express, { Express, Request, Response } from "express";
import { b2bBapRouter } from "./controllers/b2b/bap";
import { b2bBppRouter } from "./controllers/b2b/bpp";
const app: Express = express();
const port = 3000;
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("Mock Server for NP");
});

app.use("/b2b/bap", b2bBapRouter);
app.use("/b2b/bpp", b2bBppRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:3000`);
});
