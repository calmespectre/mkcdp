import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  EditableText,
  EditableImage,
  EditableNumber,
  useSiteContent,
} from "./editorContext";
import { useGiftCart } from "./giftCart";
import { useAuth } from "./AuthContext";
import { createDonation } from "../src/api/donations";
import { createGiftOrder } from "../src/api/gifts";
import { listNeeds } from "../src/api/gifts";
import {
  listOpportunities,
  createOpportunity,
  deleteOpportunity as deleteOpportunityApi,
  submitApplication,
} from "../src/api/volunteer";
import {
  listBeneficiaries,
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
} from "../src/api/beneficiaries";
import { createPartnershipEnquiry } from "../src/api/partnerships";
import { submitSafeguardingReport } from "../src/api/safeguarding";
import { usePaymentStatus } from "../src/hooks/usePaymentStatus";

const CURRENCIES = [
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling", flag: "🇰🇪", rate: 1 },
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸", rate: 129 },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺", rate: 140 },
  { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧", rate: 163 },
  { code: "ZAR", symbol: "R", name: "South African Rand", flag: "🇿🇦", rate: 7.1 },
  { code: "UGX", symbol: "USh", name: "Ugandan Shilling", flag: "🇺🇬", rate: 0.034 },
  { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling", flag: "🇹🇿", rate: 0.048 },
  { code: "RWF", symbol: "FRw", name: "Rwandan Franc", flag: "🇷🇼", rate: 0.094 },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", flag: "🇦🇪", rate: 35.1 },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", flag: "🇸🇦", rate: 34.4 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦", rate: 94.5 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺", rate: 85.2 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", flag: "🇮🇳", rate: 1.55 },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", flag: "🇨🇳", rate: 17.9 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵", rate: 0.85 },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", flag: "🇨🇭", rate: 146 },
];

