import express, { Request, Response } from "express";

import { AppDataSource } from "./data-source";

const app = express();

//Abrindo conexão com o banco de dados
AppDataSource.initialize()
  .then(() => {
    console.log("Conexão com banco de dados efetuada com sucesso !");
  })
  .catch((error) => {
    console.log("Erro ao conectar a base de dados: ", error);
  });

app.get("/", (req: Request, res: Response) => {
  res.send("Bem-vindo !");
});

app.listen(8080, () => {
  console.log("Servidor rodando na porta 8080 !");
});
