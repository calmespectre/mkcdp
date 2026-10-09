import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useEditor,
  EditableText,
  EditableImage,
} from "./editorContext";

const SECTIONS = [
  {
    slug: "our-reach",
    id: "our-reach",
    label: "Our Reach",
    short: "Reach",
    desc: "The breadth and depth of our commitment — children, families and communities across Mt. Kilimanjaro.",
    tag: "Impact",
    image: "/img1.jpg",
    accent: "#7FB069",
  },
  {
    slug: "featured-projects",
    id: "featured-projects",
    label: "Featured Projects",
    short: "Projects",
    desc: "Water, livelihoods and learning — real projects changing lives on the ground, told with dignity.",
    tag: "Stories",
    image: "/img5.jpg",
    accent: "#F2B33D",
  },
];

const STATS = [
  { value: "2,833", suffix: "+", label: "Enrolled Children" },
  { value: "2,396", suffix: "+", label: "Sponsored Children" },
  { value: "40", suffix: "K", label: "Participants Supported" },
  { value: "100", suffix: "+", label: "Projects" },
];

const REACH_BY_COUNTY = [
  { label: "Loitokitok", value: 78 },
  { label: "Kimana", value: 62 },
  { label: "Rombo", value: 51 },
  { label: "Entonet", value: 44 },
  { label: "Namanga", value: 38 },
  { label: "Kajiado Central", value: 26 },
];

const REACH_BY_LIFE_STAGE = [
  { label: "Early childhood (0–5)", value: 34 },
  { label: "Primary (6–13)", value: 68 },
  { label: "Secondary (14–18)", value: 47 },
  { label: "Caregivers", value: 55 },
];

const REACH_BY_GENDER = [
  { label: "Girls", value: 52 },
  { label: "Boys", value: 48 },
];

const WHO_WE_REACH = [
  "Children from early childhood through adolescence",
  "Orphans and vulnerable children",
  "Children with disabilities and special needs",
  "Caregivers, parents and guardians",
  "Teachers, community volunteers and local leaders",
];

const IMPACT_BEYOND_NUMBERS = [
  "Children staying in school and learning safely.",
  "Families better able to provide care and protection.",
  "Communities strengthened to respond to child welfare needs.",
];

const FEATURED_PROJECTS = [
  {
    id: "moilo-water",
    title: "Moilo Water Project",
    category: "Water & Sanitation",
    location: "Moilo, Kajiado County",
    year: "2024",
    image: "/240322_013-scaled.jpg",
    summary:
      "A community borehole and storage system bringing clean, safe water within walking distance for over 800 children and their families.",
    stats: [
      { label: "People served", value: "800+" },
      { label: "Distance cut", value: "6 km → 400 m" },
      { label: "Status", value: "Active" },
    ],
  },
  {
    id: "beekeeping",
    title: "Beekeeping Project",
    category: "Livelihoods",
    location: "Kimana, Kajiado County",
    year: "2024",
    image: "/240321_094-scaled.jpg",
    summary:
      "Fifty hives, thirty trained caregivers, and a honey cooperative that puts real income in the hands of women who care for children.",
    stats: [
      { label: "Hives installed", value: "50" },
      { label: "Caregivers trained", value: "30" },
      { label: "Status", value: "Active" },
    ],
  },
  {
    id: "education",
    title: "Education Programmes",
    category: "Education",
    location: "Loitokitok, Kajiado County",
    year: "Ongoing",
    image: "/kids-loghing-in-class.jpg",
    summary:
      "School fees, books, uniforms, meals and mentorship — the everyday work of keeping 2,833 children in class, term after term.",
    stats: [
      { label: "Children enrolled", value: "2,833" },
      { label: "Partner schools", value: "14" },
      { label: "Status", value: "Ongoing" },
    ],
  },
];

