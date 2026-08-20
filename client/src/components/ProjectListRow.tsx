import type { Project } from "../types";

export function ProjectListRow({ project }: { project: Project }) {
  return (
    <div className="grid grid-cols-1 items-start gap-3 py-6 sm:grid-cols-[220px_1fr_140px] sm:items-center sm:gap-8">
      <h3 className="font-semibold text-slate-50">{project.title}</h3>
      <p className="text-sm text-slate-400">{project.description}</p>
      <div className="flex gap-4 text-sm sm:justify-end">
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Code
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Live demo
          </a>
        )}
      </div>
    </div>
  );
}
