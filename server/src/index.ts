import "dotenv/config";
import cors from "cors";
import express from "express";
import { contactRouter } from "./routes/contact.js";
import { projectsRouter } from "./routes/projects.js";

const app = express();
const port = process.env.PORT ?? 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/projects", projectsRouter);
app.use("/api/contact", contactRouter);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
