import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const SECTIONS = [
  {
    slug: "what-we-do",
    id: "what-we-do",
    label: "What We Do",
    desc: "Education, health, protection and livelihoods — the four programme areas that anchor every child's wellbeing.",
    tag: "Programmes",
    image: "/img1.jpg",
    accent: "#E2703A",
  },
  {
    slug: "where-we-work",
    id: "where-we-work",
    label: "Where We Work",
    desc: "Communities around Mt. Kilimanjaro — Moshi Rural, Hai, Siha and Rombo — where vulnerability meets opportunity.",
    tag: "Geographic reach",
    image: "/img3.jpg",
    accent: "#F2B33D",
  },
  {
    slug: "how-we-work",
    id: "how-we-work",
    label: "How We Work",
    desc: "Child-centred, community-driven and partnership-based. Seven principles that shape every programme we run.",
    tag: "Our approach",
    image: "/img4.jpg",
    accent: "#7FB069",
  },
];

const SERVICES = [
  {
    icon: "school",
    title: "Education",
    body: "School fees, learning materials, uniforms, mentorship and after-school support so every child stays in class and thrives.",
  },
  {
    icon: "heart",
    title: "Health & Nutrition",
    body: "Routine check-ups, immunisation support, nutrition programmes and referrals to partner health facilities.",
  },
  {
    icon: "shield",
    title: "Child Protection",
    body: "Safeguarding systems, community awareness, survivor support and safe reporting pathways for every child.",
  },
  {
    icon: "users",
    title: "Family & Livelihoods",
    body: "Household economic strengthening through savings groups, skills training and small enterprise support.",
  },
];

const APPROACH = [
  {
    n: "01",
    title: "Child Centred",
    body: "Every decision begins with what is best for the child — their safety, dignity and long-term development.",
  },
  {
    n: "02",
    title: "Family and Community Focused",
    body: "Children thrive inside strong families and communities. We work with both, never around them.",
  },
  {
    n: "03",
    title: "Preventive and Protective",
    body: "We act early to reduce risk, and we respond quickly when a child needs protection.",
  },
  {
    n: "04",
    title: "Partnership Driven",
    body: "We collaborate with government, schools, health facilities and local organisations to strengthen existing systems.",
  },
  {
    n: "05",
    title: "Sustainable and Locally Led",
    body: "Communities lead. We invest in local capacity so change continues long after direct support ends.",
  },
  {
    n: "06",
    title: "Accountable and Learning Oriented",
    body: "We track progress, listen to feedback, and let what we learn shape what we do next.",
  },
];

const HOW_PILLARS = [
  {
    n: "01",
    icon: "users",
    title: "Community engagement and participation",
    body: "We begin by listening. MKCDP works with community leaders, caregivers, schools and children themselves to understand local needs, risks and priorities. Communities are involved in programme design, implementation and review to ensure relevance and ownership.",
  },
  {
    n: "02",
    icon: "sparkle",
    title: "Integrated child development approach",
    body: "Rather than addressing a single issue, MKCDP supports the whole child by integrating education, health and nutrition, psychosocial care, child protection, and family economic strengthening.",
  },
  {
    n: "03",
    icon: "shield",
    title: "Safeguarding-first programming",
    body: "Child safeguarding is embedded in all activities. Staff, volunteers, partners and visitors follow strict safeguarding policies, codes of conduct and reporting procedures to ensure children are protected at all times.",
  },
  {
    n: "04",
    icon: "globe",
    title: "Partnerships and collaboration",
    body: "MKCDP collaborates with local government authorities, schools, early learning centres, health facilities, and community-based organisations to strengthen existing systems and avoid duplication.",
  },
  {
    n: "05",
    icon: "book",
    title: "Capacity building and sustainability",
    body: "We invest in caregivers, teachers, community volunteers and local institutions so that positive change continues beyond direct programme support.",
  },
  {
    n: "06",
    icon: "chart",
    title: "Monitoring, learning and accountability",
    body: "We track progress through regular monitoring, community feedback and evaluations. Lessons learned inform programme improvements and ensure accountability to children, communities and donors.",
  },
  {
    n: "07",
    icon: "heart",
    title: "Respect, dignity and inclusion",
    body: "We uphold the dignity of every child and family, ensuring programmes are inclusive and accessible to children with disabilities and those facing discrimination.",
  },
];

