import { useState } from "react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#home" className="flex items-center gap-2 text-lg font-semibold text-slate-50">
          <span className="text-indigo-400">{"</>"}</span>
          William de Keizer
        </a>

        <nav className="hidden items-center gap-8 text-sm text-slate-300 sm:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-slate-50">
              {link.label}
            </a>
          ))}
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
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm text-slate-300 hover:text-slate-50"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
