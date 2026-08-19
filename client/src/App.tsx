import { useEffect, useState } from "react";
import { ContactForm } from "./components/ContactForm";
import { Hero } from "./components/Hero";
import { NavBar } from "./components/NavBar";
import { ProjectCard } from "./components/ProjectCard";
import type { Project } from "./types";

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load projects");
        return res.json();
      })
      .then(setProjects)
      .catch(() => setError("Could not load projects right now."));
  }, []);

  return (
    <div className="min-h-screen">
      <NavBar />
      <Hero />

      <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="mb-8 text-2xl font-semibold text-slate-50">Projects</h2>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!error && projects.length === 0 && (
          <p className="text-sm text-slate-500">No projects yet.</p>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((project) => (
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

export default App;
