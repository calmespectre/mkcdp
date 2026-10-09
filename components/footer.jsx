import {
  useEditor,
  EditableText,
  EditableImage,
} from "./editorContext";

const GREEN = "#14532D";
const GREEN_DARK = "#0F3D22";
const CREAM = "#FBF7F0";
const GOLD = "#F2B33D";

const Icon = {
  MapPin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
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
  ChevronRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  ),
  ArrowRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
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
  Instagram: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
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

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/MKCDP", Icon: Icon.Facebook },
  { label: "Twitter", href: "https://twitter.com/MKCDP", Icon: Icon.Twitter },
  {
    label: "LinkedIn",
    href: "https://ke.linkedin.com/in/mt-kilimanjaro-child-development-programme-mkcdp-869933358",
    Icon: Icon.LinkedIn,
  },
  { label: "YouTube", href: "https://www.youtube.com/@MKCDPData", Icon: Icon.YouTube },
];

const QUICK_LINKS = [
  { label: "About", href: "/about" },
  { label: "Our Work", href: "/our-work" },
  { label: "Program Impact", href: "/program-impact" },
  { label: "News and Stories", href: "/news-and-stories" },
  { label: "Take Action", href: "/take-action" },
];

const PROGRAMS = [
  { label: "Education Support", href: "/our-work/education" },
  { label: "Health & Nutrition", href: "/our-work/health" },
  { label: "Water & Sanitation", href: "/our-work/water" },
  { label: "Child Protection", href: "/our-work/child-protection" },
  { label: "Community Empowerment", href: "/our-work/community" },
];

