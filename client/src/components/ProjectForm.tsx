import { useState } from "react";
import type { ProjectInput } from "../lib/api";
import type { Project } from "../types";

const inputClass =
  "w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none";

export function ProjectForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Project;
  submitLabel: string;
  onSubmit: (input: ProjectInput) => Promise<void>;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [repoUrl, setRepoUrl] = useState(initial?.repoUrl ?? "");
  const [liveUrl, setLiveUrl] = useState(initial?.liveUrl ?? "");
  const [tags, setTags] = useState(initial?.tags.join(", ") ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        title,
        description,
        repoUrl: repoUrl.trim() || undefined,
        liveUrl: liveUrl.trim() || undefined,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        featured,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        maxLength={200}
        className={inputClass}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
        rows={3}
        maxLength={2000}
        className={inputClass}
      />
      <input
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder="Repo URL (optional)"
        type="url"
        className={inputClass}
      />
      <input
        value={liveUrl}
        onChange={(e) => setLiveUrl(e.target.value)}
        placeholder="Live URL (optional)"
        type="url"
        className={inputClass}
      />
      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags, comma separated"
        className={inputClass}
      />
      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-slate-700 bg-slate-900"
        />
        Featured
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-50"
        >
          {submitting ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-100"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
