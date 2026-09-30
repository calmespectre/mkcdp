import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
      { label: "Opinion", href: "/news-and-stories/opinion" },
      { label: "Media Center", href: "/news-and-stories/media-center" },
    ],
  },
  {
    label: "Take Action",
    href: "/take-action",
    children: [
      { label: "Sponsor a Child", href: "/take-action/sponsor-a-child" },
      { label: "Donate", href: "/take-action/donate" },
      { label: "Volunteer", href: "/take-action/volunteer" },
      { label: "Partner with us", href: "/take-action/partnerships" },
      { label: "Report Safeguarding Issue", href: "/take-action/report-safeguarding" },
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
  return (
    <div className={`fixed inset-0 z-[60] lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />

      <aside
        className={`absolute right-0 top-0 flex h-[100dvh] w-full max-w-[420px] flex-col bg-[#FBF7F0] shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-green-700/10 px-6 py-4">
          <Link to="/" onClick={onClose} className="flex items-center">
            <img src="/mkcdp.png" alt="MKCDP Logo" className="h-11 w-auto" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center text-green-700 transition-colors duration-200 hover:bg-green-700 hover:text-white"
          >
            <Icon.Close className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-7">
          <p className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700">
            Menu
          </p>

          <ul className="space-y-1">
            {NAV_LINKS.map((link, index) => {
              const isOpen = expanded === link.label;
              return (
                <li
                  key={link.label}
                  style={{ transitionDelay: open ? `${100 + index * 50}ms` : "0ms" }}
                  className={`transition-all duration-300 ${open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
                >
                  <div
                    className={`flex items-stretch overflow-hidden rounded-xl transition-colors duration-200 ${
                      isOpen ? "bg-green-700/8" : "hover:bg-green-700/6"
                    }`}
                  >
                    <Link
                      to={link.href}
                      onClick={onClose}
                      className={`flex flex-1 items-center px-4 py-4 text-[0.95rem] font-semibold transition-colors duration-200 ${
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
                      className={`flex w-14 flex-shrink-0 items-center justify-center border-l transition-colors duration-200 ${
                        isOpen
                          ? "border-green-700/15 text-green-700"
                          : "border-green-700/10 text-[#2A2A26]/50 hover:text-green-700"
                      }`}
                    >
                      <Icon.ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
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
                            className="group flex items-center gap-2 rounded-lg px-3 py-2.5 text-[0.85rem] font-medium text-[#4A4A42] transition-all duration-200 hover:bg-green-700/6 hover:pl-4 hover:text-green-700"
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
          </ul>

          <div className="mt-8 grid grid-cols-1 gap-3">
            <Link
              to="/take-action/sponsor-a-child"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-xl border border-green-700/20 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-200 hover:bg-green-700/6 active:scale-[0.98]"
            >
              Sponsor a Child
            </Link>
            <Link
              to="/donate"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_32px_-16px_rgba(28,107,75,0.95)] transition-all duration-200 hover:bg-[#15543A] active:scale-[0.98]"
            >
              Donate
            </Link>
          </div>

          <div className="mt-8 border-t border-green-700/10 pt-6">
            <p className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700">
              Account
            </p>
            <Link
              to="/auth"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-xl border border-green-700/20 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-200 hover:bg-green-700/6 active:scale-[0.98]"
            >
              <Icon.User className="h-4 w-4" />
              Sign in / Sign up
            </Link>
          </div>

          <div className="mt-8 border-t border-green-700/10 pt-6">
            <p className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700">
              Get in Touch
            </p>
            <div className="space-y-3 text-[0.85rem] text-[#4A4A42]">
              {CONTACT_LINES.map((line) => (
                <ContactLine
                  key={line.label}
                  icon={line.Icon}
                  label={line.label}
                  href={line.href}
                  wrapClass="items-start text-[#4A4A42] hover:text-green-700"
                  iconClass="mt-0.5 h-4 w-4 text-green-700"
                />
              ))}
            </div>
          </div>

          <div className="mt-8 border-t border-green-700/10 pt-6">
            <p className="mb-4 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700">
              Follow Us
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {SOCIALS.map(({ label, href, Icon: SocialIcon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-green-700/15 text-green-700 transition-all duration-200 hover:bg-green-700 hover:text-white active:scale-95"
                >
                  <SocialIcon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastScrollY;

      setHidden(goingDown && y > 80);
      if (goingDown) setOpenDropdown(null);
      setLastScrollY(y);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const toggleMobileDropdown = (label) =>
    setMobileDropdown((current) => (current === label ? null : label));

  const headerTranslate = menuOpen ? "" : hidden ? "-translate-y-full" : "translate-y-0";

  return (
    <header
      className={`sticky top-0 z-50 w-full font-[Montserrat] transition-transform duration-300 ease-in-out ${headerTranslate}`}
    >
      <nav className="border-b border-green-700/10 bg-[#FBF7F0]">
        <div className="mx-auto flex max-w-[1560px] items-center justify-between gap-2 px-4 py-2 lg:px-14">
          <Link to="/" className="flex flex-shrink-0 items-center gap-3">
            <img src="/mkcdp.png" alt="MKCDP Logo" className="h-12 w-auto lg:h-14" />
          </Link>

          <ul className="hidden items-center lg:flex">
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
                    className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.07em] text-[#2A2A26] transition-colors duration-200 hover:text-green-700"
                  >
                    <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-green-700 after:transition-all after:duration-300 hover:after:w-full">
                      {link.label}
                    </span>
                    <Icon.ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        open ? "rotate-180 text-green-700" : "text-[#2A2A26]/50"
                      }`}
                    />
                  </Link>

                  <div
                    className={`absolute left-0 top-full pt-3 transition-all duration-200 ${
                      open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
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

          <div className="flex items-center gap-1 lg:gap-3">
            <Link
              to="/take-action/sponsor-a-child"
              className="hidden items-center gap-2 rounded-xl border border-green-700/20 px-5 py-3 text-[0.78rem] font-bold uppercase tracking-[0.09em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-700 hover:bg-green-700/6 lg:inline-flex"
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
              className="hidden h-11 w-11 items-center justify-center rounded-xl text-green-700 transition-colors duration-200 hover:bg-green-700/6 lg:inline-flex"
            >
              <Icon.User className="h-5 w-5" />
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="inline-flex h-11 w-11 items-center justify-center text-green-700 transition-colors duration-200 hover:bg-green-700/6 lg:hidden"
            >
              <Icon.Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </nav>

      <MobileDrawer
        open={menuOpen}
        onClose={closeMenu}
        expanded={mobileDropdown}
        onToggle={toggleMobileDropdown}
      />
    </header>
  );
}