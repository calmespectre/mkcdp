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
  main: "/img1.jpg",
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

// function Hero() {
//   const heroRef = useRef(null);
//   const { isEditing } = useEditor();

//   const { scrollYProgress } = useScroll({
//     target: heroRef,
//     offset: ["start start", "end start"],
//   });

//   const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
//   const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

//   return (
//     <section
//       ref={heroRef}
//       className="relative flex h-[calc(110dvh-68px)] w-full items-center overflow-hidden sm:h-[calc(110dvh-108px)] lg:h-[calc(110dvh-128px)]"
//     >
//       <motion.div className="absolute inset-0" style={{ y: heroY }}>
//         <EditableImage
//           id="home.hero.image"
//           defaultValue={PHOTOS.main}
//           alt="Children learning together"
//           className="h-full w-full object-cover"
//           wrapperClassName="h-full w-full"
//         />
//       </motion.div>

//       <div className="absolute inset-0 z-10 bg-gradient-to-r from-green-700 via-green-700/50 to-transparent" />

//       <motion.div
//         className="relative z-20 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20"
//         style={{ opacity: heroOpacity }}
//       >
//         <div className="max-w-2xl">
//           <EditableText
//             as="p"
//             id="home.hero.eyebrow"
//             defaultValue="Mt. KIlimanjaro Child Development Programme"
//             className="mb-4 block text-[0.72rem] font-bold uppercase tracking-[0.24em] text-[#F2C94C]"
//           />

//           <EditableText
//             as="h1"
//             id="home.hero.heading"
//             defaultValue="Every child deserves the chance to dream."
//             multiline
//             className="block text-[clamp(2.4rem,6.4vw,5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white"
//           />

//           <EditableText
//             as="p"
//             id="home.hero.subheading"
//             defaultValue="Supporting children, families and communities across Kajiado South to create lasting change — through education, health, protection and livelihoods."
//             multiline
//             className="mt-6 block max-w-xl text-[1.0625rem] leading-[1.8] text-white/85"
//           />

//           <div className="mt-9 flex flex-wrap justify-center items-center gap-4">
//             <Link
//               to="/take-action/sponsor-a-child"
//               className={`group inline-flex items-center gap-3 rounded-full bg-white px-8 py-[1.15rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-green-700 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F2C94C] ${
//                 isEditing ? "pointer-events-none" : ""
//               }`}
//             >
//               <EditableText id="home.hero.ctaPrimary" defaultValue="Sponsor a child" />
//               <svg
//                 viewBox="0 0 24 24"
//                 className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.4"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M5 12h14M13 6l6 6-6 6" />
//               </svg>
//             </Link>

//             <Link
//               to="/our-work"
//               className={`inline-flex items-center gap-3 rounded-full border border-white/40 px-8 py-[1.15rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:border-white hover:bg-white/10 ${
//                 isEditing ? "pointer-events-none" : ""
//               }`}
//             >
//               <EditableText id="home.hero.ctaSecondary" defaultValue="Explore our work" />
//             </Link>
//           </div>
//         </div>
//       </motion.div>
//     </section>
//   );
// }

