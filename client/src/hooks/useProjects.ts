import { useCallback, useEffect, useState } from "react";
import type { Project } from "../types";
import { apiUrl } from "../lib/api";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    fetch(apiUrl("/api/projects"))
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load projects");
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setError(null);
      })
      .catch(() => setError("Could not load projects right now."));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { projects, error, refetch };
}
