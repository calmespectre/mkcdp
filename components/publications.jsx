import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useEditor, EditableText } from "./editorContext";
import { useAuth } from "./AuthContext";

const AUTH_API = import.meta.env?.VITE_API_URL || "http://127.0.0.1:8000/api/auth";
const PUBLICATIONS_API = AUTH_API.replace(/\/auth\/?$/, "") + "/publications";

const ICONS = {
  pdf: "📄",
  doc: "📝",
  docx: "📝",
  xls: "📊",
  xlsx: "📊",
  ppt: "📽️",
  pptx: "📽️",
  csv: "🧾",
  txt: "📄",
  png: "🖼️",
  jpg: "🖼️",
  jpeg: "🖼️",
  webp: "🖼️",
  gif: "🖼️",
};

const CATEGORIES = [
  { id: "annual-report", label: "Annual Report" },
  { id: "financial-statement", label: "Financial Statement" },
  { id: "strategic-plan", label: "Strategic Plan" },
  { id: "impact-report", label: "Impact Report" },
  { id: "newsletter", label: "Newsletter" },
  { id: "policy", label: "Policy Document" },
  { id: "other", label: "Other" },
];

function getAccessToken() {
  try {
    return localStorage.getItem("mkcdp.access");
  } catch {
    return null;
  }
}

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

function fileIcon(type) {
  if (!type) return "📁";
  return ICONS[type.toLowerCase()] || "📁";
}

async function publicGet(path) {
  const token = getAccessToken();
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${PUBLICATIONS_API}${path}`, { headers });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data };
}

async function authPost(path, body, isMultipart = false) {
  const token = getAccessToken();
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isMultipart) headers["Content-Type"] = "application/json";
  const res = await fetch(`${PUBLICATIONS_API}${path}`, {
    method: "POST",
    headers,
    body: isMultipart ? body : JSON.stringify(body),
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data };
}

async function authPatch(path, body) {
  const token = getAccessToken();
  const res = await fetch(`${PUBLICATIONS_API}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { ok: res.ok, status: res.status, data };
}

async function authDelete(path) {
  const token = getAccessToken();
  const res = await fetch(`${PUBLICATIONS_API}${path}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return { ok: res.ok, status: res.status };
}

function Notice({ notice, onClose }) {
  if (!notice) return null;
  return (
    <div
      className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-[0.85rem] font-medium ${
        notice.type === "error"
          ? "border-[#E2703A]/30 bg-[#E2703A]/8 text-[#8a3a12]"
          : "border-green-700/20 bg-green-700/6 text-green-700"
      }`}
    >
      <span className="flex-1">{notice.text}</span>
      <button
        type="button"
        onClick={onClose}
        className="flex-shrink-0 text-[0.7rem] font-bold uppercase tracking-[0.14em] opacity-70 hover:opacity-100"
      >
        Dismiss
      </button>
    </div>
  );
}

