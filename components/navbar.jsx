import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useGiftCart, countCartItems } from "./giftCart";

const Icon = {
  Mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  ),
  Phone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5Z" />
    </svg>
  ),
  MapPin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  Menu: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
  Close: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  ChevronRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  ),
  ChevronDown: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  User: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M4.5 20c.9-3.8 3.8-6 7.5-6s6.6 2.2 7.5 6" />
    </svg>
  ),
  Heart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" />
    </svg>
  ),
  Gift: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3.5 10h17l-1.4 8.2a2 2 0 0 1-2 1.8H6.9a2 2 0 0 1-2-1.8L3.5 10Z" />
      <path d="M8.5 10V7a3.5 3.5 0 0 1 7 0v3" />
      <path d="M9.5 13.5v3" />
      <path d="M12 13.5v3" />
      <path d="M14.5 13.5v3" />
    </svg>
  ),
  Basket: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4.5 10h15l-1.3 8.4a2 2 0 0 1-2 1.6H7.8a2 2 0 0 1-2-1.6L4.5 10Z" />
      <path d="M9 10 12 4l3 6" />
      <path d="M9.5 14v3" />
      <path d="M14.5 14v3" />
    </svg>
  ),
  Search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20.5 20.5-4-4" />
    </svg>
  ),
  ArrowUpRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  ),
  Facebook: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.24-1.46 1.5-1.46h1.6V4.4A21 21 0 0 0 14.3 4.3c-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.4V21z" />
    </svg>
  ),
  Twitter: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.1L4.7 21H1.5l7.5-8.5L1.2 3h6.5l4.5 5.6zM16.4 19.2h1.8L7.7 4.7H5.8z" />
    </svg>
  ),
  LinkedIn: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z" />
    </svg>
  ),
  YouTube: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M23 12s0-3.9-.5-5.8a3 3 0 0 0-2.1-2.1C18.5 3.5 12 3.5 12 3.5s-6.5 0-8.4.6A3 3 0 0 0 1.5 6.2C1 8.1 1 12 1 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 8.4.6 8.4.6s6.5 0 8.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8M9.75 15.5v-7l6 3.5z" />
    </svg>
  ),
};

const NAV_LINKS = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Who We Are", slug: "who-we-are", href: "/about/who-we-are" },
      { label: "Our Strategic Plan", slug: "strategic-plan", href: "/about/strategic-plan" },
      { label: "Accountability", slug: "accountability", href: "/about/accountability" },
      { label: "Safeguarding", slug: "safeguarding", href: "/about/safeguarding" },
      { label: "Our Leadership", slug: "leadership", href: "/about/leadership" },
      { label: "Our Development Partners", slug: "partners", href: "/about/partners" },
    ],
  },
  {
    label: "Our Work",
    href: "/our-work",
    children: [
      { label: "Where We Work", href: "/our-work/where-we-work" },
      { label: "How We Work", href: "/our-work/how-we-work" },
    ],
  },
  {
    label: "Program Impact",
    href: "/program-impact",
    children: [
      { label: "Our Reach", href: "/program-impact/our-reach" },
      { label: "Featured Projects", href: "/program-impact/featured-projects" },
    ],
  },
  {
    label: "News & Stories",
    href: "/news-and-stories",
    children: [
      { label: "Stories of Impact", href: "/news-and-stories/stories-of-impact" },
      { label: "Media Center", href: "/news-and-stories/media-center" },
    ],
  },
  {
    label: "Take Action",
    href: "/take-action",
    children: [
      { label: "Sponsor a Child", href: "/take-action/sponsor-a-child" },
      { label: "Send a Gift", href: "/take-action/send-a-gift" },
      { label: "Donate", href: "/take-action/donate" },
      { label: "Volunteer", href: "/take-action/volunteer" },
      { label: "Partner with us", href: "/take-action/partnerships" },
      { label: "Report a Safeguarding Concern", href: "/take-action/report-safeguarding" },
    ],
  },
];

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/100095720401305/?locale=sw_KE", Icon: Icon.Facebook },
  { label: "Twitter", href: "https://twitter.com/MKCDP", Icon: Icon.Twitter },
  {
    label: "LinkedIn",
    href: "https://ke.linkedin.com/in/mt-kilimanjaro-child-development-programme-mkcdp-869933358",
    Icon: Icon.LinkedIn,
  },
  { label: "YouTube", href: "https://www.youtube.com/@MKCDPData", Icon: Icon.YouTube },
];

