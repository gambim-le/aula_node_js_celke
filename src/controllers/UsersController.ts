import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const router = express.Router();

//instância do repositório da entidade User
const userRepository = AppDataSource.getRepository(User);

var GMensagem: string = "";

async function doEmailExiste(AEmail: string) {
  const emailExist = await userRepository.findOne({
    where: { email: AEmail },
  });
  GMensagem = "";
  if (emailExist) {
    GMensagem = "e-Mail já cadastrado com outro usuário !";
  }
  return emailExist;
}

//Listagem via find()
router.get("/users/modo1", async (req: Request, res: Response) => {
  try {
    const users = await userRepository.find();
    //const users = await AppDataSource.query("select * from public.user");

    res.status(200).json(users);
    return;
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar Users !",
    });
  }
});

//Listagem via query direto do DataSource
router.get("/users/modo2", async (req: Request, res: Response) => {
  try {
    const users = await AppDataSource.query("select * from public.user");

    res.status(200).json(users);
    return;
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar Users !",
    });
  }
});

//Listagem via QueryRunner
router.get("/users/modo3", async (req: Request, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    const users = await queryRunner.query("select * from public.user");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar Users !",
    });
  } finally {
    await queryRunner.release();
  }
});

//Busca por findOneBy
router.get("/users/modo1/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userRepository.findOneBy({ id: parseInt(id as string) });

    res.status(200).json(user);
    return;
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar o User !",
    });
  }
});

//Busca por query do DataSource
router.get("/users/modo2/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await AppDataSource.query(
      "select * from public.user where id = $1",
      [parseInt(id as string)]
    );

    res.status(200).json(user);
    return;
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar o User !",
    });
  }
});

//Buscar via QueryRunner
router.get("/users/modo3/:id", async (req: Request, res: Response) => {
  const queryRunner = AppDataSource.createQueryRunner();
  try {
    const { id } = req.params;
    await queryRunner.connect();
    const users = await queryRunner.query(
      "select * from public.user where id = $1",
      [parseInt(id as string)]
    );

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao listar Users !",
    });
  } finally {
    await queryRunner.release();
  }
});

//Insert via create to typeorm
router.post("/users/modo1", async (req: Request, res: Response) => {
  try {
    //variável que receberá os dados vindos da requisição
    var data = req.body;

    var gravar = !(await doEmailExiste(data.email));

    if (gravar) {
      //cria o novo usuario em memória
      const newUser = userRepository.create(data);

      //gravar fisicamente no banco de dados
      await userRepository.save(newUser);

      //Retornando resposta
      res.status(201).json({
        message: "OK",
        user: newUser,
      });
    } else {
      res.status(400).json({
        message: GMensagem,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erro ao cadastrar usuário !",
    });
  }
});

//Insert via query no DataSource
router.post("/users/modo2", async (req: Request, res: Response) => {
  try {
    //variável que receberá os dados vindos da requisição
    var data = req.body;

    var gravar = !(await doEmailExiste(data.email));

    if (gravar) {
      //cria o novo usuario em memória
      const newUser = await AppDataSource.query(
        "insert into public.user (" +
          "name," +
          "email" +
          ") values (" +
          "$1," +
          "$2" +
          ") " +
          "returning id",
        [data.name, data.email]
      );
      console.log(newUser);
      console.log(newUser.id);
      const user = await AppDataSource.query(
        "select * from public.user where id = $1",
        [newUser.id as number]
      );

      //Retornando resposta
      res.status(201).json({
        message: "OK",
        user: user,
      });
    } else {
      res.status(400).json({
        message: GMensagem,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erro ao cadastrar usuário !",
    });
  }
});

export default router;
