import type { Project } from "../types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <h3 className="text-lg font-semibold text-slate-50">{project.title}</h3>
      <p className="text-sm text-slate-400">{project.description}</p>
      {project.tags.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto flex gap-4 pt-2 text-sm">
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
    </article>
  );
}