const REACH_AREAS = [
  {
    n: "01",
    title: "Rural and peri-urban villages",
    body: "Communities where access to basic services — schools, clinics, clean water — is limited or unreliable.",
  },
  {
    n: "02",
    title: "Low-income communities",
    body: "Households facing high rates of school dropout, child malnutrition and economic vulnerability.",
  },
  {
    n: "03",
    title: "Hard-to-reach areas",
    body: "Families facing geographic and systemic barriers to healthcare, clean water and child protection services.",
  },
];

const DISTRICTS = [
  { name: "Moshi Rural", note: "Our largest programme footprint" },
  { name: "Hai District", note: "Education and health focus" },
  { name: "Siha District", note: "Child protection and livelihoods" },
  { name: "Rombo", note: "Water access and nutrition" },
];

const STATS = [
  { value: "2,833", suffix: "+", label: "Enrolled Children" },
  { value: "2,396", suffix: "+", label: "Sponsored Children" },
  { value: "40", suffix: "K", label: "Participants Supported" },
  { value: "100", suffix: "+", label: "Projects" },
];

const Icon = {
  Heart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" />
    </svg>
  ),
  Users: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c.7-3.4 3.3-5.4 6.5-5.4s5.8 2 6.5 5.4" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M15 20c.3-2.4 1.7-4 3.6-4 1.8 0 3 .8 3.4 2.4" />
    </svg>
  ),
  ArrowRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  ArrowLeft: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  ),
  ChevronRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  ),
  Check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m5 12.5 5 5 9-11" />
    </svg>
  ),
  Shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3l7 3v6c0 4.6-3 8.1-7 9-4-.9-7-4.4-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Globe: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
    </svg>
  ),
  Sparkle: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />
    </svg>
  ),
  School: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m3 10 9-6 9 6-9 6z" />
      <path d="M5 11v6c0 1 3.5 3 7 3s7-2 7-3v-6" />
    </svg>
  ),
  Book: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" />
      <path d="M17 4h2v16h-2" />
    </svg>
  ),
  Chart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </svg>
  ),
  MapPin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  Phone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5Z" />
    </svg>
  ),
  Target: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
};

const wayIcon = (key, cls) => {
  const map = {
    heart: Icon.Heart,
    users: Icon.Users,
    shield: Icon.Shield,
    globe: Icon.Globe,
    sparkle: Icon.Sparkle,
    school: Icon.School,
    book: Icon.Book,
    chart: Icon.Chart,
    target: Icon.Target,
  };
  const Cmp = map[key] || Icon.Heart;
  return <Cmp className={cls} />;
};