function UploadPanel({ onUploaded, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    category: "annual-report",
    year: new Date().getFullYear(),
    description: "",
    published: true,
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const change = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const pickFile = (file) => {
    if (!file) return;
    setForm((f) => ({ ...f, file }));
    setErrors((e) => ({ ...e, file: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (!form.file) next.file = "Please attach a file.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("category", form.category);
      if (form.year) fd.append("year", String(form.year));
      fd.append("description", form.description.trim());
      fd.append("published", form.published ? "true" : "false");
      fd.append("file", form.file);

      const { ok, data } = await authPost("/", fd, true);
      if (!ok) {
        const first =
          data?.detail ||
          (data && typeof data === "object"
            ? Object.values(data).flat().find((v) => typeof v === "string")
            : null) ||
          "Could not save the publication.";
        setErrors({ _form: first });
        return;
      }
      onUploaded?.(data);
    } catch {
      setErrors({ _form: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      className="mb-8 rounded-3xl border border-green-700/15 bg-white/85 p-5 shadow-[0_28px_70px_-46px_rgba(20,83,45,0.5)] sm:p-7"
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-[560px]">
          <span className="inline-flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-green-700">
            <span className="h-px w-6 bg-green-700" />
            Superuser
          </span>
          <h3 className="hero-serif mt-3 text-[1.15rem] font-bold leading-tight text-[#111111] sm:text-[1.3rem]">
            Upload a new publication
          </h3>
          <p className="mt-1.5 text-[0.85rem] leading-[1.7] text-[#4A4A42]">
            PDF, Word, Excel, PowerPoint, text, or image. Published files appear here immediately.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex flex-shrink-0 items-center justify-center rounded-xl border border-green-700/20 px-4 py-2.5 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-200 hover:bg-green-700/6"
        >
          Cancel
        </button>
      </div>

      {errors._form && (
        <div className="mb-5 rounded-xl border border-[#E2703A]/30 bg-[#E2703A]/8 px-4 py-3 text-[0.82rem] font-semibold text-[#8a3a12]">
          {errors._form}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={change("title")}
            placeholder="e.g. Annual Report 2024"
            className={`w-full rounded-xl border bg-white px-4 py-3.5 text-[0.9rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:ring-2 ${
              errors.title
                ? "border-[#E2703A]/60 focus:border-[#E2703A] focus:ring-[#E2703A]/20"
                : "border-green-700/15 focus:border-green-700 focus:ring-green-700/15"
            }`}
          />
          {errors.title && (
            <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
            Category
          </label>
          <select
            value={form.category}
            onChange={change("category")}
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

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
            Year
          </label>
          <input
            type="number"
            min="1976"
            max="2100"
            value={form.year}
            onChange={change("year")}
            className="w-full rounded-xl border border-green-700/15 bg-white px-4 py-3.5 text-[0.9rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
          />
        </div>

        <label className="mt-6 flex cursor-pointer items-center gap-3 rounded-xl border border-green-700/12 bg-white/55 px-4 py-3 transition-colors duration-200 hover:border-green-700/25 hover:bg-white/85">
          <input
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

      <div className="mt-5">
        <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
          Description (optional)
        </label>
        <textarea
          value={form.description}
          onChange={change("description")}
          rows={3}
          placeholder="A short summary for the publications page."
          className="w-full resize-none rounded-xl border border-green-700/15 bg-white px-4 py-3.5 text-[0.9rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
        />
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
          File
        </label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            pickFile(e.dataTransfer?.files?.[0]);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200 ${
            dragActive
              ? "border-green-700 bg-green-700/6"
              : errors.file
              ? "border-[#E2703A]/50 bg-white"
              : "border-green-700/25 bg-white/60 hover:border-green-700/50 hover:bg-white/85"
          }`}
        >
          <span className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-green-700/8 text-green-700">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v12" />
              <path d="m7 9 5-5 5 5" />
              <path d="M4 20h16" />
            </svg>
          </span>
          {form.file ? (
            <>
              <p className="text-[0.9rem] font-semibold text-[#111111]">{form.file.name}</p>
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
            onChange={(e) => pickFile(e.target.files?.[0])}
            className="hidden"
          />
        </div>
        {errors.file && (
          <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.file}</p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-green-700/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
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
  );
}

function PublicationCard({ pub, isSuperuser, onDelete, onTogglePublish }) {
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete “${pub.title}”? This cannot be undone.`)) return;
    setBusy(true);
    await onDelete(pub);
    setBusy(false);
  };

  const handleToggle = async () => {
    setBusy(true);
    await onTogglePublish(pub);
    setBusy(false);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-green-700/12 bg-white/80 p-5 shadow-[0_20px_50px_-40px_rgba(20,83,45,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-green-700/30 hover:shadow-[0_28px_60px_-40px_rgba(20,83,45,0.55)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-green-700/8 text-[1.6rem] leading-none">
          {fileIcon(pub.file_type)}
        </span>
        <div className="flex items-center gap-2">
          {isSuperuser && !pub.published && (
            <span className="rounded-full bg-[#8a5a00]/15 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[#8a5a00]">
              Draft
            </span>
          )}
          {pub.year && (
            <span className="rounded-full bg-green-700/8 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-green-700">
              {pub.year}
            </span>
          )}
        </div>
      </div>

      <h3 className="hero-serif mt-5 text-[1.15rem] font-bold leading-tight text-[#111111] sm:text-[1.25rem]">
        {pub.title}
      </h3>

      <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#F2B33D]/15 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#8a5a00]">
        {pub.category_label || pub.category}
      </span>

      {pub.description && (
        <p className="mt-4 flex-1 text-[0.88rem] leading-[1.75] text-[#4A4A42]">
          {pub.description}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-green-700/12 pt-4 text-[0.7rem] text-[#4A4A42]/80">
        <span className="truncate font-semibold uppercase tracking-[0.12em]">
          {(pub.file_type || "FILE").toUpperCase()}
        </span>
        <span>{pub.file_size_display || formatBytes(pub.file_size)}</span>
      </div>

      <a
        href={pub.file_url}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-[#15543A] active:scale-[0.99]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M4 20h16" />
        </svg>
        Download
      </a>

      {isSuperuser && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={handleToggle}
            disabled={busy}
            className="flex-1 rounded-lg border border-green-700/20 px-3 py-2 text-[0.66rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-200 hover:bg-green-700/6 disabled:opacity-50"
          >
            {pub.published ? "Unpublish" : "Publish"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="flex-1 rounded-lg border border-[#E2703A]/30 px-3 py-2 text-[0.66rem] font-bold uppercase tracking-[0.1em] text-[#E2703A] transition-all duration-200 hover:bg-[#E2703A]/10 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      )}
    </article>
  );
}

export default function Publications() {
  const { isSuperuser } = useAuth();
  const { isEditing } = useEditor();

  const [data, setData] = useState({ results: [], categories: [], years: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState("all");
  const [query, setQuery] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [notice, setNotice] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const { ok, data: payload } = await publicGet("/");
    if (ok && payload) {
      setData({
        results: Array.isArray(payload.results) ? payload.results : [],
        categories: Array.isArray(payload.categories) ? payload.categories : [],
        years: Array.isArray(payload.years) ? payload.years : [],
      });
    } else {
      setError("Could not load publications.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUploaded = (saved) => {
    if (saved) {
      setData((prev) => ({
        ...prev,
        results: [saved, ...prev.results],
      }));
      setNotice({ type: "success", text: `“${saved.title}” was published.` });
    } else {
      setNotice({ type: "success", text: "Publication uploaded." });
      load();
    }
    setShowUpload(false);
    window.setTimeout(() => setNotice(null), 4000);
  };

  const handleDelete = async (pub) => {
    const { ok, status } = await authDelete(`/${pub.id}/`);
    if (!ok && status !== 204) {
      setNotice({ type: "error", text: "Could not delete the publication." });
      return;
    }
    setData((prev) => ({ ...prev, results: prev.results.filter((p) => p.id !== pub.id) }));
    setNotice({ type: "success", text: `“${pub.title}” was removed.` });
    window.setTimeout(() => setNotice(null), 3000);
  };

  const handleTogglePublish = async (pub) => {
    const { ok, data: updated } = await authPatch(`/${pub.id}/`, { published: !pub.published });
    if (!ok || !updated) {
      setNotice({ type: "error", text: "Could not update the publication." });
      return;
    }
    setData((prev) => ({
      ...prev,
      results: prev.results.map((p) => (p.id === updated.id ? updated : p)),
    }));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.results.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (year !== "all" && String(p.year) !== String(year)) return false;
      if (q) {
        const hay = `${p.title || ""} ${p.description || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [data.results, category, year, query]);

  const grouped = useMemo(() => {
    const byYear = new Map();
    filtered.forEach((p) => {
      const key = p.year || "Undated";
      if (!byYear.has(key)) byYear.set(key, []);
      byYear.get(key).push(p);
    });
    return Array.from(byYear.entries()).sort((a, b) => {
      if (a[0] === "Undated") return 1;
      if (b[0] === "Undated") return -1;
      return Number(b[0]) - Number(a[0]);
    });
  }, [filtered]);

  return (
    <div className="hero-sans relative min-h-screen overflow-x-hidden bg-[#FBF7F0] text-[#141414] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,600;1,700&family=Montserrat:wght@400;500;600;700;800;900&display=swap');
        .hero-serif { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
        .hero-sans { font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        ::selection { background: #14532D; color: #FBF7F0; }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(20,83,45,0.06) 0px, rgba(20,83,45,0.06) 1px, transparent 1px, transparent 22px)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)",
        }}
      />

      <section className="relative overflow-hidden pt-12 sm:pt-16 lg:pt-24">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 items-end gap-8 sm:gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-green-700">
                <span className="h-px w-8 bg-green-700" />
                <EditableText id="publications.hero.eyebrow" defaultValue="Publications" />
              </span>
              <EditableText
                as="h1"
                id="publications.hero.title"
                defaultValue={"Reports, plans\nand the record\nof our work."}
                multiline
                className="hero-serif block whitespace-pre-line text-[clamp(2rem,8vw,4.4rem)] font-bold leading-[1.05] tracking-[-0.022em] text-[#111111]"
              />
            </div>
            <div className="lg:pb-3">
              <EditableText
                as="p"
                id="publications.hero.intro"
                defaultValue="Annual reports, audited financial statements, strategic plans and impact summaries — everything we publish, in one place. Download any file below."
                multiline
                className="block max-w-[520px] text-[0.98rem] leading-[1.85] text-[#3D3D37] sm:text-[1.0625rem]"
              />
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(20,83,45,0.09) 0px, rgba(20,83,45,0.09) 1px, transparent 1px, transparent 22px)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, #000 40%, #000 65%, transparent)",
            maskImage:
              "linear-gradient(to bottom, transparent, #000 40%, #000 65%, transparent)",
          }}
        />
      </section>

      <section className="relative py-10 sm:py-14 lg:py-20">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-14">
          {isSuperuser && (
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
              <button
                type="button"
                onClick={() => {
                  setShowUpload((v) => !v);
                  setNotice(null);
                }}
                className={`inline-flex flex-shrink-0 items-center justify-center rounded-xl px-5 py-3 text-[0.74rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${
                  showUpload
                    ? "border border-green-700/20 text-green-700 hover:bg-green-700/6"
                    : "bg-green-700 text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] hover:-translate-y-0.5 hover:bg-[#15543A]"
                }`}
              >
                {showUpload ? "Cancel" : "Upload new"}
              </button>
            </div>
          )}

          <Notice notice={notice} onClose={() => setNotice(null)} />

          {isSuperuser && showUpload && (
            <UploadPanel
              onUploaded={handleUploaded}
              onCancel={() => setShowUpload(false)}
            />
          )}

          <div className="mb-8 grid grid-cols-1 gap-4 sm:mb-10 sm:grid-cols-[1fr_auto_auto] sm:items-end sm:gap-5">
            <div>
              <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                <EditableText id="publications.filters.searchLabel" defaultValue="Search" />
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20.5 20.5-4-4" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title or description…"
                  className="w-full rounded-xl border border-green-700/15 bg-white py-3.5 pl-11 pr-4 text-[0.9rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
                />
              </div>
            </div>

            <div className="w-full sm:w-[220px]">
              <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                <EditableText id="publications.filters.categoryLabel" defaultValue="Category" />
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-green-700/15 bg-white px-4 py-3.5 text-[0.9rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
              >
                <option value="all">All categories</option>
                {data.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-[160px]">
              <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                <EditableText id="publications.filters.yearLabel" defaultValue="Year" />
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-xl border border-green-700/15 bg-white px-4 py-3.5 text-[0.9rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
              >
                <option value="all">All years</option>
                {data.years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-3 py-16">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-green-700/20 border-t-green-700" />
              <p className="text-[0.9rem] text-[#4A4A42]">Loading publications…</p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-3xl border border-dashed border-[#E2703A]/30 bg-white/50 p-10 text-center">
              <p className="text-[0.95rem] font-medium text-[#E2703A]">{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="rounded-3xl border border-dashed border-green-700/25 bg-white/50 p-12 text-center">
              <EditableText
                as="p"
                id="publications.empty.title"
                defaultValue="No publications match your filters."
                className="hero-serif block text-[1.3rem] font-bold text-[#111111]"
              />
              <EditableText
                as="p"
                id="publications.empty.body"
                defaultValue="Try clearing the search or choosing a different category."
                className="mt-2 block text-[0.9rem] text-[#4A4A42]"
              />
              <button
                type="button"
                onClick={() => {
                  setCategory("all");
                  setYear("all");
                  setQuery("");
                }}
                className="mt-6 inline-flex items-center rounded-xl border border-green-700/20 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-200 hover:bg-green-700/6"
              >
                <EditableText id="publications.empty.cta" defaultValue="Clear filters" />
              </button>
            </div>
          )}

          {!loading && !error && grouped.map(([groupYear, items]) => (
            <section key={groupYear} className="mb-14 last:mb-0">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-green-700/15 pb-4">
                <div className="flex items-center gap-4">
                  <span className="hero-serif text-[2rem] font-bold leading-none text-[#111111] sm:text-[2.4rem]">
                    {groupYear}
                  </span>
                  <span className="h-px w-10 bg-green-700/40" />
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#4A4A42]/70">
                    {items.length} {items.length === 1 ? "document" : "documents"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((pub) => (
                  <PublicationCard
                    key={pub.id}
                    pub={pub}
                    isSuperuser={isSuperuser}
                    onDelete={handleDelete}
                    onTogglePublish={handleTogglePublish}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-green-700">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(251,247,240,0.09) 0px, rgba(251,247,240,0.09) 1px, transparent 1px, transparent 22px)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)",
            maskImage:
              "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)",
          }}
        />
        <div className="relative mx-auto max-w-[1360px] px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
                <span className="h-px w-8 bg-[#F2B33D]" />
                <EditableText id="publications.contact.eyebrow" defaultValue="Questions about a report?" />
              </span>
              <EditableText
                as="h2"
                id="publications.contact.title"
                defaultValue="Every figure has a person behind it."
                className="hero-serif block text-[clamp(1.6rem,5vw,2.6rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#FBF7F0]"
              />
              <EditableText
                as="p"
                id="publications.contact.body"
                defaultValue="If you would like a deeper dive into any report, or a specific year's numbers broken down by programme, our team will be glad to walk you through it."
                multiline
                className="mt-5 block max-w-[520px] text-[0.95rem] leading-[1.85] text-[#FBF7F0]/70 sm:text-[1rem]"
              />
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <a
                href="mailto:info@mkcdp.org"
                className={`group inline-flex w-fit items-center gap-3 rounded-xl bg-[#FBF7F0] px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white ${
                  isEditing ? "pointer-events-none" : ""
                }`}
              >
                <EditableText id="publications.contact.email" defaultValue="info@mkcdp.org" />
                <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <Link
                to="/about/accountability"
                className={`inline-flex w-fit items-center gap-3 rounded-xl border border-[#FBF7F0]/30 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[#FBF7F0] transition-all duration-300 hover:bg-[#FBF7F0] hover:text-green-700 ${
                  isEditing ? "pointer-events-none" : ""
                }`}
              >
                <EditableText id="publications.contact.accountability" defaultValue="Our accountability promise" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}