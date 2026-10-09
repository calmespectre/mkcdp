import { useEffect, useRef, useState } from "react";

const AUTH_API = import.meta.env?.VITE_API_URL || "http://127.0.0.1:8000/api/auth";
const PUBLICATIONS_API = AUTH_API.replace(/\/auth\/?$/, "") + "/publications";

const CATEGORIES = [
  { id: "annual-report", label: "Annual Report" },
  { id: "financial-statement", label: "Financial Statement" },
  { id: "strategic-plan", label: "Strategic Plan" },
  { id: "impact-report", label: "Impact Report" },
  { id: "newsletter", label: "Newsletter" },
  { id: "policy", label: "Policy Document" },
  { id: "other", label: "Other" },
];

function formatBytes(n) {
  if (!n || n <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = n;
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i += 1;
  }
  return `${i === 0 ? size.toFixed(0) : size.toFixed(1)} ${units[i]}`;
}

function StatTile({ value, label, accent = "text-green-700" }) {
  return (
    <div className="rounded-2xl border border-green-700/12 bg-white/70 px-5 py-4">
      <p className={`hero-serif text-[1.6rem] font-bold leading-none ${accent}`}>{value}</p>
      <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/75">
        {label}
      </p>
    </div>
  );
}

function Field({ id, label, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={`w-full rounded-xl border bg-white px-4 py-3.5 text-[0.9rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:ring-2 ${
          error
            ? "border-[#E2703A]/60 focus:border-[#E2703A] focus:ring-[#E2703A]/20"
            : "border-green-700/15 focus:border-green-700 focus:ring-green-700/15"
        }`}
      />
      {error && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{error}</p>}
    </div>
  );
}