function SectionHeading({ idPrefix, eyebrow, title, intro, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-[720px] text-center" : "max-w-[720px]"}>
      <span
        className={`mb-4 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-green-700 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-8 bg-green-700" />
        <EditableText id={`${idPrefix}.eyebrow`} defaultValue={eyebrow} />
      </span>
      <EditableText
        as="h2"
        id={`${idPrefix}.title`}
        defaultValue={title}
        multiline
        className="block hero-serif text-[clamp(1.7rem,4vw,2.9rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#111111]"
      />
      {intro && (
        <EditableText
          as="p"
          id={`${idPrefix}.intro`}
          defaultValue={intro}
          multiline
          className="mt-5 block text-[1rem] leading-[1.85] text-[#4A4A42]"
        />
      )}
    </div>
  );
}

function MobileBreadcrumb({ label }) {
  const { isEditing } = useEditor();
  return (
    <nav aria-label="Breadcrumb" className="border-b border-green-700/12 bg-[#FBF7F0] lg:hidden">
      <div className="mx-auto max-w-[1560px] px-5 py-3.5 sm:px-10">
        <ol className="flex flex-wrap items-center gap-2 text-sm font-bold uppercase tracking-wider">
          <li>
            <Link
              to="/program-impact"
              className={`text-green-700 transition-colors duration-200 hover:text-green-950 hover:underline ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              Program Impact
            </Link>
          </li>
          <li aria-hidden="true" className="text-green-700/35">›</li>
          <li className="text-[#4A4A42]" aria-current="page">{label}</li>
        </ol>
      </div>
    </nav>
  );
}

function DesktopBreadcrumb({ label }) {
  const { isEditing } = useEditor();
  return (
    <nav aria-label="Breadcrumb" className="relative hidden border-b border-green-700/12 bg-[#FBF7F0] lg:block">
      <div className="mx-auto max-w-[1560px] px-6 py-5 sm:px-10 lg:px-14 lg:py-6">
        <ol className="flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.16em]">
          <li>
            <Link
              to="/program-impact"
              className={`text-green-700 transition-colors duration-200 hover:text-green-950 hover:underline ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              Program Impact
            </Link>
          </li>
          <li aria-hidden="true" className="text-green-700/35">/</li>
          <li className="text-[#4A4A42]" aria-current="page">{label}</li>
        </ol>
      </div>
    </nav>
  );
}

function BarChart({ idPrefix, data, accent = "#16A34A", unit = "%" }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-4">
      {data.map((item, i) => {
        const pct = Math.round((item.value / max) * 100);
        return (
          <div key={item.label}>
            <div className="flex items-center justify-between text-[0.82rem]">
              <EditableText
                as="span"
                id={`${idPrefix}.${i}.label`}
                defaultValue={item.label}
                className="block font-semibold text-[#2A2A26]"
              />
              <span className="font-bold text-green-700">
                <EditableText id={`${idPrefix}.${i}.value`} defaultValue={String(item.value)} />
                {unit}
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-green-700/10">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: accent }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReachCharts() {
  const [tab, setTab] = useState("county");
  const tabs = [
    { id: "county", label: "Reach By County" },
    { id: "life", label: "Reach By Life Stage" },
    { id: "gender", label: "Reach By Gender" },
  ];

  return (
    <div className="rounded-3xl border border-green-700/12 bg-white/80 p-5 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.4)] sm:p-8">
      <div className="flex flex-wrap gap-2 rounded-xl border border-green-700/15 bg-white p-1">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
              tab === t.id
                ? "bg-green-700 text-white shadow-[0_10px_20px_-10px_rgba(28,107,75,0.9)]"
                : "text-[#4A4A42] hover:text-green-700"
            }`}
          >
            <EditableText id={`program.reach.charts.tab.${t.id}`} defaultValue={t.label} />
          </button>
        ))}
      </div>

      <div className="mt-7">
        {tab === "county" && <BarChart idPrefix="program.reach.charts.county" data={REACH_BY_COUNTY} accent="#16A34A" />}
        {tab === "life" && <BarChart idPrefix="program.reach.charts.life" data={REACH_BY_LIFE_STAGE} accent="#F2B33D" />}
        {tab === "gender" && <BarChart idPrefix="program.reach.charts.gender" data={REACH_BY_GENDER} accent="#1C6B4B" />}
      </div>
    </div>
  );
}

function ProgramImpactHero() {
  return (
    <section className="relative overflow-hidden bg-[#FBF7F0] pt-10 sm:pt-16 lg:pt-24">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 items-end gap-8 sm:gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-green-700">
              <span className="h-px w-8 bg-green-700" />
              <EditableText id="program.hero.eyebrow" defaultValue="Program Impact" />
            </span>
            <EditableText
              as="h1"
              id="program.hero.title"
              defaultValue={"Every number\nis a child.\nEvery project is a promise."}
              multiline
              className="hero-serif block whitespace-pre-line text-[clamp(2rem,8vw,4.4rem)] font-bold leading-[1.05] tracking-[-0.022em] text-[#111111]"
            />
          </div>
          <div className="lg:pb-3">
            <EditableText
              as="p"
              id="program.hero.intro"
              defaultValue="Our reach, measured honestly. Our projects, told with dignity. Two views into the work MKCDP does every day alongside the communities surrounding Mt. Kilimanjaro."
              multiline
              className="block max-w-[520px] text-[0.98rem] leading-[1.85] text-[#3D3D37] sm:text-[1.0625rem]"
            />
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-green-700/15 pt-6 sm:gap-x-10">
              {[
                { v: "2,833", l: "Enrolled children", key: "enrolled" },
                { v: "100+", l: "Projects delivered", key: "projects" },
                { v: "40K", l: "Lives touched", key: "lives" },
              ].map((item) => (
                <div key={item.key}>
                  <EditableText
                    as="p"
                    id={`program.hero.stat.${item.key}.v`}
                    defaultValue={item.v}
                    className="hero-serif block text-[1.15rem] font-bold leading-none text-green-700 sm:text-[1.25rem]"
                  />
                  <EditableText
                    as="p"
                    id={`program.hero.stat.${item.key}.l`}
                    defaultValue={item.l}
                    className="mt-2 block text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/75 sm:text-[0.68rem]"
                  />
                </div>
              ))}
            </div>
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
  );
}

