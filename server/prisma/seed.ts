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
