import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useEditor,
  EditableText,
  EditableNumber,
  EditableImage,
} from "../components/editorContext";

const SECTIONS = [
  { slug: "who-we-are", id: "who-we-are", label: "Who We Are", desc: "Our story, mission, vision and the values that guide every decision we make." },
  { slug: "strategic-plan", id: "strategic-plan", label: "Our Strategic Plan", desc: "The 2025–2030 strategy: four pillars, five years, one promise to children." },
  { slug: "accountability", id: "accountability", label: "Accountability", desc: "How we govern, spend and report — openly, honestly and to community standards." },
  { slug: "safeguarding", id: "safeguarding", label: "Safeguarding", desc: "Our zero-tolerance commitment to the safety and dignity of every child." },
  { slug: "leadership", id: "leadership", label: "Our Leadership", desc: "The senior team and Board guiding MKCDP's work on the ground, every day." },
  { slug: "partners", id: "partners", label: "Our Development Partners", desc: "The funders, foundations and organisations that make this work possible." },
];

const Icon = {
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
  Shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3l7 3v6c0 4.6-3 8.1-7 9-4-.9-7-4.4-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Heart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" />
    </svg>
  ),
  Spark: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  ),
  Users: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c.8-3.4 2.9-5.2 5.5-5.2s4.7 1.8 5.5 5.2" />
      <path d="M16 5.4a3.2 3.2 0 0 1 0 5.9M17.5 20c-.3-1.6-.8-2.9-1.5-3.9 2.4.2 4 2 4.5 3.9" />
    </svg>
  ),
  Plus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Minus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14" />
    </svg>
  ),
  Target: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
  Eye: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Compass: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </svg>
  ),
  Book: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
      <path d="M20 18v3H6.5" />
    </svg>
  ),
};

function SectionHeading({ idPrefix, eyebrow, title, intro, align = "left" }) {
  const containerClass = align === "center" ? "mx-auto max-w-[720px] text-center" : "max-w-[720px]";
  return (
    <div className={containerClass}>
      <EditableText
        as="span"
        id={`${idPrefix}.eyebrow`}
        defaultValue={eyebrow}
        className={`mb-4 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-green-700 ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        {eyebrow}
      </EditableText>
      <EditableText
        as="h2"
        id={`${idPrefix}.title`}
        defaultValue={title}
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

function FaqItem({ idPrefix, q, a, isOpen, onToggle }) {
  return (
    <div className="border-b border-green-700/12">
      <button type="button" onClick={onToggle} aria-expanded={isOpen} className="group flex w-full items-center justify-between gap-6 py-6 text-left">
        <EditableText
          as="span"
          id={`${idPrefix}.q`}
          defaultValue={q}
          className="hero-serif block text-[1.05rem] font-bold leading-snug text-[#111111] transition-colors duration-200 group-hover:text-green-700 sm:text-[1.15rem]"
        />
        <span className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-full border transition-all duration-300 ${isOpen ? "border-green-700 bg-green-700 text-white" : "border-green-700/25 text-green-700 group-hover:border-green-700"}`}>
          {isOpen ? <Icon.Minus className="h-4 w-4" /> : <Icon.Plus className="h-4 w-4" />}
        </span>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <EditableText
            as="p"
            id={`${idPrefix}.a`}
            defaultValue={a}
            multiline
            className="block max-w-[820px] text-[0.95rem] leading-[1.85] text-[#4A4A42]"
          />
        </div>
      </div>
    </div>
  );
}

function Counter({ target, suffix = "", active }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    const duration = 1800;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * target));
      if (p < 1) frame = requestAnimationFrame(tick);
      else setValue(target);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return (
    <>
      {value.toLocaleString("en-US")}
      {suffix}
    </>
  );
}