const getCurrency = (code) => CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
const fromKes = (amountKes, currency) => {
  const rate = currency?.rate || 1;
  return rate > 0 ? amountKes / rate : amountKes;
};
const toKes = (amountLocal, currency) => {
  const rate = currency?.rate || 1;
  return amountLocal * rate;
};
const formatLocal = (value, currency) => {
  if (!Number.isFinite(value)) return "0";
  const decimals = ["KES", "UGX", "TZS", "RWF", "JPY", "INR", "CNY"].includes(currency?.code) ? 0 : 2;
  return value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

const PRESETS = [{ amount: 500 }, { amount: 1500 }, { amount: 5000 }, { amount: 12000 }];

const inputClass =
  "w-full rounded-xl border border-green-700/15 bg-white px-4 py-4 text-[1rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15 sm:py-3.5 sm:text-[0.92rem]";

const formatDate = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

function SectionHeading({ eyebrowPath, titlePath, introPath, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-[720px] text-center" : "max-w-[720px]"}>
      <span className={`mb-4 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-green-700 ${align === "center" ? "justify-center" : ""}`}>
        <span className="h-px w-8 bg-green-700" />
        <EditableText path={eyebrowPath} />
      </span>
      <EditableText
        path={titlePath}
        as="h2"
        multiline
        className="hero-serif text-[clamp(1.7rem,4vw,2.9rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#111111]"
      />
      {introPath && (
        <EditableText
          path={introPath}
          as="p"
          multiline
          className="mt-5 text-[1rem] leading-[1.85] text-[#4A4A42]"
        />
      )}
    </div>
  );
}

function FaqItem({ qPath, aPath, isOpen, onToggle }) {
  return (
    <div className="border-b border-green-700/12">
      <button type="button" onClick={onToggle} aria-expanded={isOpen} className="group flex w-full items-center justify-between gap-4 py-5 text-left sm:gap-6 sm:py-6">
        <EditableText
          path={qPath}
          as="span"
          multiline
          className="hero-serif text-[1rem] font-bold leading-snug text-[#111111] transition-colors duration-200 group-hover:text-green-700 sm:text-[1.15rem]"
        />
        <span className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border text-[1.15rem] font-bold leading-none transition-all duration-300 sm:h-9 sm:w-9 ${isOpen ? "border-green-700 bg-green-700 text-white" : "border-green-700/25 text-green-700 group-hover:border-green-700"}`}>
          {isOpen ? "–" : "+"}
        </span>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <EditableText
            path={aPath}
            as="p"
            multiline
            className="max-w-[820px] text-[0.95rem] leading-[1.85] text-[#4A4A42]"
          />
        </div>
      </div>
    </div>
  );
}

function MobileBreadcrumb({ label }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-green-700/12 bg-[#FBF7F0] lg:hidden">
      <div className="mx-auto max-w-[1560px] px-5 py-3.5 sm:px-10">
        <ol className="flex flex-wrap items-center gap-2 text-sm font-bold uppercase tracking-wider">
          <li>
            <Link to="/take-action" className="text-green-700 transition-colors duration-200 hover:text-green-950 hover:underline">
              Take Action
            </Link>
          </li>
          <li aria-hidden="true" className="text-green-700/35">›</li>
          <li className="text-[#4A4A42]" aria-current="page">{label}</li>
        </ol>
      </div>
    </nav>
  );
}

function CurrencyPicker({ value, onChange, className = "" }) {
  const [open, setOpen] = useState(false);
  const current = getCurrency(value);
  return (
    <div className={`relative ${className}`}>
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-green-700/15 bg-white px-4 py-3.5 text-left transition-all duration-200 hover:border-green-700/40">
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="text-[1.05rem] leading-none">{current.flag}</span>
          <span className="min-w-0">
            <span className="block text-[0.85rem] font-bold text-[#111111]">{current.code}</span>
            <span className="block truncate text-[0.7rem] text-[#4A4A42]/80">{current.name}</span>
          </span>
        </span>
        <span className="text-[0.75rem] font-bold text-green-700">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} aria-hidden="true" className="fixed inset-0 z-40" />
          <div className="absolute right-0 top-full z-50 mt-2 max-h-[320px] w-full min-w-[260px] overflow-y-auto rounded-2xl border border-green-700/15 bg-[#FBF7F0] py-2 shadow-[0_24px_48px_-24px_rgba(20,20,20,0.35)]">
            {CURRENCIES.map((c) => {
              const active = c.code === value;
              return (
                <button key={c.code} type="button" onClick={() => { onChange(c.code); setOpen(false); }} className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${active ? "bg-green-700/10" : "hover:bg-green-700/6"}`}>
                  <span className="text-[1rem] leading-none">{c.flag}</span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-[0.85rem] font-bold ${active ? "text-green-700" : "text-[#111111]"}`}>{c.code} · {c.symbol}</span>
                    <span className="block truncate text-[0.7rem] text-[#4A4A42]/80">{c.name}</span>
                  </span>
                  {active && <span className="text-[0.75rem] font-bold text-green-700">✓</span>}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function AmountSummary({ kesAmount, currencyCode, frequency, pathPrefix = "takeAction.donate" }) {
  const cur = getCurrency(currencyCode);
  const local = fromKes(kesAmount, cur);
  const isKes = cur.code === "KES";
  return (
    <div className="rounded-2xl border border-green-700/12 bg-green-700/5 p-4">
      <EditableText
        path={frequency === "monthly" ? `${pathPrefix}.monthlySummary` : `${pathPrefix}.oneTimeSummary`}
        as="p"
        className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-green-700"
      />
      <p className="hero-serif mt-1.5 text-[1.15rem] font-bold leading-tight text-[#111111]">{cur.symbol}{formatLocal(local, cur)} {cur.code}</p>
      {!isKes && <p className="mt-1 text-[0.78rem] text-[#4A4A42]/85">≈ KES {kesAmount.toLocaleString("en-US")} · converted at 1 {cur.code} = {cur.rate} KES</p>}
    </div>
  );
}

function PaymentWaitingScreen({ payment, onRetry, firstName, email, frequency, currency, amountLocal }) {
  const isMpesa = payment?.method === "mpesa";
  const isBank = payment?.method === "bank";
  const isCard = payment?.method === "card";
  const status = payment?.status || "processing";
  const bank = payment?.next_action?.instructions || {};
  return (
    <div className="mx-auto max-w-[640px] rounded-3xl border border-green-700/15 bg-white/85 p-8 shadow-[0_36px_80px_-44px_rgba(20,83,45,0.5)] sm:p-12">
      <span className="inline-flex rounded-full bg-green-700/10 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-green-700">
        {status === "pending_verification" ? "Awaiting verification" : "Awaiting payment"}
      </span>
      <h2 className="hero-serif mt-6 text-[clamp(1.5rem,4vw,2.1rem)] font-bold leading-tight text-[#111111]">
        {isMpesa && <>Check your phone, {firstName}.</>}
        {isBank && <>Complete your bank transfer, {firstName}.</>}
        {isCard && <>Complete your card payment, {firstName}.</>}
      </h2>
      <p className="mt-4 text-[0.95rem] leading-[1.8] text-[#4A4A42]">
        {isMpesa && <>We sent an M-Pesa prompt to your phone. Enter your PIN to confirm the gift of <span className="font-bold text-green-700">{currency.symbol}{formatLocal(amountLocal, currency)} {currency.code}</span>. This page updates automatically.</>}
        {isCard && <>A secure payment session has been created. Complete the card payment to finish your {frequency === "monthly" ? "monthly" : "one-time"} gift of <span className="font-bold text-green-700">{currency.symbol}{formatLocal(amountLocal, currency)} {currency.code}</span>.</>}
        {isBank && <>Transfer <span className="font-bold text-green-700">{currency.symbol}{formatLocal(amountLocal, currency)} {currency.code}</span> using the details below. Your gift is confirmed once our team verifies the transfer.</>}
      </p>
      {isBank && (
        <div className="mt-6 rounded-2xl border border-green-700/15 bg-green-700/5 p-5">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-green-700">Bank transfer details</p>
          <dl className="mt-3 space-y-1.5 text-[0.88rem] text-[#111111]">
            <div className="flex justify-between gap-4"><dt className="text-[#4A4A42]">Bank</dt><dd className="font-semibold">{bank.bank_name}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#4A4A42]">Account name</dt><dd className="font-semibold">{bank.account_name}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#4A4A42]">Account number</dt><dd className="font-semibold">{bank.account_number}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#4A4A42]">Branch</dt><dd className="font-semibold">{bank.branch}</dd></div>
            {bank.swift && <div className="flex justify-between gap-4"><dt className="text-[#4A4A42]">SWIFT</dt><dd className="font-semibold">{bank.swift}</dd></div>}
            <div className="mt-2 flex justify-between gap-4 border-t border-green-700/15 pt-3"><dt className="text-[#4A4A42]">Reference</dt><dd className="font-mono font-bold text-green-700">{bank.reference}</dd></div>
          </dl>
          <p className="mt-3 text-[0.78rem] text-[#4A4A42]/85">{bank.note}</p>
        </div>
      )}
      <div className="mt-8 flex items-center gap-3">
        <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-green-700" />
        <span className="text-[0.85rem] font-semibold text-[#4A4A42]">
          {status === "pending_verification" ? "Waiting for our team to verify your transfer…" : "Waiting for payment confirmation…"}
        </span>
      </div>
      <p className="mt-6 text-[0.78rem] leading-[1.7] text-[#4A4A42]/80">
        We'll email your receipt to <span className="font-semibold text-[#111111]">{email}</span> once the payment is confirmed. If the prompt did not appear, you can try again.
      </p>
      <button type="button" onClick={onRetry} className="mt-6 inline-flex items-center rounded-xl border border-green-700/20 px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-200 hover:bg-green-700/6">
        Start over
      </button>
    </div>
  );
}

function Donate() {
  const { getPath } = useSiteContent();
  const [currencyCode, setCurrencyCode] = useState("KES");
  const [frequency, setFrequency] = useState("once");
  const [preset, setPreset] = useState(1500);
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState("mpesa");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [idempotencyKey] = useState(() => `d-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);
  const currency = getCurrency(currencyCode);
  const localPresets = useMemo(() => PRESETS.map((p) => ({ ...p, local: fromKes(p.amount, currency) })), [currency]);
  const payMethods = getPath("takeAction.payMethods") || [];
  const amountKes = useMemo(() => {
    const n = Number(custom);
    if (custom && Number.isFinite(n) && n > 0) return Math.round(toKes(n, currency));
    return preset;
  }, [custom, preset, currency]);
  const amountLocal = fromKes(amountKes, currency);
  const { payment } = usePaymentStatus(paymentRef);
  const submitted = payment?.status === "completed";
  const processing = !!paymentRef && !submitted && payment?.status !== "failed";
  const failed = payment?.status === "failed";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!firstName.trim()) next.firstName = "Required";
    if (!lastName.trim()) next.lastName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email";
    if (!/^\+?[\d\s()-]{7,20}$/.test(phone)) next.phone = "Enter a valid phone number";
    if (!amountKes || amountKes < 100) next.amount = "Minimum gift is KES 100";
    setErrors(next);
    if (Object.keys(next).length !== 0) return;
    setSubmitting(true);
    try {
      const res = await createDonation({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        amount: Number(custom) > 0 ? Number(custom) : preset,
        currency: currency.code,
        frequency,
        payment_method: method,
        idempotency_key: idempotencyKey,
      });
      setPaymentRef(res.payment.public_reference);
    } catch (err) {
      setErrors({ form: err.message || "Could not start the payment. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setPaymentRef("");
    setErrors({});
  };

  if (processing || failed) {
    return (
      <div className="hidden lg:block">
        <PaymentWaitingScreen
          payment={payment}
          onRetry={reset}
          firstName={firstName}
          email={email}
          frequency={frequency}
          currency={currency}
          amountLocal={amountLocal}
        />
      </div>
    );
  }

  if (submitted) {
    return (
      <>
        <div className="hidden lg:block">
          <div className="relative flex min-h-[60vh] items-center justify-center rounded-3xl border border-green-700/12 bg-white/70 px-6 py-20">
            <div className="max-w-[560px] text-center">
              <EditableText path="takeAction.donate.successKicker" as="span" className="inline-flex rounded-full bg-green-700/10 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-green-700" />
              <h2 className="hero-serif mt-8 text-[clamp(1.6rem,5vw,2.6rem)] font-bold leading-tight text-[#111111]">
                <EditableText path="takeAction.donate.successTitlePrefix" /> {firstName}.
              </h2>
              <p className="mt-5 text-[1rem] leading-[1.8] text-[#4A4A42]">
                Your <EditableText path={frequency === "once" ? "takeAction.donate.successBodyOnce" : "takeAction.donate.successBodyMonthly"} /> <EditableText path="takeAction.donate.successBodyMiddle" />{" "}
                <span className="font-bold text-green-700">{currency.symbol}{formatLocal(amountLocal, currency)} {currency.code}</span>{" "}
                <EditableText path="takeAction.donate.successBodySuffix" />{" "}
                <span className="font-semibold text-[#111111]">{email}</span>.
              </p>
              {payment?.receipt_number && (
                <p className="mt-4 text-[0.8rem] uppercase tracking-[0.14em] text-[#4A4A42]">Receipt {payment.receipt_number}</p>
              )}
            </div>
          </div>
        </div>
        <div className="lg:hidden">
          <div className="rounded-3xl border border-green-700/20 bg-green-700/6 px-6 py-14 text-center">
            <EditableText path="takeAction.donate.successKicker" as="span" className="inline-flex rounded-full bg-green-700 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white" />
            <h2 className="hero-serif mt-6 text-[1.8rem] font-bold leading-tight text-[#111111]">
              <EditableText path="takeAction.donate.successTitlePrefix" /> {firstName}.
            </h2>
            <p className="mt-4 text-[0.95rem] leading-[1.8] text-[#4A4A42]">
              Your <EditableText path={frequency === "once" ? "takeAction.donate.successBodyOnce" : "takeAction.donate.successBodyMonthly"} /> <EditableText path="takeAction.donate.successBodyMiddle" />{" "}
              <span className="font-bold text-green-700">{currency.symbol}{formatLocal(amountLocal, currency)} {currency.code}</span>{" "}
              <EditableText path="takeAction.donate.successBodySuffix" />{" "}
              <span className="font-semibold text-[#111111]">{email}</span>.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hidden lg:block">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="relative lg:sticky lg:top-40 lg:self-start">
            <span className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-8 bg-green-700" />
              <EditableText path="takeAction.donate.eyebrow" />
            </span>
            <h2 className="hero-serif text-[clamp(1.9rem,6vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.025em] text-[#111111]">
              <EditableText path="takeAction.donate.titleLine1" />
              <br />
              <EditableText path="takeAction.donate.titleLine2" className="italic text-green-700" />
            </h2>
            <EditableText path="takeAction.donate.subtitle" as="p" multiline className="mt-6 max-w-[480px] text-[1rem] leading-[1.8] text-[#4A4A42] sm:mt-7 sm:text-[1.02rem]" />
            <div className="mt-8 grid grid-cols-3 gap-3 sm:mt-10 sm:gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-2xl border border-green-700/12 bg-white/60 p-3 sm:p-4">
                  <span className="block h-1 w-7 rounded-full bg-green-700/70" />
                  <EditableText path={`takeAction.donate.badges.${i}.t`} as="p" className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-green-700 sm:mt-3 sm:text-[0.72rem]" />
                  <EditableText path={`takeAction.donate.badges.${i}.d`} as="p" className="mt-0.5 text-[0.75rem] leading-snug text-[#4A4A42] sm:mt-1 sm:text-[0.82rem]" />
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="relative rounded-[24px] border border-green-700/12 bg-white/85 p-5 shadow-[0_36px_80px_-44px_rgba(20,83,45,0.45)] backdrop-blur-sm sm:rounded-[28px] sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <EditableText path="takeAction.donate.currencyLabel" as="p" className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]" />
                <EditableText path="takeAction.donate.currencyHint" as="p" className="mt-1 text-[0.82rem] text-[#4A4A42]/80" />
              </div>
              <CurrencyPicker value={currencyCode} onChange={(code) => { setCurrencyCode(code); setCustom(""); }} className="sm:w-[200px]" />
            </div>

            <div className="mt-7">
              <EditableText path="takeAction.donate.giveLabel" as="p" className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]" />
              <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-green-700/6 p-1.5">
                {[{ id: "once", path: "takeAction.donate.frequencyOnce" }, { id: "monthly", path: "takeAction.donate.frequencyMonthly" }].map((opt) => (
                  <button key={opt.id} type="button" onClick={() => setFrequency(opt.id)} className={`rounded-lg py-3 text-[0.82rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 sm:py-2.5 sm:text-[0.8rem] ${frequency === opt.id ? "bg-green-700 text-white shadow-[0_10px_20px_-10px_rgba(28,107,75,0.9)]" : "text-[#4A4A42] hover:text-green-700"}`}>
                    <EditableText path={opt.path} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                <EditableText path="takeAction.donate.amountLabel" /> ({currency.code})
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {localPresets.map((p) => (
                  <button key={p.amount} type="button" onClick={() => { setPreset(p.amount); setCustom(""); }} className={`rounded-xl border px-3.5 py-4 text-left transition-all duration-200 sm:px-4 sm:py-3.5 ${amountKes === p.amount && !custom ? "border-green-700 bg-green-700/6 shadow-[0_10px_24px_-16px_rgba(28,107,75,0.9)]" : "border-green-700/15 bg-white hover:border-green-700/40"}`}>
                    <span className={`block text-[1rem] font-bold ${amountKes === p.amount && !custom ? "text-green-700" : "text-[#111111]"}`}>{currency.symbol}{formatLocal(p.local, currency)}</span>
                  </button>
                ))}
              </div>
              <div className="relative mt-3">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[0.85rem] font-bold text-green-700">{currency.symbol}</span>
                <input type="number" min="1" step="any" inputMode="decimal" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={`${getPath("takeAction.donate.amountPlaceholderPrefix")} ${currency.code}`} className={`${inputClass} pl-14 ${errors.amount ? "border-[#E2703A]/60 focus:border-[#E2703A]" : ""}`} />
              </div>
              {errors.amount && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.amount}</p>}
            </div>

            <div className="mt-6 sm:mt-7">
              <AmountSummary kesAmount={amountKes} currencyCode={currencyCode} frequency={frequency} />
            </div>

            <div className="mt-7">
              <EditableText path="takeAction.donate.methodLabel" as="p" className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]" />
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {payMethods.map((m, i) => (
                  <button key={m.id} type="button" onClick={() => setMethod(m.id)} className={`rounded-xl border px-4 py-3 text-left transition-all duration-200 ${method === m.id ? "border-green-700 bg-green-700/6" : "border-green-700/15 bg-white hover:border-green-700/40"}`}>
                    <EditableText path={`takeAction.payMethods.${i}.label`} as="span" className={`block text-[0.88rem] font-bold ${method === m.id ? "text-green-700" : "text-[#111111]"}`} />
                    <EditableText path={`takeAction.payMethods.${i}.hint`} as="span" className="mt-0.5 block text-[0.7rem] text-[#4A4A42]/80" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <EditableText path="takeAction.donate.detailsLabel" as="p" className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]" />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <EditableText path="takeAction.donate.firstNameLabel" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={getPath("takeAction.donate.firstNamePlaceholder")} autoComplete="given-name" className={`${inputClass} ${errors.firstName ? "border-[#E2703A]/60" : ""}`} />
                  {errors.firstName && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.firstName}</p>}
                </div>
                <div>
                  <EditableText path="takeAction.donate.lastNameLabel" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={getPath("takeAction.donate.lastNamePlaceholder")} autoComplete="family-name" className={`${inputClass} ${errors.lastName ? "border-[#E2703A]/60" : ""}`} />
                  {errors.lastName && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <EditableText path="takeAction.donate.emailLabel" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={getPath("takeAction.donate.emailPlaceholder")} autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                {errors.email ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p> : <EditableText path="takeAction.donate.emailHint" as="p" className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70" />}
              </div>
              <div>
                <EditableText path="takeAction.donate.phoneLabel" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={getPath("takeAction.donate.phonePlaceholder")} autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                {errors.phone && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p>}
              </div>
              {errors.form && <p className="text-[0.8rem] font-medium text-[#E2703A]">{errors.form}</p>}
            </div>

            <button type="submit" disabled={submitting} className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-green-700 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_20px_40px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:mt-9 sm:px-8 sm:py-[1.15rem]">
              {submitting ? "Starting payment…" : (<><EditableText path="takeAction.donate.submitPrefix" /> {currency.symbol}{formatLocal(amountLocal, currency)} {currency.code}</>)}
            </button>
            <EditableText path="takeAction.donate.secure" as="p" multiline className="mt-5 border-l-2 border-green-700/40 pl-4 text-[0.78rem] leading-[1.7] text-[#4A4A42]/80" />
          </form>
        </div>
      </div>

      <div className="lg:hidden">
        {processing || failed ? (
          <PaymentWaitingScreen
            payment={payment}
            onRetry={reset}
            firstName={firstName}
            email={email}
            frequency={frequency}
            currency={currency}
            amountLocal={amountLocal}
          />
        ) : submitted ? (
          <div className="rounded-3xl border border-green-700/20 bg-green-700/6 px-6 py-14 text-center">
            <EditableText path="takeAction.donate.successKicker" as="span" className="inline-flex rounded-full bg-green-700 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white" />
            <h2 className="hero-serif mt-6 text-[1.8rem] font-bold leading-tight text-[#111111]">
              <EditableText path="takeAction.donate.successTitlePrefix" /> {firstName}.
            </h2>
            <p className="mt-4 text-[0.95rem] leading-[1.8] text-[#4A4A42]">
              Your <EditableText path={frequency === "once" ? "takeAction.donate.successBodyOnce" : "takeAction.donate.successBodyMonthly"} /> <EditableText path="takeAction.donate.successBodyMiddle" />{" "}
              <span className="font-bold text-green-700">{currency.symbol}{formatLocal(amountLocal, currency)} {currency.code}</span>{" "}
              <EditableText path="takeAction.donate.successBodySuffix" />{" "}
              <span className="font-semibold text-[#111111]">{email}</span>.
            </p>
          </div>
        ) : (
          <>
            <div>
              <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
                <span className="h-px w-6 bg-green-700" />
                <EditableText path="takeAction.donate.eyebrow" />
              </span>
              <h2 className="hero-serif text-[2rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111]">
                <EditableText path="takeAction.donate.titleLine1" /> <EditableText path="takeAction.donate.titleLine2" className="italic text-green-700" />
              </h2>
              <EditableText path="takeAction.donate.subtitle" as="p" multiline className="mt-4 text-[0.95rem] leading-[1.8] text-[#4A4A42]" />
              <div className="mt-6 grid grid-cols-3 divide-x divide-green-700/12 rounded-2xl border border-green-700/12 bg-white/60">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="px-3 py-4 text-center">
                    <EditableText path={`takeAction.donate.badges.${i}.t`} as="p" className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-green-700" />
                    <EditableText path={`takeAction.donate.badges.${i}.d`} as="p" className="mt-1 text-[0.75rem] text-[#4A4A42]" />
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-7">
              <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.45)]">
                <EditableText path="takeAction.donate.mobileSteps.0" as="p" className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]" />
                <div className="mt-3">
                  <CurrencyPicker value={currencyCode} onChange={(code) => { setCurrencyCode(code); setCustom(""); }} />
                </div>
                <EditableText path="takeAction.donate.mobileSteps.1" as="p" className="mt-7 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]" />
                <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-green-700/6 p-1.5">
                  {[{ id: "once", path: "takeAction.donate.frequencyOnce" }, { id: "monthly", path: "takeAction.donate.frequencyMonthly" }].map((opt) => (
                    <button key={opt.id} type="button" onClick={() => setFrequency(opt.id)} className={`rounded-lg py-3.5 text-[0.82rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${frequency === opt.id ? "bg-green-700 text-white" : "text-[#4A4A42]"}`}>
                      <EditableText path={opt.path} />
                    </button>
                  ))}
                </div>
                <p className="mt-7 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                  <EditableText path="takeAction.donate.mobileSteps.2" /> ({currency.code})
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  {localPresets.map((p) => {
                    const active = amountKes === p.amount && !custom;
                    return (
                      <button key={p.amount} type="button" onClick={() => { setPreset(p.amount); setCustom(""); }} className={`rounded-xl border px-4 py-4 text-left transition-all duration-200 ${active ? "border-green-700 bg-green-700/6 ring-1 ring-green-700" : "border-green-700/15 bg-white"}`}>
                        <span className={`block text-[1.05rem] font-bold ${active ? "text-green-700" : "text-[#111111]"}`}>{currency.symbol}{formatLocal(p.local, currency)}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="relative mt-3">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[0.85rem] font-bold text-green-700">{currency.symbol}</span>
                  <input type="number" min="1" step="any" inputMode="decimal" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={`${getPath("takeAction.donate.amountPlaceholderPrefix")} ${currency.code}`} className={`${inputClass} pl-14`} />
                </div>
                {errors.amount && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.amount}</p>}
                <div className="mt-4"><AmountSummary kesAmount={amountKes} currencyCode={currencyCode} frequency={frequency} /></div>
              </div>

              <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5">
                <EditableText path="takeAction.donate.mobileSteps.3" as="p" className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]" />
                <div className="mt-3 space-y-2.5">
                  {payMethods.map((m, i) => {
                    const active = method === m.id;
                    return (
                      <button key={m.id} type="button" onClick={() => setMethod(m.id)} className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-4 text-left transition-all duration-200 ${active ? "border-green-700 bg-green-700/6 ring-1 ring-green-700" : "border-green-700/15 bg-white"}`}>
                        <span>
                          <EditableText path={`takeAction.payMethods.${i}.label`} as="span" className={`block text-[0.92rem] font-bold ${active ? "text-green-700" : "text-[#111111]"}`} />
                          <EditableText path={`takeAction.payMethods.${i}.hint`} as="span" className="mt-0.5 block text-[0.72rem] text-[#4A4A42]/80" />
                        </span>
                        <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${active ? "bg-green-700" : "bg-green-700/20"}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5">
                <EditableText path="takeAction.donate.mobileSteps.4" as="p" className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]" />
                <div className="mt-4 space-y-5">
                  {[
                    { key: "firstName", path: "takeAction.donate.firstNameLabel", value: firstName, set: setFirstName, ph: "takeAction.donate.firstNamePlaceholder", ac: "given-name", err: errors.firstName },
                    { key: "lastName", path: "takeAction.donate.lastNameLabel", value: lastName, set: setLastName, ph: "takeAction.donate.lastNamePlaceholder", ac: "family-name", err: errors.lastName },
                  ].map((f) => (
                    <div key={f.key}>
                      <EditableText path={f.path} as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                      <input type="text" value={f.value} onChange={(e) => f.set(e.target.value)} placeholder={getPath(f.ph)} autoComplete={f.ac} className={`${inputClass} ${f.err ? "border-[#E2703A]/60" : ""}`} />
                      {f.err && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{f.err}</p>}
                    </div>
                  ))}
                  <div>
                    <EditableText path="takeAction.donate.emailLabel" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={getPath("takeAction.donate.emailPlaceholder")} autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                    {errors.email ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p> : <EditableText path="takeAction.donate.emailHint" as="p" className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70" />}
                  </div>
                  <div>
                    <EditableText path="takeAction.donate.phoneLabel" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={getPath("takeAction.donate.phonePlaceholder")} autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                    {errors.phone && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-3 z-30">
                <div className="rounded-2xl border border-green-700/15 bg-white/95 p-3 shadow-[0_18px_44px_-18px_rgba(20,83,45,0.55)] backdrop-blur">
                  <div className="mb-2 flex items-center justify-between px-1">
                    <EditableText path={frequency === "monthly" ? "takeAction.donate.mobileMonthly" : "takeAction.donate.mobileOneTime"} as="span" className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#4A4A42]" />
                    <span className="hero-serif text-[1.05rem] font-bold text-green-700">{currency.symbol}{formatLocal(amountLocal, currency)} {currency.code}</span>
                  </div>
                  <button type="submit" disabled={submitting} className="w-full rounded-xl bg-green-700 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-white transition-all duration-200 active:scale-[0.99] disabled:opacity-60">
                    {submitting ? "Starting…" : <EditableText path="takeAction.donate.mobileGiveNow" />}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}

function NeedCard({ needIndex, need, currency, qty, onAdd, onDec }) {
  const priceLocal = fromKes(need.kes, currency);
  const base = `takeAction.needs.${needIndex}`;
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-green-700/12 bg-white/80 shadow-[0_20px_50px_-40px_rgba(20,83,45,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-40px_rgba(20,83,45,0.55)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={need.childImage} alt={need.childName} loading="lazy" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-green-700 backdrop-blur">{need.category}</span>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/80">{need.childName} · {need.childGrade}</p>
          <p className="text-[0.68rem] text-white/70">{need.childLocation}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="hero-serif text-[1.1rem] font-bold leading-tight text-[#111111]">{need.title}</h3>
        <p className="mt-2 flex-1 text-[0.86rem] leading-[1.7] text-[#4A4A42]">{need.body}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="hero-serif text-[1.1rem] font-bold leading-none text-green-700">{currency.symbol}{formatLocal(priceLocal, currency)}</p>
            {currency.code !== "KES" && <p className="mt-1 text-[0.68rem] text-[#4A4A42]/80">≈ KES {need.kes.toLocaleString("en-US")}</p>}
          </div>
          {qty > 0 ? (
            <div className="flex items-center gap-2 rounded-full border border-green-700/25 bg-white p-1">
              <button type="button" onClick={onDec} aria-label="Decrease quantity" className="grid h-8 w-8 place-items-center rounded-full text-green-700 transition-colors hover:bg-green-700/10 active:scale-95">−</button>
              <span className="min-w-[2ch] text-center text-[0.9rem] font-bold text-[#111111]">{qty}</span>
              <button type="button" onClick={onAdd} aria-label="Increase quantity" className="grid h-8 w-8 place-items-center rounded-full bg-green-700 text-white transition-colors hover:bg-[#15543A] active:scale-95">+</button>
            </div>
          ) : (
            <button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-full bg-green-700 px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-white transition-all duration-200 hover:bg-[#15543A] active:scale-95">
              <EditableText path="takeAction.gift.addLabel" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function mapApiNeedToUi(n, index) {
  return {
    id: n.id,
    kes: Number(n.price_kes),
    title: n.title,
    body: n.body,
    category: n.category,
    childName: n.child_name,
    childGrade: n.child_grade,
    childLocation: n.child_location,
    childImage: n.child_image_url || n.child_image,
    _index: index,
  };
}

function SendAGift() {
  const { cart, setCart } = useGiftCart();
  const { getPath } = useSiteContent();
  const [currencyCode, setCurrencyCode] = useState("KES");
  const [apiNeeds, setApiNeeds] = useState([]);
  const currency = getCurrency(currencyCode);
  const fallbackNeeds = getPath("takeAction.needs") || [];

  useEffect(() => {
    let cancelled = false;
    listNeeds()
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res) ? res : res?.results || [];
        setApiNeeds(list.map(mapApiNeedToUi));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const needs = apiNeeds.length > 0 ? apiNeeds : fallbackNeeds;

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const need = needs.find((n) => n.id === id);
        return need && qty > 0 ? { need, qty } : null;
      })
      .filter(Boolean);
  }, [cart, needs]);

  const totalKes = cartItems.reduce((s, { need, qty }) => s + need.kes * qty, 0);
  const totalLocal = fromKes(totalKes, currency);
  const itemCount = cartItems.reduce((s, { qty }) => s + qty, 0);

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const decFromCart = (id) =>
    setCart((c) => {
      const next = { ...c };
      const cur = (next[id] || 0) - 1;
      if (cur <= 0) delete next[id];
      else next[id] = cur;
      return next;
    });

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="mb-8 sm:mb-10">
        <span className="inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-green-700">
          <span className="h-px w-6 bg-green-700" />
          <EditableText path="takeAction.gift.kicker" />
        </span>
        <h1 className="hero-serif mt-4 text-[clamp(1.9rem,6vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#111111]">
          <EditableText path="takeAction.gift.titleLine1" />
          <br />
          <EditableText path="takeAction.gift.titleLine2" className="italic text-green-700" />
        </h1>
        <EditableText path="takeAction.gift.subtitle" as="p" multiline className="mt-5 max-w-[620px] text-[0.98rem] leading-[1.85] text-[#4A4A42]" />
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex items-center gap-3">
          <EditableText path="takeAction.gift.currencyLabel" as="p" className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]" />
          <CurrencyPicker value={currencyCode} onChange={setCurrencyCode} className="w-full sm:w-[190px]" />
        </div>
      </div>

      <div className="pb-24 sm:pb-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {needs.map((need, i) => (
            <NeedCard key={need.id} needIndex={i} need={need} currency={currency} qty={cart[need.id] || 0} onAdd={() => addToCart(need.id)} onDec={() => decFromCart(need.id)} />
          ))}
        </div>
      </div>

      {itemCount > 0 && (
        <div className="fixed inset-x-3 bottom-3 z-40 lg:sticky lg:inset-auto lg:bottom-6 lg:mx-auto lg:mt-8 lg:max-w-2xl">
          <Link to="/take-action/send-a-gift-cart" className="flex w-full items-center justify-between gap-3 rounded-2xl border border-green-700/20 bg-white/95 px-5 py-4 shadow-[0_20px_50px_-18px_rgba(20,83,45,0.55)] backdrop-blur transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] lg:bg-white">
            <span className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-green-700 text-[0.8rem] font-bold text-white">{itemCount}</span>
              <span className="text-left">
                <EditableText path={itemCount === 1 ? "takeAction.gift.basketSingular" : "takeAction.gift.basketPlural"} as="span" className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]" />
                <span className="hero-serif block text-[1.05rem] font-bold leading-tight text-green-700">{currency.symbol}{formatLocal(totalLocal, currency)} {currency.code}</span>
              </span>
            </span>
            <EditableText path="takeAction.gift.viewBasket" as="span" className="rounded-xl bg-green-700 px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-white" />
          </Link>
        </div>
      )}
    </div>
  );
}

function GiftCart() {
  const { cart, setCart } = useGiftCart();
  const { getPath } = useSiteContent();
  const [currencyCode, setCurrencyCode] = useState("KES");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [paymentRef, setPaymentRef] = useState("");
  const [idempotencyKey] = useState(() => `g-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);
  const [apiNeeds, setApiNeeds] = useState([]);
  const currency = getCurrency(currencyCode);
  const fallbackNeeds = getPath("takeAction.needs") || [];

  useEffect(() => {
    let cancelled = false;
    listNeeds()
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res) ? res : res?.results || [];
        setApiNeeds(list.map(mapApiNeedToUi));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const needs = apiNeeds.length > 0 ? apiNeeds : fallbackNeeds;
  const { payment } = usePaymentStatus(paymentRef);
  const submitted = payment?.status === "completed";
  const processing = !!paymentRef && !submitted && payment?.status !== "failed";

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const need = needs.find((n) => n.id === id);
        return need && qty > 0 ? { need, qty } : null;
      })
      .filter(Boolean);
  }, [cart, needs]);

  const totalKes = cartItems.reduce((s, { need, qty }) => s + need.kes * qty, 0);
  const totalLocal = fromKes(totalKes, currency);
  const itemCount = cartItems.reduce((s, { qty }) => s + qty, 0);

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const decFromCart = (id) =>
    setCart((c) => {
      const next = { ...c };
      const cur = (next[id] || 0) - 1;
      if (cur <= 0) delete next[id];
      else next[id] = cur;
      return next;
    });
  const removeItem = (id) =>
    setCart((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });

  const resetAll = () => {
    setPaymentRef("");
    setCart({});
    setForm({ name: "", email: "", phone: "" });
    setErrors({});
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email";
    if (cartItems.length === 0) next.cart = "Add at least one need to your basket";
    if (form.phone.trim() && !/^\+?[\d\s()-]{7,20}$/.test(form.phone)) next.phone = "Enter a valid phone number";
    if (paymentMethod === "mpesa") {
      if (!form.phone.trim()) next.phone = "M-Pesa requires a phone number";
      else {
        const cleaned = form.phone.replace(/[\s()-]/g, "");
        if (!/^(\+?254|0)[17]\d{8}$/.test(cleaned)) next.phone = "M-Pesa is only available for Kenyan numbers (+254).";
      }
    }
    setErrors(next);
    if (Object.keys(next).length !== 0) return;
    setSubmitting(true);
    try {
      const res = await createGiftOrder({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        currency: currency.code,
        payment_method: paymentMethod,
        items: cartItems.map(({ need, qty }) => ({ id: need.id, quantity: qty })),
        idempotency_key: idempotencyKey,
      });
      setPaymentRef(res.payment.public_reference);
    } catch (err) {
      setErrors({ form: err.message || "Could not place order. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (processing) {
    return (
      <div className="mx-auto max-w-[720px] px-5 py-16 sm:px-0 sm:py-20">
        <PaymentWaitingScreen
          payment={payment}
          onRetry={resetAll}
          firstName={form.name.split(" ")[0] || ""}
          email={form.email}
          frequency="once"
          currency={currency}
          amountLocal={totalLocal}
        />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-[720px] px-5 py-16 sm:px-0 sm:py-20">
        <div className="rounded-3xl border border-green-700/20 bg-white/85 p-6 shadow-[0_36px_80px_-44px_rgba(20,83,45,0.5)] sm:p-10">
          <EditableText path="takeAction.cart.successKicker" as="span" className="inline-flex rounded-full bg-green-700/10 px-4 py-1.5 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-green-700" />
          <h2 className="hero-serif mt-6 text-[clamp(1.6rem,5vw,2.4rem)] font-bold leading-tight text-[#111111]">
            <EditableText path="takeAction.cart.successTitlePrefix" /> {form.name.split(" ")[0]}.
          </h2>
          <p className="mt-4 text-[0.95rem] leading-[1.8] text-[#4A4A42]">
            <EditableText path="takeAction.cart.successBodyPrefix" />{" "}
            <span className="font-bold text-green-700">{currency.symbol}{formatLocal(totalLocal, currency)} {currency.code}</span>{" "}
            (≈ KES {totalKes.toLocaleString("en-US")}) <EditableText path="takeAction.cart.successBodyMiddle" />{" "}
            <span className="font-semibold text-[#111111]">{form.email}</span>.
          </p>
          <div className="mt-6 divide-y divide-green-700/12 rounded-2xl border border-green-700/12 bg-white/70">
            {cartItems.map(({ need, qty }) => (
              <div key={need.id} className="flex items-start justify-between gap-4 p-4">
                <div>
                  <p className="text-[0.9rem] font-bold text-[#111111]">{need.title}</p>
                  <p className="mt-0.5 text-[0.75rem] text-[#4A4A42]">for {need.childName} · {need.childGrade}</p>
                </div>
                <p className="flex-shrink-0 text-[0.85rem] font-bold text-green-700">×{qty}</p>
              </div>
            ))}
          </div>
          <button type="button" onClick={resetAll} className="mt-6 inline-flex items-center rounded-xl border border-green-700/20 px-6 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-200 hover:bg-green-700/6">
            <EditableText path="takeAction.cart.successAnother" />
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-[720px] py-16 sm:py-20">
        <div className="rounded-3xl border border-dashed border-green-700/25 bg-white/50 p-12 text-center">
          <EditableText path="takeAction.cart.emptyTitle" as="p" className="hero-serif text-[1.3rem] font-bold text-[#111111]" />
          <Link to="/take-action/send-a-gift" className="mt-6 inline-flex items-center rounded-xl bg-green-700 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white transition-all duration-200 hover:bg-[#15543A]">
            <EditableText path="takeAction.cart.emptyBrowse" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1240px]">
      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
        <div className="space-y-8">
          <div>
            <EditableText path="takeAction.cart.title" as="h2" className="hero-serif text-[1.3rem] font-bold text-[#111111] sm:text-[1.5rem]" />
            <p className="mt-1 text-[0.85rem] text-[#4A4A42]">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
            <div className="mt-4 divide-y divide-green-700/12 rounded-2xl border border-green-700/12 bg-white/70">
              {cartItems.map(({ need, qty }) => {
                const lineLocal = fromKes(need.kes * qty, currency);
                return (
                  <div key={need.id} className="flex items-start gap-4 p-4">
                    <img src={need.childImage} alt={need.childName} className="h-16 w-16 flex-shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.92rem] font-bold text-[#111111]">{need.title}</p>
                      <p className="mt-0.5 text-[0.75rem] text-[#4A4A42]">for {need.childName} · {need.childGrade}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-green-700/25 bg-white p-0.5">
                          <button type="button" onClick={() => decFromCart(need.id)} aria-label="Decrease" className="grid h-7 w-7 place-items-center rounded-full text-green-700 transition-colors hover:bg-green-700/10 active:scale-95">−</button>
                          <span className="min-w-[2ch] text-center text-[0.85rem] font-bold text-[#111111]">{qty}</span>
                          <button type="button" onClick={() => addToCart(need.id)} aria-label="Increase" className="grid h-7 w-7 place-items-center rounded-full bg-green-700 text-white transition-colors hover:bg-[#15543A] active:scale-95">+</button>
                        </div>
                        <button type="button" onClick={() => removeItem(need.id)} className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#E2703A] transition-colors hover:text-[#c95c2b]">
                          <EditableText path="takeAction.cart.removeLabel" />
                        </button>
                      </div>
                    </div>
                    <p className="flex-shrink-0 text-[0.9rem] font-bold text-green-700">{currency.symbol}{formatLocal(lineLocal, currency)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <EditableText path="takeAction.cart.detailsTitle" as="h2" className="hero-serif text-[1.3rem] font-bold text-[#111111] sm:text-[1.5rem]" />
            <div className="mt-4 space-y-5">
              <div>
                <EditableText path="takeAction.cart.fullNameLabel" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder={getPath("takeAction.cart.fullNamePlaceholder")} autoComplete="name" className={`${inputClass} ${errors.name ? "border-[#E2703A]/60" : ""}`} />
                {errors.name && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.name}</p>}
              </div>
              <div>
                <EditableText path="takeAction.cart.emailLabel" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder={getPath("takeAction.cart.emailPlaceholder")} autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                {errors.email ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p> : <EditableText path="takeAction.cart.emailHint" as="p" className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70" />}
              </div>
              <div>
                <p className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                  <EditableText path="takeAction.cart.phoneLabel" /> <EditableText path="takeAction.cart.phoneOptional" className="font-medium normal-case tracking-normal text-[#4A4A42]/60" />
                </p>
                <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder={getPath("takeAction.cart.phonePlaceholder")} autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                {errors.phone ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p> : paymentMethod === "mpesa" ? <EditableText path="takeAction.cart.phoneHintMpesa" as="p" className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70" /> : <EditableText path="takeAction.cart.phoneHintCard" as="p" className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70" />}
              </div>
              {errors.form && <p className="text-[0.8rem] font-medium text-[#E2703A]">{errors.form}</p>}
              {errors.cart && <p className="text-[0.8rem] font-medium text-[#E2703A]">{errors.cart}</p>}
            </div>
          </div>

          <div>
            <EditableText path="takeAction.cart.paymentTitle" as="h2" className="hero-serif text-[1.3rem] font-bold text-[#111111] sm:text-[1.5rem]" />
            <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-green-700/15 bg-white p-1">
              <button type="button" onClick={() => setPaymentMethod("card")} className={`rounded-lg px-3 py-3 text-[0.75rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${paymentMethod === "card" ? "bg-green-700 text-white shadow-[0_10px_20px_-10px_rgba(28,107,75,0.9)]" : "text-[#4A4A42] hover:text-green-700"}`}>
                <EditableText path="takeAction.cart.cardLabel" />
                <EditableText path="takeAction.cart.cardSub" as="span" className="mt-0.5 block text-[0.58rem] font-medium normal-case tracking-normal opacity-80" />
              </button>
              <button type="button" onClick={() => setPaymentMethod("mpesa")} className={`rounded-lg px-3 py-3 text-[0.75rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${paymentMethod === "mpesa" ? "bg-green-700 text-white shadow-[0_10px_20px_-10px_rgba(28,107,75,0.9)]" : "text-[#4A4A42] hover:text-green-700"}`}>
                <EditableText path="takeAction.cart.mpesaLabel" />
                <EditableText path="takeAction.cart.mpesaSub" as="span" className="mt-0.5 block text-[0.58rem] font-medium normal-case tracking-normal opacity-80" />
              </button>
              <button type="button" onClick={() => setPaymentMethod("bank")} className={`rounded-lg px-3 py-3 text-[0.75rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${paymentMethod === "bank" ? "bg-green-700 text-white shadow-[0_10px_20px_-10px_rgba(28,107,75,0.9)]" : "text-[#4A4A42] hover:text-green-700"}`}>
                Bank transfer
              </button>
            </div>

            {paymentMethod === "card" && (
              <div className="mt-4 rounded-2xl border border-green-700/12 bg-green-700/5 p-4">
                <EditableText path="takeAction.cart.mpesaNote" as="p" multiline className="text-[0.85rem] leading-[1.7] text-[#4A4A42]" />
              </div>
            )}

            {paymentMethod === "mpesa" && (
              <div className="mt-4 rounded-2xl border border-green-700/12 bg-green-700/5 p-4">
                <EditableText path="takeAction.cart.mpesaNote" as="p" multiline className="text-[0.85rem] leading-[1.7] text-[#4A4A42]" />
                <EditableText path="takeAction.cart.mpesaNoteSub" as="p" className="mt-2 text-[0.72rem] text-[#4A4A42]/80" />
              </div>
            )}

            {paymentMethod === "bank" && (
              <div className="mt-4 rounded-2xl border border-green-700/12 bg-green-700/5 p-4">
                <p className="text-[0.85rem] leading-[1.7] text-[#4A4A42]">You'll receive bank transfer details and a reference code after placing your order. The order is confirmed once our team verifies the transfer.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-40 lg:self-start">
          <div className="rounded-3xl border border-green-700/12 bg-white/85 p-6 shadow-[0_28px_70px_-46px_rgba(20,83,45,0.5)]">
            <EditableText path="takeAction.cart.orderSummary" as="h3" className="hero-serif text-[1.15rem] font-bold text-[#111111]" />
            <div className="mt-4 space-y-2 border-b border-green-700/12 pb-4 text-[0.85rem]">
              <div className="flex justify-between text-[#4A4A42]"><EditableText path="takeAction.cart.itemsLabel" as="span" /><span className="font-bold text-[#111111]">{itemCount}</span></div>
              <div className="flex justify-between text-[#4A4A42]"><EditableText path="takeAction.cart.subtotalLabel" as="span" /><span className="font-bold text-[#111111]">KES {totalKes.toLocaleString("en-US")}</span></div>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <EditableText path="takeAction.cart.totalLabel" as="span" className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-green-700" />
              <div className="text-right">
                <p className="hero-serif text-[1.6rem] font-bold leading-none text-green-700">{currency.symbol}{formatLocal(totalLocal, currency)}</p>
                <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#4A4A42]/80">{currency.code}</p>
              </div>
            </div>
            {currency.code !== "KES" && <p className="mt-2 text-[0.72rem] text-[#4A4A42]/80">≈ KES {totalKes.toLocaleString("en-US")} · 1 {currency.code} = {currency.rate} KES</p>}
            <button type="submit" disabled={submitting} className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-green-700 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_20px_40px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] active:scale-[0.99] disabled:opacity-60">
              {submitting ? "Placing order…" : (<><EditableText path="takeAction.cart.checkoutPrefix" /> {currency.symbol}{formatLocal(totalLocal, currency)}</>)}
            </button>
            <Link to="/take-action/send-a-gift" className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-green-700/20 px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-all duration-200 hover:bg-green-700/6">
              <EditableText path="takeAction.cart.addMore" />
            </Link>
            <EditableText path="takeAction.cart.secure" as="p" multiline className="mt-4 text-[0.72rem] leading-[1.7] text-[#4A4A42]/80" />
          </div>
        </div>
      </form>
    </div>
  );
}

function mapBeneficiaryFromApi(b) {
  return {
    id: b.id,
    name: b.name,
    age: b.age,
    gender: b.gender,
    location: b.location,
    grade: b.grade,
    monthly: Number(b.monthly_usd ?? 0),
    status: b.status,
    funded: b.funded,
    photo: b.photo_url || b.photo || "",
    dream: b.dream,
    story: b.story,
    published: b.published,
  };
}

function SponsorField({ label, error, children }) {
  return (
    <label className="block">
      <span className="hero-sans mb-1.5 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
        {label}
      </span>
      {children}
      {error ? (
        <span className="hero-sans mt-1 block text-[0.75rem] font-semibold text-[#E2703A]">{error}</span>
      ) : null}
    </label>
  );
}

function SponsorDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg className="absolute -left-32 -top-32 h-[460px] w-[460px] text-green-700/15" viewBox="0 0 400 400" fill="none">
        <circle cx="200" cy="200" r="186" stroke="currentColor" strokeWidth="2" />
        <circle cx="200" cy="200" r="128" stroke="currentColor" strokeWidth="1.5" strokeDasharray="9 11" />
        <circle cx="200" cy="200" r="72" fill="currentColor" opacity="0.14" />
      </svg>
      <svg className="absolute -right-24 top-24 h-[380px] w-[380px] text-[#E2703A]/20" viewBox="0 0 400 400" fill="none">
        <circle cx="200" cy="200" r="170" stroke="currentColor" strokeWidth="2" />
        <circle cx="200" cy="200" r="112" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="58" fill="currentColor" opacity="0.16" />
      </svg>
      <svg className="absolute bottom-10 left-0 h-64 w-full text-green-700/20" viewBox="0 0 1440 260" fill="none" preserveAspectRatio="none">
        <path d="M0 200 C 240 60, 480 268, 720 140 S 1200 40, 1440 180" stroke="currentColor" strokeWidth="2" />
        <path d="M0 246 C 260 120, 520 300, 780 178 S 1240 88, 1440 224" stroke="currentColor" strokeWidth="1.5" strokeDasharray="10 12" />
      </svg>
      <svg className="absolute right-0 top-0 h-72 w-full text-[#E2703A]/15" viewBox="0 0 1440 220" fill="none" preserveAspectRatio="none">
        <path d="M0 40 C 320 200, 640 0, 960 120 S 1280 200, 1440 60" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
}

function SponsorChildCard({ child, currency, canManage, onMeet, onSponsor, onEdit, onRemove }) {
  const monthly = Number(child.monthly) || 0;
  const funded = Math.max(0, Math.min(100, Number(child.funded) || 0));
  const monthlyLocal = fromKes(monthly * 129, currency);
  const isSponsored = child.status === "Sponsored";

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-green-700/12 bg-white/85 shadow-[0_24px_60px_-42px_rgba(20,83,45,0.42)] transition-all duration-300 hover:-translate-y-1 hover:border-green-700/30 hover:shadow-[0_30px_70px_-42px_rgba(20,83,45,0.55)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EFE9DF]">
        {child.photo ? (
          <img src={child.photo} alt={child.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="hero-serif flex h-full w-full items-center justify-center bg-green-700 text-6xl font-bold text-white">
            {child.name.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

        <span className={`hero-sans absolute left-3 top-3 rounded-full px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] shadow-sm ${isSponsored ? "bg-[#E2703A] text-white" : "bg-white text-green-700"}`}>
          {child.status}
        </span>

        {canManage && (
          <div className="absolute right-3 top-3 flex gap-2">
            <button type="button" onClick={() => onEdit(child)} aria-label={`Edit ${child.name}`} className="grid h-8 w-8 place-items-center rounded-full border border-white/40 bg-white/90 text-green-700 backdrop-blur transition-colors duration-200 hover:bg-white">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M4 20h4l10-10-4-4L4 16v4Z" />
                <path d="m14 6 4 4" />
              </svg>
            </button>
            <button type="button" onClick={() => onRemove(child)} aria-label={`Remove ${child.name}`} className="grid h-8 w-8 place-items-center rounded-full border border-white/40 bg-white/90 text-[#E2703A] backdrop-blur transition-colors duration-200 hover:bg-white">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
              </svg>
            </button>
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <p className="hero-serif text-[1.35rem] font-bold leading-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">{child.name}</p>
          <p className="hero-sans mt-0.5 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white/85">{child.age} yrs · {child.gender}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="hero-sans space-y-2 text-[0.85rem] text-[#4A4A42]">
          <p className="flex items-center gap-2">
            <svg className="h-4 w-4 flex-shrink-0 text-[#E2703A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span className="truncate">{child.location}</span>
          </p>
          <p className="flex items-center gap-2">
            <svg className="h-4 w-4 flex-shrink-0 text-[#E2703A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 8.5 12 4l9 4.5-9 4.5-9-4.5Z" />
              <path d="M7 11v4.5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V11" />
            </svg>
            {child.grade}
          </p>
        </div>

        {child.story && <p className="hero-sans mt-3 line-clamp-2 text-[0.82rem] leading-[1.7] text-[#4A4A42]/80">{child.story}</p>}

        <div className="mt-4">
          <div className="flex items-center justify-between text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
            <span>Funded</span>
            <span className="text-green-700">{funded}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-green-700/10">
            <div className={`h-full rounded-full transition-all duration-700 ${funded >= 100 ? "bg-[#E2703A]" : "bg-green-700"}`} style={{ width: `${funded}%` }} />
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-green-700/10 pt-4">
          <div>
            <p className="hero-sans text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#4A4A42]/70">Monthly</p>
            <p className="hero-serif mt-1 text-[1.35rem] font-bold leading-none text-green-700">{currency.symbol}{formatLocal(monthlyLocal, currency)}</p>
            {currency.code !== "KES" && <p className="hero-sans mt-1 text-[0.65rem] text-[#4A4A42]/80">${monthly} USD</p>}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          <button type="button" onClick={() => onSponsor(child)} className="hero-sans inline-flex w-full items-center justify-center rounded-xl bg-green-700 px-5 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] active:scale-[0.99]">
            Sponsor Now · {currency.symbol}{formatLocal(monthlyLocal, currency)}
          </button>
          <button type="button" onClick={() => onMeet(child)} className="hero-sans inline-flex w-full items-center justify-center gap-2 rounded-xl border border-green-700/20 bg-white px-5 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-200 hover:border-green-700/50 hover:bg-green-700/6 active:scale-[0.99]">
            Meet {child.name}
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

function MeetChildModal({ child, currency, onClose, onSponsor }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      }
    };
  }, [onClose]);

  const monthly = Number(child.monthly) || 0;
  const monthlyLocal = fromKes(monthly * 129, currency);
  const funded = Math.max(0, Math.min(100, Number(child.funded) || 0));

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`About ${child.name}`}>
      <div onClick={(e) => e.stopPropagation()} className="relative max-h-[94vh] w-full max-w-[1000px] overflow-y-auto rounded-t-3xl border border-green-700/15 bg-[#FBF7F0] shadow-[0_40px_90px_-30px_rgba(20,83,45,0.6)] sm:rounded-3xl">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full border border-green-700/20 bg-white/95 text-[#4A4A42] transition-colors duration-200 hover:bg-white hover:text-[#111111]">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="relative aspect-square overflow-hidden lg:aspect-auto lg:min-h-[500px]">
            {child.photo ? (
              <img src={child.photo} alt={child.name} className="h-full w-full object-cover" />
            ) : (
              <div className="hero-serif flex h-full w-full items-center justify-center bg-green-700 text-[8rem] font-bold text-white">
                {child.name.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
            <span className={`hero-sans absolute left-4 top-4 rounded-full px-3.5 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.16em] shadow ${child.status === "Sponsored" ? "bg-[#E2703A] text-white" : "bg-white text-green-700"}`}>
              {child.status}
            </span>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <span className="hero-sans inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-6 bg-green-700" />
              Meet your sponsored child
            </span>
            <h2 className="hero-serif mt-3 text-[clamp(1.8rem,5vw,2.6rem)] font-bold leading-tight text-[#111111]">{child.name}</h2>
            <p className="hero-sans mt-2 text-[0.95rem] font-semibold text-green-700">{child.age} years old · {child.gender} · {child.grade}</p>

            <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-green-700/12 bg-white/70 p-4">
                <dt className="hero-sans text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#4A4A42]/70">Location</dt>
                <dd className="hero-sans mt-1 text-[0.95rem] font-semibold text-[#111111]">{child.location}</dd>
              </div>
              <div className="rounded-2xl border border-green-700/12 bg-white/70 p-4">
                <dt className="hero-sans text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#4A4A42]/70">Grade</dt>
                <dd className="hero-sans mt-1 text-[0.95rem] font-semibold text-[#111111]">{child.grade}</dd>
              </div>
            </dl>

            <div className="mt-4 rounded-2xl border border-green-700/12 bg-green-700/5 p-4">
              <p className="hero-sans text-[0.62rem] font-bold uppercase tracking-[0.16em] text-green-700">Monthly sponsorship</p>
              <p className="hero-serif mt-1.5 text-[1.4rem] font-bold leading-none text-green-700">{currency.symbol}{formatLocal(monthlyLocal, currency)} {currency.code}</p>
              {currency.code !== "KES" && <p className="hero-sans mt-1 text-[0.75rem] text-[#4A4A42]/85">${monthly} USD per month · billed monthly, cancel anytime</p>}
            </div>

            {child.story && (
              <div className="mt-6">
                <p className="hero-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-green-700">Their story</p>
                <p className="hero-sans mt-3 text-[0.92rem] leading-[1.85] text-[#4A4A42]">{child.story}</p>
              </div>
            )}

            {child.dream && (
              <div className="mt-6 rounded-2xl border border-green-700/12 border-l-2 border-l-green-700 bg-white/60 p-5">
                <p className="hero-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-green-700">Their dream</p>
                <p className="hero-serif mt-2 text-[1.05rem] italic leading-[1.6] text-[#111111]">&ldquo;{child.dream}&rdquo;</p>
              </div>
            )}

            <div className="mt-6">
              <div className="hero-sans flex items-center justify-between text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#4A4A42]">
                <span>Sponsorship funded</span>
                <span className="text-green-700">{funded}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-green-700/10">
                <div className={`h-full rounded-full transition-all duration-700 ${funded >= 100 ? "bg-[#E2703A]" : "bg-green-700"}`} style={{ width: `${funded}%` }} />
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={() => onSponsor(child)} className="hero-sans inline-flex flex-1 items-center justify-center rounded-xl bg-green-700 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_20px_40px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] active:scale-[0.99]">
                Sponsor {child.name}
              </button>
              <button type="button" onClick={onClose} className="hero-sans inline-flex items-center justify-center rounded-xl border border-green-700/20 px-6 py-4 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-all duration-200 hover:bg-green-700/6">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddChildPanel({ initial, onSubmit, onClose, title }) {
  const [form, setForm] = useState(() => ({
    name: initial?.name || "",
    age: initial ? String(initial.age ?? "") : "",
    gender: initial?.gender || "Female",
    location: initial?.location || "",
    grade: initial?.grade || "",
    monthly: initial ? String(initial.monthly ?? "39") : "39",
    status: initial?.status || "Available",
    funded: initial ? String(initial.funded ?? "0") : "0",
    photo: initial?.photo || "",
    dream: initial?.dream || "",
    story: initial?.story || "",
  }));
  const [errors, setErrors] = useState({});
  const [uploadError, setUploadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      }
    };
  }, [onClose]);

  const change = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setUploadError("Please choose an image file."); return; }
    if (file.size > 6 * 1024 * 1024) { setUploadError("Image must be smaller than 6 MB."); return; }
    setUploadError("");
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, photo: String(reader.result || "") }));
    reader.onerror = () => setUploadError("Could not read that image. Try another file.");
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile({ target: { files: [file] } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Child's name is required.";
    if (!form.age || Number(form.age) < 1 || Number(form.age) > 25) next.age = "Enter an age between 1 and 25.";
    if (!form.location.trim()) next.location = "Location is required.";
    if (!form.grade.trim()) next.grade = "Grade or class is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        age: Number(form.age),
        gender: form.gender,
        location: form.location.trim(),
        grade: form.grade.trim(),
        monthly_usd: Number(form.monthly) || 0,
        status: form.status,
        funded: Math.max(0, Math.min(100, Number(form.funded) || 0)),
        photo: form.photo,
        dream: form.dream.trim(),
        story: form.story.trim(),
      });
    } catch (err) {
      setErrors({ form: err.message || "Could not save." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/55 px-4 py-10 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-green-700/15 bg-[#FBF7F0] shadow-2xl">
        <svg className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 text-green-700/12" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="100" r="48" fill="currentColor" />
        </svg>

        <div className="relative flex items-start justify-between gap-6 border-b border-green-700/12 px-6 py-5 sm:px-8 sm:py-6">
          <div>
            <h2 className="hero-serif text-[1.4rem] font-bold leading-tight text-[#111111] sm:text-[1.6rem]">{title || "Add a new child"}</h2>
            <p className="hero-sans mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-green-700">Superuser access only</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full border border-green-700/15 bg-white p-2.5 text-[#4A4A42] transition hover:border-[#E2703A]/40 hover:text-[#E2703A]">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative px-6 py-6 sm:px-8 sm:py-7">
          <div className="mb-6">
            <span className="hero-sans mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Child photo</span>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[160px_1fr] sm:items-start">
              <div className="relative">
                {form.photo ? (
                  <img src={form.photo} alt="Preview" className="h-40 w-40 rounded-2xl border border-green-700/15 object-cover sm:h-40 sm:w-40" />
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center rounded-2xl border border-dashed border-green-700/30 bg-white/60 text-center">
                    <span className="hero-sans px-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#4A4A42]/60">No image</span>
                  </div>
                )}
              </div>
              <div>
                <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} onClick={() => fileRef.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileRef.current?.click(); }} className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-green-700/25 bg-white/60 px-5 py-6 text-center transition-colors duration-200 hover:border-green-700/60 hover:bg-white">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-green-700" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M12 4v12" /><path d="m7 9 5-5 5 5" /><path d="M5 20h14" />
                  </svg>
                  <span className="hero-sans text-[0.8rem] font-bold text-green-700">Upload from your device</span>
                  <span className="hero-sans text-[0.7rem] text-[#4A4A42]/75">Click to browse or drag an image here. JPG, PNG, WEBP up to 6 MB.</span>
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.photo && (
                    <button type="button" onClick={() => setForm((f) => ({ ...f, photo: "" }))} className="hero-sans rounded-full border border-[#E2703A]/30 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#E2703A] transition hover:bg-[#E2703A]/10">Remove image</button>
                  )}
                </div>
                {uploadError && <p className="hero-sans mt-2 text-[0.75rem] font-medium text-[#E2703A]">{uploadError}</p>}
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <SponsorField label="Full name" error={errors.name}>
                <input value={form.name} onChange={change("name")} placeholder="e.g. Amina Nakato" className={inputClass} />
              </SponsorField>
            </div>

            <SponsorField label="Age" error={errors.age}>
              <input type="number" min="1" max="25" value={form.age} onChange={change("age")} placeholder="e.g. 8" className={inputClass} />
            </SponsorField>

            <SponsorField label="Gender">
              <select value={form.gender} onChange={change("gender")} className={inputClass}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </SponsorField>

            <SponsorField label="Location" error={errors.location}>
              <input value={form.location} onChange={change("location")} placeholder="e.g. Kisumu, Kenya" className={inputClass} />
            </SponsorField>

            <SponsorField label="Grade / Class" error={errors.grade}>
              <input value={form.grade} onChange={change("grade")} placeholder="e.g. Primary 4" className={inputClass} />
            </SponsorField>

            <SponsorField label="Monthly sponsorship (USD)">
              <input type="number" min="0" value={form.monthly} onChange={change("monthly")} placeholder="e.g. 39" className={inputClass} />
            </SponsorField>

            <SponsorField label="Status">
              <select value={form.status} onChange={change("status")} className={inputClass}>
                <option value="Available">Available</option>
                <option value="Sponsored">Sponsored</option>
              </select>
            </SponsorField>

            <SponsorField label="Funded (%)">
              <input type="number" min="0" max="100" value={form.funded} onChange={change("funded")} className={inputClass} />
            </SponsorField>

            <div className="sm:col-span-2">
              <SponsorField label="Their dream">
                <input value={form.dream} onChange={change("dream")} placeholder="e.g. To become a teacher" className={inputClass} />
              </SponsorField>
            </div>

            <div className="sm:col-span-2">
              <SponsorField label="Short story">
                <textarea value={form.story} onChange={change("story")} rows={5} placeholder="A few lines about the child's circumstances, interests and hopes." className={`${inputClass} resize-none`} />
              </SponsorField>
            </div>
            {errors.form && <p className="sm:col-span-2 text-[0.8rem] font-medium text-[#E2703A]">{errors.form}</p>}
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-green-700/12 pt-6 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="hero-sans rounded-full border border-green-700/20 px-7 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42] transition hover:border-green-700/40 hover:text-green-700">Cancel</button>
            <button type="submit" disabled={submitting} className="hero-sans inline-flex items-center justify-center gap-2 rounded-full bg-green-700 px-8 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-green-700/25 transition hover:bg-[#15543A] focus:outline-none focus:ring-4 focus:ring-green-700/25 disabled:opacity-60">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M5 12.5 10 17l9-10" />
              </svg>
              {submitting ? "Saving…" : (initial ? "Save changes" : "Add child")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SponsorAChildAdmin() {
  const { isSuperuser } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [currencyCode, setCurrencyCode] = useState("KES");
  const [editing, setEditing] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [meetChild, setMeetChild] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [toast, setToast] = useState("");

  const currency = getCurrency(currencyCode);
  const canManage = Boolean(isSuperuser);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listBeneficiaries()
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res) ? res : res?.results || [];
        setChildren(list.map(mapBeneficiaryFromApi));
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return children.filter((child) => {
      const matchesFilter = filter === "All" || child.status === filter;
      const matchesQuery =
        !q ||
        child.name.toLowerCase().includes(q) ||
        child.location.toLowerCase().includes(q) ||
        child.grade.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [children, filter, query]);

  const openAdd = () => { setEditing(null); setAddOpen(true); };
  const openEdit = (child) => { setEditing(child); setAddOpen(true); };
  const closeForm = () => { setAddOpen(false); setEditing(null); };

  const handleSubmit = async (payload) => {
    if (editing) {
      const updated = await updateBeneficiary(editing.id, payload);
      setChildren((prev) => prev.map((c) => (c.id === editing.id ? mapBeneficiaryFromApi(updated) : c)));
      setToast(`${payload.name} was updated`);
    } else {
      const created = await createBeneficiary(payload);
      setChildren((prev) => [mapBeneficiaryFromApi(created), ...prev]);
      setToast(`${payload.name} was added`);
    }
    closeForm();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteBeneficiary(pendingDelete.id);
      setChildren((prev) => prev.filter((c) => c.id !== pendingDelete.id));
      setToast(`${pendingDelete.name} was removed`);
    } catch {
      setToast("Could not remove child");
    }
    setPendingDelete(null);
  };

  const handleSponsor = (child) => {
    if (typeof window !== "undefined") {
      window.location.href = `/take-action/donate?child=${encodeURIComponent(child.name)}`;
    }
  };

  const filters = ["All", "Available", "Sponsored"];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#FBF7F0]">
      <SponsorDecor />

      <div className="relative mx-auto max-w-[1560px] px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-20">
        <div className="grid grid-cols-1 items-end gap-8 border-b border-green-700/15 pb-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-12">
          <div>
            <span className="hero-sans mb-5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-green-700">
              <span className="h-px w-8 bg-green-700" />
              Child Sponsorship
            </span>
            <h1 className="hero-serif text-[clamp(2rem,6vw,3.6rem)] font-bold leading-[1.05] tracking-[-0.028em] text-[#111111]">
              Sponsor a child.
              <br />
              <span className="italic text-green-700">Change their whole world.</span>
            </h1>
          </div>
          <div>
            <p className="hero-sans max-w-[520px] text-[0.98rem] leading-[1.85] text-[#4A4A42] sm:text-[1.02rem]">
              Every child here is waiting for someone like you. Browse their profiles, read their stories, and start a relationship that changes both your lives.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3">
                <p className="hero-sans text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Show in</p>
                <CurrencyPicker value={currencyCode} onChange={setCurrencyCode} className="w-[210px]" />
              </div>
              {canManage && (
                <button type="button" onClick={openAdd} className="hero-sans group ml-auto inline-flex items-center justify-center gap-2 rounded-full bg-green-700 px-6 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_-16px_rgba(20,83,45,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add Child
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, location or grade" className={`${inputClass} sm:max-w-[320px]`} />
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-full border px-5 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${filter === f ? "border-green-700 bg-green-700 text-white" : "border-green-700/20 bg-white/60 text-[#4A4A42] hover:border-green-700/50"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-10 rounded-3xl border border-dashed border-green-700/25 bg-white/50 p-12 text-center">
            <p className="hero-sans text-[0.9rem] text-[#4A4A42]">Loading children…</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((child) => (
              <SponsorChildCard key={child.id} child={child} currency={currency} canManage={canManage} onMeet={setMeetChild} onSponsor={handleSponsor} onEdit={openEdit} onRemove={setPendingDelete} />
            ))}
          </div>
        )}

        {!loading && visible.length === 0 && (
          <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-green-700/30 bg-white/60 px-6 py-16 text-center">
            <svg className="h-20 w-20 text-green-700/40" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="34" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
              <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.5" />
            </svg>
            <h3 className="hero-serif mt-5 text-[1.4rem] font-bold text-[#111111]">No children found</h3>
            <p className="hero-sans mt-2 max-w-sm text-[0.88rem] text-[#4A4A42]">Try a different search term or filter.</p>
            {canManage && (
              <button type="button" onClick={openAdd} className="hero-sans mt-6 rounded-full bg-green-700 px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#15543A]">Add Child</button>
            )}
          </div>
        )}
      </div>

      {addOpen && <AddChildPanel initial={editing} title={editing ? `Edit ${editing.name}` : "Add a new child"} onSubmit={handleSubmit} onClose={closeForm} />}

      {meetChild && <MeetChildModal child={meetChild} currency={currency} onClose={() => setMeetChild(null)} onSponsor={handleSponsor} />}

      {pendingDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-green-700/15 bg-[#FBF7F0] p-8 text-center shadow-2xl">
            <svg className="mx-auto h-24 w-24 text-[#E2703A]/40" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="2" strokeDasharray="7 9" />
              <circle cx="50" cy="50" r="12" fill="currentColor" />
            </svg>
            <h3 className="hero-serif mt-4 text-[1.4rem] font-bold text-[#111111]">Remove this child?</h3>
            <p className="hero-sans mt-3 text-[0.88rem] leading-relaxed text-[#4A4A42]">
              <span className="font-bold text-green-700">{pendingDelete.name}</span> will be removed from the sponsorship grid. This cannot be undone.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button type="button" onClick={() => setPendingDelete(null)} className="hero-sans rounded-full border border-green-700/20 px-7 py-3.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42] transition hover:border-green-700/40 hover:text-green-700">Keep child</button>
              <button type="button" onClick={confirmDelete} className="hero-sans rounded-full bg-[#E2703A] px-7 py-3.5 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-[#E2703A]/25 transition hover:bg-[#c95c2b] focus:outline-none focus:ring-4 focus:ring-[#E2703A]/25">Delete child</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 px-4">
          <div className="hero-sans flex items-center gap-3 rounded-full border border-green-700/25 bg-white px-6 py-4 text-[0.85rem] font-bold text-[#111111] shadow-xl shadow-green-700/10">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-700 text-white">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M5 12.5 10 17l9-10" />
              </svg>
            </span>
            {toast}
          </div>
        </div>
      )}
    </section>
  );
}

function RoleText({ plain, path, as = "span", className, multiline, value }) {
  if (plain) {
    const Tag = as;
    return <Tag className={className}>{value}</Tag>;
  }
  return <EditableText path={path} as={as} className={className} multiline={multiline} />;
}

function OpportunityCard({ roleIndex, role, plain, onApply, onRemove, canManage }) {
  const start = formatDate(role.startDate);
  const deadline = formatDate(role.deadline);
  const base = `takeAction.opportunities.${roleIndex}`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-green-700/12 bg-white/70 p-5 shadow-[0_24px_60px_-46px_rgba(20,83,45,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-green-700/30 hover:shadow-[0_30px_70px_-46px_rgba(20,83,45,0.55)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <RoleText plain={plain} path={`${base}.id`} as="span" className="rounded-full bg-green-700/8 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-green-700" value={role.id} />
        <div className="flex items-center gap-2">
          <RoleText plain={plain} path={`${base}.org`} as="span" className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/60" value={role.org} />
          {canManage && onRemove && (
            <button type="button" onClick={() => onRemove(role)} aria-label={`Remove ${role.title}`} className="grid h-6 w-6 place-items-center rounded-full border border-[#E2703A]/30 text-[0.78rem] font-bold leading-none text-[#E2703A] transition-colors duration-200 hover:bg-[#E2703A]/10">×</button>
          )}
        </div>
      </div>
      <RoleText plain={plain} path={`${base}.title`} as="h3" className="hero-serif mt-5 text-[1.25rem] font-bold leading-tight text-[#111111] sm:text-[1.3rem]" value={role.title} />
      <div className="mt-4 space-y-2 text-[0.82rem] text-[#4A4A42]">
        <span className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-700" /><RoleText plain={plain} path={`${base}.location`} value={role.location} /></span>
        <span className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-700" /><RoleText plain={plain} path={`${base}.commitment`} value={role.commitment} /></span>
        {start && <span className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-700" />Starts {start}</span>}
        {deadline && <span className="flex items-center gap-2.5 font-semibold text-[#E2703A]"><span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E2703A]" />Apply by {deadline}</span>}
      </div>
      <RoleText plain={plain} path={`${base}.desc`} as="p" multiline className="mt-5 flex-1 text-[0.9rem] leading-[1.75] text-[#4A4A42]" value={role.desc} />
      <div className="mt-5 flex flex-wrap gap-2">
        {(role.skills || []).map((s, i) => (
          <span key={i} className="rounded-full border border-green-700/15 px-3 py-1 text-[0.68rem] font-semibold text-[#4A4A42]">
            <RoleText plain={plain} path={`${base}.skills.${i}`} value={s} />
          </span>
        ))}
      </div>
      <button type="button" onClick={() => onApply(role)} className="mt-6 inline-flex items-center justify-center rounded-xl bg-green-700 px-5 py-4 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-[#15543A] active:scale-[0.99] sm:py-3.5 sm:text-[0.78rem]">Apply for this role</button>
    </article>
  );
}

function NewOpportunityPanel({ volFilters, onCreate }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", org: "", location: "", commitment: "", startDate: "", deadline: "", desc: "", skills: "", tags: [] });
  const [errors, setErrors] = useState({});
  const [posted, setPosted] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const tagOptions = volFilters.filter((f) => f.id !== "all");
  const change = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const toggleTag = (id) => setForm((f) => ({ ...f, tags: f.tags.includes(id) ? f.tags.filter((t) => t !== id) : [...f.tags, id] }));
  const clear = () => { setForm({ title: "", org: "", location: "", commitment: "", startDate: "", deadline: "", desc: "", skills: "", tags: [] }); setErrors({}); };
  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.title.trim()) next.title = "Role title is required.";
    if (!form.org.trim()) next.org = "Organisation is required.";
    if (!form.location.trim()) next.location = "Location is required.";
    if (!form.commitment.trim()) next.commitment = "Commitment is required.";
    if (!form.desc.trim()) next.desc = "Description is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitting(true);
    try {
      await onCreate({
        title: form.title.trim(),
        org: form.org.trim(),
        location: form.location.trim(),
        commitment: form.commitment.trim(),
        start_date: form.startDate || null,
        deadline: form.deadline || null,
        description: form.desc.trim(),
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        tags: form.tags,
      });
      setPosted(form.title.trim());
      clear();
      setOpen(false);
      if (typeof window !== "undefined") window.setTimeout(() => setPosted(""), 4000);
    } catch (err) {
      setErrors({ form: err.message || "Could not post role." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-green-700/15 bg-white/85 p-5 shadow-[0_28px_70px_-46px_rgba(20,83,45,0.5)] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-[560px]">
          <span className="inline-flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-green-700">
            <span className="h-px w-6 bg-green-700" />
            Superuser
          </span>
          <p className="hero-serif mt-3 text-[1.2rem] font-bold leading-tight text-[#111111] sm:text-[1.35rem]">Post a volunteer opportunity</p>
          <p className="mt-1.5 text-[0.85rem] leading-[1.7] text-[#4A4A42]">Published roles appear at the top of the list immediately.</p>
        </div>
        <button type="button" onClick={() => setOpen((v) => !v)} className={`inline-flex flex-shrink-0 items-center justify-center rounded-xl px-5 py-3 text-[0.74rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${open ? "border border-green-700/20 text-green-700 hover:bg-green-700/6" : "bg-green-700 text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] hover:-translate-y-0.5 hover:bg-[#15543A]"}`}>
          {open ? "Cancel" : "New role"}
        </button>
      </div>

      {posted && !open && (
        <p className="mt-5 rounded-xl border border-green-700/15 bg-green-700/6 px-4 py-3 text-[0.82rem] font-semibold text-green-700">“{posted}” was posted to the volunteer board.</p>
      )}

      {open && (
        <form onSubmit={submit} noValidate className="mt-7 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Role title</label>
              <input type="text" value={form.title} onChange={change("title")} placeholder="e.g. Weekend Reading Coach" className={`${inputClass} ${errors.title ? "border-[#E2703A]/60" : ""}`} />
              {errors.title && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.title}</p>}
            </div>
            <div>
              <label className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Organisation</label>
              <input type="text" value={form.org} onChange={change("org")} placeholder="e.g. Kakenya's Dream" className={`${inputClass} ${errors.org ? "border-[#E2703A]/60" : ""}`} />
              {errors.org && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.org}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Location</label>
              <input type="text" value={form.location} onChange={change("location")} placeholder="e.g. Kimana, Kajiado County" className={`${inputClass} ${errors.location ? "border-[#E2703A]/60" : ""}`} />
              {errors.location && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.location}</p>}
            </div>
            <div>
              <label className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Commitment</label>
              <input type="text" value={form.commitment} onChange={change("commitment")} placeholder="e.g. 4 hrs / week · 3 months" className={`${inputClass} ${errors.commitment ? "border-[#E2703A]/60" : ""}`} />
              {errors.commitment && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.commitment}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Start date (optional)</label>
              <input type="date" value={form.startDate} onChange={change("startDate")} className={inputClass} />
            </div>
            <div>
              <label className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Application deadline (optional)</label>
              <input type="date" value={form.deadline} onChange={change("deadline")} className={inputClass} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Description</label>
            <textarea value={form.desc} onChange={change("desc")} rows={4} placeholder="What will the volunteer be doing, and who will they be supporting?" className={`w-full resize-none rounded-xl border bg-white px-4 py-4 text-[1rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:ring-2 sm:py-3.5 sm:text-[0.92rem] ${errors.desc ? "border-[#E2703A]/60 focus:border-[#E2703A] focus:ring-[#E2703A]/20" : "border-green-700/15 focus:border-green-700 focus:ring-green-700/15"}`} />
            {errors.desc && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.desc}</p>}
          </div>

          <div>
            <label className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Skills (comma separated)</label>
            <input type="text" value={form.skills} onChange={change("skills")} placeholder="e.g. Literacy support, Swahili, First aid" className={inputClass} />
          </div>

          {tagOptions.length > 0 && (
            <div>
              <label className="mb-3 block text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Categories</label>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {tagOptions.map((f) => {
                  const active = form.tags.includes(f.id);
                  return (
                    <button key={f.id} type="button" onClick={() => toggleTag(f.id)} className={`rounded-xl border px-4 py-3.5 text-left text-[0.85rem] font-semibold transition-all duration-200 sm:py-3 ${active ? "border-green-700 bg-green-700/6 text-green-700" : "border-green-700/15 bg-white text-[#4A4A42] hover:border-green-700/40"}`}>
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {errors.form && <p className="text-[0.8rem] font-medium text-[#E2703A]">{errors.form}</p>}

          <div className="flex flex-col gap-4 border-t border-green-700/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="order-2 text-[0.75rem] leading-[1.6] text-[#4A4A42]/80 sm:order-1">Only superusers can publish or remove roles.</p>
            <button type="submit" disabled={submitting} className="order-1 inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-green-700 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] active:scale-[0.99] disabled:opacity-60 sm:order-2 sm:px-8 sm:py-[1.05rem] sm:text-[0.78rem]">
              {submitting ? "Publishing…" : "Publish role"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function mapApiOpportunity(o, index) {
  return {
    id: o.id,
    code: o.code,
    org: o.org,
    title: o.title,
    location: o.location,
    commitment: o.commitment,
    startDate: o.start_date,
    deadline: o.deadline,
    desc: o.description,
    skills: o.skills || [],
    tags: o.tags || [],
    _fromApi: true,
    _index: index,
  };
}

function Volunteer() {
  const { getPath } = useSiteContent();
  const { isSuperuser, user } = useAuth();
  const volFilters = getPath("takeAction.volFilters") || [];
  const volSteps = getPath("takeAction.volSteps") || [];
  const availabilityOptions = getPath("takeAction.availabilityOptions") || [];
  const expectList = getPath("takeAction.volunteer.expectList") || [];
  const fallbackOpportunities = getPath("takeAction.opportunities") || [];
  const [apiOpportunities, setApiOpportunities] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [filter, setFilter] = useState("all");
  const [applied, setApplied] = useState(null);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", availability: "", note: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canManage = Boolean(isSuperuser || user?.is_superuser || user?.role === "superuser" || user?.role === "admin");

  useEffect(() => {
    let cancelled = false;
    listOpportunities()
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res) ? res : res?.results || [];
        setApiOpportunities(list.map(mapApiOpportunity));
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingRoles(false); });
    return () => { cancelled = true; };
  }, []);

  const opportunities = apiOpportunities.length > 0 ? apiOpportunities : fallbackOpportunities;
  const hasRoles = opportunities.length > 0;
  const filtered = useMemo(() => filter === "all" ? opportunities : opportunities.filter((r) => r.tags && r.tags.includes(filter)), [filter, opportunities]);

  const handleCreateRole = async (data) => {
    const created = await createOpportunity(data);
    setApiOpportunities((prev) => [mapApiOpportunity(created, 0), ...prev]);
  };

  const handleRemoveRole = async (role) => {
    if (typeof window !== "undefined" && !window.confirm(`Remove “${role.title}” from the volunteer board?`)) return;
    await deleteOpportunityApi(role.id);
    setApiOpportunities((prev) => prev.filter((r) => r.id !== role.id));
  };

  const handleApply = (role) => {
    setApplied(role);
    setForm({ fullName: "", phone: "", email: "", availability: "", note: "" });
    setErrors({});
    setSubmitted(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeApplication = () => {
    setApplied(null);
    setSubmitted(false);
    setForm({ fullName: "", phone: "", email: "", availability: "", note: "" });
    setErrors({});
  };
  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Please enter your full name.";
    if (!/^\+?[\d\s()-]{7,20}$/.test(form.phone)) next.phone = "Enter a valid phone number.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email or leave this blank.";
    if (!form.availability) next.availability = "Please tell us when you are available.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitting(true);
    try {
      await submitApplication({
        opportunity_id: applied.id,
        full_name: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        availability: form.availability,
        note: form.note,
      });
      setSubmitted(true);
    } catch (err) {
      setErrors({ form: err.message || "Could not submit application." });
    } finally {
      setSubmitting(false);
    }
  };

  const renderRole = (role, i) => {
    const contentIndex = fallbackOpportunities.findIndex((r) => r.id === role.id);
    const inContent = contentIndex !== -1 && !role._fromApi;
    return (
      <OpportunityCard
        key={role.id || i}
        roleIndex={inContent ? contentIndex : (role._index ?? i)}
        role={role}
        plain={role._fromApi || !inContent}
        onApply={handleApply}
        onRemove={handleRemoveRole}
        canManage={canManage}
      />
    );
  };

  return (
    <>
      <div className="hidden lg:block">
        <div className="space-y-16 lg:space-y-28">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-green-700">
                <span className="h-px w-8 bg-green-700" />
                <EditableText path="takeAction.volunteer.kicker" />
              </span>
              <h1 className="hero-serif text-[clamp(2rem,7vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#111111]">
                <EditableText path="takeAction.volunteer.titleLine1" />
                <br />
                <EditableText path="takeAction.volunteer.titleLine2" className="italic text-green-700" />
              </h1>
              <EditableText path="takeAction.volunteer.subtitle" as="p" multiline className="mt-6 max-w-[520px] text-[1rem] leading-[1.8] text-[#4A4A42] sm:mt-8 sm:text-[1.0625rem]" />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-green-700/12 bg-white/70 p-4 sm:p-5">
                <p className="hero-serif text-[clamp(1.2rem,4.5vw,1.8rem)] font-bold leading-none text-green-700">{opportunities.length}</p>
                <EditableText path="takeAction.volunteer.statRoles" as="p" className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/80 sm:text-[0.68rem]" />
              </div>
              <div className="rounded-2xl border border-green-700/12 bg-white/70 p-4 sm:p-5">
                <EditableText path="takeAction.volunteer.statCommitmentValue" as="p" className="hero-serif text-[clamp(1.2rem,4.5vw,1.8rem)] font-bold leading-none text-green-700" />
                <EditableText path="takeAction.volunteer.statCommitment" as="p" className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/80 sm:text-[0.68rem]" />
              </div>
            </div>
          </div>

          {canManage && <NewOpportunityPanel volFilters={volFilters} onCreate={handleCreateRole} />}

          {applied && !submitted && (
            <div className="relative overflow-hidden rounded-[24px] border border-green-700/15 bg-white/85 p-5 shadow-[0_36px_80px_-44px_rgba(20,83,45,0.5)] backdrop-blur-sm sm:rounded-[32px] sm:p-10 lg:p-12">
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-700 via-[#7FB069] to-[#F2B33D]" />
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="flex-1">
                  <span className="inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
                    <span className="h-px w-6 bg-green-700" />
                    <EditableText path="takeAction.volunteer.formKicker" />
                  </span>
                  <h2 className="hero-serif mt-4 text-[clamp(1.35rem,4.5vw,2rem)] font-bold leading-tight text-[#111111]">
                    <EditableText path="takeAction.volunteer.formTitlePrefix" /> {applied.title}
                  </h2>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.82rem] text-[#4A4A42]">
                    <span className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-green-700" />{applied.location}</span>
                    <span className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-green-700" />{applied.commitment}</span>
                  </div>
                </div>
                <button type="button" onClick={closeApplication} className="self-start text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42] transition-colors duration-200 hover:text-green-700">
                  <EditableText path="takeAction.volunteer.formCancel" />
                </button>
              </div>
              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <EditableText path="takeAction.volunteer.formFullName" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                    <input type="text" value={form.fullName} onChange={handleChange("fullName")} placeholder={getPath("takeAction.volunteer.formFullNamePlaceholder")} autoComplete="name" className={`${inputClass} ${errors.fullName ? "border-[#E2703A]/60" : ""}`} />
                    {errors.fullName && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.fullName}</p>}
                  </div>
                  <div>
                    <EditableText path="takeAction.volunteer.formPhone" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                    <input type="tel" value={form.phone} onChange={handleChange("phone")} placeholder={getPath("takeAction.volunteer.formPhonePlaceholder")} autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                    {errors.phone ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p> : <EditableText path="takeAction.volunteer.formPhoneHint" as="p" className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70" />}
                  </div>
                </div>
                <div>
                  <p className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                    <EditableText path="takeAction.volunteer.formEmail" /> <EditableText path="takeAction.volunteer.formNoteOptional" className="font-medium normal-case tracking-normal text-[#4A4A42]/60" />
                  </p>
                  <input type="email" value={form.email} onChange={handleChange("email")} placeholder={getPath("takeAction.volunteer.formEmailPlaceholder")} autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                  {errors.email ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p> : <EditableText path="takeAction.volunteer.formEmailHint" as="p" className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70" />}
                </div>
                <div>
                  <EditableText path="takeAction.volunteer.formAvailability" as="label" className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {availabilityOptions.map((opt, i) => {
                      const active = form.availability === opt.id;
                      return (
                        <button key={opt.id} type="button" onClick={() => setForm((f) => ({ ...f, availability: opt.id }))} className={`rounded-xl border px-4 py-3.5 text-left text-[0.85rem] font-semibold transition-all duration-200 sm:py-3 ${active ? "border-green-700 bg-green-700/6 text-green-700" : "border-green-700/15 bg-white text-[#4A4A42] hover:border-green-700/40"}`}>
                          <EditableText path={`takeAction.availabilityOptions.${i}.label`} />
                        </button>
                      );
                    })}
                  </div>
                  {errors.availability && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.availability}</p>}
                </div>
                <div>
                  <p className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                    <EditableText path="takeAction.volunteer.formNote" /> <EditableText path="takeAction.volunteer.formNoteOptional" className="font-medium normal-case tracking-normal text-[#4A4A42]/60" />
                  </p>
                  <textarea value={form.note} onChange={handleChange("note")} rows={4} placeholder={getPath("takeAction.volunteer.formNotePlaceholder")} className="w-full resize-none rounded-xl border border-green-700/15 bg-white px-4 py-4 text-[1rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15 sm:py-3.5 sm:text-[0.92rem]" />
                </div>
                {errors.form && <p className="text-[0.8rem] font-medium text-[#E2703A]">{errors.form}</p>}
                <div className="flex flex-col gap-4 border-t border-green-700/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <EditableText path="takeAction.volunteer.formTerms" as="p" multiline className="order-2 text-[0.75rem] leading-[1.6] text-[#4A4A42]/80 sm:order-1" />
                  <button type="submit" disabled={submitting} className="order-1 inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-green-700 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] active:scale-[0.99] disabled:opacity-60 sm:order-2 sm:px-8 sm:py-[1.05rem] sm:text-[0.78rem]">
                    {submitting ? "Submitting…" : <EditableText path="takeAction.volunteer.formSubmit" />}
                  </button>
                </div>
              </form>
            </div>
          )}

          {applied && submitted && (
            <div className="relative overflow-hidden rounded-[24px] border border-green-700/20 bg-green-700/6 p-6 sm:rounded-[32px] sm:p-12 lg:p-14">
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
                <div>
                  <EditableText path="takeAction.volunteer.successKicker" as="p" className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700" />
                  <h2 className="hero-serif mt-3 text-[clamp(1.35rem,4.5vw,1.9rem)] font-bold leading-tight text-[#111111]">
                    <EditableText path="takeAction.volunteer.successTitlePrefix" /> {form.fullName.split(" ")[0]}.
                  </h2>
                  <p className="mt-3 max-w-[560px] text-[0.95rem] leading-[1.8] text-[#4A4A42]">
                    <EditableText path="takeAction.volunteer.successBodyPrefix" />{" "}
                    <span className="font-bold text-[#111111]">{applied.title}</span>{" "}
                    <EditableText path="takeAction.volunteer.successBodyAt" /> {applied.org}.{" "}
                    <EditableText path="takeAction.volunteer.successBodyMiddle" />{" "}
                    <span className="font-semibold text-[#111111]">{form.phone}</span>{" "}
                    <EditableText path="takeAction.volunteer.successBodySuffix" />
                    {form.email ? <> <EditableText path="takeAction.volunteer.successBodyEmail" /> {form.email}</> : null}{" "}
                    <EditableText path="takeAction.volunteer.successBodyEnd" />
                  </p>
                </div>
                <button type="button" onClick={closeApplication} className="inline-flex items-center rounded-xl border border-green-700/20 px-5 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white sm:px-6">
                  <EditableText path="takeAction.volunteer.successBrowse" />
                </button>
              </div>
            </div>
          )}

          <div>
            <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="mb-3 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700">
                  <span className="h-px w-8 bg-green-700" />
                  <EditableText path="takeAction.volunteer.listKicker" />
                </span>
                <EditableText path="takeAction.volunteer.listTitle" as="h2" className="hero-serif text-[clamp(1.6rem,5.5vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#111111]" />
              </div>
              {hasRoles && <p className="max-w-[360px] text-[0.95rem] leading-[1.75] text-[#4A4A42] sm:text-[0.98rem]">{filtered.length} role{filtered.length === 1 ? "" : "s"} matching your filters.</p>}
            </div>
            <div className="scrollbar-hide -mx-6 mb-8 flex gap-2.5 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              {volFilters.map((f, i) => {
                const active = filter === f.id;
                return (
                  <button key={f.id} type="button" onClick={() => setFilter(f.id)} className={`flex-shrink-0 rounded-full border px-5 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${active ? "border-green-700 bg-green-700 text-white shadow-[0_12px_26px_-14px_rgba(20,83,45,0.9)]" : "border-green-700/20 bg-white/60 text-[#4A4A42] hover:border-green-700/50 hover:text-green-700"}`}>
                    <EditableText path={`takeAction.volFilters.${i}.label`} />
                  </button>
                );
              })}
            </div>
            {loadingRoles ? (
              <div className="rounded-3xl border border-dashed border-green-700/25 bg-white/50 p-10 text-center sm:p-12">
                <p className="hero-sans text-[0.9rem] text-[#4A4A42]">Loading roles…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-green-700/25 bg-white/50 p-10 text-center sm:p-12">
                <EditableText path={hasRoles ? "takeAction.volunteer.listEmptyTitle" : "takeAction.volunteer.listEmptyNoRolesTitle"} as="p" className="hero-serif text-[1.2rem] font-bold text-[#111111] sm:text-[1.3rem]" />
                <EditableText path={hasRoles ? "takeAction.volunteer.listEmptyBody" : "takeAction.volunteer.listEmptyNoRolesBody"} as="p" multiline className="mt-2 text-[0.9rem] text-[#4A4A42]" />
                {!hasRoles && (
                  <a href={`mailto:${getPath("takeAction.volunteer.email")}?subject=Notify%20me%20about%20new%20volunteer%20roles`} className="mt-6 inline-flex items-center rounded-xl bg-green-700 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A]">
                    <EditableText path="takeAction.volunteer.notifyCta" />
                  </a>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {filtered.map(renderRole)}
              </div>
            )}
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-green-700 px-5 py-14 sm:px-14 sm:py-16 lg:px-20 lg:py-24">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.55]" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(251,247,240,0.09) 0px, rgba(251,247,240,0.09) 1px, transparent 1px, transparent 22px)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)", maskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)" }} />
            <div className="relative">
              <div className="mb-10 max-w-[680px] sm:mb-14">
                <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
                  <span className="h-px w-8 bg-[#F2B33D]" />
                  <EditableText path="takeAction.volunteer.howKicker" />
                </span>
                <EditableText path="takeAction.volunteer.howTitle" as="h2" className="hero-serif text-[clamp(1.6rem,5.5vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#FBF7F0]" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {volSteps.map((step, i) => (
                  <div key={i} className="rounded-2xl border border-[#FBF7F0]/12 bg-[#FBF7F0]/5 p-5 transition-colors duration-300 hover:border-[#FBF7F0]/30 hover:bg-[#FBF7F0]/8 sm:p-6">
                    <EditableText path={`takeAction.volSteps.${i}.n`} as="span" className="hero-serif text-[2rem] font-bold leading-none text-[#F2B33D]/50 sm:text-[2.4rem]" />
                    <EditableText path={`takeAction.volSteps.${i}.title`} as="p" className="hero-serif mt-3 text-[1.1rem] font-bold leading-tight text-[#FBF7F0] sm:text-[1.15rem]" />
                    <EditableText path={`takeAction.volSteps.${i}.body`} as="p" multiline className="mt-3 text-[0.88rem] leading-[1.7] text-[#FBF7F0]/65" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700">
                <span className="h-px w-8 bg-green-700" />
                <EditableText path="takeAction.volunteer.expectKicker" />
              </span>
              <EditableText path="takeAction.volunteer.expectTitle" as="h2" className="hero-serif text-[clamp(1.6rem,5.5vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#111111]" />
              <EditableText path="takeAction.volunteer.expectIntro" as="p" multiline className="mt-6 max-w-[480px] text-[0.95rem] leading-[1.8] text-[#4A4A42] sm:mt-7 sm:text-[1rem]" />
              <div className="mt-8 space-y-4 sm:mt-10">
                {expectList.map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-700" />
                    <EditableText path={`takeAction.volunteer.expectList.${i}`} as="p" multiline className="text-[0.92rem] leading-[1.75] text-[#4A4A42]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="space-y-14">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-6 bg-green-700" />
              <EditableText path="takeAction.volunteer.kicker" />
            </span>
            <h1 className="hero-serif text-[2.1rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111]">
              <EditableText path="takeAction.volunteer.titleLine1" /> <EditableText path="takeAction.volunteer.titleLine2" className="italic text-green-700" />
            </h1>
            <EditableText path="takeAction.volunteer.subtitle" as="p" multiline className="mt-4 text-[0.95rem] leading-[1.8] text-[#4A4A42]" />
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-green-700/12 bg-white/70 p-4">
                <p className="hero-serif text-[1.3rem] font-bold leading-none text-green-700">{opportunities.length}</p>
                <EditableText path="takeAction.volunteer.statRoles" as="p" className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/80" />
              </div>
              <div className="rounded-2xl border border-green-700/12 bg-white/70 p-4">
                <EditableText path="takeAction.volunteer.statCommitmentValue" as="p" className="hero-serif text-[1.3rem] font-bold leading-none text-green-700" />
                <EditableText path="takeAction.volunteer.statCommitment" as="p" className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/80" />
              </div>
            </div>
          </div>

          {canManage && <NewOpportunityPanel volFilters={volFilters} onCreate={handleCreateRole} />}

          {applied && !submitted && (
            <div className="relative overflow-hidden rounded-3xl border border-green-700/15 bg-white/85 p-5 shadow-[0_28px_60px_-40px_rgba(20,83,45,0.5)]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-700 via-[#7FB069] to-[#F2B33D]" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700">
                    <span className="h-px w-5 bg-green-700" />
                    <EditableText path="takeAction.volunteer.formKicker" />
                  </span>
                  <h2 className="hero-serif mt-3 text-[1.4rem] font-bold leading-tight text-[#111111]">
                    <EditableText path="takeAction.volunteer.formTitlePrefix" /> {applied.title}
                  </h2>
                  <p className="mt-2 text-[0.8rem] text-[#4A4A42]">{applied.location} · {applied.commitment}</p>
                </div>
                <button type="button" onClick={closeApplication} className="flex-shrink-0 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                  <EditableText path="takeAction.volunteer.formCancel" />
                </button>
              </div>
              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                <div>
                  <EditableText path="takeAction.volunteer.formFullName" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                  <input type="text" value={form.fullName} onChange={handleChange("fullName")} placeholder={getPath("takeAction.volunteer.formFullNamePlaceholder")} autoComplete="name" className={`${inputClass} ${errors.fullName ? "border-[#E2703A]/60" : ""}`} />
                  {errors.fullName && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.fullName}</p>}
                </div>
                <div>
                  <EditableText path="takeAction.volunteer.formPhone" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                  <input type="tel" value={form.phone} onChange={handleChange("phone")} placeholder={getPath("takeAction.volunteer.formPhonePlaceholder")} autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                  {errors.phone ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p> : <EditableText path="takeAction.volunteer.formPhoneHint" as="p" className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70" />}
                </div>
                <div>
                  <p className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                    <EditableText path="takeAction.volunteer.formEmail" /> <EditableText path="takeAction.volunteer.formNoteOptional" className="font-medium normal-case tracking-normal text-[#4A4A42]/60" />
                  </p>
                  <input type="email" value={form.email} onChange={handleChange("email")} placeholder={getPath("takeAction.volunteer.formEmailPlaceholder")} autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                  {errors.email && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p>}
                </div>
                <div>
                  <EditableText path="takeAction.volunteer.formAvailability" as="label" className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                  <div className="space-y-2.5">
                    {availabilityOptions.map((opt, i) => {
                      const active = form.availability === opt.id;
                      return (
                        <button key={opt.id} type="button" onClick={() => setForm((f) => ({ ...f, availability: opt.id }))} className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left text-[0.88rem] font-semibold transition-all duration-200 ${active ? "border-green-700 bg-green-700/6 text-green-700 ring-1 ring-green-700" : "border-green-700/15 bg-white text-[#4A4A42]"}`}>
                          <EditableText path={`takeAction.availabilityOptions.${i}.label`} />
                          <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${active ? "bg-green-700" : "bg-green-700/20"}`} />
                        </button>
                      );
                    })}
                  </div>
                  {errors.availability && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.availability}</p>}
                </div>
                <div>
                  <p className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                    <EditableText path="takeAction.volunteer.formNote" /> <EditableText path="takeAction.volunteer.formNoteOptional" className="font-medium normal-case tracking-normal text-[#4A4A42]/60" />
                  </p>
                  <textarea value={form.note} onChange={handleChange("note")} rows={4} placeholder={getPath("takeAction.volunteer.formNotePlaceholder")} className="w-full resize-none rounded-xl border border-green-700/15 bg-white px-4 py-4 text-[1rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15" />
                </div>
                {errors.form && <p className="text-[0.8rem] font-medium text-[#E2703A]">{errors.form}</p>}
                <button type="submit" disabled={submitting} className="w-full rounded-xl bg-green-700 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] active:scale-[0.99] disabled:opacity-60">
                  {submitting ? "Submitting…" : <EditableText path="takeAction.volunteer.formSubmit" />}
                </button>
                <EditableText path="takeAction.volunteer.formTerms" as="p" multiline className="text-[0.72rem] leading-[1.6] text-[#4A4A42]/80" />
              </form>
            </div>
          )}

          {applied && submitted && (
            <div className="rounded-3xl border border-green-700/20 bg-green-700/6 p-6">
              <EditableText path="takeAction.volunteer.successKicker" as="p" className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700" />
              <h2 className="hero-serif mt-3 text-[1.5rem] font-bold leading-tight text-[#111111]">
                <EditableText path="takeAction.volunteer.successTitlePrefix" /> {form.fullName.split(" ")[0]}.
              </h2>
              <p className="mt-3 text-[0.9rem] leading-[1.8] text-[#4A4A42]">
                <EditableText path="takeAction.volunteer.successBodyPrefix" />{" "}
                <span className="font-bold text-[#111111]">{applied.title}</span>{" "}
                <EditableText path="takeAction.volunteer.successBodyAt" /> {applied.org}.{" "}
                <EditableText path="takeAction.volunteer.successBodyMiddle" />{" "}
                <span className="font-semibold text-[#111111]">{form.phone}</span>{" "}
                <EditableText path="takeAction.volunteer.successBodySuffix" />
                {form.email ? <> <EditableText path="takeAction.volunteer.successBodyEmail" /> {form.email}</> : null}{" "}
                <EditableText path="takeAction.volunteer.successBodyEnd" />
              </p>
              <button type="button" onClick={closeApplication} className="mt-6 w-full rounded-xl border border-green-700/20 px-5 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700">
                <EditableText path="takeAction.volunteer.successBrowse" />
              </button>
            </div>
          )}

          <div>
            <span className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-6 bg-green-700" />
              <EditableText path="takeAction.volunteer.listKicker" />
            </span>
            <EditableText path="takeAction.volunteer.listTitle" as="h2" className="hero-serif text-[1.8rem] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111]" />
            <div className="scrollbar-hide -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-1">
              {volFilters.map((f, i) => {
                const active = filter === f.id;
                return (
                  <button key={f.id} type="button" onClick={() => setFilter(f.id)} className={`flex-shrink-0 rounded-full border px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${active ? "border-green-700 bg-green-700 text-white" : "border-green-700/20 bg-white text-[#4A4A42]"}`}>
                    <EditableText path={`takeAction.volFilters.${i}.label`} />
                  </button>
                );
              })}
            </div>
            <div className="mt-6 space-y-5">
              {loadingRoles ? (
                <div className="rounded-3xl border border-dashed border-green-700/25 bg-white/50 p-8 text-center">
                  <p className="hero-sans text-[0.9rem] text-[#4A4A42]">Loading roles…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-green-700/25 bg-white/50 p-8 text-center">
                  <EditableText path={hasRoles ? "takeAction.volunteer.listEmptyTitle" : "takeAction.volunteer.listEmptyNoRolesTitle"} as="p" className="hero-serif text-[1.2rem] font-bold text-[#111111]" />
                  <EditableText path={hasRoles ? "takeAction.volunteer.listEmptyBody" : "takeAction.volunteer.listEmptyNoRolesBody"} as="p" multiline className="mt-2 text-[0.88rem] leading-[1.7] text-[#4A4A42]" />
                  {!hasRoles && (
                    <a href={`mailto:${getPath("takeAction.volunteer.email")}?subject=Notify%20me%20about%20new%20volunteer%20roles`} className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-green-700 px-6 py-4 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white active:scale-[0.99]">
                      <EditableText path="takeAction.volunteer.notifyCta" />
                    </a>
                  )}
                </div>
              ) : (
                filtered.map(renderRole)
              )}
            </div>
          </div>

          <div className="-mx-5 bg-green-700 px-5 py-14">
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
              <span className="h-px w-6 bg-[#F2B33D]" />
              <EditableText path="takeAction.volunteer.howKicker" />
            </span>
            <EditableText path="takeAction.volunteer.howTitle" as="h2" className="hero-serif text-[1.8rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#FBF7F0]" />
            <div className="relative mt-8 space-y-5 before:absolute before:bottom-2 before:left-[1.05rem] before:top-2 before:w-px before:bg-[#FBF7F0]/15">
              {volSteps.map((step, i) => (
                <div key={i} className="relative flex gap-4">
                  <EditableText path={`takeAction.volSteps.${i}.n`} as="span" className="z-10 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-[#F2B33D] text-[0.68rem] font-bold text-[#1C6B4B]" />
                  <div className="rounded-2xl border border-[#FBF7F0]/12 bg-[#FBF7F0]/5 p-4">
                    <EditableText path={`takeAction.volSteps.${i}.title`} as="p" className="hero-serif text-[1.05rem] font-bold leading-tight text-[#FBF7F0]" />
                    <EditableText path={`takeAction.volSteps.${i}.body`} as="p" multiline className="mt-2 text-[0.85rem] leading-[1.7] text-[#FBF7F0]/65" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-6 bg-green-700" />
              <EditableText path="takeAction.volunteer.expectKicker" />
            </span>
            <EditableText path="takeAction.volunteer.expectTitle" as="h2" className="hero-serif text-[1.8rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111]" />
            <div className="mt-6 space-y-4">
              {expectList.map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-700" />
                  <EditableText path={`takeAction.volunteer.expectList.${i}`} as="p" multiline className="text-[0.9rem] leading-[1.75] text-[#4A4A42]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Partnerships() {
  const { getPath } = useSiteContent();
  const partnerTypes = getPath("takeAction.partnerTypes") || [];
  const [form, setForm] = useState({ org: "", contact: "", email: "", phone: "", type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.org.trim()) next.org = "Please enter your organisation name.";
    if (!form.contact.trim()) next.contact = "Please enter a contact name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.phone && !/^\+?[\d\s()-]{7,20}$/.test(form.phone)) next.phone = "Enter a valid phone number or leave blank.";
    if (!form.type) next.type = "Please choose a partnership type.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitting(true);
    try {
      await createPartnershipEnquiry({
        organisation: form.org.trim(),
        contact_name: form.contact.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        partnership_type: form.type,
        message: form.message,
      });
      setSubmitted(true);
    } catch (err) {
      setErrors({ form: err.message || "Could not submit. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };
  const reset = () => {
    setForm({ org: "", contact: "", email: "", phone: "", type: "", message: "" });
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <>
        <div className="hidden lg:block">
          <div className="relative overflow-hidden rounded-[24px] border border-green-700/20 bg-green-700/6 p-6 sm:rounded-[32px] sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
              <div>
                <EditableText path="takeAction.partnerships.successKicker" as="p" className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700" />
                <h2 className="hero-serif mt-3 text-[clamp(1.35rem,4.5vw,2rem)] font-bold leading-tight text-[#111111]">
                  <EditableText path="takeAction.partnerships.successTitlePrefix" /> {form.contact.split(" ")[0]}.
                </h2>
                <p className="mt-3 max-w-[560px] text-[0.95rem] leading-[1.8] text-[#4A4A42]">
                  <EditableText path="takeAction.partnerships.successBodyPrefix" />{" "}
                  <span className="font-bold text-[#111111]">{form.org}</span>.{" "}
                  <EditableText path="takeAction.partnerships.successBodyMiddle" />{" "}
                  <span className="font-semibold text-[#111111]">{form.email}</span>{" "}
                  <EditableText path="takeAction.partnerships.successBodySuffix" />
                </p>
              </div>
              <button type="button" onClick={reset} className="inline-flex items-center rounded-xl border border-green-700/20 px-5 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white sm:px-6">
                <EditableText path="takeAction.partnerships.successAnother" />
              </button>
            </div>
          </div>
        </div>
        <div className="lg:hidden">
          <div className="rounded-3xl border border-green-700/20 bg-green-700/6 p-6">
            <EditableText path="takeAction.partnerships.successKicker" as="p" className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700" />
            <h2 className="hero-serif mt-3 text-[1.5rem] font-bold leading-tight text-[#111111]">
              <EditableText path="takeAction.partnerships.successTitlePrefix" /> {form.contact.split(" ")[0]}.
            </h2>
            <p className="mt-3 text-[0.9rem] leading-[1.8] text-[#4A4A42]">
              <EditableText path="takeAction.partnerships.successBodyPrefix" />{" "}
              <span className="font-bold text-[#111111]">{form.org}</span>.{" "}
              <EditableText path="takeAction.partnerships.successBodyMiddle" />{" "}
              <span className="font-semibold text-[#111111]">{form.email}</span>{" "}
              <EditableText path="takeAction.partnerships.successBodySuffix" />
            </p>
            <button type="button" onClick={reset} className="mt-6 w-full rounded-xl border border-green-700/20 px-5 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700">
              <EditableText path="takeAction.partnerships.successAnotherMobile" />
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hidden lg:block">
        <div className="relative overflow-hidden">
          <div className="max-w-[720px]">
            <span className="inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-6 bg-green-700" />
              <EditableText path="takeAction.partnerships.kicker" />
            </span>
            <EditableText path="takeAction.partnerships.title" as="h2" className="hero-serif mt-4 text-[clamp(1.6rem,5.5vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111]" />
            <EditableText path="takeAction.partnerships.subtitle" as="p" multiline className="mt-5 text-[0.95rem] leading-[1.8] text-[#4A4A42] sm:text-[0.98rem]" />
          </div>
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
              <div>
                <EditableText path="takeAction.partnerships.orgLabel" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                <input type="text" value={form.org} onChange={handleChange("org")} placeholder={getPath("takeAction.partnerships.orgPlaceholder")} className={`${inputClass} ${errors.org ? "border-[#E2703A]/60" : ""}`} />
                {errors.org && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.org}</p>}
              </div>
              <div>
                <EditableText path="takeAction.partnerships.contactLabel" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                <input type="text" value={form.contact} onChange={handleChange("contact")} placeholder={getPath("takeAction.partnerships.contactPlaceholder")} className={`${inputClass} ${errors.contact ? "border-[#E2703A]/60" : ""}`} />
                {errors.contact && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.contact}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
              <div>
                <EditableText path="takeAction.partnerships.emailLabel" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                <input type="email" value={form.email} onChange={handleChange("email")} placeholder={getPath("takeAction.partnerships.emailPlaceholder")} autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                {errors.email && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p>}
              </div>
              <div>
                <p className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                  <EditableText path="takeAction.partnerships.phoneLabel" /> <EditableText path="takeAction.partnerships.phoneOptional" className="font-medium normal-case tracking-normal text-[#4A4A42]/60" />
                </p>
                <input type="tel" value={form.phone} onChange={handleChange("phone")} placeholder={getPath("takeAction.partnerships.phonePlaceholder")} autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                {errors.phone && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p>}
              </div>
            </div>
            <div>
              <EditableText path="takeAction.partnerships.typeLabel" as="label" className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {partnerTypes.map((opt, i) => {
                  const active = form.type === opt.title;
                  return (
                    <button key={i} type="button" onClick={() => setForm((f) => ({ ...f, type: opt.title }))} className={`rounded-xl border px-4 py-3.5 text-left text-[0.85rem] font-semibold transition-all duration-200 sm:py-3 ${active ? "border-green-700 bg-green-700/6 text-green-700" : "border-green-700/15 bg-white text-[#4A4A42] hover:border-green-700/40"}`}>
                      <EditableText path={`takeAction.partnerTypes.${i}.title`} />
                    </button>
                  );
                })}
              </div>
              {errors.type && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.type}</p>}
            </div>
            <div>
              <p className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                <EditableText path="takeAction.partnerships.messageLabel" /> <EditableText path="takeAction.partnerships.messageOptional" className="font-medium normal-case tracking-normal text-[#4A4A42]/60" />
              </p>
              <textarea value={form.message} onChange={handleChange("message")} rows={4} placeholder={getPath("takeAction.partnerships.messagePlaceholder")} className="w-full resize-none rounded-xl border border-green-700/15 bg-white px-4 py-4 text-[1rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15 sm:py-3.5 sm:text-[0.92rem]" />
            </div>
            {errors.form && <p className="text-[0.8rem] font-medium text-[#E2703A]">{errors.form}</p>}
            <div className="flex flex-col gap-4 border-t border-green-700/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <EditableText path="takeAction.partnerships.terms" as="p" multiline className="order-2 text-[0.75rem] leading-[1.6] text-[#4A4A42]/80 sm:order-1" />
              <button type="submit" disabled={submitting} className="order-1 inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-green-700 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] active:scale-[0.99] disabled:opacity-60 sm:order-2 sm:px-8 sm:py-[1.05rem] sm:text-[0.78rem]">
                {submitting ? "Submitting…" : <EditableText path="takeAction.partnerships.submit" />}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="lg:hidden">
        <div>
          <span className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700">
            <span className="h-px w-5 bg-green-700" />
            <EditableText path="takeAction.partnerships.kicker" />
          </span>
          <EditableText path="takeAction.partnerships.title" as="h2" className="hero-serif mt-3 text-[1.8rem] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111]" />
          <EditableText path="takeAction.partnerships.subtitle" as="p" multiline className="mt-4 text-[0.92rem] leading-[1.8] text-[#4A4A42]" />
        </div>
        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
          <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.45)]">
            <EditableText path="takeAction.partnerships.mobileSteps.0" as="p" className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]" />
            <div className="mt-4 space-y-5">
              <div>
                <EditableText path="takeAction.partnerships.orgLabel" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                <input type="text" value={form.org} onChange={handleChange("org")} placeholder={getPath("takeAction.partnerships.orgPlaceholder")} className={`${inputClass} ${errors.org ? "border-[#E2703A]/60" : ""}`} />
                {errors.org && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.org}</p>}
              </div>
              <div>
                <EditableText path="takeAction.partnerships.contactLabel" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                <input type="text" value={form.contact} onChange={handleChange("contact")} placeholder={getPath("takeAction.partnerships.contactPlaceholder")} className={`${inputClass} ${errors.contact ? "border-[#E2703A]/60" : ""}`} />
                {errors.contact && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.contact}</p>}
              </div>
              <div>
                <EditableText path="takeAction.partnerships.emailLabel" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                <input type="email" value={form.email} onChange={handleChange("email")} placeholder={getPath("takeAction.partnerships.emailPlaceholder")} autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                {errors.email && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p>}
              </div>
              <div>
                <p className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                  <EditableText path="takeAction.partnerships.phoneLabel" /> <EditableText path="takeAction.partnerships.phoneOptional" className="font-medium normal-case tracking-normal text-[#4A4A42]/60" />
                </p>
                <input type="tel" value={form.phone} onChange={handleChange("phone")} placeholder={getPath("takeAction.partnerships.phonePlaceholder")} autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                {errors.phone && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p>}
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.45)]">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
              <EditableText path="takeAction.partnerships.mobileSteps.1" />
            </p>
            <div className="mt-4 space-y-2.5">
              {partnerTypes.map((opt, i) => {
                const active = form.type === opt.title;
                return (
                  <button key={i} type="button" onClick={() => setForm((f) => ({ ...f, type: opt.title }))} className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left text-[0.88rem] font-semibold transition-all duration-200 ${active ? "border-green-700 bg-green-700/6 text-green-700 ring-1 ring-green-700" : "border-green-700/15 bg-white text-[#4A4A42]"}`}>
                    <EditableText path={`takeAction.partnerTypes.${i}.title`} />
                    <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${active ? "bg-green-700" : "bg-green-700/20"}`} />
                  </button>
                );
              })}
            </div>
            {errors.type && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.type}</p>}
          </div>
          <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.45)]">
            <EditableText path="takeAction.partnerships.mobileSteps.2" as="p" className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]" />
            <textarea value={form.message} onChange={handleChange("message")} rows={4} placeholder={getPath("takeAction.partnerships.messagePlaceholder")} className="mt-4 w-full resize-none rounded-xl border border-green-700/15 bg-white px-4 py-4 text-[1rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15" />
          </div>
          {errors.form && <p className="text-[0.8rem] font-medium text-[#E2703A]">{errors.form}</p>}
          <button type="submit" disabled={submitting} className="w-full rounded-xl bg-green-700 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] active:scale-[0.99] disabled:opacity-60">
            {submitting ? "Submitting…" : <EditableText path="takeAction.partnerships.submit" />}
          </button>
          <EditableText path="takeAction.partnerships.terms" as="p" multiline className="text-[0.72rem] leading-[1.6] text-[#4A4A42]/80" />
        </form>
      </div>
    </>
  );
}

function ReportSafeguarding() {
  const { getPath } = useSiteContent();
  const reportRelationships = getPath("takeAction.reportRelationships") || [];
  const reportConcerns = getPath("takeAction.reportConcerns") || [];
  const reportUrgency = getPath("takeAction.reportUrgency") || [];
  const reportContact = getPath("takeAction.reportContact") || [];
  const helplines = getPath("takeAction.helplines") || [];
  const howSteps = getPath("takeAction.safeguarding.howSteps") || [];
  const [form, setForm] = useState({ reporterType: "", fullName: "", phone: "", email: "", relationship: "", childName: "", location: "", concerns: [], urgency: "", description: "", contactPreference: "", anonymous: false, acknowledged: false });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const toggleConcern = (id) => {
    setForm((f) => {
      const has = f.concerns.includes(id);
      return { ...f, concerns: has ? f.concerns.filter((c) => c !== id) : [...f.concerns, id] };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.reporterType) next.reporterType = "Please tell us who you are.";
    if (!form.anonymous) {
      if (!form.fullName.trim()) next.fullName = "Please enter your name, or choose to remain anonymous.";
      if (!form.phone.trim() && !form.email.trim()) next.phone = "Give us a phone number or email so we can follow up — or choose to remain anonymous.";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.phone && !/^\+?[\d\s()-]{7,20}$/.test(form.phone)) next.phone = "Enter a valid phone number.";
    if (!form.relationship) next.relationship = "Please tell us your relationship to the child.";
    if (!form.location.trim()) next.location = "Please tell us roughly where this happened.";
    if (form.concerns.length === 0) next.concerns = "Please choose at least one type of concern.";
    if (!form.urgency) next.urgency = "Please tell us how urgent this is.";
    if (!form.description.trim() || form.description.trim().length < 20) next.description = "Please describe what happened in at least a sentence or two.";
    if (!form.contactPreference) next.contactPreference = "Please choose how you'd like to be contacted.";
    if (!form.acknowledged) next.acknowledged = "Please confirm you understand how we handle this report.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitting(true);
    try {
      await submitSafeguardingReport({
        reporter_type: form.reporterType,
        anonymous: form.anonymous,
        full_name: form.anonymous ? "" : form.fullName.trim(),
        phone: form.anonymous ? "" : form.phone.trim(),
        email: form.anonymous ? "" : form.email.trim(),
        relationship: form.relationship,
        child_name: form.childName.trim(),
        location: form.location.trim(),
        concerns: form.concerns,
        urgency: form.urgency,
        description: form.description.trim(),
        contact_preference: form.contactPreference,
      });
      setSubmitted(true);
    } catch (err) {
      setErrors({ form: err.message || "Could not submit. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };
  const reset = () => {
    setForm({ reporterType: "", fullName: "", phone: "", email: "", relationship: "", childName: "", location: "", concerns: [], urgency: "", description: "", contactPreference: "", anonymous: false, acknowledged: false });
    setErrors({});
    setSubmitted(false);
  };
  const optionRowClass = (active) => `rounded-xl border px-4 py-3.5 text-left text-[0.85rem] font-semibold transition-all duration-200 sm:py-3 ${active ? "border-green-700 bg-green-700/6 text-green-700" : "border-green-700/15 bg-white text-[#4A4A42] hover:border-green-700/40"}`;

  if (submitted) {
    return (
      <>
        <div className="hidden lg:block">
          <div className="space-y-12 lg:space-y-20">
            <div className="relative overflow-hidden rounded-[24px] border border-green-700/20 bg-green-700/6 p-6 sm:rounded-[32px] sm:p-12 lg:p-16">
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
                <div>
                  <EditableText path="takeAction.safeguarding.successKicker" as="p" className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700" />
                  <EditableText path="takeAction.safeguarding.successTitle" as="h2" className="hero-serif mt-3 text-[clamp(1.35rem,4.5vw,2rem)] font-bold leading-tight text-[#111111]" />
                  <EditableText path="takeAction.safeguarding.successBody" as="p" multiline className="mt-3 max-w-[620px] text-[0.95rem] leading-[1.8] text-[#4A4A42]" />
                </div>
                <button type="button" onClick={reset} className="inline-flex items-center rounded-xl border border-green-700/20 px-5 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white sm:px-6">
                  <EditableText path="takeAction.safeguarding.successAnother" />
                </button>
              </div>
            </div>
            <div>
              <SectionHeading eyebrowPath="takeAction.safeguarding.helpKicker" titlePath="takeAction.safeguarding.helpTitle" introPath="takeAction.safeguarding.helpIntro" />
              <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-5">
                {helplines.map((h, i) => (
                  <a key={i} href={h.href} className={`group flex flex-col rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 sm:p-6 ${h.primary ? "border-green-700 bg-green-700 text-white shadow-[0_24px_60px_-40px_rgba(20,83,45,0.6)]" : "border-green-700/15 bg-white/70 hover:border-green-700/40"}`}>
                    <EditableText path={`takeAction.helplines.${i}.name`} as="span" className={`text-[0.68rem] font-bold uppercase tracking-[0.16em] ${h.primary ? "text-white/70" : "text-green-700"}`} />
                    <EditableText path={`takeAction.helplines.${i}.number`} as="span" className={`hero-serif mt-3 text-[2rem] font-bold leading-none ${h.primary ? "text-white" : "text-[#111111]"}`} />
                    <EditableText path={`takeAction.helplines.${i}.note`} as="span" multiline className={`mt-3 text-[0.85rem] leading-[1.7] ${h.primary ? "text-white/80" : "text-[#4A4A42]"}`} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:hidden">
          <div className="space-y-10">
            <div className="rounded-3xl border border-green-700/20 bg-green-700/6 p-6">
              <EditableText path="takeAction.safeguarding.successKicker" as="p" className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700" />
              <EditableText path="takeAction.safeguarding.successTitle" as="h2" className="hero-serif mt-3 text-[1.5rem] font-bold leading-tight text-[#111111]" />
              <EditableText path="takeAction.safeguarding.successBody" as="p" multiline className="mt-3 text-[0.9rem] leading-[1.8] text-[#4A4A42]" />
              <button type="button" onClick={reset} className="mt-6 w-full rounded-xl border border-green-700/20 px-5 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700">
                <EditableText path="takeAction.safeguarding.successAnother" />
              </button>
            </div>
            <div>
              <span className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
                <span className="h-px w-6 bg-green-700" />
                <EditableText path="takeAction.safeguarding.helpKicker" />
              </span>
              <EditableText path="takeAction.safeguarding.helpTitle" as="h2" className="hero-serif text-[1.6rem] font-bold leading-[1.12] text-[#111111]" />
              <div className="mt-6 space-y-3">
                {helplines.map((h, i) => (
                  <a key={i} href={h.href} className={`flex items-center justify-between gap-4 rounded-2xl border p-5 active:scale-[0.99] ${h.primary ? "border-green-700 bg-green-700 text-white" : "border-green-700/15 bg-white/70"}`}>
                    <span>
                      <EditableText path={`takeAction.helplines.${i}.name`} as="span" className={`block text-[0.65rem] font-bold uppercase tracking-[0.16em] ${h.primary ? "text-white/70" : "text-green-700"}`} />
                      <EditableText path={`takeAction.helplines.${i}.note`} as="span" multiline className={`mt-1 block text-[0.8rem] leading-[1.6] ${h.primary ? "text-white/80" : "text-[#4A4A42]"}`} />
                    </span>
                    <EditableText path={`takeAction.helplines.${i}.number`} as="span" className={`hero-serif flex-shrink-0 text-[1.6rem] font-bold leading-none ${h.primary ? "text-[#F2B33D]" : "text-green-700"}`} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hidden lg:block">
        <div className="space-y-12 lg:space-y-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-green-700">
                <span className="h-px w-8 bg-green-700" />
                <EditableText path="takeAction.safeguarding.kicker" />
              </span>
              <h1 className="hero-serif text-[clamp(1.9rem,6.5vw,3.8rem)] font-bold leading-[1.05] tracking-[-0.028em] text-[#111111]">
                <EditableText path="takeAction.safeguarding.titleLine1" />
                <br />
                <EditableText path="takeAction.safeguarding.titleLine2" className="italic text-green-700" />
              </h1>
              <EditableText path="takeAction.safeguarding.subtitle" as="p" multiline className="mt-6 max-w-[520px] text-[1rem] leading-[1.8] text-[#4A4A42] sm:mt-8 sm:text-[1.0625rem]" />
              <div className="mt-8 grid grid-cols-3 gap-3 sm:mt-10 sm:gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-2xl border border-green-700/12 bg-white/60 p-3 sm:p-4">
                    <span className="block h-1 w-7 rounded-full bg-green-700/70" />
                    <EditableText path={`takeAction.safeguarding.badges.${i}.t`} as="p" className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-green-700 sm:mt-3 sm:text-[0.72rem]" />
                    <EditableText path={`takeAction.safeguarding.badges.${i}.d`} as="p" className="mt-0.5 text-[0.75rem] leading-snug text-[#4A4A42] sm:mt-1 sm:text-[0.82rem]" />
                  </div>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[24px] border border-green-700/12 bg-green-700 p-6 text-white shadow-[0_28px_60px_-34px_rgba(20,83,45,0.6)] sm:rounded-[28px] sm:p-10">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.4]" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(251,247,240,0.09) 0px, rgba(251,247,240,0.09) 1px, transparent 1px, transparent 22px)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)", maskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)" }} />
              <div className="relative">
                <span className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
                  <span className="h-px w-6 bg-[#F2B33D]" />
                  <EditableText path="takeAction.safeguarding.dangerKicker" />
                </span>
                <EditableText path="takeAction.safeguarding.dangerTitle" as="h2" className="hero-serif text-[clamp(1.4rem,4.5vw,2rem)] font-bold leading-tight text-white" />
                <EditableText path="takeAction.safeguarding.dangerBody" as="p" multiline className="mt-4 max-w-[420px] text-[0.92rem] leading-[1.8] text-white/75" />
                <div className="mt-6 space-y-3 sm:mt-8">
                  {helplines.map((h, i) => (
                    <a key={i} href={h.href} className="group flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 p-4 transition-all duration-300 hover:border-white/40 hover:bg-white/10 sm:p-5">
                      <div>
                        <EditableText path={`takeAction.helplines.${i}.name`} as="p" className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/70 sm:text-[0.68rem]" />
                        <EditableText path={`takeAction.helplines.${i}.note`} as="p" multiline className="mt-1 text-[0.82rem] text-white/80 sm:text-[0.85rem]" />
                      </div>
                      <EditableText path={`takeAction.helplines.${i}.number`} as="span" className="hero-serif flex-shrink-0 text-[1.4rem] font-bold leading-none text-[#F2B33D] sm:text-[1.5rem]" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-green-700/12 bg-white/55 p-5 sm:p-12 lg:p-14">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
              <div className="lg:sticky lg:top-40 lg:self-start">
                <SectionHeading eyebrowPath="takeAction.safeguarding.howKicker" titlePath="takeAction.safeguarding.howTitle" introPath="takeAction.safeguarding.howIntro" />
                <ul className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
                  {howSteps.map((_, i) => (
                    <li key={i} className="flex items-start gap-4 sm:gap-5">
                      <span className="mt-0.5 grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-green-700 text-[0.68rem] font-bold text-white sm:h-9 sm:w-9 sm:text-[0.72rem]">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <EditableText path={`takeAction.safeguarding.howSteps.${i}.t`} as="p" className="hero-serif text-[1rem] font-bold text-[#111111] sm:text-[1.05rem]" />
                        <EditableText path={`takeAction.safeguarding.howSteps.${i}.b`} as="p" multiline className="mt-2 text-[0.9rem] leading-[1.8] text-[#4A4A42]" />
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 rounded-2xl border border-[#E2703A]/25 border-l-2 border-l-[#E2703A] bg-[#E2703A]/5 p-4 sm:mt-10 sm:p-5">
                  <EditableText path="takeAction.safeguarding.investigateTitle" as="p" className="text-[0.92rem] font-bold text-[#111111]" />
                  <EditableText path="takeAction.safeguarding.investigateBody" as="p" multiline className="mt-1 text-[0.88rem] leading-[1.75] text-[#4A4A42]" />
                </div>
              </div>
              <form onSubmit={handleSubmit} noValidate className="relative rounded-[24px] border border-green-700/12 bg-white/85 p-5 shadow-[0_36px_80px_-44px_rgba(20,83,45,0.45)] backdrop-blur-sm sm:rounded-[28px] sm:p-8 lg:p-10">
                <div className="rounded-2xl border border-green-700/12 border-l-2 border-l-green-700 bg-green-700/5 p-4">
                  <EditableText path="takeAction.safeguarding.confidential" as="p" multiline className="text-[0.85rem] leading-[1.7] text-[#4A4A42]" />
                </div>
                <div className="mt-7 space-y-6 sm:mt-8">
                  <div>
                    <EditableText path="takeAction.safeguarding.formWhoAreYou" as="label" className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                      {reportRelationships.map((opt, i) => (
                        <button key={i} type="button" onClick={() => setForm((f) => ({ ...f, reporterType: opt }))} className={optionRowClass(form.reporterType === opt)}>
                          <EditableText path={`takeAction.reportRelationships.${i}`} />
                        </button>
                      ))}
                    </div>
                    {errors.reporterType && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.reporterType}</p>}
                  </div>

                  <label htmlFor="anonymous" className="group flex cursor-pointer items-start gap-3.5 rounded-xl border border-green-700/12 bg-white/55 p-4 transition-colors duration-200 hover:border-green-700/25 hover:bg-white/85">
                    <span className="relative mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center">
                      <input id="anonymous" type="checkbox" checked={form.anonymous} onChange={(e) => setForm((f) => ({ ...f, anonymous: e.target.checked }))} className="peer sr-only" />
                      <span className={`h-5 w-5 rounded-md border transition-all duration-200 ${form.anonymous ? "border-green-700 bg-green-700" : "border-green-700/25 bg-white"}`} />
                    </span>
                    <span>
                      <EditableText path="takeAction.safeguarding.formAnonymous" as="span" className="block text-[0.88rem] font-semibold text-[#111111]" />
                      <EditableText path="takeAction.safeguarding.formAnonymousHint" as="span" multiline className="mt-1 block text-[0.78rem] leading-[1.6] text-[#4A4A42]/80" />
                    </span>
                  </label>

                  {!form.anonymous && (
                    <>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                        <div>
                          <EditableText path="takeAction.safeguarding.formYourName" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                          <input type="text" value={form.fullName} onChange={handleChange("fullName")} placeholder={getPath("takeAction.safeguarding.formYourNamePlaceholder")} autoComplete="name" className={`${inputClass} ${errors.fullName ? "border-[#E2703A]/60" : ""}`} />
                          {errors.fullName && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.fullName}</p>}
                        </div>
                        <div>
                          <EditableText path="takeAction.safeguarding.formPhone" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                          <input type="tel" value={form.phone} onChange={handleChange("phone")} placeholder={getPath("takeAction.safeguarding.formPhonePlaceholder")} autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                          {errors.phone && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p>}
                        </div>
                      </div>
                      <div>
                        <EditableText path="takeAction.safeguarding.formEmail" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                        <input type="email" value={form.email} onChange={handleChange("email")} placeholder={getPath("takeAction.safeguarding.formEmailPlaceholder")} autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                        {errors.email && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p>}
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <EditableText path="takeAction.safeguarding.formRelationship" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                      <input type="text" value={form.relationship} onChange={handleChange("relationship")} placeholder={getPath("takeAction.safeguarding.formRelationshipPlaceholder")} className={`${inputClass} ${errors.relationship ? "border-[#E2703A]/60" : ""}`} />
                      {errors.relationship && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.relationship}</p>}
                    </div>
                    <div>
                      <EditableText path="takeAction.safeguarding.formLocation" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                      <input type="text" value={form.location} onChange={handleChange("location")} placeholder={getPath("takeAction.safeguarding.formLocationPlaceholder")} className={`${inputClass} ${errors.location ? "border-[#E2703A]/60" : ""}`} />
                      {errors.location && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.location}</p>}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                      <EditableText path="takeAction.safeguarding.formChildName" /> <EditableText path="takeAction.safeguarding.formChildNameOptional" className="font-medium normal-case tracking-normal text-[#4A4A42]/60" />
                    </p>
                    <input type="text" value={form.childName} onChange={handleChange("childName")} placeholder={getPath("takeAction.safeguarding.formChildNamePlaceholder")} className={inputClass} />
                  </div>
                  <div>
                    <EditableText path="takeAction.safeguarding.formConcernType" as="label" className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {reportConcerns.map((c, i) => (
                        <button key={c.id} type="button" onClick={() => toggleConcern(c.id)} className={optionRowClass(form.concerns.includes(c.id))}>
                          <EditableText path={`takeAction.reportConcerns.${i}.label`} />
                        </button>
                      ))}
                    </div>
                    {errors.concerns && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.concerns}</p>}
                  </div>
                  <div>
                    <EditableText path="takeAction.safeguarding.formUrgency" as="label" className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                      {reportUrgency.map((u, i) => {
                        const active = form.urgency === u.id;
                        const isImmediate = u.id === "immediate";
                        return (
                          <button key={u.id} type="button" onClick={() => setForm((f) => ({ ...f, urgency: u.id }))} className={`rounded-xl border px-4 py-3.5 text-left transition-all duration-200 sm:py-3.5 ${active ? isImmediate ? "border-[#E2703A] bg-[#E2703A]/8" : "border-green-700 bg-green-700/6" : "border-green-700/15 bg-white hover:border-green-700/40"}`}>
                            <EditableText path={`takeAction.reportUrgency.${i}.label`} as="span" className={`block text-[0.88rem] font-bold ${active ? isImmediate ? "text-[#E2703A]" : "text-green-700" : "text-[#111111]"}`} />
                            <EditableText path={`takeAction.reportUrgency.${i}.hint`} as="span" className="mt-0.5 block text-[0.7rem] leading-snug text-[#4A4A42]/80" />
                          </button>
                        );
                      })}
                    </div>
                    {errors.urgency && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.urgency}</p>}
                  </div>
                  <div>
                    <EditableText path="takeAction.safeguarding.formDescription" as="label" className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                    <textarea value={form.description} onChange={handleChange("description")} rows={6} placeholder={getPath("takeAction.safeguarding.formDescriptionPlaceholder")} className={`w-full resize-none rounded-xl border bg-white px-4 py-4 text-[1rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:ring-2 sm:py-3.5 sm:text-[0.92rem] ${errors.description ? "border-[#E2703A]/60 focus:border-[#E2703A] focus:ring-[#E2703A]/20" : "border-green-700/15 focus:border-green-700 focus:ring-green-700/15"}`} />
                    {errors.description ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.description}</p> : <EditableText path="takeAction.safeguarding.formDescriptionHint" as="p" className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70" />}
                  </div>
                  <div>
                    <EditableText path="takeAction.safeguarding.formContactPref" as="label" className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]" />
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                      {reportContact.map((c, i) => (
                        <button key={c.id} type="button" onClick={() => setForm((f) => ({ ...f, contactPreference: c.id }))} className={optionRowClass(form.contactPreference === c.id)}>
                          <EditableText path={`takeAction.reportContact.${i}.label`} />
                        </button>
                      ))}
                    </div>
                    {errors.contactPreference && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.contactPreference}</p>}
                  </div>
                  <label htmlFor="acknowledged" className="group flex cursor-pointer items-start gap-3.5 rounded-xl border border-green-700/12 bg-white/55 p-4 transition-colors duration-200 hover:border-green-700/25 hover:bg-white/85">
                    <span className="relative mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center">
                      <input id="acknowledged" type="checkbox" checked={form.acknowledged} onChange={(e) => setForm((f) => ({ ...f, acknowledged: e.target.checked }))} className="peer sr-only" />
                      <span className={`h-5 w-5 rounded-md border transition-all duration-200 ${form.acknowledged ? "border-green-700 bg-green-700" : errors.acknowledged ? "border-[#E2703A]/60 bg-white" : "border-green-700/25 bg-white"}`} />
                    </span>
                    <EditableText path="takeAction.safeguarding.formAcknowledge" as="span" multiline className="text-[0.82rem] leading-[1.7] text-[#4A4A42]" />
                  </label>
                  {errors.acknowledged && <p className="-mt-3 text-[0.75rem] font-medium text-[#E2703A]">{errors.acknowledged}</p>}
                  {errors.form && <p className="text-[0.8rem] font-medium text-[#E2703A]">{errors.form}</p>}
                </div>
                <button type="submit" disabled={submitting} className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#E2703A] px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_20px_40px_-18px_rgba(226,112,58,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c95c2b] active:scale-[0.99] disabled:opacity-60 sm:mt-9 sm:px-8 sm:py-[1.15rem]">
                  {submitting ? "Submitting…" : <EditableText path="takeAction.safeguarding.formSubmit" />}
                </button>
                <p className="mt-5 border-l-2 border-green-700/40 pl-4 text-[0.78rem] leading-[1.7] text-[#4A4A42]/80">
                  <EditableText path="takeAction.safeguarding.formFootnote" />{" "}
                  <a href="tel:116" className="font-bold text-green-700 underline decoration-green-700/30 underline-offset-4 hover:decoration-green-700">116</a>{" "}
                  <EditableText path="takeAction.safeguarding.formFootnoteMiddle" />{" "}
                  <a href="tel:999" className="font-bold text-green-700 underline decoration-green-700/30 underline-offset-4 hover:decoration-green-700">999</a>{" "}
                  <EditableText path="takeAction.safeguarding.formFootnoteEnd" />
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="space-y-12">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-6 bg-green-700" />
              <EditableText path="takeAction.safeguarding.kicker" />
            </span>
            <h1 className="hero-serif text-[2rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111]">
              <EditableText path="takeAction.safeguarding.titleLine1" /> <EditableText path="takeAction.safeguarding.titleLine2" className="italic text-green-700" />
            </h1>
            <EditableText path="takeAction.safeguarding.subtitle" as="p" multiline className="mt-4 text-[0.95rem] leading-[1.8] text-[#4A4A42]" />
            <div className="mt-6 grid grid-cols-3 divide-x divide-green-700/12 rounded-2xl border border-green-700/12 bg-white/60">
              {[0, 1, 2].map((i) => (
                <div key={i} className="px-3 py-4 text-center">
                  <EditableText path={`takeAction.safeguarding.badges.${i}.t`} as="p" className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-green-700" />
                  <EditableText path={`takeAction.safeguarding.badges.${i}.d`} as="p" className="mt-1 text-[0.72rem] text-[#4A4A42]" />
                </div>
              ))}
            </div>
          </div>
          <div className="-mx-5 bg-green-700 px-5 py-10">
            <span className="mb-3 inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
              <span className="h-px w-5 bg-[#F2B33D]" />
              <EditableText path="takeAction.safeguarding.dangerKicker" />
            </span>
            <EditableText path="takeAction.safeguarding.mobileCallTo" as="h2" className="hero-serif text-[1.5rem] font-bold leading-tight text-white" />
            <div className="mt-6 space-y-3">
              {helplines.map((h, i) => (
                <a key={i} href={h.href} className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 p-4 active:scale-[0.99] active:bg-white/10">
                  <span>
                    <EditableText path={`takeAction.helplines.${i}.name`} as="span" className="block text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/70" />
                    <EditableText path={`takeAction.helplines.${i}.note`} as="span" multiline className="mt-1 block text-[0.78rem] leading-[1.55] text-white/80" />
                  </span>
                  <EditableText path={`takeAction.helplines.${i}.number`} as="span" className="hero-serif flex-shrink-0 text-[1.5rem] font-bold leading-none text-[#F2B33D]" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-6 bg-green-700" />
              <EditableText path="takeAction.safeguarding.howKicker" />
            </span>
            <EditableText path="takeAction.safeguarding.howTitle" as="h2" className="hero-serif text-[1.7rem] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111]" />
            <div className="relative mt-7 space-y-6 before:absolute before:bottom-2 before:left-[1.05rem] before:top-2 before:w-px before:bg-green-700/15">
              {howSteps.map((_, i) => (
                <div key={i} className="relative flex gap-4">
                  <span className="z-10 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-green-700 text-[0.68rem] font-bold text-white">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <EditableText path={`takeAction.safeguarding.howSteps.${i}.t`} as="p" className="hero-serif text-[1rem] font-bold text-[#111111]" />
                    <EditableText path={`takeAction.safeguarding.howSteps.${i}.b`} as="p" multiline className="mt-1.5 text-[0.88rem] leading-[1.75] text-[#4A4A42]" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 rounded-2xl border border-[#E2703A]/25 border-l-2 border-l-[#E2703A] bg-[#E2703A]/5 p-4">
              <EditableText path="takeAction.safeguarding.investigateTitle" as="p" className="text-[0.9rem] font-bold text-[#111111]" />
              <EditableText path="takeAction.safeguarding.investigateBody" as="p" multiline className="mt-1 text-[0.85rem] leading-[1.75] text-[#4A4A42]" />
            </div>
          </div>
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="rounded-2xl border border-green-700/12 border-l-2 border-l-green-700 bg-green-700/5 p-4">
              <EditableText path="takeAction.safeguarding.confidential" as="p" multiline className="text-[0.85rem] leading-[1.7] text-[#4A4A42]" />
            </div>
            <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                <EditableText path="takeAction.safeguarding.formWhoAreYou" />
              </p>
              <div className="mt-4 space-y-2.5">
                {reportRelationships.map((opt, i) => {
                  const active = form.reporterType === opt;
                  return (
                    <button key={i} type="button" onClick={() => setForm((f) => ({ ...f, reporterType: opt }))} className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left text-[0.88rem] font-semibold transition-all duration-200 ${active ? "border-green-700 bg-green-700/6 text-green-700 ring-1 ring-green-700" : "border-green-700/15 bg-white text-[#4A4A42]"}`}>
                      <EditableText path={`takeAction.reportRelationships.${i}`} />
                      <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${active ? "bg-green-700" : "bg-green-700/20"}`} />
                    </button>
                  );
                })}
              </div>
              {errors.reporterType && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.reporterType}</p>}
              <label htmlFor="anonymous-m" className="mt-5 flex cursor-pointer items-start gap-3.5 rounded-xl border border-green-700/12 bg-white/55 p-4">
                <span className="relative mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center">
                  <input id="anonymous-m" type="checkbox" checked={form.anonymous} onChange={(e) => setForm((f) => ({ ...f, anonymous: e.target.checked }))} className="peer sr-only" />
                  <span className={`h-5 w-5 rounded-md border transition-all duration-200 ${form.anonymous ? "border-green-700 bg-green-700" : "border-green-700/25 bg-white"}`} />
                </span>
                <span>
                  <EditableText path="takeAction.safeguarding.formAnonymous" as="span" className="block text-[0.88rem] font-semibold text-[#111111]" />
                  <EditableText path="takeAction.safeguarding.formAnonymousHint" as="span" multiline className="mt-1 block text-[0.76rem] leading-[1.6] text-[#4A4A42]/80" />
                </span>
              </label>
            </div>
            {!form.anonymous && (
              <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5">
                <EditableText path="takeAction.safeguarding.formYourName" as="p" className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]" />
                <div className="mt-4 space-y-5">
                  <div>
                    <input type="text" value={form.fullName} onChange={handleChange("fullName")} placeholder={getPath("takeAction.safeguarding.formYourNamePlaceholder")} autoComplete="name" className={`${inputClass} ${errors.fullName ? "border-[#E2703A]/60" : ""}`} />
                    {errors.fullName && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.fullName}</p>}
                  </div>
                  <div>
                    <input type="tel" value={form.phone} onChange={handleChange("phone")} placeholder={getPath("takeAction.safeguarding.formPhonePlaceholder")} autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                    {errors.phone && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p>}
                  </div>
                  <div>
                    <input type="email" value={form.email} onChange={handleChange("email")} placeholder={getPath("takeAction.safeguarding.formEmailPlaceholder")} autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                    {errors.email && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p>}
                  </div>
                </div>
              </div>
            )}
            <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5">
              <EditableText path="takeAction.safeguarding.formRelationship" as="p" className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]" />
              <div className="mt-4 space-y-5">
                <input type="text" value={form.relationship} onChange={handleChange("relationship")} placeholder={getPath("takeAction.safeguarding.formRelationshipPlaceholder")} className={`${inputClass} ${errors.relationship ? "border-[#E2703A]/60" : ""}`} />
                {errors.relationship && <p className="text-[0.75rem] font-medium text-[#E2703A]">{errors.relationship}</p>}
                <input type="text" value={form.location} onChange={handleChange("location")} placeholder={getPath("takeAction.safeguarding.formLocationPlaceholder")} className={`${inputClass} ${errors.location ? "border-[#E2703A]/60" : ""}`} />
                {errors.location && <p className="text-[0.75rem] font-medium text-[#E2703A]">{errors.location}</p>}
                <input type="text" value={form.childName} onChange={handleChange("childName")} placeholder={getPath("takeAction.safeguarding.formChildNamePlaceholder")} className={inputClass} />
              </div>
            </div>
            <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5">
              <EditableText path="takeAction.safeguarding.formConcernType" as="p" className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]" />
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {reportConcerns.map((c, i) => {
                  const active = form.concerns.includes(c.id);
                  return (
                    <button key={c.id} type="button" onClick={() => toggleConcern(c.id)} className={`rounded-xl border px-3.5 py-3.5 text-left text-[0.82rem] font-semibold transition-all duration-200 ${active ? "border-green-700 bg-green-700/6 text-green-700 ring-1 ring-green-700" : "border-green-700/15 bg-white text-[#4A4A42]"}`}>
                      <EditableText path={`takeAction.reportConcerns.${i}.label`} />
                    </button>
                  );
                })}
              </div>
              {errors.concerns && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.concerns}</p>}
              <p className="mt-6 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                <EditableText path="takeAction.safeguarding.formUrgency" />
              </p>
              <div className="mt-3 space-y-2.5">
                {reportUrgency.map((u, i) => {
                  const active = form.urgency === u.id;
                  const isImmediate = u.id === "immediate";
                  return (
                    <button key={u.id} type="button" onClick={() => setForm((f) => ({ ...f, urgency: u.id }))} className={`w-full rounded-xl border px-4 py-4 text-left transition-all duration-200 ${active ? isImmediate ? "border-[#E2703A] bg-[#E2703A]/8 ring-1 ring-[#E2703A]" : "border-green-700 bg-green-700/6 ring-1 ring-green-700" : "border-green-700/15 bg-white"}`}>
                      <EditableText path={`takeAction.reportUrgency.${i}.label`} as="span" className={`block text-[0.9rem] font-bold ${active ? isImmediate ? "text-[#E2703A]" : "text-green-700" : "text-[#111111]"}`} />
                      <EditableText path={`takeAction.reportUrgency.${i}.hint`} as="span" className="mt-0.5 block text-[0.72rem] leading-snug text-[#4A4A42]/80" />
                    </button>
                  );
                })}
              </div>
              {errors.urgency && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.urgency}</p>}
            </div>
            <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5">
              <EditableText path="takeAction.safeguarding.formDescription" as="p" className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]" />
              <textarea value={form.description} onChange={handleChange("description")} rows={6} placeholder={getPath("takeAction.safeguarding.formDescriptionPlaceholder")} className={`mt-4 w-full resize-none rounded-xl border bg-white px-4 py-4 text-[1rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:ring-2 ${errors.description ? "border-[#E2703A]/60 focus:border-[#E2703A] focus:ring-[#E2703A]/20" : "border-green-700/15 focus:border-green-700 focus:ring-green-700/15"}`} />
              {errors.description ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.description}</p> : <EditableText path="takeAction.safeguarding.formDescriptionHint" as="p" className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70" />}
              <p className="mt-6 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                <EditableText path="takeAction.safeguarding.formContactPref" />
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {reportContact.map((c, i) => {
                  const active = form.contactPreference === c.id;
                  return (
                    <button key={c.id} type="button" onClick={() => setForm((f) => ({ ...f, contactPreference: c.id }))} className={`rounded-xl border px-3.5 py-3.5 text-left text-[0.82rem] font-semibold transition-all duration-200 ${active ? "border-green-700 bg-green-700/6 text-green-700 ring-1 ring-green-700" : "border-green-700/15 bg-white text-[#4A4A42]"}`}>
                      <EditableText path={`takeAction.reportContact.${i}.label`} />
                    </button>
                  );
                })}
              </div>
              {errors.contactPreference && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.contactPreference}</p>}
            </div>
            <label htmlFor="acknowledged-m" className="flex cursor-pointer items-start gap-3.5 rounded-xl border border-green-700/12 bg-white/55 p-4">
              <span className="relative mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center">
                <input id="acknowledged-m" type="checkbox" checked={form.acknowledged} onChange={(e) => setForm((f) => ({ ...f, acknowledged: e.target.checked }))} className="peer sr-only" />
                <span className={`h-5 w-5 rounded-md border transition-all duration-200 ${form.acknowledged ? "border-green-700 bg-green-700" : errors.acknowledged ? "border-[#E2703A]/60 bg-white" : "border-green-700/25 bg-white"}`} />
              </span>
              <EditableText path="takeAction.safeguarding.formAcknowledge" as="span" multiline className="text-[0.8rem] leading-[1.7] text-[#4A4A42]" />
            </label>
            {errors.acknowledged && <p className="-mt-3 text-[0.75rem] font-medium text-[#E2703A]">{errors.acknowledged}</p>}
            {errors.form && <p className="text-[0.8rem] font-medium text-[#E2703A]">{errors.form}</p>}
            <div className="sticky bottom-3 z-30">
              <button type="submit" disabled={submitting} className="w-full rounded-xl bg-[#E2703A] px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_20px_40px_-18px_rgba(226,112,58,0.9)] active:scale-[0.99] disabled:opacity-60">
                {submitting ? "Submitting…" : <EditableText path="takeAction.safeguarding.formSubmit" />}
              </button>
            </div>
            <p className="border-l-2 border-green-700/40 pl-4 text-[0.78rem] leading-[1.7] text-[#4A4A42]/80">
              <EditableText path="takeAction.safeguarding.formFootnote" />{" "}
              <a href="tel:116" className="font-bold text-green-700 underline decoration-green-700/30 underline-offset-4">116</a>{" "}
              <EditableText path="takeAction.safeguarding.formFootnoteMiddle" />{" "}
              <a href="tel:999" className="font-bold text-green-700 underline decoration-green-700/30 underline-offset-4">999</a>{" "}
              <EditableText path="takeAction.safeguarding.formFootnoteEnd" />
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

function TakeActionHero() {
  return (
    <section className="relative overflow-hidden bg-[#FBF7F0] pt-10 sm:pt-16 lg:pt-24">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 items-end gap-8 sm:gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-green-700">
              <span className="h-px w-8 bg-green-700" />
              <EditableText path="takeAction.hub.kicker" />
            </span>
            <EditableText
              path="takeAction.hub.title"
              as="h1"
              multiline
              className="hero-serif whitespace-pre-line text-[clamp(2rem,8vw,4.4rem)] font-bold leading-[1.05] tracking-[-0.022em] text-[#111111]"
            />
          </div>
          <div className="lg:pb-3">
            <EditableText path="takeAction.hub.subtitle" as="p" multiline className="max-w-[520px] text-[0.98rem] leading-[1.85] text-[#3D3D37] sm:text-[1.0625rem]" />
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-green-700/15 pt-6 sm:gap-x-10">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <EditableText path={`takeAction.hub.stats.${i}.v`} as="p" className="hero-serif text-[1.15rem] font-bold leading-none text-green-700 sm:text-[1.25rem]" />
                  <EditableText path={`takeAction.hub.stats.${i}.l`} as="p" className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/75 sm:text-[0.68rem]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.55]" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(20,83,45,0.09) 0px, rgba(20,83,45,0.09) 1px, transparent 1px, transparent 22px)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 65%, transparent)", maskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 65%, transparent)" }} />
    </section>
  );
}

function TakeActionHub() {
  const { getPath } = useSiteContent();
  const sections = (getPath("takeAction.sections") || []).filter((s) => !s.hidden);
  return (
    <>
      <div className="hidden lg:block">
        <TakeActionHero />
        <section className="relative py-14 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-14">
            <SectionHeading eyebrowPath="takeAction.hub.kicker" titlePath="takeAction.hub.headingTitle" introPath="takeAction.hub.headingIntro" />
            <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sections.map((s, i) => (
                <Link key={s.slug} to={`/take-action/${s.slug}`} className={`group relative flex flex-col rounded-[24px] border border-green-700/12 bg-white/70 p-6 shadow-[0_28px_70px_-46px_rgba(20,83,45,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:border-green-700/30 hover:bg-white/85 hover:shadow-[0_36px_80px_-46px_rgba(20,83,45,0.65)] active:scale-[0.99] sm:rounded-[28px] sm:p-8 ${i === 1 ? "lg:mt-8" : i === 2 ? "lg:mt-16" : ""}`}>
                  <EditableText path={`takeAction.sections.${i}.tag`} as="p" className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700" />
                  <EditableText path={`takeAction.sections.${i}.label`} as="h3" className="hero-serif mt-3 text-[clamp(1.4rem,5vw,2rem)] font-bold leading-tight text-[#111111] sm:mt-4" />
                  <EditableText path={`takeAction.sections.${i}.desc`} as="p" multiline className="mt-4 flex-1 text-[0.92rem] leading-[1.8] text-[#4A4A42] sm:mt-5 sm:text-[0.95rem]" />
                  <div className="mt-6 inline-flex items-center justify-between gap-3 border-t border-green-700/15 pt-5 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-colors duration-300 group-hover:text-[#15543A] sm:mt-8 sm:pt-6">
                    <EditableText path={`takeAction.sections.${i}.ctaLabel`} />
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
      <div className="lg:hidden">
        <section className="relative overflow-hidden px-5 pt-8">
          <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
            <span className="h-px w-6 bg-green-700" />
            <EditableText path="takeAction.hub.kicker" />
          </span>
          <EditableText path="takeAction.hub.title" as="h1" multiline className="hero-serif whitespace-pre-line text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111]" />
          <EditableText path="takeAction.hub.subtitle" as="p" multiline className="mt-4 text-[0.95rem] leading-[1.8] text-[#3D3D37]" />
          <div className="mt-7 grid grid-cols-3 divide-x divide-green-700/12 rounded-2xl border border-green-700/12 bg-white/60">
            {[0, 1, 2].map((i) => (
              <div key={i} className="px-3 py-4 text-center">
                <EditableText path={`takeAction.hub.stats.${i}.v`} as="p" className="hero-serif text-[1.1rem] font-bold leading-none text-green-700" />
                <EditableText path={`takeAction.hub.stats.${i}.l`} as="p" className="mt-2 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]/75" />
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-3 px-5 pb-16 pt-8">
          {sections.map((s, i) => (
            <Link key={s.slug} to={`/take-action/${s.slug}`} className="block rounded-2xl border border-green-700/12 bg-white/80 p-5 shadow-[0_20px_50px_-40px_rgba(20,83,45,0.5)] transition-all duration-200 active:scale-[0.99]">
              <span className="block h-1 w-10 rounded-full" style={{ backgroundColor: s.accent }} />
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <EditableText path={`takeAction.sections.${i}.tag`} as="p" className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-green-700" />
                  <EditableText path={`takeAction.sections.${i}.label`} as="h3" className="hero-serif mt-2 text-[1.45rem] font-bold leading-tight text-[#111111]" />
                </div>
                <span className="mt-1 flex-shrink-0 rounded-full border border-green-700/20 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-green-700">Open</span>
              </div>
              <EditableText path={`takeAction.sections.${i}.desc`} as="p" multiline className="mt-3 text-[0.88rem] leading-[1.75] text-[#4A4A42]" />
            </Link>
          ))}
        </section>
      </div>
    </>
  );
}

function Breadcrumb({ label }) {
  return (
    <nav aria-label="Breadcrumb" className="relative hidden border-b border-green-700/12 bg-[#FBF7F0] lg:block">
      <div className="mx-auto max-w-[1560px] px-6 py-5 sm:px-10 lg:px-14 lg:py-6">
        <ol className="flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.16em]">
          <li><Link to="/take-action" className="text-green-700 transition-colors duration-200 hover:text-green-950 hover:underline">Take Action</Link></li>
          <li aria-hidden="true" className="text-green-700/35">/</li>
          <li className="text-[#4A4A42]" aria-current="page">{label}</li>
        </ol>
      </div>
    </nav>
  );
}

function NotFound() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center py-20">
      <div className="mx-auto max-w-[600px] px-5 text-center sm:px-6">
        <EditableText path="takeAction.notFound.kicker" as="p" className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700" />
        <EditableText path="takeAction.notFound.title" as="h1" multiline className="hero-serif mt-5 text-[clamp(1.6rem,6vw,2.8rem)] font-bold leading-tight text-[#111111]" />
        <Link to="/take-action" className="mt-10 inline-flex items-center rounded-xl bg-green-700 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-950">
          <EditableText path="takeAction.notFound.cta" />
        </Link>
      </div>
    </section>
  );
}

export default function TakeAction() {
  const { section } = useParams();
  const { getPath } = useSiteContent();

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [section]);

  const sections = getPath("takeAction.sections") || [];
  const active = section ? sections.find((s) => s.slug === section) : null;

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
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.5]" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(20,83,45,0.06) 0px, rgba(20,83,45,0.06) 1px, transparent 1px, transparent 22px)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)", maskImage: "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)" }} />
      {!section && <TakeActionHub />}
      {section && !active && <NotFound />}
      {section && active && (
        <>
          <MobileBreadcrumb label={active.label} />
          <Breadcrumb label={active.label} />
          <main className="relative py-10 pb-16 sm:py-16 lg:py-24">
            <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-14">
              {active.id === "donate" && <Donate />}
              {active.id === "sponsor-a-child" && <SponsorAChildAdmin />}
              {active.id === "send-a-gift" && <SendAGift />}
              {active.id === "send-a-gift-cart" && <GiftCart />}
              {active.id === "volunteer" && <Volunteer />}
              {active.id === "partnerships" && <Partnerships />}
              {active.id === "report-safeguarding" && <ReportSafeguarding />}
            </div>
          </main>
        </>
      )}
    </div>
  );
}