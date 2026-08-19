import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";

export const projectsRouter = Router();

const projectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  repoUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

projectsRouter.get("/", async (_req, res) => {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  res.json(projects);
});

projectsRouter.post("/", async (req, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const project = await prisma.project.create({ data: parsed.data });
  res.status(201).json(project);
});
