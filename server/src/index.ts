import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import cors from "cors";
import express from "express";
import { contactRouter } from "./routes/contact.js";
import { projectsRouter } from "./routes/projects.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");

try {
  execSync("node_modules/.bin/prisma migrate deploy", {
    stdio: "inherit",
    timeout: 30_000,
  });
} catch (err) {
  console.error("Prisma migrate deploy failed, continuing startup:", err);
}

const app = express();
const port = process.env.PORT ?? 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/projects", projectsRouter);
app.use("/api/contact", contactRouter);

app.use(express.static(publicDir));
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