const CONTACT_LINES = [
  { Icon: Icon.MapPin, label: "P.O Box 249-00209 Loitokitok, Kenya" },
  { Icon: Icon.Mail, label: "info@mkcdp.org", href: "mailto:info@mkcdp.org" },
  { Icon: Icon.Phone, label: "+254 737 332 219", href: "tel:+254737332219" },
];

const SEARCH_INDEX = (() => {
  const items = [];
  items.push({
    title: "Home",
    path: "/",
    category: "Page",
    keywords: "home homepage main landing start mkcdp mount kilimanjaro",
  });
  NAV_LINKS.forEach((parent) => {
    items.push({
      title: parent.label,
      path: parent.href,
      category: "Section",
      keywords: `${parent.label} ${parent.children.map((c) => c.label).join(" ")}`.toLowerCase(),
    });
    parent.children.forEach((child) => {
      items.push({
        title: child.label,
        path: child.href,
        category: parent.label,
        keywords: `${child.label} ${parent.label}`.toLowerCase(),
      });
    });
  });
  const extras = [
    { title: "Sponsor a Child", path: "/take-action/sponsor-a-child", category: "Take Action", keywords: "sponsor child donation support give monthly" },
    { title: "Send a Gift", path: "/take-action/send-a-gift", category: "Take Action", keywords: "gift shop store merchandise buy send" },
    { title: "Basket", path: "/take-action/send-a-gift-cart", category: "Take Action", keywords: "basket cart checkout gift" },
    { title: "Donate", path: "/take-action/donate", category: "Take Action", keywords: "donate give money support fund" },
    { title: "Volunteer", path: "/take-action/volunteer", category: "Take Action", keywords: "volunteer help serve join" },
    { title: "Partner with Us", path: "/take-action/partnerships", category: "Take Action", keywords: "partner partnership collaborate corporate" },
    { title: "Report a Safeguarding Concern", path: "/take-action/report-safeguarding", category: "Take Action", keywords: "safeguarding report concern abuse child protection" },
    { title: "Sign in / Sign up", path: "/auth", category: "Account", keywords: "login signup register account auth" },
    { title: "Our Reach", path: "/program-impact/our-reach", category: "Impact", keywords: "reach impact numbers statistics beneficiaries" },
    { title: "Stories of Impact", path: "/news-and-stories/stories-of-impact", category: "News", keywords: "stories impact news testimonies success" },
    { title: "Media Center", path: "/news-and-stories/media-center", category: "News", keywords: "media press kit photos videos" },
    { title: "Loitokitok, Kenya", path: "/our-work/where-we-work", category: "Location", keywords: "loitokitok kenya kajiado location where work" },
  ];
  extras.forEach((e) => {
    if (!items.find((it) => it.title.toLowerCase() === e.title.toLowerCase() && it.path === e.path)) {
      items.push(e);
    }
  });
  return items;
})();

function Highlight({ text, query }) {
  if (!query) return <>{text}</>;
  const q = query.trim().toLowerCase();
  if (!q) return <>{text}</>;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-green-700/15 text-green-700 rounded px-0.5">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function scoreItem(item, q) {
  const query = q.toLowerCase().trim();
  if (!query) return 0;
  const title = item.title.toLowerCase();
  const keywords = (item.keywords || "").toLowerCase();
  const category = (item.category || "").toLowerCase();
  let score = 0;
  if (title === query) score += 200;
  if (title.startsWith(query)) score += 120;
  if (title.includes(query)) score += 80;
  if (keywords.includes(query)) score += 40;
  if (category.includes(query)) score += 20;
  const tokens = query.split(/\s+/).filter(Boolean);
  if (tokens.length > 1) {
    tokens.forEach((t) => {
      if (title.includes(t)) score += 15;
      if (keywords.includes(t)) score += 5;
    });
  }
  return score;
}

