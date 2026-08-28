import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NavBar } from "../components/NavBar";

interface MiscItem {
  slug: string;
  title: string;
  description: string;
}

export function MiscItemsPage() {
  const [items, setItems] = useState<MiscItem[]>([]);

  useEffect(() => {
    fetch("/lab/manifest.json")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, []);

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

        <h1 className="mb-4 text-3xl font-bold text-slate-50">Misc. Items</h1>
        <p className="mb-8 text-sm text-slate-500">
          A corner for minigames and other fun experiments.
        </p>

        {items.length === 0 && (
          <p className="text-sm text-slate-500">Nothing here yet — check back soon.</p>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <a
              key={item.slug}
              href={`/lab/${item.slug}/`}
              className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700"
            >
              <h3 className="text-lg font-semibold text-slate-50">{item.title}</h3>
              {item.description && <p className="text-sm text-slate-400">{item.description}</p>}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
