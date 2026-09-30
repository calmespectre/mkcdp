import { useMemo, useState } from "react";

const PRESETS = [
  { amount: 500, impact: "School supplies for one child for a term" },
  { amount: 1500, impact: "A month of nutritious meals for a family" },
  { amount: 5000, impact: "Textbooks and uniform for a sponsored child" },
  { amount: 12000, impact: "A full year of school fees for one child" },
];

const PAY_METHODS = [
  { id: "mpesa", label: "M-Pesa", hint: "Fastest in Kenya" },
  { id: "card", label: "Card", hint: "Visa · Mastercard" },
  { id: "bank", label: "Bank transfer", hint: "For larger gifts" },
];

const Icon = {
  Heart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" />
    </svg>
  ),
  Shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3l7 3v6c0 4.6-3 8.1-7 9-4-.9-7-4.4-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m5 12.5 5 5 9-11" />
    </svg>
  ),
  Lock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="4" y="10" width="16" height="11" rx="2.5" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3" />
    </svg>
  ),
  User: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M4.5 20c.9-3.8 3.8-6 7.5-6s6.6 2.2 7.5 6" />
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
  Arrow: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
};

const inputClass =
  "w-full rounded-xl border border-green-900/15 bg-white px-4 py-3.5 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-900 focus:ring-2 focus:ring-green-900/15";

const inputWithIcon =
  "w-full rounded-xl border border-green-900/15 bg-white py-3.5 pl-11 pr-4 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-900 focus:ring-2 focus:ring-green-900/15";

