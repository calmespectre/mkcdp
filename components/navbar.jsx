import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGiftCart, countCartItems } from "./giftCart";
import { useEditor, EditableText, EditableImage } from "./editorContext";

const API_BASE =
  import.meta.env?.VITE_API_URL ||
  "https://child-tracking-system-backend.onrender.com/api/auth";

const NAV_LINKS = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Who We Are", href: "/about/who-we-are" },
      { label: "Our Strategic Plan", href: "/about/strategic-plan" },
      { label: "Accountability", href: "/about/accountability" },
      { label: "Safeguarding", href: "/about/safeguarding" },
      { label: "Our Leadership", href: "/about/leadership" },
      { label: "Our Development Partners", href: "/about/partners" },
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
      {
        label: "Report a Safeguarding Concern",
        href: "/take-action/report-safeguarding",
      },
    ],
  },
  {
    label: "Publications",
    href: "/publications",
    children: [],
  },
];

const Icon = {
  Search: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  ),

  User: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      {...props}
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c.8-3.8 3.7-6 7.5-6s6.7 2.2 7.5 6" />
    </svg>
  ),

  Basket: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4.5 10h15l-1.3 8.4a2 2 0 0 1-2 1.6H7.8a2 2 0 0 1-2-1.6L4.5 10Z" />
      <path d="M9 10 12 4l3 6" />
      <path d="M9.5 14v3M14.5 14v3" />
    </svg>
  ),

  Arrow: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  ),

  Chevron: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),

  Close: (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      {...props}
    >
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  ),
};

function getAccessToken() {
  try {
    return localStorage.getItem("mkcdp.access");
  } catch {
    return null;
  }
}

function clearTokens() {
  try {
    localStorage.removeItem("mkcdp.access");
    localStorage.removeItem("mkcdp.refresh");
  } catch {}
}

