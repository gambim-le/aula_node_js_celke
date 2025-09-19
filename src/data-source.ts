import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "masterkey",
  synchronize: true,
  logging: false,
  entities: [User],
  subscribers: [],
  migrations: [__dirname + "/migration/*.js"],
});

//Abrindo conexão com o banco de dados
AppDataSource.initialize()
  .then(() => {
    console.log("Conexão com banco de dados efetuada com sucesso !");
  })
  .catch((error) => {
    console.log("Erro ao conectar a base de dados: ", error);
  });