export default function Footer() {
  const { isEditing } = useEditor();

  return (
    <footer className="relative w-full overflow-hidden bg-[#FBF7F0] font-[Montserrat] text-[#141414]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-green-900/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(20,83,45,0.09) 0px, rgba(20,83,45,0.09) 1px, transparent 1px, transparent 22px)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 65%, transparent)",
          maskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 65%, transparent)",
        }}
      />

      <svg
        viewBox="0 0 120 120"
        aria-hidden="true"
        className="pointer-events-none absolute -left-8 top-14 w-32 -rotate-12 opacity-40"
      >
        <path
          d="M18 76c6-30 34-54 66-50 20 3 30 20 22 34-10 17-36 24-58 18"
          fill="none"
          stroke="#7FB069"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>

      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 bottom-28 w-28 rotate-12 opacity-40"
      >
        <path
          d="M52 9c21 1 38 15 37 36-1 24-20 45-44 44C24 88 8 70 9 49 10 26 28 8 52 9Z"
          fill="none"
          stroke="#E2703A"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative mx-auto max-w-[1560px] px-6 pb-14 pt-20 sm:px-10 lg:px-14 lg:pb-20 lg:pt-24">
        <div className="mb-14 flex flex-col gap-8 border-b border-green-700/12 pb-12 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[560px]">
            <span className="mb-4 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-8 bg-green-700" />
              <EditableText
                id="footer.stayConnected.eyebrow"
                defaultValue="Stay connected"
              />
            </span>
            <EditableText
              as="h3"
              id="footer.stayConnected.heading"
              defaultValue="Every child deserves a future worth dreaming about."
              multiline
              className="hero-serif text-[clamp(1.6rem,3.4vw,2.6rem)] font-bold leading-[1.14] tracking-[-0.02em] text-[#111111]"
            />
          </div>
          <a
            href="/take-action/sponsor-a-child"
            className={`group inline-flex w-fit items-center gap-3 rounded-xl bg-green-700 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-950 ${
              isEditing ? "pointer-events-none" : ""
            }`}
          >
            <EditableText
              id="footer.stayConnected.cta"
              defaultValue="Sponsor a Child"
            />
            <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <a
              href="/"
              className={`inline-flex items-center gap-3 ${isEditing ? "pointer-events-none" : ""}`}
            >
              <EditableImage
                id="footer.brand.logo"
                defaultValue="/mkcdp.png"
                alt="MKCDP Logo"
                className="h-24 w-auto rounded-full object-cover"
                wrapperClassName="inline-block"
                circular
              />
            </a>
            <EditableText
              as="p"
              id="footer.brand.description"
              defaultValue="Mt. Kilimanjaro Child Development Programme is a registered, child-centered NGO dedicated to empowering children and communities in Kajiado South, Kenya."
              multiline
              className="mt-6 block max-w-[380px] text-[0.92rem] leading-[1.8] text-[#4A4A42]"
            />
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <EditableText
              as="h4"
              id="footer.quickLinks.heading"
              defaultValue="Quick Links"
              className="block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"
            />
            <ul className="mt-6 space-y-3.5">
              {QUICK_LINKS.map((link, i) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`group inline-flex items-center gap-2 text-[0.88rem] font-medium text-[#4A4A42] transition-colors duration-200 hover:text-green-900 ${
                      isEditing ? "pointer-events-none" : ""
                    }`}
                  >
                    <Icon.ChevronRight className="h-3.5 w-3.5 text-green-700 transition-transform duration-200 group-hover:translate-x-1" />
                    <EditableText
                      id={`footer.quickLinks.${i}.label`}
                      defaultValue={link.label}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <EditableText
              as="h4"
              id="footer.programs.heading"
              defaultValue="Our Programs"
              className="block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"
            />
            <ul className="mt-6 space-y-3.5">
              {PROGRAMS.map((program, i) => (
                <li key={program.label}>
                  <a
                    href={program.href}
                    className={`group inline-flex items-center gap-2 text-[0.88rem] font-medium text-[#4A4A42] transition-colors duration-200 hover:text-green-900 ${
                      isEditing ? "pointer-events-none" : ""
                    }`}
                  >
                    <Icon.ChevronRight className="h-3.5 w-3.5 text-green-700 transition-transform duration-200 group-hover:translate-x-1" />
                    <EditableText
                      id={`footer.programs.${i}.label`}
                      defaultValue={program.label}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <EditableText
              as="h4"
              id="footer.contact.heading"
              defaultValue="Get in Touch"
              className="block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"
            />
            <ul className="mt-6 space-y-4 text-[0.88rem] text-[#4A4A42]">
              <li className="flex items-start gap-3">
                <Icon.MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-700" />
                <EditableText
                  id="footer.contact.address"
                  defaultValue="P.O Box 249-00209 Loitokitok, Kenya"
                />
              </li>
              <li>
                <span className="flex items-start gap-3">
                  <Icon.Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-700" />
                  <EditableText
                    id="footer.contact.email"
                    defaultValue="info@mkcdp.org"
                  />
                </span>
              </li>
              <li>
                <span className="flex items-start gap-3">
                  <Icon.Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-700" />
                  <EditableText
                    id="footer.contact.phone"
                    defaultValue="+254 737 332 219"
                  />
                </span>
              </li>
            </ul>
            <div className="mt-8 flex items-center gap-3">
              {SOCIALS.map(({ label, href, Icon: SocialIcon }, i) => (
                <span
                  key={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-green-700/20 text-green-700 transition-all duration-200"
                  title={label}
                >
                  <SocialIcon className="h-4 w-4" />
                  <span className="sr-only">
                    <EditableText
                      id={`footer.socials.${i}.label`}
                      defaultValue={label}
                    />
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-green-700/12">
        <div className="mx-auto flex max-w-[1560px] flex-col items-center justify-between gap-4 px-6 py-7 text-center sm:px-10 lg:flex-row lg:px-14 lg:text-left">
          <EditableText
            as="p"
            id="footer.copyright"
            defaultValue={`© ${new Date().getFullYear()} MKCDP. All rights reserved.`}
            className="block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#4A4A42]/75"
          />
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[0.78rem] font-medium text-[#4A4A42]">
            <EditableText
              id="footer.legal.privacy"
              defaultValue="Privacy Policy"
            />
            <EditableText
              id="footer.legal.terms"
              defaultValue="Terms of Service"
            />
            <EditableText
              id="footer.legal.sitemap"
              defaultValue="Sitemap"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}