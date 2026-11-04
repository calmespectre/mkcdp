
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  useEditor,
  EditableText,
  EditableImage,
  EditableVideo,
} from "./editorContext";

const PHOTOS = {
  main: "/img18.jpg",
};

const YOUTUBE_ID = "ztwN71sY98o";

function useInView(options = { threshold: 0.25 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(entry.target);
      }
    }, options);

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

function useCountUp(target, active, duration = 2200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const reducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setValue(target);
      return;
    }

    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(Math.floor(eased * target));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function Hero() {
  const heroRef = useRef(null);
  const { isEditing } = useEditor();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

  return (
    <section
      ref={heroRef}
      className="relative isolate flex min-h-[760px] h-[100svh] max-h-[1000px] w-full items-end overflow-hidden sm:min-h-[720px] sm:items-center"
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: heroY }}
      >
        <EditableImage
          id="home.hero.image"
          defaultValue={PHOTOS.main}
          alt="Children learning together"
          className="h-full w-full object-cover object-[55%_center] sm:object-center"
          wrapperClassName="h-full w-full"
        />
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 30%, rgba(6, 24, 13, 0.55) 100%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] hidden sm:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(36, 69, 41, 0.75) 0%, rgba(56, 112, 79, 0.45) 55%, rgba(20,83,45,0) 100%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-[#173D29]/40 to-transparent sm:hidden"
      />

      <motion.div
        className="relative z-30 mx-auto w-full max-w-7xl px-5 pb-16 pt-32 sm:px-10 sm:pb-0 sm:pt-24 md:px-12 lg:px-20"
        style={{ opacity: heroOpacity }}
      >
        <div className="max-w-2xl">
          <EditableText
            as="p"
            id="home.hero.eyebrow"
            defaultValue="Mt. Kilimanjaro Child Development Programme"
            className="mb-4 inline-flex max-w-full items-center gap-3 text-[9px] font-bold uppercase leading-relaxed tracking-[0.17em] text-[#F2C94C] sm:mb-5 sm:text-[11px] sm:tracking-[0.24em]"
          />

          <EditableText
            as="h1"
            id="home.hero.heading"
            defaultValue="Every child deserves the chance to dream."
            multiline
            className="block max-w-[620px] text-[clamp(2.65rem,11vw,5rem)] font-bold leading-[1.04] tracking-[-0.045em] text-white drop-shadow-[0_3px_16px_rgba(0,0,0,0.3)] sm:text-[clamp(3.2rem,6vw,5rem)] sm:leading-[1.02] sm:tracking-[-0.03em]"
          />

          <EditableText
            as="p"
            id="home.hero.subheading"
            defaultValue="Supporting children, families and communities across Kajiado South to create lasting change — through education, health, protection and livelihoods."
            multiline
            className="mt-5 block max-w-[520px] text-[13px] leading-[1.85] text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.3)] sm:mt-6 sm:text-base sm:leading-[1.8]"
          />

          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-9 sm:w-fit sm:flex-row sm:items-center sm:gap-4">
            <Link
              to="/take-action/sponsor-a-child"
              className={`group inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-xl bg-white px-7 text-[10px] font-extrabold uppercase tracking-[0.12em] text-green-800 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[#FBF7F0] sm:w-auto sm:min-h-12 ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableText
                id="home.hero.ctaPrimary"
                defaultValue="Sponsor a child"
              />
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
              className={`inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-7 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 sm:w-auto sm:min-h-12 ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableText
                id="home.hero.ctaSecondary"
                defaultValue="Explore our work"
              />
            </Link>
          </div>

          <div className="mt-9 flex items-center gap-3 sm:hidden">
            <span className="h-px w-8 bg-[#F2C94C]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/65">
              Building brighter futures
            </span>
          </div>
        </div>
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-7 right-10 z-[3] hidden items-center gap-3 text-[9px] font-bold uppercase tracking-[0.22em] text-white/70 sm:flex"
      >
        <span className="h-px w-10 bg-[#F2C94C]" />
        <span>Building brighter futures</span>
      </div>
    </section>
  );
}

