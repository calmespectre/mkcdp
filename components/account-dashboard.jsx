import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { api } from "../src/api/client";
import AdminPublicationsPanel from "./admin-publications";

const NAV_TABS = [
  { id: "account", label: "Profile" },
  { id: "giving", label: "Giving" },
  { id: "correspondence", label: "Letters" },
  { id: "profile", label: "Settings" },
];

const ADMIN_TABS = [
  { id: "users", label: "Users" },
  { id: "donations", label: "Donations" },
  { id: "sponsorships", label: "Sponsorships" },
  { id: "publications", label: "Publications" },
];

const SPONSORED_CHILDREN = [
  { id: "c1", name: "Deysi", age: 4, location: "Guatemala", since: "2022", image: "/img1.jpg" },
  { id: "c2", name: "Blessing", age: 6, location: "Kenya", since: "2021", image: "/img2.jpg" },
  { id: "c3", name: "Janishi", age: 6, location: "Sri Lanka", since: "2023", image: "/img3.jpg" },
  { id: "c4", name: "Jose", age: 6, location: "Mexico", since: "2020", image: "/img4.jpg" },
];

const Icon = {
  User: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M4.5 20c.9-3.8 3.8-6 7.5-6s6.6 2.2 7.5 6" />
    </svg>
  ),
  Users: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c.6-3.4 3-5.5 6-5.5s5.4 2.1 6 5.5" />
      <path d="M16 4.5a3 3 0 0 1 0 6" />
      <path d="M18.5 19.5c-.2-2.6-1.4-4.4-3.4-5.3" />
    </svg>
  ),
  Heart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" />
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
  LogOut: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  ),
  Plus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Edit: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),
  Trash: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 6h18" />
      <path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6" />
      <path d="M6 6l1 14a2 2 0 0 0 2 1.8h6A2 2 0 0 0 17 20l1-14" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  ),
  X: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M18 6 6 18M6 6l12 12" />
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
  Refresh: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 12a9 9 0 0 1 15.3-6.3L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.3 6.3L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  ),
  Check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m5 12.5 5 5 9-11" />
    </svg>
  ),
  Grid: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  Gift: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3.5 10h17l-1.4 8.2a2 2 0 0 1-2 1.8H6.9a2 2 0 0 1-2-1.8L3.5 10Z" />
      <path d="M8.5 10V7a3.5 3.5 0 0 1 7 0v3" />
      <path d="M9.5 13.5v3" />
      <path d="M12 13.5v3" />
      <path d="M14.5 13.5v3" />
    </svg>
  ),
  Sparkle: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  ),
  Hand: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M12 11V4.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M15 11V6.5a1.5 1.5 0 0 1 3 0V13" />
      <path d="M9 11V9a1.5 1.5 0 0 0-3 0v6a6 6 0 0 0 6 6h2a6 6 0 0 0 6-6v-3" />
    </svg>
  ),
  Shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3l7 3v6c0 4.6-3 8.1-7 9-4-.9-7-4.4-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  Search: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20.5 20.5-4-4" />
    </svg>
  ),
  ChevronDown: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  ChevronUp: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m6 15 6-6 6 6" />
    </svg>
  ),
  Warning: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
};

const HIGHLIGHTS = [
  { id: "donate", label: "Donate", to: "/take-action/donate", Icon: Icon.Heart },
  { id: "sponsor", label: "Sponsor", to: "/take-action/sponsor-a-child", Icon: Icon.Sparkle },
  { id: "gift", label: "Send Gift", to: "/take-action/send-a-gift", Icon: Icon.Gift },
  { id: "volunteer", label: "Volunteer", to: "/take-action/volunteer", Icon: Icon.Hand },
  { id: "safeguard", label: "Safety", to: "/take-action/report-safeguarding", Icon: Icon.Shield },
];

function Card({ children, className = "" }) {
  return (
    <section className={`rounded-3xl border border-green-700/12 bg-white/70 p-6 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.35)] sm:p-8 ${className}`}>
      {children}
    </section>
  );
}

function SectionTitle({ children, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="hero-serif text-[1.35rem] font-bold leading-tight text-[#111111] sm:text-[1.5rem]">{children}</h2>
      {subtitle && <p className="mt-2 text-[0.88rem] leading-[1.75] text-[#4A4A42]">{subtitle}</p>}
    </div>
  );
}

function EmptyRow({ message }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-dashed border-green-700/20 bg-[#FBF7F0]/60 p-4">
      <p className="text-[0.85rem] text-[#4A4A42]">{message}</p>
    </div>
  );
}

