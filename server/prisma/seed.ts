import { prisma } from "../src/prisma.js";

async function main() {
  await prisma.project.createMany({
    data: [
      {
        title: "Portfolio Website",
        description: "This site — a React/Vite frontend with an Express + PostgreSQL API.",
        repoUrl: "https://github.com/wdekeizer/website",
        tags: ["TypeScript", "React", "Express", "PostgreSQL"],
        featured: true,
      },
      {
        title: "VPN Hook-Up System",
        description: "Open-source system for hooking up VPN access to a home lab.",
        repoUrl: "https://github.com/wdekeizer/Home-Lab-AI",
        tags: ["VPN", "Networking", "Self-Hosted"],
        featured: true,
      },
      {
        title: "Local AI Server",
        description: "A local AI server with a web UI for running LLMs on your own hardware.",
        repoUrl: "https://github.com/wdekeizer/WebUI-Local-LLM",
        tags: ["AI", "LLM", "Self-Hosted"],
        featured: true,
      },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
