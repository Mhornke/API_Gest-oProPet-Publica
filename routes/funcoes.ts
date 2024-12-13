import { PrismaClient } from "@prisma/client";
import { Router } from "express";

// const prisma = new PrismaClient()
const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
});

prisma.$on("query", (e) => {
  console.log("Query: " + e.query);
  console.log("Params: " + e.params);
  console.log("Duration: " + e.duration + "ms");
});

const router = Router();

router.get("/", async (req, res) => {
  try {
    const funcoes = await prisma.funcao.findMany();
    res.status(200).json(funcoes);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/", async (req, res) => {
  const { nome, descricao } = req.body;

  if (!nome || !descricao) {
    res.status(400).json({ erro: "Informe o nome e a descricao da Função" });
    return;
  }

  try {
    const funcao = await prisma.funcao.create({
      data: { nome, descricao },
    });
    res.status(201).json(funcao);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const funcao = await prisma.funcao.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(funcao);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;

  if (!nome || !descricao) {
    res.status(400).json({ erro: "Informe o nome ou a descricao da Função" });
    return;
  }

  try {
    const funcao = await prisma.funcao.update({
      where: { id: Number(id) },
      data: { nome, descricao },
    });
    res.status(200).json(funcao);
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;