function SectionHeading({ eyebrow, title, intro, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-[720px] text-center" : "max-w-[720px]"}>
      <span
        className={`mb-4 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-green-700 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-8 bg-green-700" />
        {eyebrow}
      </span>
      <h2 className="hero-serif text-[clamp(1.7rem,4vw,2.9rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#111111]">
        {title}
      </h2>
      {intro && <p className="mt-5 text-[1rem] leading-[1.85] text-[#4A4A42]">{intro}</p>}
    </div>
  );
}

function OurWorkHub() {
  return (
    <div className="space-y-24 lg:space-y-32">
      <section className="relative overflow-hidden pt-16 lg:pt-24">
        <div className="mx-auto max-w-[1560px] px-6 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-[860px] text-center">
            <span className="mb-5 inline-flex items-center justify-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-green-700">
              <span className="h-px w-8 bg-green-700" />
              Our Work
            </span>
            <h1 className="hero-serif text-[clamp(2.1rem,6.4vw,4.4rem)] font-bold leading-[1.06] tracking-[-0.022em] text-[#111111]">
              Putting children first.
            </h1>
            <p className="mx-auto mt-7 max-w-[640px] text-[1.0625rem] leading-[1.85] text-[#3D3D37]">
              Children are our future — and our present. We work with communities across Kenya
              to help children and families meet their most urgent needs for health, education,
              skills and safety. Today MKCDP focuses on sustainable, community-driven programmes
              that target the root causes of child vulnerability: poverty, lack of access to
              quality education, hunger and limited access to healthcare.
            </p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1560px] px-6 sm:px-10 lg:px-14">
        <SectionHeading
          eyebrow="Our services"
          title="Four programme areas. One child at the centre."
          intro="Choose one of the programme areas below to learn more about our work, or use the links further down to see how and where we deliver it."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group flex flex-col rounded-3xl border border-green-700/12 bg-white/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-green-700/30 hover:bg-white/85"
            >
              <span className="mb-6 block h-1 w-10 rounded-full bg-green-700/60 transition-all duration-300 group-hover:w-14 group-hover:bg-green-700" />
              <h3 className="hero-serif text-[1.25rem] font-bold leading-tight text-[#111111]">
                {s.title}
              </h3>
              <p className="mt-3 flex-1 text-[0.9rem] leading-[1.75] text-[#4A4A42]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-[1560px] px-6 sm:px-10 lg:px-14">
        <SectionHeading
          eyebrow="Explore deeper"
          title="Two more pages to take you inside our work."
          intro="Learn how our programmes are designed, and where in Kajiado South they are delivered."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {SECTIONS.filter((s) => s.id !== "what-we-do").map((s) => (
            <Link
              key={s.slug}
              to={`/our-work/${s.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-[28px] border border-green-700/12 bg-white/70 shadow-[0_28px_70px_-46px_rgba(20,83,45,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_36px_80px_-46px_rgba(20,83,45,0.65)]"
            >
              <div className="h-2 w-full" style={{ backgroundColor: s.accent }} />

              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-green-700">
                  {s.tag}
                </p>
                <p className="hero-serif mt-3 text-[clamp(1.5rem,2.6vw,2rem)] font-bold leading-tight text-[#111111]">
                  {s.label}
                </p>
                <p className="mt-4 flex-1 text-[0.95rem] leading-[1.8] text-[#4A4A42]">{s.desc}</p>
                <div className="mt-6 inline-flex w-fit items-center justify-center rounded-xl bg-green-700 px-5 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 group-hover:bg-[#15543A]">
                  Open page
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-green-700 py-20 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(251,247,240,0.09) 0px, rgba(251,247,240,0.09) 1px, transparent 1px, transparent 22px)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)",
            maskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)",
          }}
        />

        <div className="relative mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
                <span className="h-px w-8 bg-[#F2B33D]" />
                Our impact in numbers
              </span>
              <h2 className="hero-serif text-[clamp(1.8rem,4.2vw,3rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#FBF7F0]">
                Numbers that carry names, families and futures.
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="border-l-2 border-[#F2B33D]/60 pl-5">
                  <p className="hero-serif text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-none text-[#FBF7F0]">
                    {s.value}
                    {s.suffix && <span className="text-[#F2B33D]">{s.suffix}</span>}
                  </p>
                  <p className="mt-3 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#FBF7F0]/60">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1560px] px-6 sm:px-10 lg:px-14">
        <SectionHeading
          eyebrow="Our approach"
          title="Six principles that guide every programme."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {APPROACH.map((a) => (
            <div
              key={a.n}
              className="group relative overflow-hidden rounded-3xl border border-green-700/12 bg-white/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-green-700/30 hover:bg-white/85"
            >
              <span className="hero-serif text-[2.4rem] font-bold leading-none text-green-700/15 transition-colors duration-300 group-hover:text-green-700/35">
                {a.n}
              </span>
              <h3 className="hero-serif mt-5 text-[1.2rem] font-bold leading-tight text-[#111111]">
                {a.title}
              </h3>
              <p className="mt-3 text-[0.9rem] leading-[1.75] text-[#4A4A42]">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-[1360px] px-6 sm:px-10 lg:px-14">
        <div className="relative overflow-hidden rounded-[36px] bg-green-700 px-8 py-16 sm:px-14 lg:px-20 lg:py-24">
          <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
                <span className="h-px w-8 bg-[#F2B33D]" />
                Join us
              </span>
              <h3 className="hero-serif text-[clamp(1.7rem,3.6vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.02em] text-[#FBF7F0]">
                Join us in building brighter futures for children around Mt. Kilimanjaro.
              </h3>
              <p className="mt-6 max-w-[560px] text-[0.98rem] leading-[1.85] text-[#FBF7F0]/70">
                Whether you give, volunteer or partner with us, your contribution reaches a real
                child in a real classroom — and stays with them for years.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <Link
                to="/about"
                className="inline-flex w-fit items-center rounded-xl bg-[#FBF7F0] px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
              >
                Learn more about us
              </Link>
              <Link
                to="/take-action/donate"
                className="inline-flex w-fit items-center rounded-xl border border-[#FBF7F0]/30 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[#FBF7F0] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FBF7F0] hover:text-green-700"
              >
                Donate now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function WhereWeWork() {
  return (
    <div className="space-y-20 lg:space-y-28">
      <section className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-green-700">
            <span className="h-px w-8 bg-green-700" />
            Where We Work
          </span>

          <h1 className="hero-serif text-[clamp(2rem,5.4vw,3.8rem)] font-bold leading-[1.05] tracking-[-0.022em] text-[#111111]">
            Around Mt. Kilimanjaro.
            <br />
            <span className="italic text-green-700">Where vulnerability meets opportunity.</span>
          </h1>

          <p className="mt-8 max-w-[540px] text-[1.0625rem] leading-[1.85] text-[#3D3D37]">
            The Mt. Kilimanjaro Child Development Programme (MKCDP) works in communities located
            around the Mt. Kilimanjaro region, focusing on areas where children face the highest
            levels of vulnerability due to poverty, limited access to education, food insecurity
            and inadequate healthcare.
          </p>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-[28px] border border-green-700/15 bg-white/65 p-8 shadow-[0_28px_60px_-34px_rgba(20,83,45,0.35)] sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-700 via-[#7FB069] to-[#F2B33D]"
            />
            <span className="grid h-12 w-12 place-items-center rounded-full bg-green-700/8 text-green-700">
              <Icon.MapPin className="h-5 w-5" />
            </span>
            <p className="mt-6 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              Primary operating region
            </p>
            <p className="hero-serif mt-3 text-[clamp(1.3rem,2.4vw,1.7rem)] font-bold leading-tight text-[#111111]">
              Moshi Rural, Hai District, Siha District &amp; Rombo
            </p>
            <p className="mt-4 text-[0.95rem] leading-[1.8] text-[#4A4A42]">
              Communities surrounding Mt. Kilimanjaro, where the need is greatest and the impact
              of consistent support is highest.
            </p>
          </div>

          <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute -right-4 -top-6 z-10 w-16 rotate-12">
            <path d="M52 9c21 1 38 15 37 36-1 24-20 45-44 44C24 88 8 70 9 49 10 26 28 8 52 9Z" fill="none" stroke="#E2703A" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Why these communities"
          title="Where the need is highest."
          intro="We deliberately focus on communities where children face overlapping barriers — so that every shilling goes where it changes the most."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {REACH_AREAS.map((r) => (
            <div
              key={r.n}
              className="group relative overflow-hidden rounded-3xl border border-green-700/12 bg-white/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-green-700/30 hover:bg-white/85"
            >
              <span className="hero-serif text-[2.6rem] font-bold leading-none text-green-700/15 transition-colors duration-300 group-hover:text-green-700/35">
                {r.n}
              </span>
              <h3 className="hero-serif mt-5 text-[1.25rem] font-bold leading-tight text-[#111111]">
                {r.title}
              </h3>
              <p className="mt-3 text-[0.94rem] leading-[1.8] text-[#4A4A42]">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-green-700/12 bg-white/55 p-8 sm:p-12 lg:p-14">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-green-700/15 pb-6">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-8 bg-green-700" />
              Our districts
            </span>
            <h3 className="hero-serif text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight text-[#111111]">
              Four districts. One shared mission.
            </h3>
          </div>
          <p className="text-[0.85rem] text-[#4A4A42]/75">
            Programme focus varies slightly by district, based on local priorities.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DISTRICTS.map((d) => (
            <div
              key={d.name}
              className="rounded-2xl border border-green-700/12 bg-white/70 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-700/30"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-green-700/8 text-green-700">
                <Icon.MapPin className="h-4 w-4" />
              </span>
              <p className="hero-serif mt-5 text-[1.15rem] font-bold leading-tight text-[#111111]">
                {d.name}
              </p>
              <p className="mt-2 text-[0.85rem] leading-[1.7] text-[#4A4A42]">{d.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-green-700 px-8 py-16 sm:px-14 lg:px-20 lg:py-24">
        <svg viewBox="0 0 120 120" aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 w-40 rotate-12 opacity-30">
          <path d="M18 76c6-30 34-54 66-50 20 3 30 20 22 34-10 17-36 24-58 18" fill="none" stroke="#7FB069" strokeWidth="8" strokeLinecap="round" />
        </svg>

        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
              <span className="h-px w-8 bg-[#F2B33D]" />
              Visit us
            </span>
            <h3 className="hero-serif text-[clamp(1.7rem,3.6vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.02em] text-[#FBF7F0]">
              Come and see the work for yourself.
            </h3>
            <p className="mt-6 max-w-[560px] text-[0.98rem] leading-[1.85] text-[#FBF7F0]/70">
              We host structured partner visits throughout the year. All visitors sign our
              safeguarding code of conduct before any contact with children.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <a
              href="tel:+254782216288"
              className="group inline-flex w-fit items-center gap-3 rounded-xl bg-[#FBF7F0] px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              <Icon.Phone className="h-4 w-4" />
              +254 737 332 219
            </a>
            <Link
              to="/take-action/report-safeguarding"
              className="inline-flex w-fit items-center gap-3 rounded-xl border border-[#FBF7F0]/30 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[#FBF7F0] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FBF7F0] hover:text-green-700"
            >
              Report a concern
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function HowWeWork() {
  return (
    <div className="space-y-20 lg:space-y-28">
      <section className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-green-700">
            <span className="h-px w-8 bg-green-700" />
            How We Work
          </span>

          <h1 className="hero-serif text-[clamp(2rem,5.4vw,3.8rem)] font-bold leading-[1.05] tracking-[-0.022em] text-[#111111]">
            Child-centred.
            <br />
            Community-driven.
            <br />
            <span className="italic text-green-700">Partnership-based.</span>
          </h1>

          <p className="mt-8 max-w-[540px] text-[1.0625rem] leading-[1.85] text-[#3D3D37]">
            MKCDP works through a child-centred, community-driven and partnership-based approach
            that places children's wellbeing, safety and long-term development at the core of
            every programme.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/take-action/donate"
              className="group inline-flex items-center gap-3 rounded-full bg-green-700 px-8 py-[1.15rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_-16px_rgba(20,83,45,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A]"
            >
              Donate now
              <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/our-work/where-we-work"
              className="inline-flex items-center gap-3 rounded-full border border-green-700/25 px-8 py-[1.15rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-all duration-300 hover:border-green-700/60 hover:bg-green-700/5"
            >
              Where we work
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-[28px] border border-green-700/15 bg-white/65 p-8 shadow-[0_28px_60px_-34px_rgba(20,83,45,0.35)] sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-700 via-[#7FB069] to-[#F2B33D]"
            />
            <span className="grid h-12 w-12 place-items-center rounded-full bg-green-700/8 text-green-700">
              <Icon.Target className="h-5 w-5" />
            </span>
            <p className="mt-6 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              Our promise
            </p>
            <p className="hero-serif mt-3 text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium italic leading-[1.55] text-[#111111]">
              &ldquo;Every programme is designed with children, not just for them.&rdquo;
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-green-700/12 pt-6">
              <div>
                <p className="hero-serif text-[1.5rem] font-bold leading-none text-green-700">7</p>
                <p className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/75">
                  Guiding principles
                </p>
              </div>
              <div>
                <p className="hero-serif text-[1.5rem] font-bold leading-none text-green-700">4</p>
                <p className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/75">
                  Districts served
                </p>
              </div>
              <div>
                <p className="hero-serif text-[1.5rem] font-bold leading-none text-green-700">100%</p>
                <p className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/75">
                  Safeguarding audited
                </p>
              </div>
            </div>
          </div>

          <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute -right-4 -top-6 z-10 w-16 rotate-12">
            <path d="M52 9c21 1 38 15 37 36-1 24-20 45-44 44C24 88 8 70 9 49 10 26 28 8 52 9Z" fill="none" stroke="#E2703A" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Our principles"
          title="Seven pillars behind every programme."
          intro="Each of these principles shows up in the design, delivery and review of every project we run."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_PILLARS.map((p) => (
            <div
              key={p.n}
              className="group flex flex-col rounded-3xl border border-green-700/12 bg-white/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-green-700/30 hover:bg-white/85"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-green-700/8 text-green-700 transition-colors duration-300 group-hover:bg-green-700 group-hover:text-white">
                  {wayIcon(p.icon, "h-5 w-5")}
                </span>
                <span className="hero-serif text-[1.6rem] font-bold leading-none text-green-700/15 transition-colors duration-300 group-hover:text-green-700/35">
                  {p.n}
                </span>
              </div>

              <h3 className="hero-serif mt-6 text-[1.2rem] font-bold leading-tight text-[#111111]">
                {p.title}
              </h3>
              <p className="mt-3 text-[0.9rem] leading-[1.8] text-[#4A4A42]">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-green-700/12 bg-white/55 p-8 sm:p-12 lg:p-14">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="In practice"
              title="What this looks like on the ground."
              intro="These principles are not slogans. Here is how they translate into the work we do every day."
            />
          </div>

          <ul className="space-y-5">
            {[
              "A community meeting before a new programme starts — not after.",
              "A health check for a sponsored child that also looks at nutrition, not just attendance.",
              "A safeguarding briefing for every visitor before they meet a single child.",
              "A local nurse or teacher trained to spot warning signs early.",
              "A quarterly review with community leaders to hear what is working and what is not.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-4">
                <span className="mt-0.5 grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-green-700 text-white">
                  <Icon.Check className="h-3 w-3" />
                </span>
                <p className="text-[0.95rem] leading-[1.8] text-[#3D3D37]">{line}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-green-700 px-8 py-16 sm:px-14 lg:px-20 lg:py-24">
        <svg viewBox="0 0 120 120" aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 w-40 rotate-12 opacity-30">
          <path d="M18 76c6-30 34-54 66-50 20 3 30 20 22 34-10 17-36 24-58 18" fill="none" stroke="#7FB069" strokeWidth="8" strokeLinecap="round" />
        </svg>

        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
              <span className="h-px w-8 bg-[#F2B33D]" />
              Work with us
            </span>
            <h3 className="hero-serif text-[clamp(1.7rem,3.6vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.02em] text-[#FBF7F0]">
              Help us put these principles to work.
            </h3>
            <p className="mt-6 max-w-[560px] text-[0.98rem] leading-[1.85] text-[#FBF7F0]/70">
              Volunteer with us, partner with us, or give monthly — every path puts a child
              in school and keeps them there.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <Link
              to="/take-action/volunteer"
              className="group inline-flex w-fit items-center gap-3 rounded-xl bg-[#FBF7F0] px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              Volunteer with us
              <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/take-action/partnerships"
              className="inline-flex w-fit items-center gap-3 rounded-xl border border-[#FBF7F0]/30 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[#FBF7F0] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FBF7F0] hover:text-green-700"
            >
              Partner with us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function WhatWeDo() {
  return (
    <div className="space-y-20 lg:space-y-28">
      <section className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-green-700">
            <span className="h-px w-8 bg-green-700" />
            What We Do
          </span>
          <h1 className="hero-serif text-[clamp(2rem,5.4vw,3.8rem)] font-bold leading-[1.05] tracking-[-0.022em] text-[#111111]">
            Putting children first.
          </h1>
          <p className="mt-8 max-w-[540px] text-[1.0625rem] leading-[1.85] text-[#3D3D37]">
            Children are our future — and our present. We work with communities across Kenya to
            help children and families meet their basic, most urgent needs for health, education,
            skills and safety.
          </p>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-[28px] border border-green-700/15 bg-white/65 p-8 shadow-[0_28px_60px_-34px_rgba(20,83,45,0.35)] sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-700 via-[#7FB069] to-[#F2B33D]"
            />
            <span className="grid h-12 w-12 place-items-center rounded-full bg-green-700/8 text-green-700">
              <Icon.Heart className="h-5 w-5" />
            </span>
            <p className="mt-6 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              Our focus
            </p>
            <p className="hero-serif mt-3 text-[clamp(1.15rem,2.2vw,1.5rem)] font-medium italic leading-[1.55] text-[#111111]">
              &ldquo;Sustainable, community-driven programmes that target the root causes of
              child vulnerability.&rdquo;
            </p>
          </div>

          <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute -right-4 -top-6 z-10 w-16 rotate-12">
            <path d="M52 9c21 1 38 15 37 36-1 24-20 45-44 44C24 88 8 70 9 49 10 26 28 8 52 9Z" fill="none" stroke="#E2703A" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Our services"
          title="Four programme areas."
          intro="Each area reinforces the others. A child who is healthy learns better. A child who is protected stays in school. A family with an income can keep both going."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group flex flex-col rounded-3xl border border-green-700/12 bg-white/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-green-700/30 hover:bg-white/85"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-green-700/8 text-green-700 transition-colors duration-300 group-hover:bg-green-700 group-hover:text-white">
                {wayIcon(s.icon, "h-5 w-5")}
              </span>
              <h3 className="hero-serif mt-6 text-[1.25rem] font-bold leading-tight text-[#111111]">
                {s.title}
              </h3>
              <p className="mt-3 flex-1 text-[0.9rem] leading-[1.75] text-[#4A4A42]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Our impact in numbers"
          title="Our reach."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-3xl border border-green-700/12 bg-white/60 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-green-700/30 hover:bg-white/85"
            >
              <p className="hero-serif text-[clamp(2rem,4.4vw,2.9rem)] font-bold leading-none text-green-700">
                {s.value}
                {s.suffix && <span className="text-[#E2703A]">{s.suffix}</span>}
              </p>
              <p className="mt-4 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#4A4A42]/80">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-green-700 px-8 py-16 sm:px-14 lg:px-20 lg:py-24">
        <svg viewBox="0 0 120 120" aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 w-40 rotate-12 opacity-30">
          <path d="M18 76c6-30 34-54 66-50 20 3 30 20 22 34-10 17-36 24-58 18" fill="none" stroke="#7FB069" strokeWidth="8" strokeLinecap="round" />
        </svg>

        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
              <span className="h-px w-8 bg-[#F2B33D]" />
              Join us
            </span>
            <h3 className="hero-serif text-[clamp(1.7rem,3.6vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.02em] text-[#FBF7F0]">
              Join us in building brighter futures for children around Mt. Kilimanjaro.
            </h3>
            <p className="mt-6 max-w-[560px] text-[0.98rem] leading-[1.85] text-[#FBF7F0]/70">
              Choose a child to sponsor, give once, or volunteer your time. Every path leads to a
              real child in a real classroom.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <Link
              to="/take-action/sponsor-a-child"
              className="group inline-flex w-fit items-center gap-3 rounded-xl bg-[#FBF7F0] px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              Sponsor a child
              <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/take-action/donate"
              className="inline-flex w-fit items-center gap-3 rounded-xl border border-[#FBF7F0]/30 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[#FBF7F0] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FBF7F0] hover:text-green-700"
            >
              Donate now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Breadcrumb({ label }) {
  return (
    <nav aria-label="Breadcrumb" className="relative border-b border-green-700/12 bg-[#FBF7F0]">
      <div className="mx-auto max-w-[1560px] px-6 py-5 sm:px-10 lg:px-14 lg:py-6">
        <ol className="flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.16em]">
          <li>
            <Link
              to="/our-work"
              className="text-green-700 transition-colors duration-200 hover:text-green-950 hover:underline"
            >
              Our Work
            </Link>
          </li>
          <li aria-hidden="true" className="text-green-700/35">
            <Icon.ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li className="text-[#4A4A42]" aria-current="page">
            {label}
          </li>
        </ol>
      </div>
    </nav>
  );
}

function NotFound() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center py-20">
      <div className="mx-auto max-w-[600px] px-6 text-center">
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700">
          Page not found
        </p>
        <h1 className="hero-serif mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight text-[#111111]">
          We couldn't find that page in the Our Work section.
        </h1>
        <Link
          to="/our-work"
          className="mt-10 inline-flex items-center gap-3 rounded-xl bg-green-700 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-950"
        >
          Back to Our Work
          <Icon.ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export default function OurWork() {
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

      {!section && <OurWorkHub />}

      {section && !active && <NotFound />}

      {section && active && (
        <>
          <Breadcrumb label={active.label} />
          <main className="relative py-16 lg:py-24">
            <div className="mx-auto max-w-[1560px] px-6 sm:px-10 lg:px-14">
              {active.id === "what-we-do" && <WhatWeDo />}
              {active.id === "where-we-work" && <WhereWeWork />}
              {active.id === "how-we-work" && <HowWeWork />}
            </div>
          </main>
        </>
      )}
    </div>
  );
}