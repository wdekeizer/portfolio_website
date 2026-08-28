import { Router } from "express";
import { z } from "zod";
import { sendContactNotification } from "../mailer.js";
import { prisma } from "../prisma.js";

export const contactRouter = Router();

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});

contactRouter.post("/", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const saved = await prisma.contactMessage.create({ data: parsed.data });
  try {
    await sendContactNotification(parsed.data);
  } catch (err) {
    console.error("Failed to send contact notification email:", err);
  }
  res.status(201).json(saved);
});