function SearchModal({ open, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [query, setQuery] = useState("");
  const [preloading, setPreloading] = useState(false);
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setResults([]);
    setActiveIndex(0);
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    if (!query.trim()) {
      setResults([]);
      setPreloading(false);
      return;
    }
    setPreloading(true);
    const handle = setTimeout(() => {
      const scored = SEARCH_INDEX.map((item) => ({ item, s: scoreItem(item, query) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, 8)
        .map((r) => r.item);
      setResults(scored);
      setActiveIndex(0);
      setPreloading(false);
    }, 140);
    return () => clearTimeout(handle);
  }, [query, open]);

  const handleKeyDown = (e) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[activeIndex];
      if (target) {
        onClose();
        navigate(target.path);
      }
    }
  };

  useEffect(() => {
    if (!listRef.current) return;
    const node = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
    if (node) node.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!mounted || !open) return null;

  const grouped = results.reduce((acc, item) => {
    const key = item.category || "Results";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  let runningIndex = -1;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <div
        onClick={onClose}
        aria-hidden="true"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
      />
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="relative mx-auto flex h-full w-full items-start justify-center px-3 pt-4 sm:pt-16 lg:pt-24"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl overflow-hidden rounded-2xl border border-green-700/10 bg-[#FBF7F0] shadow-[0_40px_80px_-30px_rgba(20,20,20,0.5)] animate-[popIn_180ms_cubic-bezier(0.22,1,0.36,1)]"
        >
          <div className="flex items-center gap-3 border-b border-green-700/10 px-4 py-3 sm:px-5 sm:py-4">
            <Icon.Search className="h-5 w-5 flex-shrink-0 text-green-700" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search pages, projects, stories..."
              className="flex-1 bg-transparent text-base text-[#2A2A26] placeholder-[#2A2A26]/40 outline-none"
              autoComplete="off"
              spellCheck="false"
            />
            {preloading && (
              <span className="h-4 w-4 flex-shrink-0 animate-spin rounded-full border-2 border-green-700/20 border-t-green-700" />
            )}
            {query && !preloading && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[#2A2A26]/50 transition-colors hover:bg-green-700/8 hover:text-green-700"
              >
                <Icon.Close className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="hidden flex-shrink-0 items-center gap-1 rounded-lg border border-green-700/15 px-2 py-1 text-xs font-bold uppercase tracking-wider text-[#2A2A26]/60 transition-colors hover:text-green-700 sm:inline-flex"
            >
              Esc
            </button>
          </div>

          <div ref={listRef} className="max-h-[65vh] overflow-y-auto py-2 sm:max-h-[60vh]">
            {!query.trim() && (
              <div className="px-5 py-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-green-700">
                  Suggestions
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Sponsor a Child", "Send a Gift", "Basket", "Donate", "Where We Work", "Stories of Impact", "Volunteer"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setQuery(s)}
                      className="rounded-full border border-green-700/15 px-3.5 py-1.5 text-sm font-medium text-[#2A2A26] transition-colors hover:bg-green-700/6 hover:text-green-700"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query.trim() && !preloading && results.length === 0 && (
              <div className="px-5 py-10 text-center">
                <p className="text-base font-semibold text-[#2A2A26]">No results for "{query}"</p>
                <p className="mt-1 text-sm text-[#4A4A42]">Try a different keyword, or browse the menu.</p>
              </div>
            )}

            {query.trim() && results.length > 0 && (
              <div>
                {Object.entries(grouped).map(([group, items]) => (
                  <div key={group} className="mb-1">
                    <p className="px-5 pb-1 pt-3 text-xs font-bold uppercase tracking-[0.22em] text-green-700/80">
                      {group}
                    </p>
                    {items.map((item) => {
                      runningIndex += 1;
                      const idx = runningIndex;
                      const active = idx === activeIndex;
                      return (
                        <Link
                          key={`${item.path}-${item.title}-${idx}`}
                          to={item.path}
                          data-index={idx}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={onClose}
                          className={`group flex items-center gap-3 px-5 py-2.5 transition-colors ${
                            active ? "bg-green-700/8" : "hover:bg-green-700/6"
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border ${
                              active
                                ? "border-green-700/30 bg-green-700 text-white"
                                : "border-green-700/15 text-green-700"
                            }`}
                          >
                            <Icon.Search className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-[#2A2A26] group-hover:text-green-700">
                              <Highlight text={item.title} query={query} />
                            </span>
                            <span className="block truncate text-xs text-[#4A4A42]/80">
                              {item.path}
                            </span>
                          </span>
                          <Icon.ArrowUpRight
                            className={`h-4 w-4 flex-shrink-0 transition-all ${
                              active
                                ? "text-green-700 opacity-100"
                                : "text-green-700/40 opacity-0 group-hover:opacity-100"
                            }`}
                          />
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98) }
          to { opacity: 1; transform: translateY(0) scale(1) }
        }
      `}</style>
    </div>,
    document.body
  );
}

function ContactLine({ icon: IconCmp, label, href, wrapClass = "", iconClass = "" }) {
  const inner = (
    <>
      <IconCmp className={`flex-shrink-0 ${iconClass}`} />
      <span>{label}</span>
    </>
  );
  const base = `flex items-center gap-2 transition-colors duration-200 ${wrapClass}`;

  return href ? (
    <a href={href} className={base}>
      {inner}
    </a>
  ) : (
    <span className={base}>{inner}</span>
  );
}

function MobileDrawer({ open, onClose, expanded, onToggle }) {
  const [mounted, setMounted] = useState(false);
  const { cart } = useGiftCart();
  const basketCount = countCartItems(cart);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className={`fixed inset-0 z-[9998] lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`absolute left-0 top-0 flex h-[100dvh] w-full max-w-[420px] flex-col bg-[#FBF7F0] shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-green-700/10 px-5 py-4">
          <Link to="/" onClick={onClose} className="flex items-center">
            <img src="/mkcdp.png" alt="MKCDP Logo" className="h-10 w-auto" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-green-700 transition-colors duration-200 hover:bg-green-700/8"
          >
            <Icon.Close className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => {
              const isOpen = expanded === link.label;
              return (
                <li key={link.label}>
                  <div
                    className={`flex items-stretch overflow-hidden rounded-xl transition-colors duration-200 ${
                      isOpen ? "bg-green-700/8" : "hover:bg-green-700/6"
                    }`}
                  >
                    <Link
                      to={link.href}
                      onClick={onClose}
                      className={`flex flex-1 items-center px-4 py-3.5 text-base font-semibold transition-colors duration-200 ${
                        isOpen ? "text-green-700" : "text-[#2A2A26] hover:text-green-700"
                      }`}
                    >
                      {link.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => onToggle(link.label)}
                      aria-label={`Toggle ${link.label} submenu`}
                      aria-expanded={isOpen}
                      className={`flex w-12 flex-shrink-0 items-center justify-center border-l transition-colors duration-200 ${
                        isOpen
                          ? "border-green-700/15 text-green-700"
                          : "border-green-700/10 text-[#2A2A26]/50 hover:text-green-700"
                      }`}
                    >
                      <Icon.ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="ml-4 mt-1 space-y-1 border-l-2 border-green-700/20 pl-3">
                      {link.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            to={child.href}
                            data-section={child.slug}
                            onClick={onClose}
                            className="group flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#4A4A42] transition-all duration-200 hover:bg-green-700/6 hover:text-green-700"
                          >
                            <Icon.ChevronRight className="h-3.5 w-3.5 text-green-700" />
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}

            <li>
              <Link
                to="/take-action/send-a-gift-cart"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-semibold text-[#2A2A26] transition-colors duration-200 hover:bg-green-700/6 hover:text-green-700"
              >
                <Icon.Basket className="h-5 w-5 text-green-700" />
                <span className="flex-1">Basket</span>
                {basketCount > 0 && (
                  <span className="grid h-6 min-w-[1.5rem] place-items-center rounded-full bg-[#E2703A] px-2 text-xs font-bold text-white">
                    {basketCount > 99 ? "99+" : basketCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <Link
              to="/take-action/sponsor-a-child"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-xl border border-green-700/20 px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-green-700 transition-all duration-200 hover:bg-green-700/6 active:scale-[0.98]"
            >
              Sponsor a Child
            </Link>
            <Link
              to="/take-action/donate"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-[0_16px_32px_-16px_rgba(28,107,75,0.95)] transition-all duration-200 hover:bg-[#15543A] active:scale-[0.98]"
            >
              Donate Now
            </Link>
          </div>

          <div className="mt-8 border-t border-green-700/10 pt-6">
            <Link
              to="/auth"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-xl border border-green-700/20 px-5 py-3.5 text-sm font-bold uppercase tracking-wider text-green-700 transition-all duration-200 hover:bg-green-700/6 active:scale-[0.98]"
            >
              <Icon.User className="h-4 w-4" />
              Sign in / Sign up
            </Link>
          </div>
        </div>
      </aside>
    </div>,
    document.body
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [hidden, setHidden] = useState(false);

  const { cart } = useGiftCart();
  const basketCount = countCartItems(cart);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target?.tagName || "").toLowerCase();
      const typing = tag === "input" || tag === "textarea" || e.target?.isContentEditable;
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === "/" && !typing && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const closeMenu = () => setMenuOpen(false);
  const toggleMobileDropdown = (label) =>
    setMobileDropdown((current) => (current === label ? null : label));

  const headerTranslate = menuOpen ? "" : hidden ? "-translate-y-full" : "translate-y-0";

  return (
    <header
      className={`sticky top-0 z-50 w-full font-[Montserrat] transition-transform duration-300 ease-in-out ${headerTranslate}`}
    >
      <nav className="bg-[#FBF7F0]">
        <div className="hidden border-b border-green-700/10 lg:block">
          <div className="mx-auto flex max-w-[1560px] items-center justify-center gap-2 px-2 py-2 lg:px-4">
            <div className="flex flex-wrap items-center gap-x-7 gap-y-1 text-[0.72rem] font-medium tracking-[0.02em] text-[#4A4A42]">
              {CONTACT_LINES.map((line) => (
                <ContactLine
                  key={line.label}
                  icon={line.Icon}
                  label={line.label}
                  href={line.href}
                  wrapClass="text-[#4A4A42] hover:text-green-700"
                  iconClass="h-3.5 w-3.5 text-green-700"
                />
              ))}
              <p>|</p>
              <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                title="Search (press /)"
                className="inline-flex items-start rounded-full border border-green-700/15 px-1 py-1 text-[0.7rem] text-[#4A4A42] transition-colors duration-200 hover:border-green-700/30 hover:text-green-700"
              >
                <Icon.Search className="h-5 w-auto text-green-700" />
              </button>

              <Link
                to="/take-action/send-a-gift-cart"
                aria-label={
                  basketCount
                    ? `Basket, ${basketCount} item${basketCount === 1 ? "" : "s"}`
                    : "Basket"
                }
                title="Basket"
                className="inline-flex items-center gap-1.5 text-green-700 rounded-full border border-green-700/15 px-1 py-1 transition-colors duration-200 hover:text-[#15543A]"
              >
                <span className="relative inline-flex">
                  <Icon.Basket className="h-5 w-5" />
                  {basketCount > 0 && (
                    <span className="pointer-events-none absolute -right-1.5 -top-1.5 grid h-4 min-w-[1rem] place-items-center rounded-full bg-[#E2703A] px-1 text-[0.55rem] font-bold text-white">
                      {basketCount > 99 ? "99+" : basketCount}
                    </span>
                  )}
                </span>
              </Link>
              <Link
                to="/auth"
                aria-label="Sign in or sign up"
                title="Sign in / Sign up"
                className="text-green-700 hover:text-green-700 rounded-full border border-green-700/15 px-1 py-1"
              >
                <Icon.User className="h-5 w-auto text-green-700"/>
              </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto flex max-w-[1560px] items-center gap-2 px-4 py-2 lg:px-14">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-green-700 transition-colors duration-200 hover:bg-green-700/6 lg:hidden"
          >
            <Icon.Menu className="h-6 w-6" />
          </button>

          <Link to="/" className="flex flex-shrink-0 items-center gap-3">
            <img src="/mkcdp.png" alt="MKCDP Logo" className="h-11 w-auto lg:h-12" />
          </Link>

          <ul className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center lg:flex">
            {NAV_LINKS.map((link) => {
              const open = openDropdown === link.label;
              return (
                <li
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    to={link.href}
                    className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.07em] text-[#2A2A26] transition-colors duration-200 hover:text-green-700 xl:px-3.5 xl:text-[0.78rem]"
                  >
                    <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-green-700 after:transition-all after:duration-300 hover:after:w-full">
                      {link.label}
                    </span>
                  </Link>

                  <div
                    className={`absolute left-0 top-full pt-3 transition-all duration-200 ${
                      open
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0"
                    }`}
                  >
                    <ul className="min-w-[280px] overflow-hidden rounded-2xl border border-green-700/10 bg-[#FBF7F0] py-2 shadow-[0_24px_48px_-24px_rgba(20,20,20,0.28)]">
                      {link.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            to={child.href}
                            data-section={child.slug}
                            className="group flex items-center justify-between px-5 py-2.5 text-[0.82rem] font-medium text-[#2A2A26] transition-all duration-200 hover:bg-green-700/6 hover:pl-6 hover:text-green-700"
                          >
                            <span>{child.label}</span>
                            <Icon.ChevronRight className="h-3.5 w-3.5 -translate-x-1 text-green-700 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="ml-auto flex items-center gap-1.5 lg:gap-3">
            <Link
              to="/take-action/sponsor-a-child"
              className="hidden items-center gap-2 rounded-xl border border-green-700/20 px-5 py-3 text-[0.78rem] font-bold uppercase tracking-[0.09em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-700 hover:bg-green-700/6 2xl:inline-flex"
            >
              Sponsor a Child
            </Link>
            <Link
              to="/take-action/donate"
              className="hidden items-center gap-2 rounded-xl bg-green-700 px-6 py-3 text-[0.78rem] font-bold uppercase tracking-[0.09em] text-white shadow-[0_14px_30px_-16px_rgba(28,107,75,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] lg:inline-flex"
            >
              Donate
            </Link>

            <Link
              to="/auth"
              aria-label="Sign in or sign up"
              title="Sign in / Sign up"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-green-700/20 text-green-700 transition-all duration-200 hover:bg-green-700 hover:text-white active:scale-95 lg:hidden"
            >
              <Icon.User className="h-5 w-5" />
            </Link>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              title="Search"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-green-700/20 text-green-700 transition-all duration-200 hover:bg-green-700 hover:text-white active:scale-95 lg:hidden"
            >
              <Icon.Search className="h-5 w-5" />
            </button>

            <Link
              to="/take-action/send-a-gift-cart"
              aria-label={
                basketCount
                  ? `Basket, ${basketCount} item${basketCount === 1 ? "" : "s"}`
                  : "Basket"
              }
              title="Basket"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-green-700/20 text-green-700 transition-all duration-200 hover:bg-green-700 hover:text-white active:scale-95 lg:hidden"
            >
              <Icon.Basket className="h-5 w-5" />
              {basketCount > 0 && (
                <span className="pointer-events-none absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#E2703A] px-1 text-[0.6rem] font-bold text-white ring-2 ring-[#FBF7F0]">
                  {basketCount > 99 ? "99+" : basketCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <MobileDrawer
        open={menuOpen}
        onClose={closeMenu}
        expanded={mobileDropdown}
        onToggle={toggleMobileDropdown}
      />

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}