function ProfileHeader({ onLogout, isSuperuser, profile }) {
  const displayName = profile?.username || (isSuperuser ? "admin_root" : "supporter");
  const fullName = profile?.full_name || profile?.username || "MKCDP Supporter";

  return (
    <section className="border-b border-green-700/12 bg-[#FBF7F0]">
      <div className="mx-auto max-w-[935px] px-5 py-8 sm:px-8 lg:py-10">
        <div className="flex flex-col gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[1.6rem] font-normal leading-tight text-[#111111] sm:text-[1.75rem]">{displayName}</h1>
              {isSuperuser && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F2B33D]/40 bg-[#F2B33D]/15 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#8a5a00]">Admin</span>
              )}
              <button
                type="button"
                onClick={onLogout}
                aria-label="Log out"
                className="ml-auto inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[0.82rem] font-semibold text-[#4A4A42] transition-colors duration-150 hover:text-[#E2703A]"
              >
                <Icon.LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>

            {isSuperuser ? (
              <div className="mt-6 space-y-0.5 text-[0.9rem] leading-[1.6]">
                <p className="font-semibold text-[#111111]">MKCDP Administration</p>
                <p className="text-[#4A4A42]">Full access to users information, site editing and platform activity.</p>
              </div>
            ) : (
              <div className="mt-6 space-y-0.5 text-[0.9rem] leading-[1.6]">
                <p className="font-semibold text-[#111111]">{fullName}</p>
                <p className="text-[#4A4A42]">{profile?.email || ""}</p>
                {profile?.country && (
                  <p className="text-[#4A4A42]">
                    <span className="mr-1">📍</span>
                    {profile.country}
                  </p>
                )}
                <a href="https://mkcdp.org" className="font-semibold text-green-700 transition-colors hover:text-[#15543A]">
                  mkcdp.org/{displayName}
                </a>
              </div>
            )}
          </div>
        </div>

        {!isSuperuser && (
          <div className="scrollbar-hide mt-8 -mx-5 flex gap-6 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
            {HIGHLIGHTS.map((h) => (
              <Link key={h.id} to={h.to} className="group flex w-[76px] flex-shrink-0 flex-col items-center gap-2">
                <span className="grid h-[68px] w-[68px] place-items-center rounded-full border border-green-700/25 bg-[#FBF7F0] text-green-700 transition-all duration-200 group-hover:border-green-700 group-hover:bg-green-700/6">
                  <h.Icon className="h-6 w-6" />
                </span>
                <span className="w-full truncate text-center text-[0.72rem] font-medium text-[#111111]">{h.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProfileTabs({ active, onChange }) {
  return (
    <nav className="border-b border-green-700/12 bg-[#FBF7F0]">
      <div className="mx-auto max-w-[935px] px-5 sm:px-8">
        <ul className="scrollbar-hide -mx-5 flex justify-start gap-1 overflow-x-auto px-5 sm:mx-0 sm:justify-center sm:px-0">
          {NAV_TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <li key={tab.id} className="flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onChange(tab.id)}
                  className={`relative whitespace-nowrap px-4 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 sm:px-6 ${isActive ? "text-[#111111]" : "text-[#8E8E8E] hover:text-[#111111]"}`}
                >
                  {tab.label}
                  <span className={`pointer-events-none absolute inset-x-3 -bottom-px h-[1.5px] bg-[#111111] transition-all duration-200 ${isActive ? "opacity-100" : "opacity-0"}`} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function AdminTabs({ active, onChange }) {
  return (
    <nav className="border-b border-green-700/12 bg-[#FBF7F0]">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <ul className="scrollbar-hide -mx-5 flex justify-start gap-1 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          {ADMIN_TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <li key={tab.id} className="flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onChange(tab.id)}
                  className={`relative whitespace-nowrap px-4 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 sm:px-6 ${isActive ? "text-[#111111]" : "text-[#8E8E8E] hover:text-[#111111]"}`}
                >
                  {tab.label}
                  <span className={`pointer-events-none absolute inset-x-3 -bottom-px h-[1.5px] bg-green-700 transition-all duration-200 ${isActive ? "opacity-100" : "opacity-0"}`} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function ChildGrid() {
  return (
    <div className="grid grid-cols-3 gap-[3px] sm:gap-1">
      {SPONSORED_CHILDREN.map((child) => (
        <Link key={child.id} to="/account" className="group relative aspect-square overflow-hidden bg-[#EFE9DF]">
          <img src={child.image} alt={child.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" loading="lazy" />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <p className="text-[0.78rem] font-semibold leading-tight text-white sm:text-[0.9rem]">{child.name}, {child.age}</p>
            <p className="mt-0.5 text-[0.62rem] uppercase tracking-[0.14em] text-white/80 sm:text-[0.68rem]">{child.location} · since {child.since}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ProfilePanel() {
  return (
    <div className="space-y-10">
      <div>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#111111]">
            <Icon.Grid className="h-4 w-4" />
            Children
          </div>
          <Link to="/take-action/sponsor-a-child" className="inline-flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-colors hover:text-[#15543A]">
            Sponsor another
            <Icon.ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ChildGrid />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-green-700 p-8 text-[#FBF7F0] sm:p-10">
          <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
            <span className="h-px w-6 bg-[#F2B33D]" />
            Sponsor a Child
          </span>
          <h3 className="hero-serif text-[1.55rem] font-bold leading-tight text-[#FBF7F0] sm:text-[1.8rem]">Make a difference in a child's life.</h3>
          <p className="mt-4 text-[0.9rem] leading-[1.8] text-[#FBF7F0]/80">
            When you sponsor a child for $39 a month, you connect directly with a child facing tough circumstances and help them grow up healthy, educated and safe.
          </p>
          <Link to="/take-action/sponsor-a-child" className="mt-6 inline-flex items-center gap-3 rounded-xl bg-[#F2B33D] px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[#1C6B4B] shadow-[0_18px_36px_-18px_rgba(242,179,61,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e0a02e]">
            Sponsor a child
            <Icon.ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-3xl border border-green-700/12 bg-white/70 p-8 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.35)] sm:p-10">
          <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
            <span className="h-px w-6 bg-green-700" />
            MKCDP Village
          </span>
          <h3 className="hero-serif text-[1.55rem] font-bold leading-tight text-[#111111] sm:text-[1.8rem]">They say it takes a village to raise a child.</h3>
          <p className="mt-4 text-[0.9rem] leading-[1.8] text-[#4A4A42]">
            When you join our community, your monthly gifts help children all over the world grow up healthy, educated, skilled and safe.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/take-action/donate" className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_-16px_rgba(28,107,75,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A]">
              Donate Now
            </Link>
            <Link to="/take-action/send-a-gift" className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-700/20 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-all duration-200 hover:bg-green-700/6">
              Give a Gift
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function GivingPanel() {
  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle subtitle="Your most recent transactions and updated payment methods will appear here.">Pending Updates &amp; Transactions</SectionTitle>
        <EmptyRow message="No pending transactions found." />
      </Card>

      <Card>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle subtitle="Manage your active recurring donations.">My Donations</SectionTitle>
          <Link to="/take-action/donate" className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_-16px_rgba(28,107,75,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A]">
            Donate Now
          </Link>
        </div>
        <EmptyRow message="No donations found." />
      </Card>

      <Card>
        <SectionTitle subtitle="This is a record of past donations on your account.">My Transactions</SectionTitle>
        <EmptyRow message="No transactions found." />
      </Card>

      <Card>
        <SectionTitle subtitle="Please call +254 737 332 219 to update your payment method.">Payment Methods</SectionTitle>
        <button type="button" className="mb-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_-16px_rgba(28,107,75,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A]">
          <Icon.Plus className="h-4 w-4" />
          Add New Payment
        </button>
        <EmptyRow message="No payment methods found." />
      </Card>

      <Card>
        <SectionTitle subtitle="Printable Statements">Statements, Taxes &amp; Assistance</SectionTitle>
        <div className="rounded-2xl border border-dashed border-green-700/20 bg-[#FBF7F0]/60 p-5">
          <p className="text-[0.88rem] text-[#4A4A42]">No printable statements are available for this account.</p>
        </div>
        <div className="mt-6 rounded-2xl border border-green-700/12 bg-white/60 p-5">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-green-700">Tax Information</p>
          <p className="mt-3 text-[0.85rem] leading-[1.8] text-[#4A4A42]">
            If you sponsor a child, tax information for the previous year is provided in your January Printable Statement above.
          </p>
          <p className="mt-4 text-[0.85rem] leading-[1.8] text-[#4A4A42]">
            <span className="font-semibold text-[#111111]">Mailing Address:</span>
            <br />
            MKCDP
            <br />
            P.O Box 249-00209 Loitokitok, Kenya
          </p>
        </div>
      </Card>
    </div>
  );
}

function CorrespondencePanel() {
  const [tab, setTab] = useState("inbox");
  const folders = [
    { id: "new", label: "New Message" },
    { id: "inbox", label: "Inbox" },
    { id: "sent", label: "Sent" },
    { id: "drafts", label: "Drafts" },
    { id: "all", label: "All Mail" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle>My Correspondence</SectionTitle>
        <p className="text-[0.9rem] leading-[1.8] text-[#4A4A42]">
          To protect both children and sponsors, MKCDP doesn't allow direct, unmonitored communication between supporters and sponsored children or families without our knowledge.
        </p>
      </Card>

      <Card>
        <SectionTitle subtitle="We're continuing to make improvements to letter writing.">Supporting Your Correspondence Experience</SectionTitle>
        <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_-16px_rgba(28,107,75,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A]">
          <Icon.Edit className="h-4 w-4" />
          Start your letter
        </button>
      </Card>

      <Card>
        <SectionTitle>My Letters</SectionTitle>
        <div className="scrollbar-hide -mx-5 mb-4 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {folders.map((f) => {
            const active = tab === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setTab(f.id)}
                className={`flex-shrink-0 rounded-full border px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${active ? "border-green-700 bg-green-700 text-white" : "border-green-700/20 bg-white text-[#4A4A42] hover:border-green-700/50 hover:text-green-700"}`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <EmptyRow message="No letters available." />
      </Card>
    </div>
  );
}

function SettingsPanel({ authedFetch, onAccountDeleted, user }) {
  const [profile, setProfile] = useState({
    full_name: user?.full_name || "",
    phone: user?.phone || "",
    country: user?.country || "",
  });
  const [prefs, setPrefs] = useState({
    birthday: true,
    news: Boolean(user?.newsletter),
    statements: true,
  });
  const [handlingFee, setHandlingFee] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (!user) return;
    setProfile({
      full_name: user.full_name || "",
      phone: user.phone || "",
      country: user.country || "",
    });
    setPrefs((p) => ({ ...p, news: Boolean(user.newsletter) }));
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const res = await authedFetch("/me/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: profile.full_name,
          phone: profile.phone,
          country: profile.country,
          newsletter: prefs.news,
        }),
      });
      if (res.ok) {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2500);
      } else {
        const data = await res.json().catch(() => ({}));
        setSaveError(data?.detail || "Could not save.");
      }
    } catch {
      setSaveError("Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await authedFetch("/me/", { method: "DELETE" });
      if (res.ok) {
        await onAccountDeleted();
      } else {
        const data = await res.json().catch(() => ({}));
        setDeleteError(data?.detail || "Could not delete your account.");
        setDeleting(false);
      }
    } catch {
      setDeleteError("Could not delete your account.");
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle>My Profile</SectionTitle>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#4A4A42]">Name</p>
            <p className="mt-2 text-[0.95rem] font-semibold text-[#111111]">{user?.full_name || user?.username || "—"}</p>
          </div>
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#4A4A42]">Email</p>
            <p className="mt-2 text-[0.95rem] font-semibold text-[#111111]">{user?.email || "—"}</p>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle>Contact Info</SectionTitle>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Full name</label>
            <input
              type="text"
              value={profile.full_name}
              onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-green-700/15 bg-white px-4 py-3.5 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
            />
          </div>
          <div>
            <label className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Phone</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-green-700/15 bg-white px-4 py-3.5 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
            />
          </div>
          <div>
            <label className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Country (ISO-2)</label>
            <input
              type="text"
              maxLength={2}
              value={profile.country}
              onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value.toUpperCase() }))}
              className="mt-2 w-full rounded-xl border border-green-700/15 bg-white px-4 py-3.5 text-[0.92rem] uppercase text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
            />
          </div>
        </div>

        {saveError && (
          <div className="mt-4 rounded-2xl border border-[#E2703A]/35 bg-[#E2703A]/8 px-4 py-3">
            <p className="text-[0.85rem] font-medium text-[#E2703A]">{saveError}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_-16px_rgba(28,107,75,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            "Saving…"
          ) : saved ? (
            <>
              <Icon.Check className="h-4 w-4" />
              Saved
            </>
          ) : (
            "Update"
          )}
        </button>
      </Card>

      <Card>
        <SectionTitle subtitle="Tell us how you'd like us to communicate with you by email.">Email Preferences</SectionTitle>
        <ul className="space-y-2">
          {[
            { id: "birthday", label: "Birthday alerts" },
            { id: "news", label: "MKCDP news" },
            { id: "statements", label: "Statement announcements" },
          ].map((item) => {
            const checked = prefs[item.id];
            return (
              <li key={item.id}>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-green-700/12 bg-white/55 px-4 py-3 transition-colors duration-200 hover:border-green-700/25 hover:bg-white/85">
                  <span className="grid h-5 w-5 flex-shrink-0 place-items-center">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => setPrefs({ ...prefs, [item.id]: e.target.checked })}
                      className="peer sr-only"
                    />
                    <span className={`grid h-5 w-5 place-items-center rounded-md border transition-all duration-200 ${checked ? "border-green-700 bg-green-700 text-[#FBF7F0]" : "border-green-700/25 bg-white text-transparent"}`}>
                      <Icon.Check className="h-3 w-3" />
                    </span>
                  </span>
                  <span className="text-[0.88rem] font-medium text-[#111111]">{item.label}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <SectionTitle>Handling Fee Preferences</SectionTitle>
        <label className="flex cursor-pointer items-start gap-3.5 rounded-xl border border-green-700/12 bg-white/55 p-4 transition-colors duration-200 hover:border-green-700/25 hover:bg-white/85">
          <span className="relative mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center">
            <input type="checkbox" checked={handlingFee} onChange={(e) => setHandlingFee(e.target.checked)} className="peer sr-only" />
            <span className={`grid h-5 w-5 place-items-center rounded-md border transition-all duration-200 ${handlingFee ? "border-green-700 bg-green-700 text-[#FBF7F0]" : "border-green-700/25 bg-white text-transparent"}`}>
              <Icon.Check className="h-3 w-3" />
            </span>
          </span>
          <span className="text-[0.88rem] leading-[1.75] text-[#4A4A42]">
            Yes, I wish to contribute an additional donation to help defray the cost of sending my special gift directly to my sponsored child.
          </span>
        </label>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_-16px_rgba(28,107,75,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saved ? (
            <>
              <Icon.Check className="h-4 w-4" />
              Saved
            </>
          ) : (
            "Edit"
          )}
        </button>
      </Card>

      <Card className="border-[#E2703A]/35">
        <SectionTitle subtitle="Permanently remove your account and all associated data. This action cannot be undone.">Danger Zone</SectionTitle>

        {deleteError && (
          <div className="mb-4 rounded-2xl border border-[#E2703A]/35 bg-[#E2703A]/8 px-4 py-3">
            <p className="text-[0.85rem] font-medium text-[#E2703A]">{deleteError}</p>
          </div>
        )}

        {confirmDelete ? (
          <div className="rounded-2xl border border-[#E2703A]/35 bg-[#E2703A]/6 p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-[#E2703A] text-white">
                <Icon.Warning className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[0.92rem] font-semibold text-[#111111]">Are you sure you want to delete your account?</p>
                <p className="mt-1 text-[0.85rem] leading-[1.75] text-[#4A4A42]">
                  This will permanently remove your profile, donations, sponsorships and letters from the platform.
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E2703A] px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_-16px_rgba(226,112,58,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c95c2a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Yes, delete my account"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-700/20 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[#4A4A42] transition-all duration-200 hover:bg-green-700/6 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E2703A]/35 bg-white px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[#E2703A] transition-all duration-200 hover:bg-[#E2703A]/8"
          >
            <Icon.Trash className="h-4 w-4" />
            Delete my account
          </button>
        )}
      </Card>
    </div>
  );
}

function StatTile({ value, label, accent = "text-green-700" }) {
  return (
    <div className="rounded-2xl border border-green-700/12 bg-white/70 px-5 py-4">
      <p className={`hero-serif text-[1.6rem] font-bold leading-none ${accent}`}>{value}</p>
      <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/75">{label}</p>
    </div>
  );
}

const EMPTY_NEW_USER = {
  full_name: "",
  username: "",
  email: "",
  password: "",
  country: "",
  phone: "",
  newsletter: true,
  is_superuser: false,
};

function CreateUserModal({ onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY_NEW_USER);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const result = await onCreate(form);
    if (!result.ok) {
      setError(result.error || "Could not create user.");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-3xl border border-green-700/12 bg-[#FBF7F0] p-6 shadow-[0_40px_80px_-30px_rgba(20,83,45,0.5)] sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="hero-serif text-[1.35rem] font-bold text-[#111111]">Add new user</h3>
            <p className="mt-1 text-[0.85rem] text-[#4A4A42]">Create a new account directly from the admin dashboard.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-[#4A4A42] transition-colors hover:bg-green-700/8 hover:text-[#111111]">
            <Icon.X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Full name</label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => update("full_name", e.target.value)}
                className="mt-2 w-full rounded-xl border border-green-700/15 bg-white px-4 py-3 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
              />
            </div>
            <div>
              <label className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Username *</label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => update("username", e.target.value)}
                className="mt-2 w-full rounded-xl border border-green-700/15 bg-white px-4 py-3 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="mt-2 w-full rounded-xl border border-green-700/15 bg-white px-4 py-3 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
            />
          </div>

          <div>
            <label className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Password *</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="mt-2 w-full rounded-xl border border-green-700/15 bg-white px-4 py-3 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
            />
            <p className="mt-1.5 text-[0.72rem] text-[#4A4A42]/80">At least 6 characters with a letter, a number and a symbol.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Country (ISO-2)</label>
              <input
                type="text"
                maxLength={2}
                value={form.country}
                onChange={(e) => update("country", e.target.value.toUpperCase())}
                className="mt-2 w-full rounded-xl border border-green-700/15 bg-white px-4 py-3 text-[0.92rem] uppercase text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
              />
            </div>
            <div>
              <label className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="mt-2 w-full rounded-xl border border-green-700/15 bg-white px-4 py-3 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-green-700/12 bg-white/55 px-4 py-3">
              <input type="checkbox" checked={form.newsletter} onChange={(e) => update("newsletter", e.target.checked)} className="h-4 w-4 accent-[#1C6B4B]" />
              <span className="text-[0.88rem] text-[#111111]">Subscribe to newsletter</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#F2B33D]/35 bg-[#F2B33D]/8 px-4 py-3">
              <input type="checkbox" checked={form.is_superuser} onChange={(e) => update("is_superuser", e.target.checked)} className="h-4 w-4 accent-[#8a5a00]" />
              <span className="text-[0.88rem] font-semibold text-[#8a5a00]">Grant administrator access</span>
            </label>
          </div>

          {error && (
            <div className="rounded-2xl border border-[#E2703A]/35 bg-[#E2703A]/8 px-4 py-3">
              <p className="text-[0.85rem] font-medium text-[#E2703A]">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-700/20 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-[#4A4A42] transition-all duration-200 hover:bg-green-700/6 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_-16px_rgba(28,107,75,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating…" : "Create user"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminUsersPanel({ users, loading, error, onRefresh }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [details, setDetails] = useState({});
  const [detailLoading, setDetailLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.email, u.username, u.full_name, u.country, u.phone]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [users, query]);

  const toggleRow = async (userId) => {
    if (expanded === userId) {
      setExpanded(null);
      return;
    }
    setExpanded(userId);
    if (details[userId]) return;
    setDetailLoading(true);
    try {
      const detail = await api(`/auth/users/${userId}/`);
      setDetails((prev) => ({ ...prev, [userId]: detail }));
    } catch {
      setDetails((prev) => ({ ...prev, [userId]: { error: "Could not load details." } }));
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreate = async (form) => {
    try {
      const payload = { ...form, confirm: form.password, agree: true };
      await api("/auth/users/", { method: "POST", body: JSON.stringify(payload) });
      setShowCreate(false);
      setDetails({});
      if (onRefresh) onRefresh();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message || "Could not create user." };
    }
  };

  const handleDelete = async (user) => {
    const label = user.full_name || user.username || user.email;
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;
    setDeleteError("");
    setDeletingId(user.id);
    try {
      await api(`/auth/users/${user.id}/`, { method: "DELETE" });
      setDetails((prev) => {
        const next = { ...prev };
        delete next[user.id];
        return next;
      });
      if (expanded === user.id) setExpanded(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      setDeleteError(err.message || "Could not delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center gap-3 py-10">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-700/20 border-t-green-700" />
          <p className="text-[0.9rem] text-[#4A4A42]">Loading users…</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-[0.9rem] font-medium text-[#E2703A]">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile value={users.length} label="Total users" />
        <StatTile value={users.filter((u) => u.is_superuser).length} label="Admins" accent="text-[#8a5a00]" />
        <StatTile value={users.filter((u) => !u.is_superuser).length} label="Supporters" />
      </div>

      <Card>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SectionTitle subtitle="All registered accounts on the platform.">Users Directory</SectionTitle>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-[300px]">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-green-700/45">
                <Icon.Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, username…"
                className="w-full rounded-xl border border-green-700/15 bg-white py-3 pl-11 pr-4 text-[0.9rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_14px_30px_-16px_rgba(28,107,75,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A]"
            >
              <Icon.Plus className="h-4 w-4" />
              Add user
            </button>
          </div>
        </div>

        {deleteError && (
          <div className="mb-4 rounded-2xl border border-[#E2703A]/35 bg-[#E2703A]/8 px-4 py-3">
            <p className="text-[0.85rem] font-medium text-[#E2703A]">{deleteError}</p>
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyRow message="No users match your search." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-green-700/12">
            <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_90px] gap-4 border-b border-green-700/12 bg-[#FBF7F0]/70 px-5 py-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/75 md:grid">
              <span>User</span>
              <span>Username</span>
              <span>Country</span>
              <span>Role</span>
              <span />
            </div>

            <ul className="divide-y divide-green-700/10">
              {filtered.map((u) => {
                const isOpen = expanded === u.id;
                const detail = details[u.id];
                const isDeleting = deletingId === u.id;
                return (
                  <li key={u.id} className="bg-white/50">
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleRow(u.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleRow(u.id);
                        }
                      }}
                      className="grid w-full cursor-pointer grid-cols-1 items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-green-700/4 md:grid-cols-[2fr_1fr_1fr_1fr_90px] md:gap-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[0.92rem] font-semibold text-[#111111]">{u.full_name || u.username || u.email}</p>
                        <p className="truncate text-[0.78rem] text-[#4A4A42]/80">{u.email}</p>
                      </div>
                      <p className="truncate text-[0.85rem] text-[#4A4A42]">{u.username || "—"}</p>
                      <p className="truncate text-[0.85rem] text-[#4A4A42]">{u.country || "—"}</p>
                      <p className="text-[0.78rem] font-semibold uppercase tracking-[0.1em]">
                        {u.is_superuser ? <span className="text-[#8a5a00]">Admin</span> : <span className="text-[#4A4A42]">Supporter</span>}
                      </p>
                      <div className="flex items-center gap-1 justify-self-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(u);
                          }}
                          disabled={isDeleting}
                          aria-label={`Delete ${u.username || u.email}`}
                          className="rounded-lg p-2 text-[#4A4A42] transition-colors hover:bg-[#E2703A]/12 hover:text-[#E2703A] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Icon.Trash className="h-4 w-4" />
                        </button>
                        <span className="p-2 text-green-700">
                          {isOpen ? <Icon.ChevronUp className="h-4 w-4" /> : <Icon.ChevronDown className="h-4 w-4" />}
                        </span>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="border-t border-green-700/10 bg-[#FBF7F0]/60 px-5 py-6">
                        {detailLoading && !detail ? (
                          <div className="flex items-center gap-3">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-700/20 border-t-green-700" />
                            <p className="text-[0.85rem] text-[#4A4A42]">Loading…</p>
                          </div>
                        ) : detail?.error ? (
                          <p className="text-[0.85rem] font-medium text-[#E2703A]">{detail.error}</p>
                        ) : (
                          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <div>
                              <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-green-700">Sign-up details</p>
                              <dl className="mt-4 space-y-3 text-[0.88rem]">
                                <div className="flex justify-between gap-4">
                                  <dt className="text-[#4A4A42]/80">Full name</dt>
                                  <dd className="text-right font-semibold text-[#111111]">{detail?.full_name || u.full_name || "—"}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <dt className="text-[#4A4A42]/80">Username</dt>
                                  <dd className="text-right font-semibold text-[#111111]">{detail?.username || u.username || "—"}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <dt className="text-[#4A4A42]/80">Email</dt>
                                  <dd className="text-right font-semibold text-[#111111] break-all">{detail?.email || u.email}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <dt className="text-[#4A4A42]/80">Phone</dt>
                                  <dd className="text-right font-semibold text-[#111111]">{detail?.phone || u.phone || "—"}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <dt className="text-[#4A4A42]/80">Country</dt>
                                  <dd className="text-right font-semibold text-[#111111]">{detail?.country || u.country || "—"}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <dt className="text-[#4A4A42]/80">Joined</dt>
                                  <dd className="text-right font-semibold text-[#111111]">
                                    {detail?.date_joined ? new Date(detail.date_joined).toLocaleDateString() : "—"}
                                  </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <dt className="text-[#4A4A42]/80">Newsletter</dt>
                                  <dd className="text-right font-semibold text-[#111111]">{(detail?.newsletter ?? u.newsletter) ? "Subscribed" : "Not subscribed"}</dd>
                                </div>
                              </dl>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Card>

      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
    </div>
  );
}

function AdminDonationsPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api("/donations/");
        if (cancelled) return;
        if (Array.isArray(data)) setRows(data);
        else if (Array.isArray(data?.results)) setRows(data.results);
        else setRows([]);
      } catch {
        if (!cancelled) {
          setRows([]);
          setError("Could not load donations.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatTile value={rows.length} label="Total donations" />
        <StatTile
          value={`KSh ${rows.reduce((sum, r) => sum + Number(r.amount_kes || r.amount || 0), 0).toLocaleString()}`}
          label="Total KES"
          accent="text-[#8a5a00]"
        />
        <StatTile value={rows.filter((r) => r.frequency === "monthly").length} label="Recurring" />
        <StatTile value={rows.filter((r) => r.frequency === "once").length} label="One-time" />
      </div>

      <Card>
        <SectionTitle subtitle="Every donation made across the platform.">Donations Ledger</SectionTitle>

        {loading ? (
          <div className="flex items-center gap-3 py-10">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-700/20 border-t-green-700" />
            <p className="text-[0.9rem] text-[#4A4A42]">Loading donations…</p>
          </div>
        ) : error ? (
          <p className="text-[0.85rem] font-medium text-[#E2703A]">{error}</p>
        ) : rows.length === 0 ? (
          <EmptyRow message="No donations on record yet." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-green-700/12">
            <div className="hidden grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-4 border-b border-green-700/12 bg-[#FBF7F0]/70 px-5 py-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/75 md:grid">
              <span>Donor</span>
              <span>Reference</span>
              <span>Method</span>
              <span>Amount</span>
              <span>Status</span>
            </div>
            <ul className="divide-y divide-green-700/10">
              {rows.map((r, i) => (
                <li
                  key={r.id || i}
                  className="grid grid-cols-1 gap-2 bg-white/50 px-5 py-4 text-[0.88rem] md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] md:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#111111]">{r.full_name || `${r.first_name || ""} ${r.last_name || ""}`.trim() || "—"}</p>
                    <p className="truncate text-[0.75rem] text-[#4A4A42]/70">{r.email || ""}</p>
                  </div>
                  <p className="font-mono text-[0.78rem] text-[#4A4A42]">{r.reference || "—"}</p>
                  <p className="text-[#4A4A42]">{r.payment_method || "—"}</p>
                  <p className="hero-serif font-bold text-green-700">
                    {r.requested_currency || "KES"} {Number(r.requested_amount || r.amount_kes || 0).toLocaleString()}
                  </p>
                  <p className={`text-[0.78rem] font-semibold uppercase tracking-[0.1em] ${r.status === "completed" ? "text-green-700" : r.status === "failed" ? "text-[#E2703A]" : "text-[#8a5a00]"}`}>
                    {r.status || "—"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}

function AdminSponsorshipsPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api("/beneficiaries/sponsorships/");
        if (cancelled) return;
        if (Array.isArray(data)) setRows(data);
        else if (Array.isArray(data?.results)) setRows(data.results);
        else setRows([]);
      } catch {
        if (!cancelled) {
          setRows([]);
          setError("Could not load sponsorships.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatTile value={rows.length} label="Active sponsorships" />
        <StatTile value={new Set(rows.map((r) => r.sponsor)).size} label="Unique sponsors" accent="text-[#8a5a00]" />
        <StatTile value={new Set(rows.map((r) => r.beneficiary)).size} label="Children supported" />
      </div>

      <Card>
        <SectionTitle subtitle="Every child sponsorship across the platform.">Sponsorships Ledger</SectionTitle>

        {loading ? (
          <div className="flex items-center gap-3 py-10">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-700/20 border-t-green-700" />
            <p className="text-[0.9rem] text-[#4A4A42]">Loading sponsorships…</p>
          </div>
        ) : error ? (
          <p className="text-[0.85rem] font-medium text-[#E2703A]">{error}</p>
        ) : rows.length === 0 ? (
          <EmptyRow message="No sponsorships on record yet." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-green-700/12">
            <div className="hidden grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr] gap-4 border-b border-green-700/12 bg-[#FBF7F0]/70 px-5 py-3 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/75 md:grid">
              <span>Donor</span>
              <span>Child</span>
              <span>Monthly</span>
              <span>Active</span>
              <span>Started</span>
            </div>
            <ul className="divide-y divide-green-700/10">
              {rows.map((r, i) => (
                <li
                  key={r.id || i}
                  className="grid grid-cols-1 gap-2 bg-white/50 px-5 py-4 text-[0.88rem] md:grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr] md:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#111111]">{r.donor_name || "—"}</p>
                    <p className="truncate text-[0.75rem] text-[#4A4A42]/70">{r.donor_email || ""}</p>
                  </div>
                  <p className="truncate font-semibold text-[#111111]">{r.beneficiary_name || r.beneficiary || "—"}</p>
                  <p className="hero-serif font-bold text-green-700">
                    ${Number(r.monthly_usd || 0).toFixed(2)}
                  </p>
                  <p className={`text-[0.78rem] font-semibold uppercase tracking-[0.1em] ${r.active ? "text-green-700" : "text-[#E2703A]"}`}>
                    {r.active ? "Yes" : "No"}
                  </p>
                  <p className="text-[#4A4A42]">
                    {r.started_at ? new Date(r.started_at).toLocaleDateString() : "—"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}

function AdminDashboard({ onLogout, profile }) {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api("/auth/users/");
        if (cancelled) return;
        if (Array.isArray(data)) setUsers(data);
        else if (Array.isArray(data?.results)) setUsers(data.results);
        else setUsers([]);
      } catch {
        if (!cancelled) {
          setUsers([]);
          setError("Could not load users.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const reloadUsers = () => setReloadKey((k) => k + 1);

  return (
    <>
      <ProfileHeader onLogout={onLogout} isSuperuser profile={profile} />
      <AdminTabs active={tab} onChange={setTab} />

      <main className="relative py-10 pb-16 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          {tab === "users" && (
            <AdminUsersPanel users={users} loading={loading} error={error} onRefresh={reloadUsers} />
          )}
          {tab === "donations" && <AdminDonationsPanel />}
          {tab === "sponsorships" && <AdminSponsorshipsPanel />}
          {tab === "publications" && <AdminPublicationsPanel />}
        </div>
      </main>
    </>
  );
}

function AssistanceFooter() {
  return (
    <section className="border-t border-green-700/12 bg-[#FBF7F0]">
      <div className="mx-auto max-w-[935px] px-5 py-10 sm:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">Need Assistance?</p>
            <p className="hero-serif mt-3 text-[1.15rem] font-bold text-[#111111]">We're here to help.</p>
            <p className="mt-2 text-[0.85rem] leading-[1.75] text-[#4A4A42]">Reach out any time — a real human will get back to you.</p>
          </div>

          <a href="tel:+254737332219" className="group flex items-start gap-4 rounded-2xl border border-green-700/12 bg-white/70 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-green-700/30 hover:shadow-[0_18px_40px_-30px_rgba(20,83,45,0.5)]">
            <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-green-700 text-[#FBF7F0]">
              <Icon.Phone className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#4A4A42]/70">Call us</p>
              <p className="mt-1 text-[0.95rem] font-semibold text-[#111111]">+254 737 332 219</p>
            </div>
          </a>

          <a href="mailto:questions@mkcdp.org" className="group flex items-start gap-4 rounded-2xl border border-green-700/12 bg-white/70 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-green-700/30 hover:shadow-[0_18px_40px_-30px_rgba(20,83,45,0.5)]">
            <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-[#F2B33D] text-[#1C6B4B]">
              <Icon.Mail className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#4A4A42]/70">Email us</p>
              <p className="mt-1 text-[0.95rem] font-semibold text-[#111111]">questions@mkcdp.org</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function AccountDashboard() {
  const navigate = useNavigate();
  const { user, isSuperuser, booting, isAuthenticated, signOut, authedFetch } = useAuth();
  const [active, setActive] = useState("account");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (booting) return;
    if (!isAuthenticated) {
      setRedirecting(true);
      navigate("/auth", { replace: true, state: { from: "/account" } });
    }
  }, [booting, isAuthenticated, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const handleAccountDeleted = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  if (booting || redirecting || (!isAuthenticated && !isSuperuser)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FBF7F0]">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-green-700/20 border-t-green-700" />
          <p className="text-[0.9rem] text-[#4A4A42]">Loading your space…</p>
        </div>
      </div>
    );
  }

  const pageStyle = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800;900&display=swap');
      .hero-serif { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
      .hero-sans { font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif; }
      ::selection { background: #14532D; color: #FBF7F0; }
      .scrollbar-hide::-webkit-scrollbar { display: none; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      @media (max-width: 640px) {
        input, select, textarea { font-size: 16px !important; }
      }
    `}</style>
  );

  const backdrop = (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.5]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(20,83,45,0.06) 0px, rgba(20,83,45,0.06) 1px, transparent 1px, transparent 22px)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)",
        maskImage: "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)",
      }}
    />
  );

  if (isSuperuser) {
    return (
      <div className="hero-sans relative min-h-screen overflow-x-hidden bg-[#FBF7F0] text-[#141414] antialiased">
        {pageStyle}
        {backdrop}
        <AdminDashboard onLogout={handleLogout} profile={user} />
      </div>
    );
  }

  return (
    <div className="hero-sans relative min-h-screen overflow-x-hidden bg-[#FBF7F0] text-[#141414] antialiased">
      {pageStyle}
      {backdrop}

      <ProfileHeader onLogout={handleLogout} isSuperuser={false} profile={user} />
      <ProfileTabs active={active} onChange={setActive} />

      <main className="relative py-10 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-[935px] px-5 sm:px-8">
          {active === "account" && <ProfilePanel />}
          {active === "giving" && <GivingPanel />}
          {active === "correspondence" && <CorrespondencePanel />}
          {active === "profile" && (
            <SettingsPanel authedFetch={authedFetch} onAccountDeleted={handleAccountDeleted} user={user} />
          )}
        </div>
      </main>

      <AssistanceFooter />
    </div>
  );
}