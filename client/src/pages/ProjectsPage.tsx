import { Link } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import { ProjectListRow } from "../components/ProjectListRow";
import { useProjects } from "../hooks/useProjects";

export function ProjectsPage() {
  const { projects, error } = useProjects();

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to home
        </Link>

        <h1 className="mb-8 text-3xl font-bold text-slate-50">All Projects</h1>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!error && projects.length === 0 && (
          <p className="text-sm text-slate-500">No projects yet.</p>
        )}
        <div className="divide-y divide-slate-800 border-t border-slate-800">
          {projects.map((project) => (
            <ProjectListRow key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
