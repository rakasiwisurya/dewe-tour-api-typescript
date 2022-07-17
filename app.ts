import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import router from "./src/routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));
app.use("/api/v1/", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
