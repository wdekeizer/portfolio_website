import { useEffect, useState } from "react";
import type { Project } from "../types";

export function useProjects() {
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

  return { projects, error };
}
