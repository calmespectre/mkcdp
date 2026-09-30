import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

const PHOTOS = {
  main: "/img17.jpg",
  upper: "/img8.png",
  lower: "/img3.jpg",
  farRight: "/img4.jpg",
  lowerLeft: "/img5.jpg",
};

const VIDEO_POSTER = "image.png";
const VIDEO_SRC = "Inkisanjani-Digital-Resource-Centre-Documentary-2024.mp4";

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

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

const Icon = {
  Play: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.53.85l10.78-6.86a1 1 0 0 0 0-1.7L9.53 4.29A1 1 0 0 0 8 5.14Z" />
    </svg>
  ),
  Pause: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <rect x="6" y="4.5" width="4" height="15" rx="1.2" />
      <rect x="14" y="4.5" width="4" height="15" rx="1.2" />
    </svg>
  ),
  Volume: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M4 9.5h3l4.2-3.6a.8.8 0 0 1 1.3.62v11a.8.8 0 0 1-1.3.62L7 14.5H4a.8.8 0 0 1-.8-.8v-3.4A.8.8 0 0 1 4 9.5Z" />
      <path d="M15.4 9.2a.85.85 0 0 1 1.2.1 4.4 4.4 0 0 1 0 5.4.85.85 0 1 1-1.3-1.08 2.7 2.7 0 0 0 0-3.24.85.85 0 0 1 .1-1.18Z" />
    </svg>
  ),
  Mute: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M4 9.5h3l4.2-3.6a.8.8 0 0 1 1.3.62v11a.8.8 0 0 1-1.3.62L7 14.5H4a.8.8 0 0 1-.8-.8v-3.4A.8.8 0 0 1 4 9.5Z" />
      <path d="M15.6 9.9l4.2 4.2m0-4.2-4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  ),
  Settings: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 15.4a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8Zm0-1.8a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2Z" />
      <path d="M20.4 13.4a8.6 8.6 0 0 0 0-2.8l1.5-1.1-1.6-2.8-1.8.7a8.5 8.5 0 0 0-2.4-1.4L15.8 4h-3.2l-.3 2a8.5 8.5 0 0 0-2.4 1.4l-1.8-.7-1.6 2.8 1.5 1.1a8.6 8.6 0 0 0 0 2.8L6.5 14.5l1.6 2.8 1.8-.7a8.5 8.5 0 0 0 2.4 1.4l.3 2h3.2l.3-2a8.5 8.5 0 0 0 2.4-1.4l1.8.7 1.6-2.8-1.5-1.1Z" opacity="0.35" />
    </svg>
  ),
  Expand: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M4 9V4.8A.8.8 0 0 1 4.8 4H9v2H6v3H4Zm11-5h4.2a.8.8 0 0 1 .8.8V9h-2V6h-3V4ZM4 15h2v3h3v2H4.8a.8.8 0 0 1-.8-.8V15Zm14 0h2v4.2a.8.8 0 0 1-.8.8H15v-2h3v-3Z" />
    </svg>
  ),
  Compress: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M9 4v3.2A.8.8 0 0 1 8.2 8H5V6h2V4h2Zm6 0h2v2h2v2h-3.2A.8.8 0 0 1 15 7.2V4ZM5 16h3.2a.8.8 0 0 1 .8.8V20H7v-2H5v-2Zm14 0v2h-2v2h-2v-3.2a.8.8 0 0 1 .8-.8H19Z" />
    </svg>
  ),
};

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
      className="relative flex h-[calc(100dvh-68px)] w-full items-center overflow-hidden sm:h-[calc(100dvh-108px)] lg:h-[calc(100dvh-128px)]"
    >
      <motion.div
        className="absolute inset-0"
        style={{ y: heroY }}
      >
        <img
          src={PHOTOS.main}
          alt="Children learning together"
          className="h-full w-full object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 z-10 bg-gradient-to-r from-green-700 via-green-700/35 to-transparent" />

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

          <div className="mt-9 flex flex-wrap items-center gap-4">
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