function VideoSection() {
  return (
    <section className="relative overflow-hidden bg-[#FBF7F0] py-16 sm:py-20 lg:py-28">
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

      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-[0_28px_70px_-46px_rgba(20,83,45,0.5)] ring-1 ring-black/10 sm:rounded-2xl">
          <EditableVideo
            id="home.video.youtubeId"
            defaultValue={YOUTUBE_ID}
          />
        </div>
      </div>
    </section>
  );
}

const STATS = [
  { value: 40000, suffix: "+", label: "Participants Supported" },
  { value: 3000, suffix: "+", label: "Enrolled Children" },
  { value: 2800, suffix: "+", label: "Sponsored Children" },
  { value: 100, suffix: "+", label: "Ongoing Projects" },
];

function StatItem({ stat, active, index }) {
  const { isEditing, getValue, setValue } = useEditor();

  const target = Number(
    getValue(`home.stats.${index}.value`, stat.value)
  ) || 0;

  const count = useCountUp(
    target,
    active && !isEditing,
    2000 + index * 180
  );

  return (
    <div className="relative h-full px-1 py-7 sm:px-4 sm:py-9 lg:px-6 lg:py-10">
      <div className="flex min-w-0 items-baseline gap-1">
        {isEditing ? (
          <input
            type="number"
            value={target}
            onChange={(e) =>
              setValue(
                `home.stats.${index}.value`,
                Number(e.target.value) || 0
              )
            }
            className="w-full max-w-[180px] rounded-md border-2 border-amber-400 bg-amber-50/20 px-2 py-1 text-3xl font-extrabold leading-none tracking-[-0.03em] text-[#FBF7F0] outline-none"
          />
        ) : (
          <span className="text-[clamp(2.1rem,4.5vw,3.7rem)] font-extrabold leading-none tracking-[-0.045em] tabular-nums text-[#FBF7F0]">
            {count.toLocaleString("en-US")}
          </span>
        )}

        <EditableText
          as="span"
          id={`home.stats.${index}.suffix`}
          defaultValue={stat.suffix}
          className="text-[clamp(1.3rem,2.5vw,2rem)] font-extrabold leading-none text-[#F2B33D]"
        />
      </div>

      <div className="mt-5 h-[2px] w-10 bg-[#F2B33D]/80 sm:mt-6 sm:w-12" />

      <EditableText
        as="p"
        id={`home.stats.${index}.label`}
        defaultValue={stat.label}
        className="mt-4 block text-[10px] font-bold uppercase leading-relaxed tracking-[0.14em] text-[#FBF7F0] sm:mt-5 sm:text-xs"
      />

      <EditableText
        as="p"
        id={`home.stats.${index}.note`}
        defaultValue={stat.note}
        className="mt-2 block text-xs leading-relaxed text-[#FBF7F0]/60 sm:text-sm"
      />
    </div>
  );
}

