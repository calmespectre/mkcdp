import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

const PHOTOS = {
  main: "/img1.jpg",
  upper: "/img8.png",
  lower: "/img3.jpg",
  farRight: "/img4.jpg",
  lowerLeft: "/img5.jpg",
};

const YOUTUBE_ID = "ztwN71sY98o";

function useInView(options = { threshold: 0.35 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      });
    }, options);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

function useCountUp(target, active, duration = 2200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    let frame;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * target));
      if (p < 1) frame = requestAnimationFrame(tick);
      else setValue(target);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function Hero() {
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="relative flex h-[calc(110dvh-68px)] w-full items-center overflow-hidden sm:h-[calc(110dvh-108px)] lg:h-[calc(110dvh-128px)]"
    >
      <motion.div className="absolute inset-0" style={{ y: heroY }}>
        <img
          src={PHOTOS.main}
          alt="Children learning together"
          className="h-full w-full object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 z-10 bg-gradient-to-r from-green-700 via-green-700/50 to-transparent" />

      <motion.div
        className="relative z-20 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20"
        style={{ opacity: heroOpacity }}
      >
        <div className="max-w-2xl">
          <p className="mb-4 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-[#F2C94C]">
            Mt. KIlimanjaro Child Development Programme
          </p>

          <h1 className="text-[clamp(2.4rem,6.4vw,5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white">
            Every child deserves the chance to dream.
          </h1>

          <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.8] text-white/85">
            Supporting children, families and communities across Kajiado South to create lasting
            change — through education, health, protection and livelihoods.
          </p>

          <div className="mt-9 flex flex-wrap justify-center items-center gap-4">
            <Link
              to="/take-action/sponsor-a-child"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-[1.15rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-green-700 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F2C94C]"
            >
              Sponsor a child
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>

            <Link
              to="/our-work"
              className="inline-flex items-center gap-3 rounded-full border border-white/40 px-8 py-[1.15rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              Explore our work
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function VideoSection() {
  return (
    <section className="relative overflow-hidden bg-[#FBF7F0] py-24 lg:py-32">
      <svg
        viewBox="0 0 120 120"
        aria-hidden="true"
        className="pointer-events-none absolute left-[4%] top-[14%] hidden w-16 -rotate-12 lg:block"
      >
        <path
          d="M18 76c6-30 34-54 66-50 20 3 30 20 22 34-10 17-36 24-58 18"
          fill="none"
          stroke="#7FB069"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>

      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] top-[8%] hidden w-14 rotate-12 lg:block"
      >
        <path
          d="M52 9c21 1 38 15 37 36-1 24-20 45-44 44C24 88 8 70 9 49 10 26 28 8 52 9Z"
          fill="none"
          stroke="#E2703A"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </svg>

      <div className="mx-auto max-w-[1180px] px-6 sm:px-10">
        {/* <div className="mb-11 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[640px]">
            <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-green-700">
              <span className="h-px w-8 bg-green-700" />
              Watch the story
            </span>
            <h2 className="hero-serif text-[clamp(1.9rem,4.6vw,3.4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111]">
              Inkisanjani Digital Resource Center
            </h2>
          </div>
          <p className="max-w-[360px] text-[1rem] leading-[1.75] text-[#4A4A42]">
            A short documentary film about the Inkisanjani Digital Resource Center, a community-led initiative in Kajiado County, Kenya, that provides youth with access to digital learning resources and educational opportunities.
          </p>
        </div> */}

        <div className="relative aspect-video w-full overflow-hidden rounded-[18px] bg-black shadow-[0_28px_70px_-46px_rgba(20,83,45,0.5)] ring-1 ring-black/10">
          <iframe
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}`}
            title="Inkisanjani Digital Resource Center"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <div className="mt-9 grid grid-cols-1 gap-8 border-t border-green-700/12 pt-8 sm:grid-cols-3">
          {[
            { t: "Filmed on location", d: "Kajiado County, Kenya" },
            { t: "Community-led", d: "Produced with local storytellers" },
            { t: "3 minutes", d: "Subtitled available in English" },
          ].map((item) => (
            <div key={item.t}>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-green-700">
                {item.t}
              </p>
              <p className="mt-1.5 text-[0.92rem] leading-relaxed text-[#4A4A42]">{item.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STATS = [
  { value: 48500, suffix: "+", label: "Participants Reached", note: "Across 14 countries" },
  { value: 12400, suffix: "", label: "Children Enrolled", note: "In partner schools" },
  { value: 8750, suffix: "+", label: "Children Sponsored", note: "With long-term support" },
  { value: 326, suffix: "", label: "Total Projects", note: "Delivered since 2009" },
];

function StatItem({ stat, active, index }) {
  const count = useCountUp(stat.value, active, 2000 + index * 180);

  return (
    <div className="relative px-1 py-8 sm:px-4 lg:px-8">
      <div className="flex items-baseline gap-0.5">
        <span className="text-[clamp(2.4rem,5.4vw,3.9rem)] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-[#FBF7F0]">
          {count.toLocaleString("en-US")}
        </span>
        {stat.suffix && (
          <span className="text-[clamp(1.4rem,3vw,2.1rem)] font-extrabold leading-none text-[#F2B33D]">
            {stat.suffix}
          </span>
        )}
      </div>

      <div className="mt-5 h-px w-12 bg-[#F2B33D]/70" />

      <p className="mt-5 text-[0.78rem] font-bold uppercase tracking-[0.15em] text-[#FBF7F0]">
        {stat.label}
      </p>
      <p className="mt-2 text-[0.85rem] leading-relaxed text-[#FBF7F0]/60">{stat.note}</p>
    </div>
  );
}

function StatsSection() {
  const [ref, inView] = useInView({ threshold: 0.25 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-green-700">
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

      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="pointer-events-none absolute -left-6 top-8 w-28 rotate-12 opacity-40"
      >
        <path
          d="M52 9c21 1 38 15 37 36-1 24-20 45-44 44C24 88 8 70 9 49 10 26 28 8 52 9Z"
          fill="none"
          stroke="#F2B33D"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <svg
        viewBox="0 0 80 80"
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 bottom-6 w-24 -rotate-6 opacity-35"
      >
        <path
          d="M14 56c10-6 16-18 16-32 0-6 8-6 8 0 0 16 8 28 20 34"
          fill="none"
          stroke="#E2703A"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative mx-auto max-w-[1360px] px-6 py-20 sm:px-10 lg:px-14 lg:py-28">
        <div className="mb-10 flex flex-col gap-5 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[620px]">
            <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#F2B33D]">
              <span className="h-px w-8 bg-[#F2B33D]" />
              Our impact
            </span>
            <h2 className="text-[clamp(1.8rem,4.2vw,3.1rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#FBF7F0]">
              Numbers that carry names, families and futures.
            </h2>
          </div>
          <p className="max-w-[340px] text-[0.98rem] leading-[1.75] text-[#FBF7F0]/65">
            Every figure below is a person, a household or a community that chose to build something
            lasting with us.
          </p>
        </div>

        <div className="grid grid-cols-1 divide-y divide-[#FBF7F0]/15 border-t border-[#FBF7F0]/15 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`border-[#FBF7F0]/15 sm:border-b lg:border-b-0 ${
                i % 2 === 0 ? "sm:border-r" : ""
              } ${i < 2 ? "sm:border-b lg:border-b-0" : "sm:border-b-0"}`}
            >
              <StatItem stat={stat} active={inView} index={i} />
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-[#FBF7F0]/15 pt-9 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.95rem] text-[#FBF7F0]/70">
            Figures audited annually and reported to every partner and sponsor.
          </p>
          <a
            href="#"
            className="group inline-flex w-fit items-center gap-3 rounded-xl bg-[#FBF7F0] px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
          >
            Read the full report
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="hero-sans relative min-h-screen overflow-x-hidden bg-[#FBF7F0] text-[#141414] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Montserrat:wght@400;600;700;800;900&display=swap');
        .hero-serif { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
        .hero-sans { font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        html { scroll-behavior: smooth; }
        ::selection { background: #1C6B4B; color: #FBF7F0; }
      `}</style>

      <Hero />
      <StatsSection />
      <VideoSection />
    </div>
  );
}