function Hero() {
  const heroRef = useRef(null);
  const { isEditing } = useEditor();

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
      <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
        <EditableImage
          id="home.hero.image"
          defaultValue={PHOTOS.main}
          alt="Children learning together"
          className="h-full w-full object-cover"
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
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-full sm:w-3/5 lg:w-1/2"
        style={{
          background:
            "linear-gradient(90deg, rgba(36, 69, 41, 0.75) 0%, rgba(56, 112, 79, 0.45) 55%, rgba(20,83,45,0) 100%)",
        }}
      />

      <motion.div
        className="relative z-30 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20"
        style={{ opacity: heroOpacity }}
      >
        <div className="max-w-2xl">
          <EditableText
            as="p"
            id="home.hero.eyebrow"
            defaultValue="Mt. KIlimanjaro Child Development Programme"
            className="mb-4 block text-[0.72rem] font-bold uppercase tracking-[0.24em] text-[#F2C94C]"
          />

          <EditableText
            as="h1"
            id="home.hero.heading"
            defaultValue="Every child deserves the chance to dream."
            multiline
            className="block text-[clamp(2.4rem,6.4vw,5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
          />

          <EditableText
            as="p"
            id="home.hero.subheading"
            defaultValue="Supporting children, families and communities across Kajiado South to create lasting change — through education, health, protection and livelihoods."
            multiline
            className="mt-6 block max-w-xl text-[1.0625rem] leading-[1.8] text-white/95 drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]"
          />

          <div className="mt-9 flex flex-wrap justify-center items-center gap-4">
            <Link
              to="/take-action/sponsor-a-child"
              className={`group inline-flex items-center gap-3 rounded-full bg-white px-8 py-[1.15rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-green-700 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#F2C94C] ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableText id="home.hero.ctaPrimary" defaultValue="Sponsor a child" />
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
              className={`inline-flex items-center gap-3 rounded-full border border-white/40 px-8 py-[1.15rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:border-white hover:bg-white/10 ${
                isEditing ? "pointer-events-none" : ""
              }`}
            >
              <EditableText id="home.hero.ctaSecondary" defaultValue="Explore our work" />
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
        <div className="relative aspect-video w-full overflow-hidden rounded-[18px] bg-black shadow-[0_28px_70px_-46px_rgba(20,83,45,0.5)] ring-1 ring-black/10">
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
  const target = Number(getValue(`home.stats.${index}.value`, stat.value)) || 0;
  const suffix = getValue(`home.stats.${index}.suffix`, stat.suffix);
  const count = useCountUp(target, active && !isEditing, 2000 + index * 180);

  return (
    <div className="relative px-1 py-8 sm:px-4 lg:px-8">
      <div className="flex items-baseline gap-0.5">
        {isEditing ? (
          <input
            type="number"
            value={target}
            onChange={(e) => setValue(`home.stats.${index}.value`, Number(e.target.value) || 0)}
            className="w-40 rounded-md border-2 border-amber-400 bg-amber-50/20 px-2 py-1 text-[2rem] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-[#FBF7F0] outline-none"
          />
        ) : (
          <span className="text-[clamp(2.4rem,5.4vw,3.9rem)] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-[#FBF7F0]">
            {count.toLocaleString("en-US")}
          </span>
        )}
        <EditableText
          as="span"
          id={`home.stats.${index}.suffix`}
          defaultValue={stat.suffix}
          className="text-[clamp(1.4rem,3vw,2.1rem)] font-extrabold leading-none text-[#F2B33D]"
        />
      </div>

      <div className="mt-5 h-px w-12 bg-[#F2B33D]/70" />

      <EditableText
        as="p"
        id={`home.stats.${index}.label`}
        defaultValue={stat.label}
        className="mt-5 block text-[0.78rem] font-bold uppercase tracking-[0.15em] text-[#FBF7F0]"
      />
      <EditableText
        as="p"
        id={`home.stats.${index}.note`}
        defaultValue={stat.note}
        className="mt-2 block text-[0.85rem] leading-relaxed text-[#FBF7F0]/60"
      />
    </div>
  );
}

function StatsSection() {
  const [ref, inView] = useInView({ threshold: 0.25 });
  const { isEditing } = useEditor();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-green-700"
      style={{ marginTop: "-1px" }}
    >
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

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
      >
        <svg
          viewBox="0 0 1440 460"
          preserveAspectRatio="xMidYMax meet"
          className="h-auto w-full max-h-[1920px] max-w-[1440px] opacity-[0.2]"
          fill="none"
        >
          <defs>
            <linearGradient id="kiliBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBF7F0" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#FBF7F0" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#FBF7F0" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="kiliSnow" x1="0" y1="0" x2="0" y2="3">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="kiliShadow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(20,83,45,0.55)" />
              <stop offset="55%" stopColor="rgba(20,83,45,0)" />
              <stop offset="100%" stopColor="rgba(20,83,45,0.6)" />
            </linearGradient>
            <linearGradient id="kiliRidgeLight" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <g opacity="0.55">
            <path
              d="M0 460 L0 392 C60 388 130 380 210 372 C280 366 340 358 400 344 C450 332 490 316 520 296 C545 280 560 262 572 244 C582 230 590 218 598 208 C604 200 610 194 616 188 C620 184 624 180 628 178 C632 176 636 176 640 178 C644 180 648 184 652 188 C658 194 664 200 670 208 C678 218 686 230 696 244 C708 262 724 280 748 296 C778 316 818 332 868 344 C928 358 988 366 1058 372 C1128 380 1200 388 1270 392 C1330 396 1390 396 1440 392 L1440 460 Z"
              fill="url(#kiliBody)"
            />
          </g>

          <g opacity="0.28">
            <path
              d="M228 380 C300 366 360 348 410 326 C450 308 480 288 504 266 C524 248 540 230 552 214 C560 202 566 192 570 184 C574 176 578 170 582 166 C586 162 590 162 594 166 C598 170 602 176 606 184 C610 192 616 202 624 214 C636 230 652 248 672 266 C696 288 726 308 766 326 C816 348 876 366 948 380 C1020 394 1100 400 1180 400 C1240 400 1300 396 1360 388"
              stroke="url(#kiliRidgeLight)"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          <g opacity="0.5">
            <path
              d="M0 460 L0 428 C90 424 170 416 260 404 C340 394 410 380 470 362 C520 346 560 328 590 308 C610 294 622 280 632 266 C638 258 642 250 646 244 C650 238 654 234 658 232 C662 230 666 232 670 236 C674 240 678 246 682 254 C690 266 700 280 716 294 C736 312 762 328 796 342 C838 358 888 370 950 378 C1010 386 1070 390 1130 390 C1200 390 1270 384 1340 374 C1370 370 1400 366 1440 362 L1440 460 Z"
              fill="url(#kiliShadow)"
            />
          </g>

          <g opacity="0.32">
            <path
              d="M600 208 C604 200 610 194 616 188 C620 184 624 180 628 178 C632 176 636 176 640 178 C644 180 648 184 652 188 C658 194 664 200 670 208 C662 204 654 200 646 198 C642 196 638 194 634 194 C630 194 626 196 622 198 C616 202 608 206 600 208 Z"
              fill="url(#kiliSnow)"
            />
          </g>

          <g opacity="0.55">
            <path
              d="M616 188 C620 184 624 180 628 178 C632 176 636 176 640 178 C644 180 648 184 652 188 C650 190 646 194 640 198 C636 200 630 202 624 200 C620 198 618 194 616 188 Z"
              fill="#FFFFFF"
            />
            <path
              d="M608 210 C612 206 616 202 620 198 C618 204 616 210 612 214 C610 216 606 218 604 216 C604 214 606 212 608 210 Z"
              fill="#FFFFFF"
              opacity="0.75"
            />
            <path
              d="M652 200 C656 196 660 192 662 188 C660 194 658 200 654 206 C652 208 648 210 646 208 C646 206 648 202 652 200 Z"
              fill="#FFFFFF"
              opacity="0.6"
            />
          </g>

          <g opacity="0.14">
            <path
              d="M520 296 C545 280 560 262 572 244 L552 242 C538 262 522 280 502 296 Z"
              fill="#0F2419"
            />
            <path
              d="M748 296 C724 280 708 262 696 244 L716 242 C732 262 750 280 768 296 Z"
              fill="#0F2419"
            />
          </g>

          <g opacity="0.32">
            <path
              d="M0 400 C140 396 280 386 420 370 C560 354 700 340 840 336 C980 332 1120 340 1260 356 C1350 366 1400 374 1440 380"
              stroke="rgba(251,247,240,0.15)"
              strokeWidth="1"
              strokeDasharray="3 6"
              fill="none"
            />
          </g>
        </svg>
      </div>

      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="pointer-events-none absolute -left-6 top-32 w-28 rotate-12 opacity-40"
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

      <div className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-16 sm:h-20 lg:h-24">
          <svg
            className="h-full w-full"
            viewBox="0 0 1440 96"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0,0 L1440,0 L1440,42 C1200,88 2000,96 720,72 C440,48 240,88 0,42 Z"
              fill="rgba(20,83,45,0.55)"
            />
          </svg>
        </div>

        <div className="relative mx-auto max-w-[1360px] px-6 pb-20 pt-24 sm:px-10 lg:px-14 lg:pb-28 lg:pt-28">
          <div className="mb-10 flex flex-col gap-5 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[620px]">
              <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[#F2B33D]">
                <span className="h-px w-8 bg-[#F2B33D]" />
                <EditableText id="home.stats.eyebrow" defaultValue="Our Impact" />
              </span>
              <EditableText
                as="h2"
                id="home.stats.heading"
                defaultValue="Numbers that carry names, families and futures."
                multiline
                className="block text-[clamp(1.8rem,4.2vw,3.1rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#FBF7F0]"
              />
            </div>
            <EditableText
              as="p"
              id="home.stats.intro"
              defaultValue="Every figure below is a person, a household or a community that chose to build something lasting with us."
              multiline
              className="block max-w-[340px] text-[0.98rem] leading-[1.75] text-[#FBF7F0]/65"
            />
          </div>

          <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="relative">
                {i > 0 && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-2 left-1/2 hidden h-6 w-24 -translate-x-1/2 lg:block"
                  >
                    <svg viewBox="0 0 96 24" fill="none" className="h-full w-full">
                      <path
                        d="M2 12 Q 24 2, 48 12 T 94 12"
                        stroke="rgba(251,247,240,0.18)"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
                <StatItem stat={stat} active={inView} index={i} />
              </div>
            ))}
          </div>

          <div className="mt-14">
            <div aria-hidden="true" className="pointer-events-none relative -mx-6 sm:-mx-10 lg:-mx-14">
              <svg
                className="h-8 w-full sm:h-10"
                viewBox="0 0 1440 40"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d="M0 26 C 180 4, 360 34, 540 22 S 900 6, 1080 22 S 1320 36, 1440 16"
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
                className="block text-[0.95rem] text-[#FBF7F0]/70"
              />
              <a
                href="/publications"
                className={`group inline-flex w-fit items-center gap-3 rounded-xl bg-[#FBF7F0] px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white ${
                  isEditing ? "pointer-events-none" : ""
                }`}
              >
                <EditableText id="home.stats.footerCta" defaultValue="Read the full report" />
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

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-20 lg:h-24">
          <svg
            className="h-full w-full"
            viewBox="0 0 1440 96"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0,96 L1440,96 L1440,54 C1200,8 1000,0 720,24 C440,48 240,8 0,54 Z"
              fill="rgba(20,83,45,0.55)"
            />
          </svg>
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