import express, { Request, Response } from "express";

import { AppDataSource } from "./data-source";
import UsersController from "./controllers/UsersController";

const app = express();

app.use(express.json());
app.use("/", UsersController);

app.get("/", (req: Request, res: Response) => {
  res.send("Bem-vindo !");
});

app.listen(8080, () => {
  console.log("Servidor rodando na porta 8080 !");
});