function WhoWeAre() {
  const [openFaq, setOpenFaq] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);
  const { isEditing, getValue, setValue } = useEditor();

  useEffect(() => {
    const node = statsRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setStatsVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setStatsVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const stats = [
    { value: 2833, suffix: "+", label: "Enrolled Children" },
    { value: 2396, suffix: "+", label: "Sponsored Children" },
    { value: 4, label: "Partnerships" },
    { value: 100, suffix: "+", label: "Projects" },
  ];

  const thematic = [
    { n: "01", title: "Education" },
    { n: "02", title: "Health & Nutrition" },
    { n: "03", title: "Child Protection" },
    { n: "04", title: "Community Empowerment" },
  ];

  const history = [
    { year: "1976", label: "The beginning", body: "MKCDP was originally established in 1976 to address systemic poverty and support vulnerable children in the rural areas bordering Amboseli and Tsavo National Parks." },
    { year: "2017", label: "Formally registered", body: "After operating for decades as a community organization, MKCDP was formally registered as a Civil Society Organization (CSO) / Non-Governmental Organization (NGO) in 2017. Later came to expand all around Kajiado-South post 2017" },
  ];

  const manifesto = [
    { n: "01", label: "Our Mission", body: "To create a safe and nurturing environment where every child is empowered to realize their dreams, unlock their full potential, and thrive in a bigger future." },
    { n: "02", label: "Our Vision", body: "A society where every child in Kajiado South grows up safe, healthy, educated and hopeful — able to shape a future of their own making." },
    { n: "03", label: "Our Values", body: "Dignity. Community-led. Transparency. Stewardship. Equity. Courage. Six words we hold ourselves to in every decision and every shilling." },
  ];

  const faqs = [
    { q: "Where does MKCDP work?", a: "We work across Kajiado South in Kajiado County, Kenya — reaching children, families and communities in 14 wards including Loitokitok, Kimana, Namanga and Rombo." },
    { q: "Who can be sponsored through MKCDP?", a: "Any child enrolled in one of our partner schools who meets the household vulnerability criteria set with the community. Selection is transparent, community-led and reviewed each term." },
    { q: "How are funds used?", a: "At least 92% of every shilling goes directly to programme work. The remainder covers essential administration and audit. We publish audited financials every year." },
    { q: "How do I support a child?", a: "You can sponsor a child, give to a specific programme, or volunteer your skills. Every gift is tracked, and sponsors receive regular updates from the child and their school." },
    { q: "Can I visit the projects?", a: "Yes. We host structured partner visits throughout the year. All visitors must sign our safeguarding code of conduct before any contact with children." },
  ];

  return (
    <div className="space-y-24 lg:space-y-32">
      <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <EditableText
            as="p"
            id="about.who.heroHeading"
            defaultValue={"Rooted in\ncommunity.\nDriven by\nchildren."}
            multiline
            className="hero-serif block whitespace-pre-line text-[clamp(2.8rem,9vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-[#111111]"
          />
        </div>

        <div className="relative">
          <div className="relative ml-auto aspect-square w-[78%] overflow-hidden rounded-full shadow-[0_34px_64px_-30px_rgba(20,20,20,0.5)]">
            <EditableImage
              id="about.who.hero.image1"
              defaultValue="/img15.jpeg"
              alt="Children learning"
              className="h-full w-full object-cover"
              wrapperClassName="h-full w-full"
            />
          </div>
          <div className="absolute -left-2 bottom-0 aspect-square w-[42%] overflow-hidden rounded-full shadow-[0_24px_48px_-24px_rgba(20,20,20,0.45)]">
            <EditableImage
              id="about.who.hero.image2"
              defaultValue="/img16.jpeg"
              alt="Community life"
              className="h-full w-full object-cover"
              wrapperClassName="h-full w-full"
            />
          </div>
          <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute -right-3 top-0 w-16 rotate-12">
            <path d="M52 9c21 1 38 15 37 36-1 24-20 45-44 44C24 88 8 70 9 49 10 26 28 8 52 9Z" fill="none" stroke="#E2703A" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 border-t border-green-700/15 pt-12 lg:grid-cols-3 lg:gap-12">
        <div className="text-[0.95rem] leading-[1.9] text-[#3D3D37] lg:col-span-3 lg:columns-3 lg:gap-12">
          <EditableText
            as="p"
            id="about.who.intro"
            defaultValue="MKCDP works to improve the lives of children in Kajiado South with a focus in education, health, child protection, and community empowerment. We provide access to quality education, promote health and nutrition, and ensure children are protected from abuse and exploitation. We support families through economic empowerment initiatives — helping them achieve sustainable livelihoods so they can better care for their children. By engaging with local communities, MKCDP fosters long-term positive development for children and families across Kajiado County."
            multiline
            className="block"
          />
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-green-700/15 pb-6">
          <EditableText as="p" id="about.who.thematic.eyebrow" defaultValue="Our Thematic Areas" className="block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700" />
          <EditableText as="p" id="about.who.thematic.note" defaultValue="Four pillars of every programme we run." className="block text-[0.85rem] text-[#4A4A42]/75" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-none bg-green-700/15 lg:grid-cols-4">
          {thematic.map((t, i) => (
            <div key={t.n} className="group relative flex aspect-[4/5] flex-col justify-between bg-[#FBF7F0] p-7 transition-colors duration-300 hover:bg-white">
              <EditableText as="span" id={`about.who.thematic.${i}.n`} defaultValue={t.n} className="hero-serif block text-[0.85rem] font-bold uppercase tracking-[0.22em] text-green-700" />
              <EditableText as="p" id={`about.who.thematic.${i}.title`} defaultValue={t.title} className="hero-serif block text-[1.4rem] font-bold leading-[1.1] text-[#111111] transition-colors duration-300 group-hover:text-green-700" />
            </div>
          ))}
        </div>
      </div>

      <div ref={statsRef} className="border-y border-green-700/15 py-12 lg:py-16">
        <EditableText as="p" id="about.who.stats.eyebrow" defaultValue="Who we are in numbers" className="mb-10 block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700" />
        <div className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
          {stats.map((s, i) => {
            const target = Number(getValue(`about.who.stats.${i}.value`, s.value)) || 0;
            const suffix = getValue(`about.who.stats.${i}.suffix`, s.suffix);
            return (
              <div key={s.label} className={`relative px-6 ${i > 0 ? "lg:border-l lg:border-green-700/15" : ""}`}>
                <p className="text-[clamp(2.6rem,5.4vw,4rem)] font-bold leading-none tracking-[-0.03em] text-[#111111]">
                  {isEditing ? (
                    <input
                      type="number"
                      value={target}
                      onChange={(e) => setValue(`about.who.stats.${i}.value`, Number(e.target.value) || 0)}
                      className="w-40 rounded-md border-2 border-amber-400 bg-amber-50 px-2 py-1 text-[1.6rem] tabular-nums outline-none"
                    />
                  ) : (
                    <Counter target={target} suffix={suffix} active={statsVisible} />
                  )}
                </p>
                <EditableText as="p" id={`about.who.stats.${i}.label`} defaultValue={s.label} className="mt-5 block text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#4A4A42]/80" />
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-green-700/15 pb-6">
          <EditableText as="p" id="about.who.history.eyebrow" defaultValue="A brief history" className="block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700" />
          <EditableText as="p" id="about.who.history.note" defaultValue="Two landmark years, one continuous story." className="block text-[0.85rem] text-[#4A4A42]/75" />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {history.map((h, i) => (
            <div key={h.year} className="relative">
              <div className="flex items-center gap-5">
                <EditableText as="span" id={`about.who.history.${i}.year`} defaultValue={h.year} className="hero-serif block text-[clamp(3rem,6vw,4.4rem)] font-bold leading-none tracking-[-0.03em] text-[#111111]" />
                <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${i === 0 ? "bg-green-700" : "bg-[#E2703A]"}`} />
                <span className="h-px flex-1 bg-green-700/15" />
              </div>
              <EditableText as="p" id={`about.who.history.${i}.label`} defaultValue={h.label} className={`mt-4 block text-[0.68rem] font-bold uppercase tracking-[0.22em] ${i === 0 ? "text-green-700" : "text-[#E2703A]"}`} />
              <EditableText as="p" id={`about.who.history.${i}.body`} defaultValue={h.body} multiline className="mt-6 block max-w-[460px] text-[0.98rem] leading-[1.9] text-[#3D3D37]" />
              {i === 0 && (
                <svg viewBox="0 0 120 120" aria-hidden="true" className="pointer-events-none absolute -right-2 -top-6 hidden w-16 -rotate-12 lg:block">
                  <path d="M18 76c6-30 34-54 66-50 20 3 30 20 22 34-10 17-36 24-58 18" fill="none" stroke="#7FB069" strokeWidth="8" strokeLinecap="round" />
                </svg>
              )}
              {i === 1 && (
                <svg viewBox="0 0 100 100" aria-hidden="true" className="pointer-events-none absolute -right-2 -top-6 hidden w-14 rotate-12 lg:block">
                  <path d="M52 9c21 1 38 15 37 36-1 24-20 45-44 44C24 88 8 70 9 49 10 26 28 8 52 9Z" fill="none" stroke="#F2B33D" strokeWidth="4" strokeLinecap="round" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-green-700/12 bg-white/55 p-8 sm:p-14 lg:p-20">
        <svg viewBox="0 0 120 120" aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 w-40 rotate-12 opacity-25">
          <path d="M18 76c6-30 34-54 66-50 20 3 30 20 22 34-10 17-36 24-58 18" fill="none" stroke="#7FB069" strokeWidth="8" strokeLinecap="round" />
        </svg>

        <div className="relative space-y-10">
          {manifesto.map((m, i) => (
            <div key={m.n} className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,180px)_minmax(0,1fr)] lg:gap-12">
              <div>
                <EditableText as="p" id={`about.who.manifesto.${i}.label`} defaultValue={`${m.n} — ${m.label}`} className="hero-serif block text-[0.85rem] font-bold uppercase tracking-[0.22em] text-green-700" />
              </div>
              <EditableText as="p" id={`about.who.manifesto.${i}.body`} defaultValue={m.body} multiline className="hero-serif block text-[clamp(1.15rem,2.4vw,1.65rem)] font-medium leading-[1.5] text-[#111111]" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-green-700/12 bg-white/55 p-8 sm:p-12 lg:p-14">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-green-700/15 pb-6">
          <EditableText as="h3" id="about.who.faq.heading" defaultValue="FAQs" className="hero-serif block text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight text-[#111111]" />
          <EditableText as="p" id="about.who.faq.note" defaultValue="Answers to the questions we hear most often." className="block text-[0.85rem] text-[#4A4A42]/75" />
        </div>

        <div>
          {faqs.map((f, i) => (
            <FaqItem key={f.q} idPrefix={`about.who.faq.${i}`} q={f.q} a={f.a} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-green-700 px-8 py-14 sm:px-14 lg:px-20 lg:py-20">
        <svg viewBox="0 0 120 120" aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 w-40 rotate-12 opacity-30">
          <path d="M18 76c6-30 34-54 66-50 20 3 30 20 22 34-10 17-36 24-58 18" fill="none" stroke="#7FB069" strokeWidth="8" strokeLinecap="round" />
        </svg>

        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <EditableText as="span" id="about.who.cta.eyebrow" defaultValue="Need to learn more" className="mb-4 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
              Need to learn more
            </EditableText>
            <EditableText as="h3" id="about.who.cta.heading" defaultValue="Working together, for and with children." className="block hero-serif text-[clamp(1.7rem,3.6vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.02em] text-[#FBF7F0]" />
            <EditableText as="p" id="about.who.cta.body" defaultValue={"Write to us at info@mkcdp.org and one of our team will get back to you within two working days."} multiline className="mt-6 block max-w-[560px] text-[0.98rem] leading-[1.85] text-[#FBF7F0]/70" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StrategicPlan() {
  const chapters = [
    { n: "01", slug: "intro", label: "Introduction" },
    { n: "02", slug: "pillars", label: "Our Pillars" },
    { n: "03", slug: "roadmap", label: "Roadmap" },
    { n: "04", slug: "voices", label: "Voices Behind It" },
  ];

  const pillars = [
    { n: "01", title: "Learning for Life", body: "Universal access to quality early childhood and primary education, with a focus on girls' retention and transition to secondary school.", target: "12,000 children enrolled by 2030" },
    { n: "02", title: "Healthy Futures", body: "Integrated health, nutrition and WASH programming delivered through school and community platforms.", target: "95% of schools with clean water by 2028" },
    { n: "03", title: "Safe Childhoods", body: "Strengthened child protection systems, community safeguarding structures and survivor-centred response pathways.", target: "Zero tolerance, fully trained workforce" },
    { n: "04", title: "Resilient Livelihoods", body: "Household economic strengthening through savings groups, climate-smart agriculture and youth enterprise.", target: "3,500 households above the poverty line" },
  ];

  const roadmap = [
    { span: "Year 1", label: "Foundation", body: "Systems, baselines, safeguarding infrastructure and partner alignment across all 14 wards." },
    { span: "Years 2–3", label: "Scale", body: "Full deployment of all four pillars, reaching every target school and community partner." },
    { span: "Years 4–5", label: "Sustain", body: "Transition to community-led ownership, with local committees holding the mandate and the budget." },
  ];

  const stakeholders = [
    "Local partner organisations",
    "Community members & elders",
    "Government bodies",
    "Donors & funders",
    "Civil society organisations",
    "Private sector players",
    "Children and youth",
  ];

  return (
    <div className="space-y-24 lg:space-y-32">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-20">
        <aside className="lg:sticky lg:top-40 lg:self-start">
          <EditableText as="p" id="about.sp.sidebar.eyebrow" defaultValue="Our Strategic Plan" className="block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700" />
          <ol className="mt-8 space-y-4 border-l border-green-700/15 pl-6">
            {chapters.map((c, i) => (
              <li key={c.n} className="relative">
                <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-green-700/30" />
                <a href={`#${c.slug}`} className="group block">
                  <EditableText as="p" id={`about.sp.chapter.${i}.n`} defaultValue={`Chapter ${c.n}`} className="block text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#4A4A42]/60" />
                  <EditableText as="p" id={`about.sp.chapter.${i}.label`} defaultValue={c.label} className="hero-serif mt-1 block text-[1.05rem] font-bold text-[#111111] transition-colors duration-200 group-hover:text-green-700" />
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <div className="space-y-24 lg:space-y-32">
          <div id="intro">
            <EditableText as="p" id="about.sp.intro.hero" defaultValue="Every child matters." className="hero-serif block text-[clamp(2rem,5vw,3.6rem)] font-bold leading-[1.05] tracking-[-0.022em] text-[#111111]" />
            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
              <EditableText as="p" id="about.sp.intro.quote" defaultValue={"“Our strategy is driven by the voices of children, who have told us they need to feel heard and empowered to drive change.”"} multiline className="hero-serif block text-[clamp(1.15rem,2.4vw,1.5rem)] font-medium italic leading-[1.5] text-green-700" />
              <div className="space-y-5 text-[0.98rem] leading-[1.85] text-[#3D3D37]">
                <EditableText as="p" id="about.sp.intro.body1" defaultValue="Underpinning all our strategic priorities is the need to ensure every child feels listened to by the adults who make decisions about their lives." multiline className="block" />
                <EditableText as="p" id="about.sp.intro.body2" defaultValue="This strategy is a roadmap that guides our programs, working with local partner organisations, to address the most critical needs of children across Kenya in health, education and safety." multiline className="block" />
              </div>
            </div>
          </div>

          <div id="pillars">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-green-700/15 pb-6">
              <EditableText as="p" id="about.sp.pillars.eyebrow" defaultValue="Chapter 02 — Our Pillars" className="block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700" />
              <EditableText as="p" id="about.sp.pillars.note" defaultValue="Four priorities. Five years. One promise." className="block text-[0.85rem] text-[#4A4A42]/75" />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {pillars.map((p, i) => (
                <div
                  key={p.n}
                  className={`group relative flex flex-col justify-between border-green-700/15 pb-8 transition-colors duration-300 lg:aspect-[3/5] lg:border-l lg:px-7 lg:pt-8 ${
                    i === 0 ? "lg:border-l-0 lg:pl-0" : ""
                  } ${i > 0 ? "border-t pt-8 lg:border-t-0 lg:pt-8" : ""}`}
                >
                  <div>
                    <EditableText as="p" id={`about.sp.pillar.${i}.n`} defaultValue={p.n} className="hero-serif block text-[2.6rem] font-bold leading-none text-green-700/15 transition-colors duration-300 group-hover:text-green-700/35" />
                    <EditableText as="h3" id={`about.sp.pillar.${i}.title`} defaultValue={p.title} className="hero-serif mt-8 block text-[1.35rem] font-bold leading-tight text-[#111111]" />
                    <EditableText as="p" id={`about.sp.pillar.${i}.body`} defaultValue={p.body} multiline className="mt-4 block text-[0.9rem] leading-[1.8] text-[#4A4A42]" />
                  </div>
                  <EditableText as="p" id={`about.sp.pillar.${i}.target`} defaultValue={p.target} className="mt-10 block border-t border-green-700/12 pt-5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-green-700" />
                </div>
              ))}
            </div>
          </div>

          <div id="roadmap">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-green-700/15 pb-6">
              <EditableText as="p" id="about.sp.roadmap.eyebrow" defaultValue="Chapter 03 — Roadmap" className="block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700" />
              <EditableText as="p" id="about.sp.roadmap.note" defaultValue="How the five years unfold." className="block text-[0.85rem] text-[#4A4A42]/75" />
            </div>

            <div className="mt-12">
              <div className="relative">
                <div aria-hidden="true" className="absolute left-0 right-0 top-3 h-px bg-green-700/20" />
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-10">
                  {roadmap.map((r, i) => (
                    <div key={r.span} className="relative">
                      <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 border-green-700 bg-[#FBF7F0]">
                        <span className="h-2 w-2 rounded-full bg-green-700" />
                      </span>
                      <EditableText as="p" id={`about.sp.roadmap.${i}.span`} defaultValue={r.span} className="mt-6 block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700" />
                      <EditableText as="h4" id={`about.sp.roadmap.${i}.label`} defaultValue={r.label} className="hero-serif mt-3 block text-[1.5rem] font-bold leading-tight text-[#111111]" />
                      <EditableText as="p" id={`about.sp.roadmap.${i}.body`} defaultValue={r.body} multiline className="mt-3 block max-w-[320px] text-[0.92rem] leading-[1.85] text-[#4A4A42]" />
                      {i < roadmap.length - 1 && (
                        <span aria-hidden="true" className="mt-8 hidden h-px w-16 bg-green-700/20 lg:block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div id="voices">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-green-700/15 pb-6">
              <EditableText as="p" id="about.sp.voices.eyebrow" defaultValue="Chapter 04 — Voices behind it" className="block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700" />
              <EditableText as="p" id="about.sp.voices.note" defaultValue="Shaped by many, not written alone." className="block text-[0.85rem] text-[#4A4A42]/75" />
            </div>

            <div className="mt-10 overflow-hidden">
              <div className="flex flex-wrap gap-x-3 gap-y-3">
                {stakeholders.map((s, i) => (
                  <EditableText
                    key={s}
                    as="span"
                    id={`about.sp.voices.${i}`}
                    defaultValue={s}
                    className={`hero-serif rounded-full border px-5 py-3 text-[0.9rem] font-medium ${
                      i % 3 === 0
                        ? "border-green-700 bg-green-700 text-[#FBF7F0]"
                        : i % 3 === 1
                        ? "border-green-700/25 text-[#111111]"
                        : "border-[#E2703A]/40 text-[#E2703A]"
                    }`}
                  />
                ))}
              </div>
              <EditableText as="p" id="about.sp.voices.paragraph" defaultValue="This plan was developed in collaboration with a diverse range of stakeholders — including local partner organisations, community members, government bodies, donors, civil society organisations, private sector players, and most importantly, children and youth." multiline className="mt-10 block max-w-[560px] text-[0.95rem] leading-[1.85] text-[#4A4A42]" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-green-700 px-8 py-14 sm:px-14 lg:px-20 lg:py-20">
        <svg viewBox="0 0 120 120" aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 w-40 rotate-12 opacity-30">
          <path d="M18 76c6-30 34-54 66-50 20 3 30 20 22 34-10 17-36 24-58 18" fill="none" stroke="#7FB069" strokeWidth="8" strokeLinecap="round" />
        </svg>

        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <EditableText as="span" id="about.sp.cta.eyebrow" defaultValue="Partner with us today" className="mb-4 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">Partner with us today</EditableText>
            <EditableText as="h3" id="about.sp.cta.heading" defaultValue="Our vision needs each other." className="block hero-serif text-[clamp(1.7rem,3.6vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.02em] text-[#FBF7F0]" />
            <EditableText as="p" id="about.sp.cta.body" defaultValue="We hope our vision for the future of our work inspires you to join us on this path. Because, to reach our ambitious goals, we need each other." multiline className="mt-6 block max-w-[560px] text-[0.98rem] leading-[1.85] text-[#FBF7F0]/70" />
            <EditableText as="p" id="about.sp.cta.email" defaultValue="Write to us at info@mkcdp.org" className="mt-5 block text-[0.95rem] text-[#FBF7F0]/60" />
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <a href="mailto:info@mkcdp.org" className="group inline-flex w-fit items-center gap-3 rounded-xl bg-[#FBF7F0] px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white">
              <EditableText as="span" id="about.sp.cta.button" defaultValue="Partner with us" />
              <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Accountability() {
  const allocation = [
    { label: "Program delivery", percent: "70–80%", value: 75, color: "#14532D", items: ["Education supplies, school fees, tutoring and after-school programs", "Nutrition and health initiatives (supplements, clinics, vaccinations support)", "Psychosocial support and child protection services", "Community outreach, caregiver training and livelihoods support"] },
    { label: "Monitoring, Evaluation & Learning", percent: "5–8%", value: 6.5, color: "#7FB069", items: ["Impact measurement, data collection, surveys and beneficiary feedback systems"] },
    { label: "Operations & administration", percent: "8–12%", value: 10, color: "#1C6B4B", items: ["Staff salaries, office costs, communication and safeguarding systems"] },
    { label: "Fundraising & donor relations", percent: "3–5%", value: 4, color: "#E2703A", items: ["Campaigns, donor reporting, donor stewardship"] },
    { label: "Contingency & reserves", percent: "1–3%", value: 2, color: "#F2B33D", items: ["Small reserves to manage cashflow and unforeseen needs"] },
  ];

  const principles = [
    { n: "01", title: "Transparency", body: "We publish annual financial statements, audits, and an annual report summarising activities, beneficiaries and results." },
    { n: "02", title: "Fiduciary responsibility", body: "Funds are allocated according to agreed program priorities and legal requirements. We minimise overhead while ensuring safe, compliant operations." },
    { n: "03", title: "Donor intent", body: "We respect specific restrictions or wishes donors attach to gifts and report back on restricted-fund usage." },
    { n: "04", title: "Results-oriented spending", body: "We invest in activities that directly improve child wellbeing and track outcomes." },
  ];

  const tracking = [
    { step: "01", title: "Dedicated project codes", body: "Every donation is tagged to a project code so income and expenditure are traceable." },
    { step: "02", title: "Monthly financial statements", body: "Quick internal financial statements are prepared monthly and reviewed by the finance manager." },
    { step: "03", title: "Quarterly management reports", body: "Program managers provide narrative and financial updates to the board." },
    { step: "04", title: "Annual audited financial statements", body: "Independent external audits are commissioned yearly and the results published on our website and in the annual report." },
    { step: "05", title: "Donor-specific reports", body: "For larger or restricted gifts, we send tailored reports showing exactly how funds were used and what was achieved." },
    { step: "06", title: "Beneficiary feedback", body: "We collect regular feedback from children, caregivers and community leaders and publish a summary of key points and actions taken." },
  ];

  const impact = [
    { icon: "shield", title: "Infants are healthier", note: "Nutrition, clinics and early care." },
    { icon: "compass", title: "Young adults are shaping their own world", note: "In positive, lasting ways." },
    { icon: "users", title: "Communities are empowered", note: "To support and protect children's rights." },
    { icon: "heart", title: "Families are more resilient", note: "Equipped to provide better care for their children." },
    { icon: "book", title: "Children are educated", note: "Learning in safe, supported classrooms." },
    { icon: "spark", title: "Generations are breaking the cycle", note: "Creating lasting change for future families." },
  ];

  const impactIcons = { shield: Icon.Shield, compass: Icon.Compass, users: Icon.Users, heart: Icon.Heart, book: Icon.Book, spark: Icon.Spark };

  return (
    <div className="space-y-20 lg:space-y-28">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div>
          <EditableText as="span" id="about.acc.hero.eyebrow" defaultValue="Accountability · How we use donations" className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-green-700">Accountability · How we use donations</EditableText>
          <EditableText as="h1" id="about.acc.hero.heading" defaultValue={"We're accountable\nto you — our donors\nand sponsors."} multiline className="hero-serif block whitespace-pre-line text-[clamp(2rem,5.4vw,3.8rem)] font-bold leading-[1.05] tracking-[-0.022em] text-[#111111]" />
          <EditableText as="p" id="about.acc.hero.body" defaultValue="At the Mt. Kilimanjaro Child Development Programme, every donation is treated as a trust. We are committed to transparent, efficient and impact-focused use of funds — and to reporting clearly and regularly on how donations are spent." multiline className="mt-7 block max-w-[540px] text-[1.0625rem] leading-[1.8] text-[#3D3D37]" />

          <div className="mt-10 flex flex-wrap gap-4">
            <a href="/publication/annual-reports" className="group inline-flex items-center gap-3 rounded-xl bg-green-700 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-950">
              <EditableText as="span" id="about.acc.hero.cta1" defaultValue="Read annual reports" />
              <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="/donate" className="inline-flex items-center gap-3 rounded-xl border border-green-700/25 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:text-white">
              <EditableText as="span" id="about.acc.hero.cta2" defaultValue="Donate now" />
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-green-700/15 bg-white/70 p-8 shadow-[0_28px_60px_-34px_rgba(20,83,45,0.35)] sm:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-700 via-[#7FB069] to-[#F2B33D]" />
            <EditableText as="p" id="about.acc.hero.promiseLabel" defaultValue="Our promise" className="block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700" />
            <EditableText as="p" id="about.acc.hero.promiseBody" defaultValue={"“Every shilling is a trust. Every report is a promise kept.”"} multiline className="hero-serif mt-4 block text-[clamp(1.25rem,2.4vw,1.7rem)] font-medium italic leading-[1.45] text-[#111111]" />
            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-green-700/12 pt-6">
              {[
                { v: "75%", l: "To programmes", key: "p1" },
                { v: "100%", l: "Audited yearly", key: "p2" },
                { v: "6", l: "Tracking layers", key: "p3" },
              ].map((item) => (
                <div key={item.key}>
                  <EditableText as="p" id={`about.acc.hero.stat.${item.key}`} defaultValue={item.v} className="hero-serif block text-[1.75rem] font-bold leading-none text-green-700" />
                  <EditableText as="p" id={`about.acc.hero.statLabel.${item.key}`} defaultValue={item.l} className="mt-2 block text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#4A4A42]/75" />
                </div>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute -right-4 -top-6 z-10 w-16 rotate-12">
            <path d="M52 9c21 1 38 15 37 36-1 24-20 45-44 44C24 88 8 70 9 49 10 26 28 8 52 9Z" fill="none" stroke="#E2703A" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
          <svg viewBox="0 0 80 80" aria-hidden="true" className="absolute -bottom-5 -left-5 z-10 w-14 -rotate-6">
            <path d="M14 56c10-6 16-18 16-32 0-6 8-6 8 0 0 16 8 28 20 34" fill="none" stroke="#F2B33D" strokeWidth="7" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div>
        <SectionHeading
          idPrefix="about.acc.principles"
          eyebrow="Principles"
          title="What guides our financial stewardship."
          intro="Four commitments that shape every decision we make with the funds entrusted to us."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <div key={p.n} className="group relative flex flex-col overflow-hidden rounded-2xl border border-green-700/12 bg-white/55 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-green-700/25 hover:bg-white/85">
              <EditableText as="span" id={`about.acc.principles.${i}.n`} defaultValue={p.n} className="hero-serif block text-[2.4rem] font-bold leading-none text-green-700/15 transition-colors duration-300 group-hover:text-green-700/35" />
              <EditableText as="h3" id={`about.acc.principles.${i}.title`} defaultValue={p.title} className="hero-serif mt-5 block text-[1.15rem] font-bold leading-tight text-[#111111]" />
              <EditableText as="p" id={`about.acc.principles.${i}.body`} defaultValue={p.body} multiline className="mt-3 block flex-1 text-[0.9rem] leading-[1.75] text-[#4A4A42]" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-green-700/12 bg-white/55 p-8 sm:p-12 lg:p-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading idPrefix="about.acc.allocation" eyebrow="Allocation of donations" title="Where your giving goes." />
          <EditableText as="p" id="about.acc.allocation.note" defaultValue="Note: exact percentages vary year-to-year and by campaign. We report the precise allocations in each quarterly and annual report." multiline className="block max-w-[420px] text-[0.85rem] leading-[1.7] text-[#4A4A42]/85 lg:text-right" />
        </div>

        <div className="mt-14 space-y-12">
          {allocation.map((a, i) => (
            <div key={a.label} className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-12">
              <div>
                <div className="flex items-baseline gap-3">
                  <EditableText as="p" id={`about.acc.alloc.${i}.label`} defaultValue={a.label} className="hero-serif block text-[1.5rem] font-bold leading-tight text-[#111111]" />
                </div>
                <EditableText as="p" id={`about.acc.alloc.${i}.percent`} defaultValue={`${a.percent} of donations`} className="mt-2 block text-[0.72rem] font-bold uppercase tracking-[0.18em]" style={{ color: a.color }} />
              </div>
              <div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-green-700/8">
                  <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${a.value}%`, backgroundColor: a.color }} />
                </div>
                <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                  {a.items.map((item, j) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: a.color }} />
                      <EditableText as="span" id={`about.acc.alloc.${i}.item.${j}`} defaultValue={item} className="block text-[0.9rem] leading-[1.7] text-[#4A4A42]" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeading idPrefix="about.acc.tracking" eyebrow="How we track and report" title="Six layers of accountability." intro="From the moment a gift arrives to the day we publish our annual audit, every step is documented and verifiable." />
        <div className="relative mt-14">
          <div aria-hidden="true" className="absolute left-6 top-0 hidden h-full w-px bg-green-700/15 lg:block" />
          <div className="space-y-8">
            {tracking.map((t, i) => (
              <div key={t.step} className="relative grid grid-cols-1 gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-10">
                <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                  <EditableText as="span" id={`about.acc.track.${i}.step`} defaultValue={t.step} className="relative z-10 grid h-12 w-12 flex-shrink-0 place-items-center rounded-full border border-green-700/20 bg-[#FBF7F0] text-[0.75rem] font-bold text-green-700" />
                </div>
                <div className="rounded-2xl border border-green-700/12 bg-white/55 p-7 transition-all duration-300 hover:border-green-700/25 hover:bg-white/85 sm:p-8">
                  <EditableText as="h3" id={`about.acc.track.${i}.title`} defaultValue={t.title} className="hero-serif block text-[1.25rem] font-bold leading-tight text-[#111111]" />
                  <EditableText as="p" id={`about.acc.track.${i}.body`} defaultValue={t.body} multiline className="mt-3 block max-w-[760px] text-[0.95rem] leading-[1.85] text-[#4A4A42]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <SectionHeading idPrefix="about.acc.impact" eyebrow="Impact of support" title="Because of your support." intro="Every gift becomes something concrete — a meal, a classroom, a safe place to grow, a family that can provide." />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {impact.map(({ icon, title, note }, i) => {
            const I = impactIcons[icon];
            return (
              <div key={title} className="group relative flex flex-col overflow-hidden rounded-3xl border border-green-700/12 bg-white/55 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-green-700/25 hover:bg-white/85">
                <span className="mb-6 grid h-12 w-12 place-items-center rounded-full bg-green-700/8 text-green-700 transition-colors duration-300 group-hover:bg-green-700 group-hover:text-white">
                  <I className="h-5 w-5" />
                </span>
                <EditableText as="h3" id={`about.acc.impact.${i}.title`} defaultValue={title} className="hero-serif block text-[1.2rem] font-bold leading-tight text-[#111111]" />
                <EditableText as="p" id={`about.acc.impact.${i}.note`} defaultValue={note} className="mt-3 block text-[0.9rem] leading-[1.75] text-[#4A4A42]" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-green-700 px-8 py-16 sm:px-14 lg:px-20 lg:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.4]" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(251,247,240,0.09) 0px, rgba(251,247,240,0.09) 1px, transparent 1px, transparent 22px)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)", maskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)" }} />
        <svg viewBox="0 0 120 120" aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 w-40 rotate-12 opacity-30">
          <path d="M18 76c6-30 34-54 66-50 20 3 30 20 22 34-10 17-36 24-58 18" fill="none" stroke="#7FB069" strokeWidth="8" strokeLinecap="round" />
        </svg>

        <div className="relative mx-auto max-w-[820px] text-center">
          <EditableText as="span" id="about.acc.cta.eyebrow" defaultValue="Build brighter futures" className="mb-6 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[#F2B33D]">Build brighter futures</EditableText>
          <EditableText as="h2" id="about.acc.cta.heading" defaultValue="Join us in building brighter futures for children around Mt. Kilimanjaro." className="block hero-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[#FBF7F0]" />
          <EditableText as="p" id="about.acc.cta.body" defaultValue="Whether you give once or support monthly, your gift will be used transparently and strategically for the greatest impact." multiline className="mx-auto mt-6 block max-w-[600px] text-[1rem] leading-[1.85] text-[#FBF7F0]/70" />

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="/donate" className="group inline-flex items-center gap-3 rounded-xl bg-[#FBF7F0] px-8 py-[1.15rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white">
              <EditableText as="span" id="about.acc.cta.btn1" defaultValue="Donate now" />
              <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="mailto:info@mkcdp.org" className="inline-flex items-center gap-3 rounded-xl border border-[#FBF7F0]/30 px-8 py-[1.15rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[#FBF7F0] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FBF7F0] hover:text-green-700">
              <EditableText as="span" id="about.acc.cta.btn2" defaultValue="info@mkcdp.org" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Safeguarding() {
  const Camera = (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.7l1.2-2h5.2l1.2 2h3.7A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );

  const prevention = [
    { n: "01", title: "Awareness", body: "Children are taught age-appropriate safety awareness, including how to report concerns." },
    { n: "02", title: "Training", body: "Caregivers and community leaders receive training on child rights and protection." },
    { n: "03", title: "Commitment", body: "We ensure every representative is aware of and committed to child safeguarding best practices." },
  ];

  const protocol = [
    { n: "01", title: "Universal responsibility", body: "Every job description, no matter the role, includes child safeguarding as a responsibility. All employees are trained during onboarding and undergo annual refresher training for the duration of their employment." },
    { n: "02", title: "Standards that protect most", body: "We ensure compliance with either in-country child welfare and protection legislation or international standards — whichever affords greater protection — and with U.S. law where applicable." },
    { n: "03", title: "Partners held to the same bar", body: "Our agreements with local implementing organisations and other business partners require that they share our commitment to child safeguarding policies and procedures no less stringent than ours." },
    { n: "04", title: "Risk in every programme", body: "All our programs include risk assessments in which child safeguarding risks are considered." },
    { n: "05", title: "Consequences that mean something", body: "Our management is committed to corrective action in response to child safeguarding violations — including disciplinary, legal or other action against violators or any representative aware of a violation." },
  ];

  const confidentiality = [
    "Managed respectfully, professionally, confidentially and in compliance with applicable law.",
    "Captured and shared only with consent.",
    "Published with only the child's short name, age and general region.",
    "Never specific community-level information or details that would allow a child's identity to be traced.",
  ];

  const monitoring = [
    { title: "Regular risk assessments", body: "Conducted across programmes throughout the year." },
    { title: "Internal audits & evaluations", body: "Safeguarding practices are reviewed during internal audits and evaluations." },
    { title: "Learning from incidents", body: "Lessons learned from incidents or near-misses are used to improve systems." },
    { title: "Board oversight", body: "The Board provides oversight of safeguarding compliance and serious cases." },
  ];

  const visitorRules = [
    { icon: "shield", title: "Follow the guidelines", body: "Visitors must follow MKCDP's Child Safeguarding Guidelines." },
    { icon: "camera", title: "Informed consent required", body: "Photography or interviews require informed consent." },
    { icon: "users", title: "No unsupervised contact", body: "No unsupervised contact between visitors and children is allowed." },
  ];

  const visitorIcons = { shield: Icon.Shield, camera: Camera, users: Icon.Users };

  return (
    <div className="space-y-20 lg:space-y-28">
      <div className="relative overflow-hidden rounded-[28px] border border-green-700/12 bg-[#14532D] px-8 py-14 sm:px-12 lg:px-16 lg:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(251,247,240,0.09) 0px, rgba(251,247,240,0.09) 1px, transparent 1px, transparent 22px)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)", maskImage: "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)" }} />

        <svg viewBox="0 0 100 100" aria-hidden="true" className="pointer-events-none absolute -right-6 -top-6 w-32 rotate-12 opacity-25">
          <path d="M52 9c21 1 38 15 37 36-1 24-20 45-44 44C24 88 8 70 9 49 10 26 28 8 52 9Z" fill="none" stroke="#F2B33D" strokeWidth="3.5" strokeLinecap="round" />
        </svg>

        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <EditableText as="span" id="about.sg.hero.eyebrow" defaultValue="Child Safeguarding" className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[#F2B33D]">Child Safeguarding</EditableText>
            <EditableText as="h1" id="about.sg.hero.heading" defaultValue={"What does\nthat mean?"} multiline className="hero-serif block whitespace-pre-line text-[clamp(2rem,5.4vw,3.7rem)] font-bold leading-[1.06] tracking-[-0.022em] text-[#FBF7F0]" />
            <EditableText as="p" id="about.sg.hero.body" defaultValue="We prevent child abuse and other types of child safeguarding incidents. That means we minimise risks to children through awareness, good practice and training of all staff — and we take steps to protect children when the need arises." multiline className="mt-7 block max-w-[560px] text-[1.0625rem] leading-[1.85] text-[#FBF7F0]/75" />

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="mailto:info@mkcdp.org" className="group inline-flex items-center gap-3 rounded-xl bg-[#F2B33D] px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[#14532D] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FBF7F0]">
                <EditableText as="span" id="about.sg.hero.cta1" defaultValue="Report a concern" />
                <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="#protocol" className="inline-flex items-center gap-3 rounded-xl border border-[#FBF7F0]/30 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[#FBF7F0] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FBF7F0] hover:text-green-700">
                <EditableText as="span" id="about.sg.hero.cta2" defaultValue="How we protect" />
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[360px]">
            <div className="relative flex aspect-square items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#FBF7F0]/15" />
              <div className="absolute inset-[10%] rounded-full border border-[#FBF7F0]/20" />
              <div className="absolute inset-[22%] rounded-full border border-[#F2B33D]/30" />
              <div className="absolute inset-[34%] rounded-full bg-[#FBF7F0] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]" />
              <div className="relative z-10 grid h-24 w-24 place-items-center rounded-full bg-[#14532D] text-[#FBF7F0]">
                <Icon.Shield className="h-11 w-11" />
              </div>
              <EditableText as="span" id="about.sg.badge1" defaultValue="Everyone" className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full bg-[#E2703A] px-3.5 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white" />
              <EditableText as="span" id="about.sg.badge2" defaultValue="Zero tolerance" className="absolute bottom-[10%] left-0 rounded-full bg-[#F2B33D] px-3.5 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#14532D]" />
              <EditableText as="span" id="about.sg.badge3" defaultValue="24/7" className="absolute right-0 top-[46%] rounded-full border border-[#FBF7F0]/30 px-3.5 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#FBF7F0]" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <SectionHeading idPrefix="about.sg.prevention" eyebrow="How prevention works" title="Three layers between every child and harm." />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {prevention.map((p, i) => (
            <div key={p.n} className="group relative overflow-hidden rounded-3xl border border-green-700/12 bg-white/55 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-green-700/25 hover:bg-white/85">
              <EditableText as="span" id={`about.sg.prevention.${i}.n`} defaultValue={p.n} className="hero-serif block text-[3rem] font-bold leading-none text-green-700/12 transition-colors duration-300 group-hover:text-green-700/30" />
              <EditableText as="h3" id={`about.sg.prevention.${i}.title`} defaultValue={p.title} className="hero-serif mt-6 block text-[1.3rem] font-bold leading-tight text-[#111111]" />
              <EditableText as="p" id={`about.sg.prevention.${i}.body`} defaultValue={p.body} multiline className="mt-3 block text-[0.94rem] leading-[1.8] text-[#4A4A42]" />
            </div>
          ))}
        </div>
      </div>

      <div id="protocol" className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-40 lg:self-start">
          <EditableText as="span" id="about.sg.protocol.eyebrow" defaultValue="Our protocol" className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-green-700">Our protocol</EditableText>
          <EditableText as="h2" id="about.sg.protocol.heading" defaultValue="The commitments behind the promise." className="block hero-serif text-[clamp(1.7rem,3.4vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#111111]" />
          <EditableText as="p" id="about.sg.protocol.body" defaultValue="These are not aspirations. They are operational standards we hold ourselves to, in writing, across every programme and every partner." multiline className="mt-6 block text-[0.95rem] leading-[1.85] text-[#4A4A42]" />
        </div>

        <ol className="space-y-5">
          {protocol.map((p, i) => (
            <li key={p.n} className="group relative grid grid-cols-[auto_minmax(0,1fr)] gap-6 rounded-3xl border border-green-700/12 bg-white/55 p-7 transition-all duration-300 hover:border-green-700/25 hover:bg-white/85 sm:p-9">
              <EditableText as="span" id={`about.sg.protocol.${i}.n`} defaultValue={p.n} className="hero-serif block text-[1.6rem] font-bold leading-none text-green-700/35 transition-colors duration-300 group-hover:text-green-700" />
              <div>
                <EditableText as="h3" id={`about.sg.protocol.${i}.title`} defaultValue={p.title} className="hero-serif block text-[1.25rem] font-bold leading-tight text-[#111111]" />
                <EditableText as="p" id={`about.sg.protocol.${i}.body`} defaultValue={p.body} multiline className="mt-3 block text-[0.94rem] leading-[1.85] text-[#4A4A42]" />
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-green-700/12 bg-white/55 p-8 sm:p-12 lg:p-14">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16">
          <div>
            <SectionHeading idPrefix="about.sg.confid" eyebrow="Confidentiality" title="Children's information is sacred." intro="Child safeguarding includes confidentiality of child information. We manage children's records with the same care we'd want for our own." />
            <ul className="mt-10 space-y-5">
              {confidentiality.map((c, i) => (
                <li key={c} className="flex items-start gap-5">
                  <span className="mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-green-700 text-[0.65rem] font-bold text-white">{String(i + 1).padStart(2, "0")}</span>
                  <EditableText as="p" id={`about.sg.confid.${i}`} defaultValue={c} multiline className="block text-[0.95rem] leading-[1.8] text-[#3D3D37]" />
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-green-700/15 bg-[#FBF7F0] p-6 shadow-[0_20px_44px_-26px_rgba(20,83,45,0.35)]">
              <EditableText as="p" id="about.sg.confid.example.eyebrow" defaultValue="Example · Public story" className="block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-green-700" />
              <div className="mt-5 space-y-4">
                <div>
                  <EditableText as="p" id="about.sg.confid.shared.label" defaultValue="Shared publicly" className="block text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#4A4A42]/60" />
                  <EditableText as="p" id="about.sg.confid.shared.body" defaultValue="Amina, age 9, Kajiado South." className="mt-1.5 block text-[0.9rem] text-[#3D3D37]" />
                </div>
                <div className="h-px bg-green-700/12" />
                <div>
                  <EditableText as="p" id="about.sg.confid.never.label" defaultValue="Never published" className="block text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#E2703A]" />
                  <EditableText as="p" id="about.sg.confid.never.body" defaultValue="Full name, specific village, school, guardian details." className="mt-1.5 block text-[0.9rem] text-[#4A4A42]/70 line-through decoration-[#E2703A]/40" />
                </div>
              </div>
            </div>
            <svg viewBox="0 0 80 80" aria-hidden="true" className="absolute -bottom-5 -right-4 w-14 rotate-12">
              <path d="M14 56c10-6 16-18 16-32 0-6 8-6 8 0 0 16 8 28 20 34" fill="none" stroke="#F2B33D" strokeWidth="7" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <SectionHeading idPrefix="about.sg.monitor" eyebrow="Monitoring & continuous improvement" title="A system that learns from itself." />
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {monitoring.map((m, i) => (
            <div key={m.title} className="group flex items-start gap-5 rounded-2xl border border-green-700/12 bg-white/55 p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-700/25 hover:bg-white/85">
              <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-green-700/8 text-[0.72rem] font-bold text-green-700 transition-colors duration-300 group-hover:bg-green-700 group-hover:text-white">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <EditableText as="h3" id={`about.sg.monitor.${i}.title`} defaultValue={m.title} className="hero-serif block text-[1.1rem] font-bold leading-tight text-[#111111]" />
                <EditableText as="p" id={`about.sg.monitor.${i}.body`} defaultValue={m.body} multiline className="mt-2 block text-[0.9rem] leading-[1.75] text-[#4A4A42]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeading idPrefix="about.sg.visitors" eyebrow="For visitors" title="If you visit us, these rules protect every child." />
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {visitorRules.map(({ icon, title, body }, i) => {
            const I = visitorIcons[icon];
            return (
              <div key={title} className="group relative overflow-hidden rounded-3xl border border-green-700/12 bg-white/55 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-green-700/25 hover:bg-white/85">
                <span className="mb-6 grid h-12 w-12 place-items-center rounded-full bg-green-700/8 text-green-700 transition-colors duration-300 group-hover:bg-green-700 group-hover:text-white">
                  <I className="h-5 w-5" />
                </span>
                <EditableText as="h3" id={`about.sg.visitors.${i}.title`} defaultValue={title} className="hero-serif block text-[1.2rem] font-bold leading-tight text-[#111111]" />
                <EditableText as="p" id={`about.sg.visitors.${i}.body`} defaultValue={body} multiline className="mt-3 block text-[0.9rem] leading-[1.75] text-[#4A4A42]" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Leadership() {
  const team = [
    { name: "Elosy Omwenga", role: "Chief Executive Officer", img: "/Elosy.jpg", featured: true, quote: "Raising hope and nurturing futures — one child, one family, one community at a time." },
    { name: "Nancy Nailantei", role: "Finance & Administration Manager", img: "/Nancy.jpeg" },
    { name: "Erickson Solitei Paraitei", role: "Monitoring & Evaluation Manager / Ag. Sponsorship Manager", img: "/Erickson.jpeg" },
    { name: "Fabiola Makena", role: "Procurement Officer", img: "/Fabiola.jpg" },
    { name: "Violah Chepkemboi", role: "Program & Sponsorship Officer", img: "/Violet.jpg" },
    { name: "John Maina", role: "Finance and Administration Assistant", img: "/John.jpeg" },
    { name: "Valentine Yianoi", role: "Programs & Sponsorship Officer", img: "/nancy.png" },
    { name: "Fred Karei", role: "Logistics Officer", img: "/Fred.jpeg" },
    { name: "Esther Mbithe", role: "Office Support Staff", img: "/Esther.jpg" },
  ];

  const teamGrid = team.filter((m) => !m.featured);
  const ceo = team.find((m) => m.featured);

  return (
    <div className="space-y-20 lg:space-y-28">
      <div className="relative">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <EditableText as="span" id="about.lead.hero.eyebrow" defaultValue="Our Leadership" className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-green-700">Our Leadership</EditableText>
            <EditableText as="h1" id="about.lead.hero.heading" defaultValue={"Creative minds\nbehind our success."} multiline className="hero-serif block whitespace-pre-line text-[clamp(2rem,5.4vw,3.9rem)] font-bold leading-[1.05] tracking-[-0.022em] text-[#111111]" />
            <EditableText as="p" id="about.lead.hero.body" defaultValue="A team rooted in community and focused on children — bringing finance, programs, safeguarding, logistics and care together so every child in Kajiado South is protected, supported and able to thrive." multiline className="mt-7 block max-w-[520px] text-[1.0625rem] leading-[1.8] text-[#3D3D37]" />
          </div>

          <div className="relative flex flex-col justify-center gap-6 lg:pl-10">
            <div className="flex items-start gap-5">
              <span className="mt-2 h-px w-10 flex-shrink-0 bg-green-700" />
              <EditableText as="p" id="about.lead.tag1" defaultValue={"Raising Hope.\nNurturing Futures."} multiline className="hero-serif block whitespace-pre-line text-[clamp(1.3rem,2.6vw,1.9rem)] font-medium italic leading-[1.35] text-green-700" />
            </div>
            <div className="flex items-start gap-5">
              <span className="mt-2 h-px w-10 flex-shrink-0 bg-[#E2703A]" />
              <EditableText as="p" id="about.lead.tag2" defaultValue={"Building Brighter Futures\nfor Every Child."} multiline className="hero-serif block whitespace-pre-line text-[clamp(1.3rem,2.6vw,1.9rem)] font-medium italic leading-[1.35] text-[#111111]" />
            </div>
            <div className="flex items-start gap-5">
              <span className="mt-2 h-px w-10 flex-shrink-0 bg-[#F2B33D]" />
              <EditableText as="p" id="about.lead.tag3" defaultValue={"Where Children Are Protected,\nSupported, and Thrive."} multiline className="hero-serif block whitespace-pre-line text-[clamp(1.3rem,2.6vw,1.9rem)] font-medium italic leading-[1.35] text-[#4A4A42]" />
            </div>
          </div>
        </div>

        <svg viewBox="0 0 120 120" aria-hidden="true" className="pointer-events-none absolute -top-6 right-[42%] hidden w-16 -rotate-12 lg:block">
          <path d="M18 76c6-30 34-54 66-50 20 3 30 20 22 34-10 17-36 24-58 18" fill="none" stroke="#7FB069" strokeWidth="9" strokeLinecap="round" />
        </svg>
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-green-700/12 bg-white/60 p-8 sm:p-12 lg:p-14">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-700 via-[#7FB069] to-[#F2B33D]" />

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-16">
          <div className="relative mx-auto w-full max-w-[380px]">
            <div className="relative aspect-square w-full overflow-hidden rounded-full shadow-[0_30px_60px_-34px_rgba(20,20,20,0.5)]">
              <EditableImage id="about.lead.ceo.image" defaultValue={ceo.img} alt={ceo.name} className="h-full w-full object-cover" wrapperClassName="h-full w-full" />
            </div>
            <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute -right-4 -top-4 w-20 rotate-12">
              <path d="M52 9c21 1 38 15 37 36-1 24-20 45-44 44C24 88 8 70 9 49 10 26 28 8 52 9Z" fill="none" stroke="#E2703A" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <svg viewBox="0 0 80 80" aria-hidden="true" className="absolute -bottom-3 -left-5 w-16 -rotate-12">
              <path d="M14 56c10-6 16-18 16-32 0-6 8-6 8 0 0 16 8 28 20 34" fill="none" stroke="#F2B33D" strokeWidth="7" strokeLinecap="round" />
            </svg>
          </div>

          <div>
            <EditableText as="p" id="about.lead.ceo.eyebrow" defaultValue="Meet our Chief Executive" className="block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700" />
            <EditableText as="h2" id="about.lead.ceo.name" defaultValue={ceo.name} className="hero-serif mt-4 block text-[clamp(1.9rem,3.6vw,2.7rem)] font-bold leading-tight tracking-[-0.02em] text-[#111111]" />
            <EditableText as="p" id="about.lead.ceo.role" defaultValue={ceo.role} className="mt-3 block text-[0.85rem] font-bold uppercase tracking-[0.16em] text-[#E2703A]" />
            <EditableText as="p" id="about.lead.ceo.quote" defaultValue={`“${ceo.quote}”`} multiline className="hero-serif mt-8 block max-w-[560px] text-[1.15rem] font-medium italic leading-[1.55] text-[#2A2A26]" />
            <EditableText as="p" id="about.lead.ceo.body" defaultValue="Under Elosy's leadership, MKCDP has grown into a trusted, child-centered organisation working across Kajiado South — delivering education, health, child protection and community empowerment with the families it serves." multiline className="mt-8 block max-w-[560px] text-[0.95rem] leading-[1.85] text-[#4A4A42]" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading idPrefix="about.lead.team" eyebrow="The team" title="Rooted in community. Focused on children." />
          <EditableText as="p" id="about.lead.team.note" defaultValue="Every member of the MKCDP team is based in Kajiado South and works side-by-side with the communities we serve." multiline className="block max-w-[380px] text-[0.9rem] leading-[1.75] text-[#4A4A42]/85 lg:text-right" />
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
          {teamGrid.map((m, i) => {
            const offset = i % 2 === 1 ? "lg:mt-16" : "";
            return (
              <div key={m.name} className={`group ${offset}`}>
                <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full shadow-[0_24px_48px_-24px_rgba(20,20,20,0.45)] transition-transform duration-500 group-hover:-translate-y-1.5">
                  <EditableImage id={`about.lead.team.${i}.image`} defaultValue={m.img} alt={m.name} className="h-full w-full object-cover" wrapperClassName="h-full w-full" />
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-black/5" />
                </div>
                <div className="mt-6 text-center">
                  <EditableText as="h3" id={`about.lead.team.${i}.name`} defaultValue={m.name} className="hero-serif block text-[1.05rem] font-bold leading-tight text-[#111111] sm:text-[1.15rem]" />
                  <EditableText as="p" id={`about.lead.team.${i}.role`} defaultValue={m.role} className="mx-auto mt-2 block max-w-[240px] text-[0.68rem] font-bold uppercase tracking-[0.14em] leading-[1.5] text-green-700" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-green-700/12 bg-green-700 px-8 py-14 sm:px-14 lg:px-20 lg:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.4]" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(251,247,240,0.09) 0px, rgba(251,247,240,0.09) 1px, transparent 1px, transparent 22px)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)", maskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)" }} />
        <svg viewBox="0 0 120 120" aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 w-40 rotate-12 opacity-30">
          <path d="M18 76c6-30 34-54 66-50 20 3 30 20 22 34-10 17-36 24-58 18" fill="none" stroke="#7FB069" strokeWidth="8" strokeLinecap="round" />
        </svg>

        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <EditableText as="span" id="about.lead.cta.eyebrow" defaultValue="Community-Driven" className="mb-4 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">Community-Driven</EditableText>
            <EditableText as="h3" id="about.lead.cta.heading" defaultValue="Empowering children, strengthening communities — together for the wellbeing of every child." className="block hero-serif text-[clamp(1.7rem,3.6vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.02em] text-[#FBF7F0]" />
            <EditableText as="p" id="about.lead.cta.body" defaultValue="Our team does not work for communities. We work with them. That is the only way change becomes lasting." multiline className="mt-6 block max-w-[560px] text-[0.98rem] leading-[1.85] text-[#FBF7F0]/70" />
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <a href="/contact" className="group inline-flex w-fit items-center gap-3 rounded-xl bg-[#FBF7F0] px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white">
              <EditableText as="span" id="about.lead.cta.btn1" defaultValue="Work with us" />
              <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="/take-action/volunteer" className="group inline-flex w-fit items-center gap-3 rounded-xl border border-[#FBF7F0]/30 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[#FBF7F0] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FBF7F0] hover:text-green-700">
              <EditableText as="span" id="about.lead.cta.btn2" defaultValue="Volunteer with us" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function DevelopmentPartners() {
  const partnerLogos = [
    { logo: "/lake_region.jpg" },
    { logo: "/eastern.jpg" },
    { logo: "/childfund.png" },
    { logo: "/EDCA.png" },
  ];

  return (
    <div className="space-y-20 lg:space-y-28">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <EditableText as="span" id="about.pt.hero.eyebrow" defaultValue="Our Development Partners" className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-green-700">Our Development Partners</EditableText>

          <EditableText as="h1" id="about.pt.hero.heading" defaultValue={"Working together,\nfor and with\nchildren."} multiline className="hero-serif block whitespace-pre-line text-[clamp(2rem,5.4vw,3.9rem)] font-bold leading-[1.05] tracking-[-0.022em] text-[#111111]" />

          <div className="mt-7 max-w-[560px] space-y-5 text-[1.0625rem] leading-[1.85] text-[#3D3D37]">
            <EditableText as="p" id="about.pt.hero.body1" defaultValue="Our goal to reach over 9.5 million children in Kenya and ensure they grow up healthy, educated and safe is ambitious. Achieving this can only be possible by working in partnership with others." multiline className="block" />
            <EditableText as="p" id="about.pt.hero.body2" defaultValue="We collaborate with a range of partners to achieve sustainable change for children and youth across the country — communities, local implementing organisations, national and county governments, civil society, the private sector, faith-based organisations, academia, and more." multiline className="block" />
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-[28px] border border-green-700/15 bg-white/65 p-8 shadow-[0_28px_60px_-34px_rgba(20,83,45,0.35)] sm:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-700 via-[#7FB069] to-[#F2B33D]" />
            <EditableText as="p" id="about.pt.goal.eyebrow" defaultValue="Our 2030 goal" className="block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700" />
            <div className="mt-5 flex items-end gap-3">
              <EditableText as="span" id="about.pt.goal.number" defaultValue="9.5M" className="hero-serif block text-[clamp(3.4rem,8vw,5.2rem)] font-bold leading-none tracking-[-0.03em] text-[#111111]" />
              <EditableText as="span" id="about.pt.goal.label" defaultValue="children in Kenya" className="mb-2 block text-[0.75rem] font-bold uppercase tracking-[0.16em] text-[#4A4A42]/75" />
            </div>
            <EditableText as="p" id="about.pt.goal.body" defaultValue="Growing up healthy, educated, and safe — reached together with the partners who make this work possible." multiline className="mt-5 block max-w-[420px] text-[0.95rem] leading-[1.8] text-[#4A4A42]" />
          </div>

          <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute -right-4 -top-6 z-10 w-16 rotate-12">
            <path d="M52 9c21 1 38 15 37 36-1 24-20 45-44 44C24 88 8 70 9 49 10 26 28 8 52 9Z" fill="none" stroke="#E2703A" strokeWidth="4.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div>
        <SectionHeading idPrefix="about.pt.partners" eyebrow="Our partners" />
        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden sm:grid-cols-4">
          {partnerLogos.map((partner, i) => (
            <div key={i} className="flex flex-col items-center justify-center">
              <div className="flex gap-2 items-center justify-center">
                <EditableImage id={`about.pt.logo.${i}`} defaultValue={partner.logo} alt="logo" className="max-h-36 max-w-auto object-contain" wrapperClassName="inline-block" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-green-700/12 bg-green-700 px-8 py-14 sm:px-14 lg:px-20 lg:py-20">
        <svg viewBox="0 0 120 120" aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 w-40 rotate-12 opacity-30">
          <path d="M18 76c6-30 34-54 66-50 20 3 30 20 22 34-10 17-36 24-58 18" fill="none" stroke="#7FB069" strokeWidth="8" strokeLinecap="round" />
        </svg>

        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <EditableText as="span" id="about.pt.cta.eyebrow" defaultValue="Partner with us" className="mb-4 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">Partner with us</EditableText>
            <EditableText as="h3" id="about.pt.cta.heading" defaultValue="Join us" className="block hero-serif text-[clamp(1.7rem,3.6vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.02em] text-[#FBF7F0]" />
            <EditableText as="p" id="about.pt.cta.body" defaultValue="Whether you give once or support monthly, your gift will be used transparently and strategically for the greatest impact." multiline className="mt-6 block max-w-[560px] text-[0.98rem] leading-[1.85] text-[#FBF7F0]/70" />
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <a href="/take-action/partnerships" className="group inline-flex w-fit items-center gap-3 rounded-xl bg-[#FBF7F0] px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white">
              <EditableText as="span" id="about.pt.cta.btn1" defaultValue="Start a conversation" />
              <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="/donate" className="inline-flex w-fit items-center gap-3 rounded-xl border border-[#FBF7F0]/30 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-[#FBF7F0] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FBF7F0] hover:text-green-700">
              <EditableText as="span" id="about.pt.cta.btn2" defaultValue="Give today" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[#FBF7F0] pt-16 lg:pt-24">
      <div className="mx-auto max-w-[1560px] px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div>
            <EditableText as="span" id="about.hub.hero.eyebrow" defaultValue="About MKCDP" className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-green-700">About MKCDP</EditableText>
            <EditableText as="h1" id="about.hub.hero.heading" defaultValue={"We stand with children.\nAlways. Everywhere.\nFor as long as it takes."} multiline className="hero-serif block whitespace-pre-line text-[clamp(2.1rem,6.4vw,4.4rem)] font-bold leading-[1.06] tracking-[-0.022em] text-[#111111]" />
            <EditableText as="p" id="about.hub.hero.body" defaultValue="MKCDP is a child-centered organisation working across Kajiado South, Kenya — building education, health, protection and livelihood systems that outlast us." multiline className="mt-7 block max-w-[520px] text-[1.0625rem] leading-[1.8] text-[#3D3D37]" />
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[460px] lg:mx-0">
            <div className="absolute left-0 top-[6%] z-20 aspect-square w-[68%] overflow-hidden rounded-full shadow-[0_34px_64px_-30px_rgba(20,20,20,0.5)]">
              <EditableImage id="about.hub.hero.image1" defaultValue="/img11.jpg" alt="Children learning" className="h-full w-full object-cover" wrapperClassName="h-full w-full" />
            </div>
            <div className="absolute right-0 top-0 z-10 aspect-square w-[36%] overflow-hidden rounded-full shadow-[0_24px_48px_-24px_rgba(20,20,20,0.45)]">
              <EditableImage id="about.hub.hero.image2" defaultValue="img9.jpg" alt="Community" className="h-full w-full object-cover" wrapperClassName="h-full w-full" />
            </div>
            <div className="absolute bottom-[2%] right-[4%] z-30 aspect-square w-[28%] overflow-hidden rounded-full shadow-[0_22px_44px_-22px_rgba(20,20,20,0.45)]">
              <EditableImage id="about.hub.hero.image3" defaultValue="img19.jpg" alt="Community life" className="h-full w-full object-cover" wrapperClassName="h-full w-full" />
            </div>
            <svg viewBox="0 0 120 120" aria-hidden="true" className="absolute -top-[3%] left-[52%] z-40 w-[14%] -rotate-12">
              <path d="M18 76c6-30 34-54 66-50 20 3 30 20 22 34-10 17-36 24-58 18" fill="none" stroke="#7FB069" strokeWidth="9" strokeLinecap="round" />
            </svg>
            <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute right-[10%] top-[40%] z-40 w-[9%] rotate-6">
              <path d="M52 9c21 1 38 15 37 36-1 24-20 45-44 44C24 88 8 70 9 49 10 26 28 8 52 9Z" fill="none" stroke="#E2703A" strokeWidth="4.5" strokeLinecap="round" />
            </svg>
            <svg viewBox="0 0 80 80" aria-hidden="true" className="absolute bottom-[30%] left-[2%] z-40 w-[8%] -rotate-6">
              <path d="M14 56c10-6 16-18 16-32 0-6 8-6 8 0 0 16 8 28 20 34" fill="none" stroke="#F2B33D" strokeWidth="7" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(20,83,45,0.14) 0px, rgba(20,83,45,0.14) 1px, transparent 1px, transparent 18px)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 78%)", maskImage: "linear-gradient(to bottom, transparent, #000 78%)" }} />
    </section>
  );
}

function Breadcrumb({ label }) {
  return (
    <nav aria-label="Breadcrumb" className="relative border-b border-green-700/12 bg-[#FBF7F0]">
      <div className="mx-auto max-w-[1560px] px-6 py-5 sm:px-10 lg:px-14 lg:py-6">
        <ol className="flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.16em]">
          <li>
            <Link to="/about" className="text-green-700 transition-colors duration-200 hover:text-green-950 hover:underline">About MKCDP</Link>
          </li>
          <li aria-hidden="true" className="text-green-700/35">
            <Icon.ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li className="text-[#4A4A42]" aria-current="page">{label}</li>
        </ol>
      </div>
    </nav>
  );
}

function AboutHub() {
  return (
    <>
      <AboutHero />
      <section className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-[1560px] px-6 sm:px-10 lg:px-14">
          <SectionHeading
            idPrefix="about.hub.explore"
            eyebrow="Explore MKCDP"
            title="Six pages. One mission."
            intro="Learn who we are, how we plan, how we stay accountable, how we protect children, who leads us and who stands with us."
          />

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((s, i) => (
              <Link key={s.slug} to={`/about/${s.slug}`} className="group relative flex flex-col rounded-3xl border border-green-700/12 bg-white/55 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-green-700/25 hover:bg-white/85">
                <span className="hero-serif mb-6 text-[2rem] font-bold leading-none text-green-700/15 transition-colors duration-300 group-hover:text-green-700/30">{String(i + 1).padStart(2, "0")}</span>
                <EditableText as="h3" id={`about.hub.card.${i}.label`} defaultValue={s.label} className="hero-serif block text-[1.4rem] font-bold leading-tight text-[#111111]" />
                <EditableText as="p" id={`about.hub.card.${i}.desc`} defaultValue={s.desc} multiline className="mt-3 block flex-1 text-[0.92rem] leading-[1.8] text-[#4A4A42]" />
                <span className="mt-8 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-green-700">
                  <EditableText as="span" id={`about.hub.card.${i}.cta`} defaultValue="Open page" />
                  <Icon.ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function NotFound() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center py-20">
      <div className="mx-auto max-w-[600px] px-6 text-center">
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700">Page not found</p>
        <h1 className="hero-serif mt-5 text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight text-[#111111]">We couldn't find that page in the About section.</h1>
        <Link to="/about" className="mt-10 inline-flex items-center gap-3 rounded-xl bg-green-700 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-950">
          Back to About MKCDP
          <Icon.ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export default function About() {
  const { section } = useParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [section]);

  const active = section ? SECTIONS.find((s) => s.slug === section) : null;

  return (
    <div className="hero-sans relative min-h-screen overflow-x-hidden bg-[#FBF7F0] text-[#141414] antialiased">
      <style>{`
        .hero-serif { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
        .hero-sans { font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        ::selection { background: #14532D; color: #FBF7F0; }
      `}</style>

      {!section && <AboutHub />}
      {section && !active && <NotFound />}
      {section && active && (
        <>
          <Breadcrumb label={active.label} />
          <main className="relative py-16 lg:py-24">
            <div className="mx-auto max-w-[1560px] px-6 sm:px-10 lg:px-14">
              {active.id === "who-we-are" && <WhoWeAre />}
              {active.id === "strategic-plan" && <StrategicPlan />}
              {active.id === "accountability" && <Accountability />}
              {active.id === "safeguarding" && <Safeguarding />}
              {active.id === "leadership" && <Leadership />}
              {active.id === "partners" && <DevelopmentPartners />}
            </div>
          </main>
        </>
      )}
    </div>
  );
}