function StatsSection() {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const { isEditing } = useEditor();

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-green-700"
      style={{ marginTop: "-1px" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(251,247,240,0.09) 0px, rgba(251,247,240,0.09) 1px, transparent 1px, transparent 22px)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 35%, #000 65%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, #000 35%, #000 65%, transparent)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
      >
        {/* <svg
          viewBox="0 0 1440 460"
          preserveAspectRatio="xMidYMax meet"
          className="h-auto w-full max-h-[460px] max-w-[1440px] opacity-[0.13]"
          fill="none"
        >
          <path
            d="M0 460 L0 392 C60 388 130 380 210 372 C280 366 340 358 400 344 C450 332 490 316 520 296 C545 280 560 262 572 244 C582 230 590 218 598 208 C604 200 610 194 616 188 C620 184 624 180 628 178 C632 176 636 176 640 178 C644 180 648 184 652 188 C658 194 664 200 670 208 C678 218 686 230 696 244 C708 262 724 280 748 296 C778 316 818 332 868 344 C928 358 988 366 1058 372 C1128 380 1200 388 1270 392 C1330 396 1390 396 1440 392 L1440 460 Z"
            fill="#FBF7F0"
          />
          <path
            d="M600 208 C604 200 610 194 616 188 C620 184 624 180 628 178 C632 176 636 176 640 178 C644 180 648 184 652 188 C658 194 664 200 670 208 C662 204 654 200 646 198 C642 196 638 194 634 194 C630 194 626 196 622 198 C616 202 608 206 600 208 Z"
            fill="#FFFFFF"
          />
        </svg> */}
      </div>

      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="pointer-events-none absolute -left-7 top-28 w-24 rotate-12 opacity-30 sm:w-28"
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
        className="pointer-events-none absolute -right-3 bottom-8 w-20 -rotate-6 opacity-30 sm:w-24"
      >
        <path
          d="M14 56c10-6 16-18 16-32 0-6 8-6 8 0 0 16 8 28 20 34"
          fill="none"
          stroke="#E2703A"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative mx-auto max-w-[1360px] px-6 pb-20 pt-20 sm:px-10 sm:pb-24 sm:pt-24 lg:px-14 lg:pb-28 lg:pt-28">
        <div className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[650px]">
            <span className="mb-4 inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#F2B33D] sm:text-xs">
              <span className="h-px w-8 bg-[#F2B33D]" />
              <EditableText
                id="home.stats.eyebrow"
                defaultValue="Our Impact"
              />
            </span>

            <EditableText
              as="h2"
              id="home.stats.heading"
              defaultValue="Numbers that carry names, families and futures."
              multiline
              className="block text-[clamp(1.9rem,4vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.035em] text-[#FBF7F0]"
            />
          </div>

          <EditableText
            as="p"
            id="home.stats.intro"
            defaultValue="Every figure below is a person, a household or a community that chose to build something lasting with us."
            multiline
            className="block max-w-[390px] text-sm leading-[1.8] text-[#FBF7F0]/70 sm:text-base"
          />
        </div>

        <div className="grid grid-cols-1 divide-y divide-white/15 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`relative ${
                i > 1 ? "sm:border-t sm:border-white/15 lg:border-t-0" : ""
              }`}
            >
              <StatItem
                stat={stat}
                active={inView}
                index={i}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-14">
          <div
            aria-hidden="true"
            className="pointer-events-none relative"
          >
            <svg
              className="h-7 w-full sm:h-10"
              viewBox="0 0 1440 40"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0 26 C180 4 360 34 540 22 S900 6 1080 22 S1320 36 1440 16"
                stroke="rgba(251,247,240,0.22)"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-6 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <EditableText
              as="p"
              id="home.stats.footerNote"
              defaultValue="Figures audited annually and reported to every partner and sponsor."
              className="block max-w-xl text-xs leading-relaxed text-[#FBF7F0]/70 sm:text-sm"
            />

            <a
              href="/publications"
              className={`group inline-flex w-fit min-h-[50px] items-center justify-center gap-3 rounded-xl bg-[#FBF7F0] px-6 py-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-green-800 transition-all duration-300 hover:-translate-y-1 hover:bg-white sm:px-7 ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableText
                id="home.stats.footerCta"
                defaultValue="Read the full report"
              />

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
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0F452B]/30 to-transparent sm:h-20"
      />
    </section>
  );
}

export default function Home() {
  return (
    <main className="hero-sans relative min-h-screen overflow-x-clip bg-[#FBF7F0] text-[#141414] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800;900&display=swap');

        .hero-serif {
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
        }

        .hero-sans {
          font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }

        html {
          scroll-behavior: smooth;
        }

        ::selection {
          background: #1C6B4B;
          color: #FBF7F0;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }
      `}</style>

      <Hero />
      <StatsSection />
      <VideoSection />
    </main>
  );
}