function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const searchLinks = useMemo(
    () => [
      { title: "Home", path: "/" },
      ...NAV_LINKS.flatMap((item) => [
        { title: item.label, path: item.href },
        ...item.children.map((child) => ({
          title: child.label,
          path: child.href,
        })),
      ]),
      { title: "My Account", path: "/account" },
      { title: "Basket", path: "/take-action/send-a-gift-cart" },
    ],
    []
  );

  const results = query.trim()
    ? searchLinks
        .filter((item) =>
          item.title.toLowerCase().includes(query.trim().toLowerCase())
        )
        .slice(0, 10)
    : [];

  useEffect(() => {
    if (!open) return;

    setQuery("");
    setActiveIndex(0);

    const timer = setTimeout(() => inputRef.current?.focus(), 100);

    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    const handleKey = (event) => {
      if (event.key === "Escape") onClose();

      if (event.key === "ArrowDown" && results.length) {
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % results.length);
      }

      if (event.key === "ArrowUp" && results.length) {
        event.preventDefault();
        setActiveIndex(
          (current) => (current - 1 + results.length) % results.length
        );
      }

      if (event.key === "Enter" && results[activeIndex]) {
        onClose();
        navigate(results[activeIndex].path);
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [open, results, activeIndex, onClose, navigate]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[2000] flex items-start justify-center bg-black/40 px-3 pt-5 backdrop-blur-sm sm:pt-24">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl border border-green-700/10 bg-[#FBF7F0] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-green-700/10 px-5 py-4">
          <Icon.Search className="h-5 w-5 shrink-0 text-green-700" />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-[#20241F] outline-none placeholder:text-[#85877E]"
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            placeholder="Enter a keyword..."
            className="rounded-full p-1 text-[#697367] transition hover:bg-green-700/10 hover:text-green-700"
          >
            <Icon.Close className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-2">
          {!query.trim() && (
            <p className="px-4 py-8 text-center text-sm text-[#697367]">
            </p>
          )}

          {query.trim() && results.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-[#697367]">
              No results found for "{query}".
            </p>
          )}

          {results.map((item, index) => (
            <Link
              key={`${item.path}-${item.title}`}
              to={item.path}
              onClick={onClose}
              onMouseEnter={() => setActiveIndex(index)}
              className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm transition ${
                activeIndex === index
                  ? "bg-green-700/10 text-green-700"
                  : "text-[#343B33] hover:bg-green-700/5"
              }`}
            >
              <span className="font-medium">{item.title}</span>
              <Icon.Arrow className="h-4 w-4" />
            </Link>
          ))}
        </div>

        {/* <div className="flex items-center justify-between border-t border-green-700/10 px-5 py-3 text-[10px] text-[#85877E]">
          <span>MKCDP Website Search</span>
          <span>↑ ↓ Navigate · Enter Select · Esc Close</span>
        </div> */}
      </div>
    </div>,
    document.body
  );
}

function SideNavigation({
  open,
  onClose,
  isAuthed,
  isAdmin,
  isEditing,
  setIsEditing,
}) {
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!open) setExpanded(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  return createPortal(
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[1040] bg-black/35 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      <aside
        id="mkcdp-side-navigation"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-[1050] flex h-[100dvh] w-full max-w-[560px] flex-col overflow-y-auto bg-[#FBF7F0] text-[#20241F] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex min-h-[82px] items-center justify-between border-b border-green-700/10 px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-green-700" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">
              Explore MKCDP
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-green-700/20 text-green-700 transition hover:bg-green-700 hover:text-white"
          >
            <Icon.Close className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col px-5 pb-7 pt-5 sm:px-8">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#92978D]">
              Navigation
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#92978D]">
              Loitokitok · Kenya
            </span>
          </div>

          <nav aria-label="Expanded navigation" className="flex-1">
            {NAV_LINKS.map((item, index) => {
              const hasChildren = item.children.length > 0;
              const isExpanded = expanded === item.label;

              return (
                <div key={item.label} className="border-b border-green-700/10">
                  <div className="flex items-center gap-3">
                    <Link
                      to={item.href}
                      onClick={onClose}
                      tabIndex={open ? 0 : -1}
                      className="group flex min-w-0 flex-1 items-center gap-4 py-[19px]"
                    >
                      <span className="w-6 shrink-0 text-[10px] font-semibold tracking-widest text-[#A0A69B]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="text-[clamp(20px,3vw,27px)] font-semibold leading-tight tracking-[-0.04em] text-[#20241F] transition-colors group-hover:text-green-700">
                        <EditableText
                          id={`navbar.nav.${index}.label`}
                          defaultValue={item.label}
                        />
                      </span>
                    </Link>

                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={() =>
                          setExpanded(isExpanded ? null : item.label)
                        }
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.label}`}
                        tabIndex={open ? 0 : -1}
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
                          isExpanded
                            ? "border-green-700 bg-green-700 text-white"
                            : "border-green-700/20 text-green-700 hover:border-green-700 hover:bg-green-700 hover:text-white"
                        }`}
                      >
                        <Icon.Chevron
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={onClose}
                        tabIndex={open ? 0 : -1}
                        aria-label={`Go to ${item.label}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center text-green-700 transition hover:translate-x-1 hover:-translate-y-1"
                      >
                        <Icon.Arrow className="h-5 w-5" />
                      </Link>
                    )}
                  </div>

                  {hasChildren && (
                    <div
                      className={`grid transition-all duration-300 ${
                        isExpanded
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="mb-4 ml-7 grid grid-cols-1 gap-1 border-l border-green-700/20 pl-4 sm:ml-10 sm:grid-cols-2 sm:gap-x-5">
                          {item.children.map((child, childIndex) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              onClick={onClose}
                              tabIndex={open && isExpanded ? 0 : -1}
                              className="group flex min-h-10 items-center justify-between gap-3 py-2 text-[12px] font-medium text-[#626B60] transition-colors hover:text-green-700"
                            >
                              <EditableText
                                id={`navbar.nav.${index}.child.${childIndex}.label`}
                                defaultValue={child.label}
                              />

                              <Icon.Arrow className="h-3.5 w-3.5 shrink-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-green-700/10 pt-6">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#697367]">
              Take the next step
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/take-action/sponsor-a-child"
                onClick={onClose}
                className="flex min-h-12 items-center justify-center gap-2 bg-green-700 px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-green-800"
              >
                Sponsor a Child
                <Icon.Arrow className="h-4 w-4" />
              </Link>

              <Link
                to="/take-action/donate"
                onClick={onClose}
                className="flex min-h-12 items-center justify-center gap-2 border border-green-700/30 px-3 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-green-700 transition hover:bg-green-700 hover:text-white"
              >
                Donate
                <Icon.Arrow className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-green-700/10 pt-5">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#697367]">
                Connect with us
              </p>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold text-[#41483F]">
                <a
                  href="mailto:info@mkcdp.org"
                  className="transition hover:text-green-700"
                >
                  info@mkcdp.org
                </a>
                <a
                  href="tel:+254737332219"
                  className="transition hover:text-green-700"
                >
                  +25473 733 2219
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[10px] text-[#788074]">
              <Link
                to={isAuthed ? "/account" : "/auth"}
                onClick={onClose}
                className="transition hover:text-green-700"
              >
                {isAuthed ? "My account" : "Sign in"}
              </Link>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="font-semibold text-green-700"
                >
                  {isEditing ? "Exit editor" : "Editor mode"}
                </button>
              )}
            </div>
          </div>

          <p className="mt-5 text-[10px] text-[#92978D]">
            © {new Date().getFullYear()} MKCDP. All rights reserved.
          </p>
        </div>
      </aside>
    </>,
    document.body
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const headerRef = useRef(null);
  const lastScrollY = useRef(0);
  const idleTimer = useRef(null);

  const location = useLocation();
  const { cart } = useGiftCart();
  const { isEditing, setIsEditing } = useEditor();

  const basketCount = countCartItems(cart);

  const authLinkState = {
    from: location.pathname + location.search,
  };

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setHidden(false);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const token = getAccessToken();

    if (!token) {
      setIsAuthed(false);
      setIsAdmin(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE}/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => null);

        if (cancelled) return;

        if (response.ok && data) {
          const payload = data?.data || data;
          const role = String(payload?.role || "").toLowerCase();

          setIsAuthed(true);
          setIsAdmin(
            Boolean(payload?.is_staff) ||
              Boolean(payload?.is_superuser) ||
              ["staff", "superuser", "admin"].includes(role)
          );
        } else {
          setIsAuthed(false);
          setIsAdmin(false);
          clearTokens();
        }
      } catch {
        if (!cancelled) {
          setIsAuthed(false);
          setIsAdmin(false);
        }
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [location.key]);

  useEffect(() => {
    document.body.style.overflow =
      menuOpen || searchOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    const handleKey = (event) => {
      const tag = event.target?.tagName?.toLowerCase();
      const typing =
        tag === "input" ||
        tag === "textarea" ||
        event.target?.isContentEditable;

      if (
        (event.key === "k" || event.key === "K") &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === "/" && !typing && !searchOpen) {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === "Escape" && menuOpen) closeMenu();
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen, searchOpen, closeMenu]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const difference = currentY - lastScrollY.current;

      setScrolled(currentY > 20);

      if (menuOpen || searchOpen) {
        setHidden(false);
        lastScrollY.current = currentY;
        return;
      }

      if (Math.abs(difference) < 3) return;

      if (currentY <= 30 || difference < 0) {
        setHidden(false);
        clearTimeout(idleTimer.current);
      } else if (difference > 0) {
        if (!headerRef.current?.contains(document.activeElement)) {
          setHidden(true);
        }

        clearTimeout(idleTimer.current);

        idleTimer.current = setTimeout(() => {
          setHidden(false);
        }, 850);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(idleTimer.current);
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

        .mkcdp-header,
        .mkcdp-header *,
        #mkcdp-side-navigation,
        #mkcdp-side-navigation * {
          font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }

        .mkcdp-header {
          transition:
            transform 420ms cubic-bezier(.22,1,.36,1),
            background-color 300ms ease,
            box-shadow 300ms ease;
          will-change: transform;
        }

        .mkcdp-menu-trigger {
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }

        .mkcdp-menu-trigger::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background: #15803d;
          transform: translateX(-101%);
          transition: transform 300ms cubic-bezier(.22,1,.36,1);
        }

        .mkcdp-menu-trigger:hover::before {
          transform: translateX(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .mkcdp-header,
          .mkcdp-menu-trigger::before {
            transition: none !important;
          }
        }
      `}</style>

      <header
        ref={headerRef}
        className={`mkcdp-header fixed inset-x-0 top-0 z-[1100] ${
          hidden && !menuOpen && !searchOpen
            ? "-translate-y-full"
            : "translate-y-0"
        } ${
          scrolled || menuOpen || searchOpen
            ? "bg-[#FBF7F0]/95 text-[#20241F] shadow-[0_4px_30px_rgba(20,30,20,0.08)] backdrop-blur-xl"
            : "bg-[#FBF7F0]/90 text-[#20241F] backdrop-blur-md"
        }`}
      >
        <nav aria-label="Main navigation" className="mx-auto max-w-[1800px]">
          <div className="flex min-h-[72px] items-center justify-between gap-3 px-4 sm:px-7 lg:min-h-[86px] lg:px-10 xl:px-14">
            <Link
              to="/"
              aria-label="MKCDP home"
              onClick={closeMenu}
              className={`flex min-w-0 shrink-0 items-center ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableImage
                id="navbar.logo"
                defaultValue="/mkcdp.png"
                alt="MKCDP Logo"
                wrapperClassName="flex items-center"
                imgClassName="h-10 w-auto sm:h-12 lg:h-[58px]"
              />
            </Link>

            <div className="ml-auto flex min-w-0 items-center justify-end gap-2 sm:gap-2.5 lg:gap-3">
              <Link
                to="/take-action/send-a-gift-cart"
                aria-label={
                  basketCount
                    ? `Basket, ${basketCount} items`
                    : "Basket"
                }
                title="Basket"
                className="relative hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-green-700/20 text-green-700 transition-all duration-200 hover:bg-green-700 hover:text-white active:scale-95 sm:inline-flex"
              >
                <Icon.Basket className="h-5 w-5" />

                {basketCount > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#E2703A] px-1 text-[9px] font-bold text-white ring-2 ring-[#FBF7F0]">
                    {basketCount > 99 ? "99+" : basketCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                title="Search"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-green-700/20 text-green-700 transition-all duration-200 hover:bg-green-700 hover:text-white active:scale-95"
              >
                <Icon.Search className="h-5 w-5" />
              </button>

              <Link
                to={isAuthed ? "/account" : "/auth"}
                state={isAuthed ? undefined : authLinkState}
                aria-label={isAuthed ? "My account" : "Sign in"}
                title={isAuthed ? "My account" : "Sign in"}
                className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-green-700/20 text-green-700 transition-all duration-200 hover:bg-green-700 hover:text-white active:scale-95 sm:inline-flex"
              >
                <Icon.User className="h-5 w-5" />
              </Link>

              <Link
                to="/take-action/sponsor-a-child"
                className={`hidden min-h-10 items-center justify-center gap-2 rounded-xl border border-green-700/25 px-4 text-[10px] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-700 hover:bg-green-700/5 lg:inline-flex 2xl:px-6 ${
                  isEditing ? "pointer-events-none" : ""
                }`}
              >
                <EditableText
                  id="navbar.cta.sponsor"
                  defaultValue="Sponsor a Child"
                />
              </Link>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  aria-label={isEditing ? "Exit editor mode" : "Enter editor mode"}
                  title={isEditing ? "Exit editor mode" : "Editor"}
                  className={`hidden h-10 shrink-0 items-center justify-center border px-3 text-[9px] font-bold uppercase tracking-wider transition-colors sm:inline-flex ${
                    isEditing
                      ? "border-amber-500 bg-amber-500 text-black"
                      : "border-green-700/20 text-green-700 hover:bg-green-700 hover:text-white"
                  }`}
                >
                  {isEditing ? "Exit editor" : "Editor"}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setHidden(false);
                  setMenuOpen((current) => !current);
                }}
                aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={menuOpen}
                aria-controls="mkcdp-side-navigation"
                className="mkcdp-menu-trigger group ml-1 flex h-10 shrink-0 items-center justify-center gap-2 border border-green-700/25 px-3 text-[9px] font-bold uppercase tracking-[0.14em] text-green-700 transition-colors hover:text-white sm:ml-2 sm:px-4 sm:text-[10px]"
              >
                <span className="hidden sm:inline">
                  {menuOpen ? "Close" : "Explore"}
                </span>

                <span className="relative block h-5 w-6">
                  <span
                    className={`absolute left-0 h-[1.5px] w-6 bg-current transition-all duration-300 ${
                      menuOpen ? "top-[9px] rotate-45" : "top-[5px]"
                    }`}
                  />

                  <span
                    className={`absolute left-0 h-[1.5px] bg-current transition-all duration-300 ${
                      menuOpen
                        ? "top-[9px] w-6 -rotate-45"
                        : "top-[15px] w-4"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <SideNavigation
        open={menuOpen}
        onClose={closeMenu}
        isAuthed={isAuthed}
        isAdmin={isAdmin}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      <SearchModal open={searchOpen} onClose={closeSearch} />
    </>
  );
}