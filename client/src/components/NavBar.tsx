import { useState } from "react";
import { Link } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-50">
          <span className="text-indigo-400">{"</>"}</span>
          William de Keizer
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 sm:flex">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-slate-50">
              {link.label}
            </Link>
          ))}
          <a href="/#contact" className="hover:text-slate-50">
            Contact
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-slate-300 sm:hidden"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-slate-800 px-6 py-3 sm:hidden">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="py-2 text-sm text-slate-300 hover:text-slate-50"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="/#contact"
            onClick={() => setOpen(false)}
            className="py-2 text-sm text-slate-300 hover:text-slate-50"
          >
            Contact
          </a>
        </nav>
      )}
    </header>
  );
}