function VideoPlayer() {
  const shellRef = useRef(null);
  const videoRef = useRef(null);
  const barRef = useRef(null);
  const hideTimer = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [quality, setQuality] = useState("Auto");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volumeHover, setVolumeHover] = useState(false);

  const progress = duration ? (current / duration) * 100 : 0;

  const bumpControls = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      const el = videoRef.current;
      if (el && !el.paused && !scrubbing) setShowControls(false);
    }, 2600);
  }, [scrubbing]);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (el) el.volume = volume;
  }, [volume]);

  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play()
        .then(() => {
          setPlaying(true);
          setStarted(true);
          bumpControls();
        })
        .catch(() => {});
    } else {
      el.pause();
      setPlaying(false);
      setShowControls(true);
    }
  }, [bumpControls]);

  const seekToClientX = useCallback(
    (clientX) => {
      const bar = barRef.current;
      const el = videoRef.current;
      if (!bar || !el || !duration) return;
      const rect = bar.getBoundingClientRect();
      const pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      el.currentTime = pct * duration;
      setCurrent(pct * duration);
    },
    [duration]
  );

  useEffect(() => {
    if (!scrubbing) return undefined;

    const onMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      seekToClientX(clientX);
    };
    const onUp = () => setScrubbing(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [scrubbing, seekToClientX]);

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    if (!el.muted && volume === 0) setVolume(0.6);
  };

  const toggleFullscreen = async () => {
    const shell = shellRef.current;
    if (!shell) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await shell.requestFullscreen();
    } catch (err) {}
  };

  const onKeyDown = (e) => {
    const el = videoRef.current;
    if (!el) return;
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      togglePlay();
    } else if (e.key === "ArrowRight") {
      el.currentTime = Math.min(el.currentTime + 5, duration || 0);
    } else if (e.key === "ArrowLeft") {
      el.currentTime = Math.max(el.currentTime - 5, 0);
    } else if (e.key === "m") {
      toggleMute();
    } else if (e.key === "f") {
      toggleFullscreen();
    }
  };

  return (
    <div
      ref={shellRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseMove={bumpControls}
      onMouseLeave={() => playing && setShowControls(false)}
      className="group/player relative aspect-video w-full select-none overflow-hidden rounded-[18px] bg-black outline-none ring-1 ring-black/10 focus-visible:ring-2 focus-visible:ring-green-700"
    >
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        poster={VIDEO_POSTER}
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onProgress={(e) => {
          const el = e.currentTarget;
          if (el.buffered.length && el.duration) {
            setBuffered((el.buffered.end(el.buffered.length - 1) / el.duration) * 100);
          }
        }}
        onEnded={() => {
          setPlaying(false);
          setShowControls(true);
        }}
      />
      {!started && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play video"
          className="absolute inset-0 z-20 grid place-items-center bg-black/25 transition-opacity duration-300"
        >
          <span className="grid h-[74px] w-[74px] place-items-center rounded-full bg-green-700/95 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.7)] transition-transform duration-300 hover:scale-105">
            <Icon.Play className="ml-1 h-7 w-7 text-white" />
          </span>
        </button>
      )}
      {started && !playing && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Resume video"
          className="absolute inset-0 z-20 grid place-items-center bg-black/20"
        >
          <span className="grid h-[64px] w-[64px] place-items-center rounded-full bg-black/55 backdrop-blur-sm transition-transform duration-300 hover:scale-105">
            <Icon.Play className="ml-1 h-6 w-6 text-white" />
          </span>
        </button>
      )}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/65 to-transparent px-5 pb-10 pt-4 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-[0.95rem] font-semibold text-white drop-shadow">
          Inkisanjani Digital Resource Center
        </p>
        <p className="mt-0.5 text-[0.75rem] font-medium text-white/70">
          MKCDP · 2 min · Documentary
        </p>
      </div>
      <div
        className={`absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-3 pb-3 pt-14 transition-all duration-300 sm:px-4 sm:pb-3.5 ${
          showControls ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <div
          ref={barRef}
          onMouseDown={(e) => {
            setScrubbing(true);
            seekToClientX(e.clientX);
          }}
          onTouchStart={(e) => {
            setScrubbing(true);
            seekToClientX(e.touches[0].clientX);
          }}
          className="group/bar relative mb-2.5 flex h-4 cursor-pointer items-center"
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(current)}
          tabIndex={-1}
        >
          <div className="relative h-[3px] w-full rounded-full bg-white/25 transition-all duration-150 group-hover/bar:h-[5px]">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/40"
              style={{ width: `${buffered}%` }}
            />
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[#E2703A]"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E2703A] opacity-0 shadow transition-opacity duration-150 group-hover/bar:opacity-100"
              style={{ left: `${progress}%`, opacity: scrubbing ? 1 : undefined }}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-white sm:gap-2.5">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-white/15"
          >
            {playing ? <Icon.Pause className="h-[18px] w-[18px]" /> : <Icon.Play className="ml-0.5 h-[18px] w-[18px]" />}
          </button>

          <div
            className="flex items-center"
            onMouseEnter={() => setVolumeHover(true)}
            onMouseLeave={() => setVolumeHover(false)}
          >
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-white/15"
            >
              {muted || volume === 0 ? (
                <Icon.Mute className="h-[18px] w-[18px]" />
              ) : (
                <Icon.Volume className="h-[18px] w-[18px]" />
              )}
            </button>

            <div
              className="overflow-hidden transition-all duration-300"
              style={{ width: volumeHover ? 68 : 0, opacity: volumeHover ? 1 : 0 }}
            >
              <div
                className="relative mx-2 flex h-4 cursor-pointer items-center"
                onMouseDown={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
                  const el = videoRef.current;
                  setVolume(pct);
                  if (el) {
                    el.volume = pct;
                    el.muted = pct === 0;
                    setMuted(pct === 0);
                  }
                }}
              >
                <div className="h-[3px] w-full rounded-full bg-white/30">
                  <div
                    className="relative h-full rounded-full bg-white"
                    style={{ width: `${(muted ? 0 : volume) * 100}%` }}
                  >
                    <span className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <span className="ml-1 text-[0.78rem] font-semibold tabular-nums text-white/90">
            {formatTime(current)} <span className="text-white/45">/ {formatTime(duration)}</span>
          </span>

          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            <div className="relative">
              <button
                type="button"
                onClick={() => setSettingsOpen((v) => !v)}
                aria-label="Settings"
                className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-white/15"
              >
                <Icon.Settings className="h-[19px] w-[19px]" />
              </button>
              {settingsOpen && (
                <div className="absolute bottom-12 right-0 w-40 overflow-hidden rounded-xl border border-white/10 bg-black/90 py-1.5 shadow-2xl backdrop-blur">
                  <p className="px-3.5 pb-1 pt-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white/45">
                    Quality
                  </p>
                  {["Auto"].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        setQuality(q);
                        setSettingsOpen(false);
                      }}
                      className="flex w-full items-center justify-between px-3.5 py-2 text-left text-[0.8rem] font-medium text-white/85 transition-colors hover:bg-white/10"
                    >
                      {q}
                      {quality === q && <span className="h-1.5 w-1.5 rounded-full bg-[#E2703A]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-white/15"
            >
              {isFullscreen ? (
                <Icon.Compress className="h-[18px] w-[18px]" />
              ) : (
                <Icon.Expand className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
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
        <div className="mb-11 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
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
        </div>

        <VideoPlayer />

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