export default function AdminPublicationsPanel({ authedFetch }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    category: "annual-report",
    year: new Date().getFullYear(),
    description: "",
    published: true,
    file: null,
  });
  const [formErrors, setFormErrors] = useState({});

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authedFetch(`${PUBLICATIONS_API}/`);
      if (!res.ok) throw new Error("Could not load publications.");
      const data = await res.json();
      setItems(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      setError(err?.message || "Could not load publications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      category: "annual-report",
      year: new Date().getFullYear(),
      description: "",
      published: true,
      file: null,
    });
    setFormErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const pickFile = (file) => {
    if (!file) return;
    setForm((f) => ({ ...f, file }));
    setFormErrors((e) => ({ ...e, file: undefined }));
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    pickFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    pickFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (!form.file) next.file = "Please attach a file.";
    setFormErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setNotice(null);

    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("category", form.category);
      if (form.year) fd.append("year", String(form.year));
      fd.append("description", form.description.trim());
      fd.append("published", form.published ? "true" : "false");
      fd.append("file", form.file);

      const res = await authedFetch(`${PUBLICATIONS_API}/`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        let body = null;
        try {
          body = await res.json();
        } catch {}
        const firstError =
          body?.detail ||
          (body && typeof body === "object"
            ? Object.values(body).flat().find((v) => typeof v === "string")
            : null) ||
          "Could not save. Please try again.";
        setNotice({ type: "error", text: firstError });
        return;
      }

      const saved = await res.json();
      setItems((prev) => [saved, ...prev]);
      setNotice({ type: "success", text: `“${saved.title}” was published.` });
      resetForm();
      setShowForm(false);
      window.setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      setNotice({ type: "error", text: err?.message || "Network error." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    try {
      const res = await authedFetch(`${PUBLICATIONS_API}/${item.id}/`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        setNotice({ type: "error", text: "Could not delete." });
        return;
      }
      setItems((prev) => prev.filter((p) => p.id !== item.id));
      setNotice({ type: "success", text: `“${item.title}” was removed.` });
      window.setTimeout(() => setNotice(null), 3000);
    } catch {
      setNotice({ type: "error", text: "Network error." });
    }
  };

  const togglePublished = async (item) => {
    try {
      const res = await authedFetch(`${PUBLICATIONS_API}/${item.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !item.published }),
      });
      if (!res.ok) {
        setNotice({ type: "error", text: "Could not update." });
        return;
      }
      const updated = await res.json();
      setItems((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch {
      setNotice({ type: "error", text: "Network error." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile value={items.length} label="Total publications" />
        <StatTile
          value={items.filter((i) => i.published).length}
          label="Published"
        />
        <StatTile
          value={items.filter((i) => !i.published).length}
          label="Drafts"
          accent="text-[#8a5a00]"
        />
      </div>

      <section className="rounded-3xl border border-green-700/12 bg-white/70 p-6 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.35)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-[560px]">
            <h2 className="hero-serif text-[1.35rem] font-bold leading-tight text-[#111111] sm:text-[1.5rem]">
              Publications library
            </h2>
            <p className="mt-2 text-[0.88rem] leading-[1.75] text-[#4A4A42]">
              Upload a PDF , excel, word, powerpoint, text or image file to the publications library. You can also add a title, category, year and description for each publication.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowForm((v) => !v);
              setNotice(null);
            }}
            className={`inline-flex flex-shrink-0 items-center justify-center rounded-xl px-5 py-3 text-[0.74rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${
              showForm
                ? "border border-green-700/20 text-green-700 hover:bg-green-700/6"
                : "bg-green-700 text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] hover:-translate-y-0.5 hover:bg-[#15543A]"
            }`}
          >
            {showForm ? "Cancel" : "Upload new"}
          </button>
        </div>

        {notice && (
          <div
            className={`mt-5 rounded-xl border px-4 py-3 text-[0.82rem] font-semibold ${
              notice.type === "error"
                ? "border-[#E2703A]/30 bg-[#E2703A]/8 text-[#8a3a12]"
                : "border-green-700/15 bg-green-700/6 text-green-700"
            }`}
          >
            {notice.text}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                id="pub-title"
                label="Title"
                placeholder="e.g. Annual Report 2024"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                error={formErrors.title}
              />

              <div>
                <label htmlFor="pub-category" className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                  Category
                </label>
                <select
                  id="pub-category"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full rounded-xl border border-green-700/15 bg-white px-4 py-3.5 text-[0.9rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                id="pub-year"
                label="Year"
                type="number"
                min="1976"
                max="2100"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              />

              <label htmlFor="pub-published" className="mt-6 flex cursor-pointer items-center gap-3 rounded-xl border border-green-700/12 bg-white/55 px-4 py-3 transition-colors duration-200 hover:border-green-700/25 hover:bg-white/85">
                <input
                  id="pub-published"
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                  className="h-4 w-4 accent-green-700"
                />
                <span className="text-[0.85rem] font-semibold text-[#111111]">
                  Publish immediately
                </span>
              </label>
            </div>

            <div>
              <label htmlFor="pub-desc" className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                Description (optional)
              </label>
              <textarea
                id="pub-desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="A short summary for the publications page."
                className="w-full resize-none rounded-xl border border-green-700/15 bg-white px-4 py-3.5 text-[0.9rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
              />
            </div>

            <div>
              <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                File
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-green-700 bg-green-700/6"
                    : formErrors.file
                    ? "border-[#E2703A]/50 bg-white"
                    : "border-green-700/25 bg-white/60 hover:border-green-700/50 hover:bg-white/85"
                }`}
              >
                <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-green-700/8 text-green-700">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 4v12" />
                    <path d="m7 9 5-5 5 5" />
                    <path d="M4 20h16" />
                  </svg>
                </span>
                {form.file ? (
                  <>
                    <p className="text-[0.9rem] font-semibold text-[#111111]">
                      {form.file.name}
                    </p>
                    <p className="mt-1 text-[0.78rem] text-[#4A4A42]/75">
                      {formatBytes(form.file.size)} · click to replace
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[0.92rem] font-semibold text-[#111111]">
                      Drop a file here, or click to browse
                    </p>
                    <p className="mt-1 text-[0.78rem] text-[#4A4A42]/75">
                      PDF, Word, Excel, PowerPoint, text, or image · up to 50 MB
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.png,.jpg,.jpeg,.webp,.gif"
                  onChange={onFileChange}
                  className="hidden"
                />
              </div>
              {formErrors.file && (
                <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                  {formErrors.file}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-4 border-t border-green-700/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[0.75rem] leading-[1.6] text-[#4A4A42]/80">
                Only superusers can upload or remove publications.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-xl bg-green-700 px-8 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Uploading…
                  </>
                ) : (
                  "Publish publication"
                )}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="rounded-3xl border border-green-700/12 bg-white/70 p-6 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.35)] sm:p-8">
        <h2 className="hero-serif text-[1.35rem] font-bold leading-tight text-[#111111] sm:text-[1.5rem]">
          All publications
        </h2>

        {loading && (
          <div className="flex items-center gap-3 py-10">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-700/20 border-t-green-700" />
            <p className="text-[0.9rem] text-[#4A4A42]">Loading…</p>
          </div>
        )}

        {!loading && error && (
          <p className="py-6 text-[0.9rem] font-medium text-[#E2703A]">{error}</p>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-green-700/25 bg-white/50 p-8 text-center">
            <p className="text-[0.9rem] text-[#4A4A42]">
              No publications yet. Use <span className="font-semibold text-green-700">Upload new</span> to add the first one.
            </p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <ul className="mt-6 divide-y divide-green-700/10 overflow-hidden rounded-2xl border border-green-700/12">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-4 bg-white/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-[0.95rem] font-semibold text-[#111111]">
                      {item.title}
                    </p>
                    {!item.published && (
                      <span className="rounded-full bg-[#8a5a00]/15 px-2.5 py-0.5 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[#8a5a00]">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-[0.78rem] text-[#4A4A42]/85">
                    {item.category_label || item.category} · {item.year || "—"} · {(item.file_type || "").toUpperCase()}{" "}
                    {item.file_size_display ? `· ${item.file_size_display}` : ""}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-green-700/20 px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-200 hover:bg-green-700/6"
                  >
                    View
                  </a>
                  <button
                    type="button"
                    onClick={() => togglePublished(item)}
                    className="rounded-lg border border-green-700/20 px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-200 hover:bg-green-700/6"
                  >
                    {item.published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="rounded-lg border border-[#E2703A]/30 px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#E2703A] transition-all duration-200 hover:bg-[#E2703A]/10"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}