export default function Donate() {
  const [frequency, setFrequency] = useState("once");
  const [preset, setPreset] = useState(1500);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState("mpesa");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const amount = useMemo(() => {
    const n = Number(custom);
    return custom && Number.isFinite(n) && n > 0 ? n : preset;
  }, [custom, preset]);

  const impactNote = useMemo(() => {
    const match = PRESETS.find((p) => p.amount === amount);
    if (match) return match.impact;
    if (amount >= 12000) return "A full year of school fees for one child";
    if (amount >= 5000) return "Textbooks and uniform for a sponsored child";
    if (amount >= 1500) return "A month of nutritious meals for a family";
    return "School supplies for one child for a term";
  }, [amount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!firstName.trim()) next.firstName = "Required";
    if (!lastName.trim()) next.lastName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email";
    if (!/^\+?[\d\s()-]{7,20}$/.test(phone)) next.phone = "Enter a valid phone number";
    if (!amount || amount < 100) next.amount = "Minimum gift is KES 100";
    setErrors(next);
    if (Object.keys(next).length === 0) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="hero-sans relative flex min-h-[80vh] items-center justify-center bg-[#FBF7F0] px-6 py-20">
        <div className="max-w-[560px] text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-900 text-white">
            <Icon.Check className="h-7 w-7" />
          </span>
          <h1 className="hero-serif mt-8 text-[clamp(1.8rem,4vw,2.6rem)] font-bold leading-tight text-[#111111]">
            Thank you, {firstName}.
          </h1>
          <p className="mt-5 text-[1rem] leading-[1.8] text-[#4A4A42]">
            Your {frequency === "once" ? "one-time" : "monthly"} gift of{" "}
            <span className="font-bold text-green-900">
              KES {amount.toLocaleString("en-US")}
            </span>{" "}
            has been received. A confirmation email is on its way to{" "}
            <span className="font-semibold text-[#111111]">{email}</span>.
          </p>
          <p className="mt-3 text-[0.9rem] leading-[1.7] text-[#4A4A42]/80">
            {impactNote}. You'll receive a full impact report within 30 days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-sans relative min-h-screen overflow-x-hidden bg-[#FBF7F0] text-[#141414] antialiased">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(20,83,45,0.06) 0px, rgba(20,83,45,0.06) 1px, transparent 1px, transparent 22px)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)",
          maskImage: "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16 lg:py-24">
        <div className="relative lg:sticky lg:top-24 lg:self-start">
          <span className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-green-900">
            <span className="h-px w-8 bg-green-900" />
            Gifts &amp; Donations
          </span>

          <h1 className="hero-serif text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.025em] text-[#111111]">
            Every shilling is a trust.
            <br />
            <span className="italic text-green-900">Every report is a promise kept.</span>
          </h1>

          <p className="mt-7 max-w-[480px] text-[1.02rem] leading-[1.8] text-[#4A4A42]">
            Your gift goes directly to programmes that put children in classrooms, families on
            their feet, and communities in charge of their own future.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: Icon.Shield, t: "Audited", d: "Reported every year" },
              { icon: Icon.Lock, t: "Secure", d: "256-bit encryption" },
              { icon: Icon.Heart, t: "Direct", d: "94% to programmes" },
            ].map((item) => (
              <div
                key={item.t}
                className="rounded-2xl border border-green-900/12 bg-white/60 p-4"
              >
                <item.icon className="h-5 w-5 text-green-900" />
                <p className="mt-3 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-green-900">
                  {item.t}
                </p>
                <p className="mt-1 text-[0.82rem] leading-relaxed text-[#4A4A42]">
                  {item.d}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-start gap-4 rounded-2xl border border-green-900/12 bg-white/60 p-5">
            <span className="mt-0.5 grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-green-900 text-white">
              <Icon.Heart className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[0.92rem] leading-[1.7] text-[#111111]">
                &ldquo;I don't know who gives, but I know every term my school fees arrive. My
                mother cries less now.&rdquo;
              </p>
              <p className="mt-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/70">
                — Mercy, sponsored since 2019
              </p>
            </div>
          </div>

          <svg
            viewBox="0 0 100 100"
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 top-[62%] hidden w-16 rotate-12 opacity-60 lg:block"
          >
            <path
              d="M52 9c21 1 38 15 37 36-1 24-20 45-44 44C24 88 8 70 9 49 10 26 28 8 52 9Z"
              fill="none"
              stroke="#E2703A"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="relative rounded-[28px] border border-green-900/12 bg-white/85 p-6 shadow-[0_36px_80px_-44px_rgba(20,83,45,0.45)] backdrop-blur-sm sm:p-8 lg:p-10"
        >
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
              Give
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-green-900/6 p-1.5">
              {[
                { id: "once", label: "One-time" },
                { id: "monthly", label: "Monthly" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFrequency(opt.id)}
                  className={`rounded-lg py-2.5 text-[0.8rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${
                    frequency === opt.id
                      ? "bg-green-900 text-white shadow-[0_10px_20px_-10px_rgba(28,107,75,0.9)]"
                      : "text-[#4A4A42] hover:text-green-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
              Amount (KES)
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {PRESETS.map((p) => (
                <button
                  key={p.amount}
                  type="button"
                  onClick={() => {
                    setPreset(p.amount);
                    setCustom("");
                  }}
                  className={`rounded-xl border px-4 py-3.5 text-left transition-all duration-200 ${
                    amount === p.amount && !custom
                      ? "border-green-900 bg-green-900/6 shadow-[0_10px_24px_-16px_rgba(28,107,75,0.9)]"
                      : "border-green-900/15 bg-white hover:border-green-900/40"
                  }`}
                >
                  <span
                    className={`block text-[1rem] font-bold ${
                      amount === p.amount && !custom ? "text-green-900" : "text-[#111111]"
                    }`}
                  >
                    {p.amount.toLocaleString("en-US")}
                  </span>
                  <span className="mt-0.5 block text-[0.7rem] leading-snug text-[#4A4A42]/80">
                    {p.impact}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative mt-3">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[0.82rem] font-bold text-green-900">
                KES
              </span>
              <input
                type="number"
                min="100"
                inputMode="numeric"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Enter a custom amount"
                className={`${inputClass} pl-14 ${
                  errors.amount ? "border-[#E2703A]/60 focus:border-[#E2703A]" : ""
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                {errors.amount}
              </p>
            )}
          </div>

          <div className="mt-7 rounded-2xl border border-green-900/12 bg-green-900/5 p-4">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-green-900">
              Your impact
            </p>
            <p className="mt-1.5 text-[0.92rem] leading-[1.6] text-[#111111]">
              <span className="font-bold">KES {amount.toLocaleString("en-US")}</span>{" "}
              {frequency === "monthly" ? "every month" : "one-time"} — {impactNote}.
            </p>
          </div>

          <div className="mt-7">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
              Payment method
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {PAY_METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                    method === m.id
                      ? "border-green-900 bg-green-900/6"
                      : "border-green-900/15 bg-white hover:border-green-900/40"
                  }`}
                >
                  <span
                    className={`block text-[0.88rem] font-bold ${
                      method === m.id ? "text-green-900" : "text-[#111111]"
                    }`}
                  >
                    {m.label}
                  </span>
                  <span className="mt-0.5 block text-[0.7rem] text-[#4A4A42]/80">
                    {m.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 space-y-5">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
              Your details
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                  First name
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-900/45">
                    <Icon.User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Amina"
                    className={`${inputWithIcon} ${
                      errors.firstName ? "border-[#E2703A]/60" : ""
                    }`}
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                  Last name
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-900/45">
                    <Icon.User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Wanjiku"
                    className={`${inputWithIcon} ${
                      errors.lastName ? "border-[#E2703A]/60" : ""
                    }`}
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                Email address
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-900/45">
                  <Icon.Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`${inputWithIcon} ${
                    errors.email ? "border-[#E2703A]/60" : ""
                  }`}
                />
              </div>
              {errors.email ? (
                <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                  {errors.email}
                </p>
              ) : (
                <p className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70">
                  We'll send your receipt and impact report here.
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                Phone number
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-900/45">
                  <Icon.Phone className="h-4 w-4" />
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 7xx xxx xxx"
                  className={`${inputWithIcon} ${
                    errors.phone ? "border-[#E2703A]/60" : ""
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="group mt-9 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-green-900 px-8 py-[1.15rem] text-[0.82rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_20px_40px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] active:scale-[0.99]"
          >
            Give KES {amount.toLocaleString("en-US")}
            <Icon.Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <div className="mt-5 flex items-start gap-3 text-[0.78rem] leading-[1.7] text-[#4A4A42]/80">
            <Icon.Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-900" />
            <p>
              Your payment is processed over a secure connection. MKCDP never stores card
              details on its servers.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}