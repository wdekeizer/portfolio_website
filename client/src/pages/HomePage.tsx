import { Link } from "react-router-dom";
import { ContactForm } from "../components/ContactForm";
import { Hero } from "../components/Hero";
import { NavBar } from "../components/NavBar";
import { ProjectCard } from "../components/ProjectCard";
import { useProjects } from "../hooks/useProjects";

const MAX_FEATURED = 4;

export function HomePage() {
  const { projects, error } = useProjects();
  const featured = projects.filter((p) => p.featured).slice(0, MAX_FEATURED);
  const shown = featured.length > 0 ? featured : projects.slice(0, MAX_FEATURED);

  return (
    <div className="min-h-screen">
      <NavBar />
      <Hero />

      <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-50">Featured Projects</h2>
          <Link
            to="/projects"
            className="group flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
          >
            View all
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="transition group-hover:translate-x-1"
            >
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!error && shown.length === 0 && (
          <p className="text-sm text-slate-500">No projects yet.</p>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {shown.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section id="contact" className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="mb-6 text-2xl font-semibold text-slate-50">Contact</h2>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
