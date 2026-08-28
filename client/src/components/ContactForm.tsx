import { useState } from "react";
import { apiUrl } from "../lib/api";

type Status = "idle" | "submitting" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("submitting");
    try {
      const res = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <p className="text-sm text-emerald-400">Thanks — I&apos;ll get back to you soon.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-3">
      <input
        name="name"
        type="text"
        required
        placeholder="Name"
        className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Email"
        className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
      />
      <textarea
        name="message"
        required
        rows={4}
        placeholder="Message"
        className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-fit rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-400">Something went wrong — try again.</p>
      )}
    </form>
  );
}
