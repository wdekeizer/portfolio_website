import { useState } from "react";
import { NavBar } from "../components/NavBar";
import { ProjectForm } from "../components/ProjectForm";
import {
  AdminAuthError,
  clearStoredAdminToken,
  createProject,
  deleteProject,
  getStoredAdminToken,
  setStoredAdminToken,
  updateProject,
} from "../lib/api";
import { useProjects } from "../hooks/useProjects";
import type { Project } from "../types";

function LoginForm({ onSubmit }: { onSubmit: (token: string) => void }) {
  const [token, setToken] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(token.trim());
      }}
      className="mx-auto flex max-w-sm flex-col gap-3"
    >
      <input
        value={token}
        onChange={(e) => setToken(e.target.value)}
        type="password"
        placeholder="Admin token"
        autoFocus
        className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
      >
        Unlock
      </button>
    </form>
  );
}

export function AdminPage() {
  const [token, setToken] = useState<string | null>(getStoredAdminToken());
  const { projects, error, refetch } = useProjects();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  function handleLogin(candidate: string) {
    if (!candidate) return;
    setStoredAdminToken(candidate);
    setToken(candidate);
    setAuthError(null);
  }

  function handleAuthFailure() {
    clearStoredAdminToken();
    setToken(null);
    setAuthError("That token was rejected. Please try again.");
  }

  if (!token) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h1 className="mb-8 text-center text-2xl font-bold text-slate-50">Admin</h1>
          {authError && <p className="mb-4 text-center text-sm text-red-400">{authError}</p>}
          <LoginForm onSubmit={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-50">Manage Projects</h1>
          <button
            type="button"
            onClick={() => {
              clearStoredAdminToken();
              setToken(null);
            }}
            className="text-sm text-slate-400 hover:text-slate-100"
          >
            Log out
          </button>
        </div>

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <div className="mb-8">
          {showNewForm ? (
            <ProjectForm
              submitLabel="Create project"
              onCancel={() => setShowNewForm(false)}
              onSubmit={async (input) => {
                try {
                  await createProject(input, token);
                  setShowNewForm(false);
                  refetch();
                } catch (err) {
                  if (err instanceof AdminAuthError) {
                    handleAuthFailure();
                    return;
                  }
                  throw err;
                }
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowNewForm(true)}
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
            >
              + New project
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {projects.map((project) =>
            editingId === project.id ? (
              <ProjectForm
                key={project.id}
                initial={project}
                submitLabel="Save changes"
                onCancel={() => setEditingId(null)}
                onSubmit={async (input) => {
                  try {
                    await updateProject(project.id, input, token);
                    setEditingId(null);
                    refetch();
                  } catch (err) {
                    if (err instanceof AdminAuthError) {
                      handleAuthFailure();
                      return;
                    }
                    throw err;
                  }
                }}
              />
            ) : (
              <AdminProjectRow
                key={project.id}
                project={project}
                onEdit={() => setEditingId(project.id)}
                onDelete={async () => {
                  if (!confirm(`Delete "${project.title}"?`)) return;
                  try {
                    await deleteProject(project.id, token);
                    refetch();
                  } catch (err) {
                    if (err instanceof AdminAuthError) {
                      handleAuthFailure();
                      return;
                    }
                    throw err;
                  }
                }}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function AdminProjectRow({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div>
        <p className="font-medium text-slate-100">
          {project.title}
          {project.featured && (
            <span className="ml-2 rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300">
              Featured
            </span>
          )}
        </p>
        <p className="text-sm text-slate-500">{project.description}</p>
      </div>
      <div className="flex shrink-0 gap-3 text-sm">
        <button type="button" onClick={onEdit} className="text-indigo-400 hover:text-indigo-300">
          Edit
        </button>
        <button type="button" onClick={onDelete} className="text-red-400 hover:text-red-300">
          Delete
        </button>
      </div>
    </div>
  );
}