function ProgramImpactLanding() {
  const { isEditing } = useEditor();
  const whyCards = [
    { key: "verified", n: "01", title: "Verified reach", body: "Every figure we publish is sourced from programme records, school registers, and periodic field monitoring." },
    { key: "real", n: "02", title: "Real projects", body: "Every featured project has a name, a place, a budget, and a completion note — documented as it happens." },
    { key: "open", n: "03", title: "Open reporting", body: "Annual reports, donor updates and programme evaluations are published so progress and challenges are both visible." },
  ];
  return (
    <>
      <div className="hidden lg:block">
        <ProgramImpactHero />

        <section className="relative py-14 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-14">
            <SectionHeading
              idPrefix="program.landing.explore"
              eyebrow="Explore the impact"
              title="Two windows into our work."
              intro="Start with the reach — the children, families and communities we serve. Then walk through three projects that show what that reach looks like on the ground."
            />

            <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 lg:grid-cols-2">
              {SECTIONS.map((s, i) => (
                <Link
                  key={s.slug}
                  to={`/program-impact/${s.slug}`}
                  className={`group relative flex flex-col overflow-hidden rounded-[28px] border border-green-700/12 bg-white/70 shadow-[0_28px_70px_-46px_rgba(20,83,45,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:border-green-700/30 hover:bg-white/85 hover:shadow-[0_36px_80px_-46px_rgba(20,83,45,0.65)] active:scale-[0.99] ${
                    i === 1 ? "lg:mt-8" : ""
                  } ${isEditing ? "pointer-events-none" : ""}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <EditableImage
                      id={`program.sections.${s.slug}.image`}
                      defaultValue={s.image}
                      alt={s.label}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      wrapperClassName="h-full w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <EditableText
                      as="span"
                      id={`program.sections.${s.slug}.tag`}
                      defaultValue={s.tag}
                      className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-green-700 backdrop-blur"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <EditableText
                      as="h3"
                      id={`program.sections.${s.slug}.label`}
                      defaultValue={s.label}
                      className="hero-serif block text-[clamp(1.5rem,4vw,2rem)] font-bold leading-tight text-[#111111]"
                    />
                    <EditableText
                      as="p"
                      id={`program.sections.${s.slug}.desc`}
                      defaultValue={s.desc}
                      multiline
                      className="mt-4 block flex-1 text-[0.95rem] leading-[1.8] text-[#4A4A42]"
                    />
                    <div className="mt-6 inline-flex items-center justify-between gap-3 border-t border-green-700/15 pt-5 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-colors duration-300 group-hover:text-[#15543A]">
                      <EditableText
                        id={`program.sections.${s.slug}.cta`}
                        defaultValue={i === 0 ? "Explore the numbers" : "See the projects"}
                      />
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative border-t border-green-700/12 bg-[#FBF7F0] py-16 lg:py-24">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-14">
            <SectionHeading
              idPrefix="program.landing.why"
              eyebrow="Why this matters"
              title="Numbers build the case. Stories build the trust."
              intro="Reach tells you how many. Projects tell you how. Both are essential to honest reporting, and both are things we track, review and share — every year, with every donor."
            />

            <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
              {whyCards.map((card) => (
                <div
                  key={card.key}
                  className="rounded-[24px] border border-green-700/12 bg-white/70 p-6 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.4)] sm:p-8"
                >
                  <EditableText
                    as="span"
                    id={`program.landing.why.card.${card.key}.n`}
                    defaultValue={card.n}
                    className="hero-serif block text-[2rem] font-bold leading-none text-green-700/25 sm:text-[2.4rem]"
                  />
                  <EditableText
                    as="p"
                    id={`program.landing.why.card.${card.key}.title`}
                    defaultValue={card.title}
                    className="hero-serif mt-3 block text-[1.15rem] font-bold leading-tight text-[#111111] sm:text-[1.2rem]"
                  />
                  <EditableText
                    as="p"
                    id={`program.landing.why.card.${card.key}.body`}
                    defaultValue={card.body}
                    multiline
                    className="mt-3 block text-[0.9rem] leading-[1.75] text-[#4A4A42]"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-16 lg:py-24">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-14">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className="rounded-3xl border border-green-700/12 bg-white/80 p-5 shadow-[0_20px_50px_-40px_rgba(20,83,45,0.4)] sm:p-6"
                >
                  <p className="hero-serif text-[clamp(1.6rem,4.5vw,2.4rem)] font-bold leading-none text-green-700">
                    <EditableText id={`program.stats.${i}.value`} defaultValue={s.value} />
                    <EditableText
                      as="span"
                      id={`program.stats.${i}.suffix`}
                      defaultValue={s.suffix}
                      className="text-[0.6em] align-top text-green-700/70"
                    />
                  </p>
                  <EditableText
                    as="p"
                    id={`program.stats.${i}.label`}
                    defaultValue={s.label}
                    className="mt-3 block text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/80"
                  />
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:mt-16 sm:flex-row">
              <Link
                to="/program-impact/our-reach"
                className={`inline-flex items-center justify-center rounded-full bg-green-700 px-8 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_-16px_rgba(20,83,45,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] ${
                  isEditing ? "pointer-events-none" : ""
                }`}
              >
                <EditableText id="program.landing.cta.reach" defaultValue="See our reach →" />
              </Link>
              <Link
                to="/program-impact/featured-projects"
                className={`inline-flex items-center justify-center rounded-full border border-green-700/25 px-8 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-all duration-300 hover:border-green-700/60 hover:bg-green-700/5 ${
                  isEditing ? "pointer-events-none" : ""
                }`}
              >
                <EditableText id="program.landing.cta.projects" defaultValue="Walk through our projects" />
              </Link>
            </div>
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
          <div className="relative mx-auto max-w-[1360px] px-6 py-20 sm:px-10 lg:px-14 lg:py-28">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
              <div>
                <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
                  <span className="h-px w-8 bg-[#F2B33D]" />
                  <EditableText id="program.landing.grow.eyebrow" defaultValue="Help us grow this page" />
                </span>
                <EditableText
                  as="h2"
                  id="program.landing.grow.title"
                  defaultValue="Every new project starts with someone deciding to act."
                  multiline
                  className="hero-serif block text-[clamp(1.6rem,5.5vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#FBF7F0]"
                />
                <EditableText
                  as="p"
                  id="program.landing.grow.body"
                  defaultValue="Fund the next borehole. Sponsor the next classroom. Partner on the next idea. Whether you give monthly, once, or bring a company along — you become part of every number on this page."
                  multiline
                  className="mt-5 block max-w-[520px] text-[0.95rem] leading-[1.85] text-[#FBF7F0]/75 sm:text-[1rem]"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <Link
                  to="/take-action/donate"
                  className={`inline-flex items-center justify-center rounded-full bg-[#F2B33D] px-8 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[#1C6B4B] shadow-[0_18px_40px_-16px_rgba(242,179,61,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e0a02e] ${
                    isEditing ? "pointer-events-none" : ""
                  }`}
                >
                  <EditableText id="program.landing.grow.donate" defaultValue="Donate" />
                </Link>
                <Link
                  to="/take-action/sponsor-a-child"
                  className={`inline-flex items-center justify-center rounded-full border border-[#FBF7F0]/30 px-8 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[#FBF7F0] transition-all duration-300 hover:border-[#FBF7F0]/70 hover:bg-[#FBF7F0]/10 ${
                    isEditing ? "pointer-events-none" : ""
                  }`}
                >
                  <EditableText id="program.landing.grow.sponsor" defaultValue="Sponsor a child" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="lg:hidden">
        <section className="relative overflow-hidden px-5 pt-8">
          <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
            <span className="h-px w-6 bg-green-700" />
            <EditableText id="program.hero.eyebrow" defaultValue="Program Impact" />
          </span>
          <EditableText
            as="h1"
            id="program.landing.mobile.title"
            defaultValue="Every number is a child. Every project is a promise."
            multiline
            className="hero-serif block text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111]"
          />
          <EditableText
            as="p"
            id="program.landing.mobile.intro"
            defaultValue="Our reach, measured honestly. Our projects, told with dignity. Two views into the work MKCDP does every day."
            multiline
            className="mt-4 block text-[0.95rem] leading-[1.8] text-[#3D3D37]"
          />
          <div className="mt-7 grid grid-cols-3 divide-x divide-green-700/12 rounded-2xl border border-green-700/12 bg-white/60">
            {[
              { v: "2,833", l: "Children", key: "children" },
              { v: "100+", l: "Projects", key: "projects" },
              { v: "40K", l: "Lives", key: "lives" },
            ].map((item) => (
              <div key={item.key} className="px-3 py-4 text-center">
                <EditableText
                  as="p"
                  id={`program.hero.stat.${item.key}.v`}
                  defaultValue={item.v}
                  className="hero-serif block text-[1.1rem] font-bold leading-none text-green-700"
                />
                <EditableText
                  as="p"
                  id={`program.hero.stat.${item.key}.l`}
                  defaultValue={item.l}
                  className="mt-2 block text-[0.6rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]/75"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 px-5 pt-8">
          {SECTIONS.map((s) => (
            <Link
              key={s.slug}
              to={`/program-impact/${s.slug}`}
              className={`block overflow-hidden rounded-2xl border border-green-700/12 bg-white/80 shadow-[0_20px_50px_-40px_rgba(20,83,45,0.5)] transition-all duration-200 active:scale-[0.99] ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <EditableImage
                  id={`program.sections.${s.slug}.image`}
                  defaultValue={s.image}
                  alt={s.label}
                  className="h-full w-full object-cover"
                  wrapperClassName="h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <EditableText
                  as="span"
                  id={`program.sections.${s.slug}.tag`}
                  defaultValue={s.tag}
                  className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-green-700 backdrop-blur"
                />
              </div>
              <div className="p-5">
                <EditableText
                  as="h3"
                  id={`program.sections.${s.slug}.label`}
                  defaultValue={s.label}
                  className="hero-serif block text-[1.45rem] font-bold leading-tight text-[#111111]"
                />
                <EditableText
                  as="p"
                  id={`program.sections.${s.slug}.desc`}
                  defaultValue={s.desc}
                  multiline
                  className="mt-3 block text-[0.88rem] leading-[1.75] text-[#4A4A42]"
                />
              </div>
            </Link>
          ))}
        </section>

        <section className="px-5 pt-14">
          <span className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
            <span className="h-px w-6 bg-green-700" />
            <EditableText id="program.landing.why.eyebrow" defaultValue="Why this matters" />
          </span>
          <EditableText
            as="h2"
            id="program.landing.why.titleMobile"
            defaultValue="Numbers build the case. Stories build the trust."
            className="hero-serif block text-[1.7rem] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111]"
          />
          <div className="mt-6 space-y-3">
            {whyCards.map((card) => (
              <div
                key={card.key}
                className="rounded-2xl border border-green-700/12 bg-white/80 p-5"
              >
                <EditableText
                  as="span"
                  id={`program.landing.why.card.${card.key}.n`}
                  defaultValue={card.n}
                  className="hero-serif block text-[1.6rem] font-bold leading-none text-green-700/25"
                />
                <EditableText
                  as="p"
                  id={`program.landing.why.card.${card.key}.title`}
                  defaultValue={card.title}
                  className="hero-serif mt-3 block text-[1.05rem] font-bold leading-tight text-[#111111]"
                />
                <EditableText
                  as="p"
                  id={`program.landing.why.card.${card.key}.body`}
                  defaultValue={card.body}
                  multiline
                  className="mt-2 block text-[0.85rem] leading-[1.75] text-[#4A4A42]"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 pt-14 pb-16">
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="rounded-2xl border border-green-700/12 bg-white/80 p-4"
              >
                <p className="hero-serif text-[1.6rem] font-bold leading-none text-green-700">
                  <EditableText id={`program.stats.${i}.value`} defaultValue={s.value} />
                  <EditableText
                    as="span"
                    id={`program.stats.${i}.suffix`}
                    defaultValue={s.suffix}
                    className="text-[0.6em] align-top text-green-700/70"
                  />
                </p>
                <EditableText
                  as="p"
                  id={`program.stats.${i}.label`}
                  defaultValue={s.label}
                  className="mt-2 block text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/80"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/program-impact/our-reach"
              className={`inline-flex items-center justify-center rounded-full bg-green-700 px-8 py-4 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white active:scale-[0.99] ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableText id="program.landing.cta.reach" defaultValue="See our reach →" />
            </Link>
            <Link
              to="/program-impact/featured-projects"
              className={`inline-flex items-center justify-center rounded-full border border-green-700/25 px-8 py-4 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-green-700 ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableText id="program.landing.cta.projects" defaultValue="Walk through our projects" />
            </Link>
          </div>
        </section>

        <section className="-mx-5 bg-green-700 px-5 py-14">
          <span className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
            <span className="h-px w-6 bg-[#F2B33D]" />
            <EditableText id="program.landing.grow.eyebrow" defaultValue="Help us grow this page" />
          </span>
          <EditableText
            as="h2"
            id="program.landing.grow.title"
            defaultValue="Every new project starts with someone deciding to act."
            multiline
            className="hero-serif block text-[1.8rem] font-bold leading-[1.1] text-[#FBF7F0]"
          />
          <EditableText
            as="p"
            id="program.landing.grow.bodyMobile"
            defaultValue="Fund the next borehole. Sponsor the next classroom. Partner on the next idea. Whether you give monthly, once, or bring a company along — you become part of every number on this page."
            multiline
            className="mt-4 block text-[0.9rem] leading-[1.8] text-[#FBF7F0]/75"
          />
          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/take-action/donate"
              className={`inline-flex items-center justify-center rounded-full bg-[#F2B33D] px-8 py-4 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[#1C6B4B] active:scale-[0.99] ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableText id="program.landing.grow.donate" defaultValue="Donate" />
            </Link>
            <Link
              to="/take-action/sponsor-a-child"
              className={`inline-flex items-center justify-center rounded-full border border-[#FBF7F0]/30 px-8 py-4 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[#FBF7F0] ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableText id="program.landing.grow.sponsor" defaultValue="Sponsor a child" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

function OurReach() {
  const { isEditing } = useEditor();
  return (
    <>
      <div className="hidden lg:block">
        <div className="space-y-16 lg:space-y-24">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-green-700">
                <span className="h-px w-8 bg-green-700" />
                <EditableText id="program.reach.hero.eyebrow" defaultValue="Our Reach" />
              </span>
              <EditableText
                as="h1"
                id="program.reach.hero.title"
                defaultValue={"MKCDP's reach reflects the breadth and depth\nof our commitment to children."}
                multiline
                className="hero-serif block whitespace-pre-line text-[clamp(2rem,6.5vw,3.8rem)] font-bold leading-[1.05] tracking-[-0.028em] text-[#111111]"
              />
            </div>
            <EditableText
              as="p"
              id="program.reach.hero.intro"
              defaultValue="Across the communities surrounding Mt. Kilimanjaro, our work touches children, families and local leaders — together, we are building a future where every child is safe, in school, and supported to thrive."
              multiline
              className="block max-w-[520px] text-[1rem] leading-[1.85] text-[#4A4A42]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="rounded-3xl border border-green-700/12 bg-white/80 p-5 shadow-[0_20px_50px_-40px_rgba(20,83,45,0.4)] sm:p-6"
              >
                <p className="hero-serif text-[clamp(1.6rem,4.5vw,2.4rem)] font-bold leading-none text-green-700">
                  <EditableText id={`program.stats.${i}.value`} defaultValue={s.value} />
                  <EditableText
                    as="span"
                    id={`program.stats.${i}.suffix`}
                    defaultValue={s.suffix}
                    className="text-[0.6em] align-top text-green-700/70"
                  />
                </p>
                <EditableText
                  as="p"
                  id={`program.stats.${i}.label`}
                  defaultValue={s.label}
                  className="mt-3 block text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/80"
                />
              </div>
            ))}
          </div>

          <ReachCharts />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                idPrefix="program.reach.who"
                eyebrow="Who we reach"
                title="The children, families and communities behind our numbers."
              />
              <ul className="mt-8 space-y-4">
                {WHO_WE_REACH.map((line, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-700" />
                    <EditableText
                      as="p"
                      id={`program.reach.who.${i}`}
                      defaultValue={line}
                      multiline
                      className="block text-[0.95rem] leading-[1.75] text-[#4A4A42]"
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeading
                idPrefix="program.reach.measure"
                eyebrow="How we measure reach"
                title="Honest, verified data — reviewed again and again."
                intro="We track our reach through programme records, school and community registers, and regular monitoring activities. Reach data is reviewed periodically to ensure accuracy and accountability."
              />
            </div>
          </div>

          <div className="rounded-3xl border border-green-700/12 bg-white/80 p-8 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.4)] sm:p-10">
            <SectionHeading
              idPrefix="program.reach.impact"
              eyebrow="Impact beyond numbers"
              title="What the numbers actually mean for a child."
            />
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
              {IMPACT_BEYOND_NUMBERS.map((line, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-green-700/12 bg-green-700/5 p-5 sm:p-6"
                >
                  <span className="hero-serif text-[2rem] font-bold leading-none text-green-700/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <EditableText
                    as="p"
                    id={`program.reach.impact.${i}`}
                    defaultValue={line}
                    multiline
                    className="hero-serif mt-3 block text-[1.05rem] font-bold leading-tight text-[#111111]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-green-700/12 border-l-2 border-l-green-700 bg-white/70 p-6 sm:p-8">
            <EditableText
              as="p"
              id="program.reach.reporting.title"
              defaultValue="Reporting and transparency"
              className="block text-[0.7rem] font-bold uppercase tracking-[0.22em] text-green-700"
            />
            <EditableText
              as="p"
              id="program.reach.reporting.body"
              defaultValue="Our reach figures are shared through annual reports, donor updates and programme evaluations. We are committed to honest reporting — celebrating progress while openly acknowledging challenges."
              multiline
              className="mt-3 block max-w-[820px] text-[0.98rem] leading-[1.85] text-[#4A4A42]"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/program-impact/featured-projects"
              className={`inline-flex items-center justify-center gap-2 rounded-full bg-green-700 px-8 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_-16px_rgba(20,83,45,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableText id="program.reach.cta.projects" defaultValue="See featured projects →" />
            </Link>
            <a
              href="tel:+254737332219"
              className={`inline-flex items-center justify-center gap-2 rounded-full border border-green-700/25 px-8 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-all duration-300 hover:border-green-700/60 hover:bg-green-700/5 ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableText id="program.reach.cta.call" defaultValue="Call Us" />
            </a>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="space-y-12">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-6 bg-green-700" />
              <EditableText id="program.reach.hero.eyebrow" defaultValue="Our Reach" />
            </span>
            <EditableText
              as="h1"
              id="program.reach.hero.titleMobile"
              defaultValue="MKCDP's reach reflects our commitment to children. Across every community."
              multiline
              className="hero-serif block text-[2.1rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111]"
            />
            <EditableText
              as="p"
              id="program.reach.hero.introMobile"
              defaultValue="Across the communities surrounding Mt. Kilimanjaro, our work touches children, families and local leaders — together, we are building a future where every child is safe, in school, and supported to thrive."
              multiline
              className="mt-4 block text-[0.95rem] leading-[1.8] text-[#4A4A42]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {STATS.map((s, i) => (
              <div key={s.label} className="rounded-2xl border border-green-700/12 bg-white/80 p-4">
                <p className="hero-serif text-[1.6rem] font-bold leading-none text-green-700">
                  <EditableText id={`program.stats.${i}.value`} defaultValue={s.value} />
                  <EditableText
                    as="span"
                    id={`program.stats.${i}.suffix`}
                    defaultValue={s.suffix}
                    className="text-[0.6em] align-top text-green-700/70"
                  />
                </p>
                <EditableText
                  as="p"
                  id={`program.stats.${i}.label`}
                  defaultValue={s.label}
                  className="mt-2 block text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/80"
                />
              </div>
            ))}
          </div>

          <ReachCharts />

          <div>
            <span className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-6 bg-green-700" />
              <EditableText id="program.reach.who.eyebrow" defaultValue="Who we reach" />
            </span>
            <EditableText
              as="h2"
              id="program.reach.who.titleMobile"
              defaultValue="The people behind our numbers."
              className="hero-serif block text-[1.7rem] font-bold leading-[1.1] text-[#111111]"
            />
            <ul className="mt-5 space-y-3">
              {WHO_WE_REACH.map((line, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-700" />
                  <EditableText
                    as="p"
                    id={`program.reach.who.${i}`}
                    defaultValue={line}
                    multiline
                    className="block text-[0.9rem] leading-[1.75] text-[#4A4A42]"
                  />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-6 bg-green-700" />
              <EditableText id="program.reach.measure.eyebrow" defaultValue="How we measure reach" />
            </span>
            <EditableText
              as="h2"
              id="program.reach.measure.titleMobile"
              defaultValue="Honest, verified data."
              className="hero-serif block text-[1.7rem] font-bold leading-[1.1] text-[#111111]"
            />
            <EditableText
              as="p"
              id="program.reach.measure.bodyMobile"
              defaultValue="We track our reach through programme records, school and community registers, and regular monitoring activities. Reach data is reviewed periodically to ensure accuracy and accountability."
              multiline
              className="mt-4 block text-[0.9rem] leading-[1.8] text-[#4A4A42]"
            />
          </div>

          <div className="-mx-5 bg-green-700 px-5 py-14">
            <span className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
              <span className="h-px w-6 bg-[#F2B33D]" />
              <EditableText id="program.reach.impact.eyebrow" defaultValue="Impact beyond numbers" />
            </span>
            <EditableText
              as="h2"
              id="program.reach.impact.titleMobile"
              defaultValue="What the numbers mean for a child."
              className="hero-serif block text-[1.7rem] font-bold leading-[1.1] text-[#FBF7F0]"
            />
            <div className="mt-8 space-y-3">
              {IMPACT_BEYOND_NUMBERS.map((line, i) => (
                <div key={i} className="rounded-2xl border border-[#FBF7F0]/12 bg-[#FBF7F0]/5 p-5">
                  <span className="hero-serif text-[1.6rem] font-bold leading-none text-[#F2B33D]/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <EditableText
                    as="p"
                    id={`program.reach.impact.${i}`}
                    defaultValue={line}
                    multiline
                    className="hero-serif mt-3 block text-[1.05rem] font-bold leading-tight text-[#FBF7F0]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-green-700/12 border-l-2 border-l-green-700 bg-white/70 p-5">
            <EditableText
              as="p"
              id="program.reach.reporting.title"
              defaultValue="Reporting and transparency"
              className="block text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700"
            />
            <EditableText
              as="p"
              id="program.reach.reporting.body"
              defaultValue="Our reach figures are shared through annual reports, donor updates and programme evaluations. We are committed to honest reporting — celebrating progress while openly acknowledging challenges."
              multiline
              className="mt-3 block text-[0.9rem] leading-[1.8] text-[#4A4A42]"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/program-impact/featured-projects"
              className={`inline-flex items-center justify-center gap-2 rounded-full bg-green-700 px-8 py-4 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white active:scale-[0.99] ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableText id="program.reach.cta.projects" defaultValue="See featured projects →" />
            </Link>
            <a
              href="tel:+254737332219"
              className={`inline-flex items-center justify-center gap-2 rounded-full border border-green-700/25 px-8 py-4 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-green-700 ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableText id="program.reach.cta.call" defaultValue="Call Us" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function ProjectCard({ project, projectIndex }) {
  const base = `program.projects.${project.id}`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-green-700/12 bg-white/80 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-40px_rgba(20,83,45,0.55)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <EditableImage
          id={`${base}.image`}
          defaultValue={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          wrapperClassName="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <EditableText
          as="span"
          id={`${base}.category`}
          defaultValue={project.category}
          className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-green-700 backdrop-blur"
        />
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <EditableText
            as="p"
            id={`${base}.location`}
            defaultValue={project.location}
            className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/80"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <EditableText
          as="p"
          id={`${base}.year`}
          defaultValue={project.year}
          className="block text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700"
        />
        <EditableText
          as="h3"
          id={`${base}.title`}
          defaultValue={project.title}
          className="hero-serif mt-2 block text-[1.3rem] font-bold leading-tight text-[#111111] sm:text-[1.45rem]"
        />
        <EditableText
          as="p"
          id={`${base}.summary`}
          defaultValue={project.summary}
          multiline
          className="mt-3 block flex-1 text-[0.9rem] leading-[1.75] text-[#4A4A42]"
        />
        <div className="mt-5 grid grid-cols-3 gap-3 border-t border-green-700/12 pt-5">
          {project.stats.map((stat, j) => (
            <div key={j}>
              <EditableText
                as="p"
                id={`${base}.stat.${j}.value`}
                defaultValue={stat.value}
                className="hero-serif block text-[1rem] font-bold leading-none text-green-700"
              />
              <EditableText
                as="p"
                id={`${base}.stat.${j}.label`}
                defaultValue={stat.label}
                className="mt-1.5 block text-[0.6rem] font-bold uppercase tracking-[0.12em] text-[#4A4A42]/70"
              />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function FeaturedProjects() {
  const { isEditing } = useEditor();
  return (
    <>
      <div className="hidden lg:block">
        <div className="space-y-16 lg:space-y-24">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-green-700">
                <span className="h-px w-8 bg-green-700" />
                <EditableText id="program.projects.hero.eyebrow" defaultValue="Featured Projects" />
              </span>
              <EditableText
                as="h1"
                id="program.projects.hero.title"
                defaultValue={"Water. Livelihoods. Learning.\nThree stories on the ground."}
                multiline
                className="hero-serif block whitespace-pre-line text-[clamp(2rem,6.5vw,3.8rem)] font-bold leading-[1.05] tracking-[-0.028em] text-[#111111]"
              />
            </div>
            <EditableText
              as="p"
              id="program.projects.hero.intro"
              defaultValue="Some of our work is a borehole. Some is fifty beehives. Some is simply a child in a classroom, day after day. Here are three projects that show what a community can do when it is given the tools to build its own future."
              multiline
              className="block max-w-[520px] text-[1rem] leading-[1.85] text-[#4A4A42]"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {FEATURED_PROJECTS.map((project, i) => (
              <ProjectCard key={project.id} project={project} projectIndex={i} />
            ))}
          </div>

          <div className="rounded-3xl border border-green-700/12 border-l-2 border-l-green-700 bg-white/70 p-6 sm:p-8">
            <EditableText
              as="p"
              id="program.projects.more.title"
              defaultValue="More projects coming"
              className="block text-[0.7rem] font-bold uppercase tracking-[0.22em] text-green-700"
            />
            <EditableText
              as="p"
              id="program.projects.more.body"
              defaultValue="These featured projects are only a small sample of the 100+ initiatives we have delivered since MKCDP began. New projects — water, education, health and livelihoods — are documented here as they launch and complete."
              multiline
              className="mt-3 block max-w-[820px] text-[0.98rem] leading-[1.85] text-[#4A4A42]"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/take-action/donate"
              className={`inline-flex items-center hover:bg-green-700 hover:text-white justify-center gap-2 rounded-full border border-green-700/25 px-8 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-all duration-300 hover:border-green-700/60 ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableText id="program.projects.cta.support" defaultValue="Support the next project" />
            </Link>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="space-y-12">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-6 bg-green-700" />
              <EditableText id="program.projects.hero.eyebrow" defaultValue="Featured Projects" />
            </span>
            <EditableText
              as="h1"
              id="program.projects.hero.titleMobile"
              defaultValue="Water. Livelihoods. Learning. Three stories on the ground."
              multiline
              className="hero-serif block text-[2.1rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111]"
            />
            <EditableText
              as="p"
              id="program.projects.hero.introMobile"
              defaultValue="Some of our work is a borehole. Some is fifty beehives. Some is simply a child in a classroom, day after day. Here are three projects that show what a community can do when it is given the tools to build its own future."
              multiline
              className="mt-4 block text-[0.95rem] leading-[1.8] text-[#4A4A42]"
            />
          </div>

          <div className="space-y-6">
            {FEATURED_PROJECTS.map((project, i) => (
              <ProjectCard key={project.id} project={project} projectIndex={i} />
            ))}
          </div>

          <div className="rounded-3xl border border-green-700/12 border-l-2 border-l-green-700 bg-white/70 p-5">
            <EditableText
              as="p"
              id="program.projects.more.title"
              defaultValue="More projects coming"
              className="block text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700"
            />
            <EditableText
              as="p"
              id="program.projects.more.bodyMobile"
              defaultValue="These featured projects are only a small sample of the 100+ initiatives we have delivered since MKCDP began. New projects are documented here as they launch and complete."
              multiline
              className="mt-3 block text-[0.9rem] leading-[1.8] text-[#4A4A42]"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/program-impact/our-reach"
              className={`inline-flex items-center justify-center gap-2 rounded-full bg-green-700 px-8 py-4 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white active:scale-[0.99] ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableText id="program.projects.cta.back" defaultValue="← Back to Our Reach" />
            </Link>
            <Link
              to="/take-action/donate"
              className={`inline-flex items-center justify-center gap-2 rounded-full border border-green-700/25 px-8 py-4 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-green-700 ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableText id="program.projects.cta.support" defaultValue="Support the next project" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function NotFound() {
  const { isEditing } = useEditor();
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center py-20">
      <div className="mx-auto max-w-[600px] px-5 text-center sm:px-6">
        <EditableText
          as="p"
          id="program.notFound.kicker"
          defaultValue="Page not found"
          className="block text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700"
        />
        <EditableText
          as="h1"
          id="program.notFound.title"
          defaultValue="We couldn't find that page in the Program Impact section."
          multiline
          className="hero-serif mt-5 block text-[clamp(1.6rem,6vw,2.8rem)] font-bold leading-tight text-[#111111]"
        />
        <Link
          to="/program-impact"
          className={`mt-10 inline-flex items-center rounded-xl bg-green-700 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-950 ${
            isEditing ? "pointer-events-none" : ""
          }`}
        >
          <EditableText id="program.notFound.cta" defaultValue="Back to Program Impact" />
        </Link>
      </div>
    </section>
  );
}

export default function ProgramImpact() {
  const { section } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [section]);

  const active = section ? SECTIONS.find((s) => s.slug === section) : null;

  return (
    <div className="hero-sans relative min-h-screen overflow-x-hidden bg-[#FBF7F0] text-[#141414] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,600;1,700&family=Montserrat:wght@400;500;600;700;800;900&display=swap');
        .hero-serif { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
        .hero-sans { font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        html { scroll-behavior: smooth; }
        ::selection { background: #14532D; color: #FBF7F0; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 640px) {
          input, select, textarea { font-size: 16px !important; }
        }
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

      {!section && <ProgramImpactLanding />}

      {section && !active && <NotFound />}

      {section && active && (
        <>
          <MobileBreadcrumb label={active.label} />
          <DesktopBreadcrumb label={active.label} />
          <main className="relative py-10 pb-16 sm:py-16 lg:py-24">
            <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-14">
              {active.id === "our-reach" && <OurReach />}
              {active.id === "featured-projects" && <FeaturedProjects />}
            </div>
          </main>
        </>
      )}
    </div>
  );
}