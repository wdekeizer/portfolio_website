import { Router } from "express";
import { z } from "zod";
import { requireAdmin } from "../middleware/adminAuth.js";
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

const projectUpdateSchema = projectSchema.partial();

projectsRouter.get("/", async (_req, res) => {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  res.json(projects);
});

projectsRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = projectSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const project = await prisma.project.create({ data: parsed.data });
  res.status(201).json(project);
});

projectsRouter.patch("/:id", requireAdmin, async (req, res) => {
  const parsed = projectUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json(project);
  } catch {
    res.status(404).json({ error: "Project not found" });
  }
});

projectsRouter.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Project not found" });
  }
});
