import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGiftCart } from "./giftCart";

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

const SECTIONS = [
  { slug: "donate", id: "donate", label: "Donate", short: "Donate", desc: "Every shilling is a trust, every report a promise kept. Fund meals, books, health, and the everyday cost of staying in school.", tag: "Give once or often", image: "/img1.jpg", accent: "#E2703A" },
  { slug: "sponsor-a-child", id: "sponsor-a-child", label: "Sponsor a Child", short: "Sponsor", desc: "Put a real child in a real classroom for KES 2,500 a month. Real names. Real schools. Real letters twice a year.", tag: "Give monthly", image: "/img3.jpg", accent: "#F2B33D" },
  { slug: "send-a-gift", id: "send-a-gift", label: "Send a Gift", short: "Gift", desc: "Browse real needs from real children. Pick what you want to cover, set the quantity, and check out in your own currency.", tag: "Gift marketplace", image: "/img5.jpg", accent: "#7FB069" },
  { slug: "send-a-gift-cart", id: "send-a-gift-cart", label: "Basket", short: "Basket", desc: "Review your basket and check out.", tag: "Checkout", image: "/img5.jpg", accent: "#7FB069", hidden: true },
  { slug: "volunteer", id: "volunteer", label: "Volunteer", short: "Volunteer", desc: "Teach, mentor, design, translate, or help us run the field. Skilled and unskilled roles, on-site and remote.", tag: "Give your time", image: "/img4.jpg", accent: "#7FB069" },
  { slug: "partnerships", id: "partnerships", label: "Partnerships", short: "Partner", desc: "Companies, foundations, governments and faith groups — co-design a partnership that moves children's futures forward.", tag: "Give together", image: "/img5.jpg", accent: "#1C6B4B" },
  { slug: "report-safeguarding", id: "report-safeguarding", label: "Report a Concern", short: "Report", desc: "A safe, confidential way to report a safeguarding concern about a child. Every report is taken seriously and handled with care.", tag: "Keep children safe", image: "/img8.png", accent: "#E2703A" },
];

const VISIBLE_SECTIONS = SECTIONS.filter((s) => !s.hidden);

const PRESETS = [{ amount: 500 }, { amount: 1500 }, { amount: 5000 }, { amount: 12000 }];

const PAY_METHODS = [
  { id: "mpesa", label: "M-Pesa", hint: "Fastest in Kenya" },
  { id: "card", label: "Card", hint: "Visa · Mastercard" },
  { id: "bank", label: "Bank transfer", hint: "For larger gifts" },
];

const NEEDS = [
  { id: "uniform-mercy", childName: "Mercy", childGrade: "Grade 5", childLocation: "Loitokitok", childImage: "/img3.jpg", title: "New school uniform", body: "Two sets — one to wear, one to wash. Replaces a uniform she has outgrown.", kes: 1800, category: "Uniform" },
  { id: "meals-brian", childName: "Brian", childGrade: "Grade 3", childLocation: "Kimana", childImage: "/img1.jpg", title: "A term of hot lunches", body: "A hot meal every school day for one full term.", kes: 4500, category: "Meals" },
  { id: "textbooks-faith", childName: "Faith", childGrade: "Grade 7", childLocation: "Rombo", childImage: "/img4.jpg", title: "Full set of textbooks", body: "All seven subjects for Grade 7 — kept by her until she finishes primary.", kes: 3200, category: "Books" },
  { id: "shoes-samuel", childName: "Samuel", childGrade: "Grade 2", childLocation: "Entonet", childImage: "/img5.jpg", title: "A pair of sturdy school shoes", body: "Closed leather shoes that fit — he has been walking to school in sandals.", kes: 1500, category: "Uniform" },
  { id: "checkup-grace", childName: "Grace", childGrade: "Grade 4", childLocation: "Kimana", childImage: "/img1.jpg", title: "A full health check-up", body: "Routine check-up, deworming, and any treatment she needs this term.", kes: 2200, category: "Health" },
  { id: "bag-david", childName: "David", childGrade: "Grade 6", childLocation: "Namanga", childImage: "/img4.jpg", title: "A durable school bag", body: "Replaces the plastic bag he carries his books in.", kes: 1200, category: "Books" },
  { id: "fees-esther", childName: "Esther", childGrade: "Grade 1", childLocation: "Rombo", childImage: "/img3.jpg", title: "A year of school fees", body: "Paid directly to the school so she is never sent home.", kes: 12000, category: "School fees" },
  { id: "mentor-joseph", childName: "Joseph", childGrade: "Grade 8", childLocation: "Loitokitok", childImage: "/img5.jpg", title: "A year of mentorship", body: "A trained local mentor checks in monthly and prepares him for secondary school.", kes: 6000, category: "Mentorship" },
  { id: "books-any", childName: "Any child", childGrade: "Any grade", childLocation: "Loitokitok", childImage: "/img1.jpg", title: "A year of exercise books", body: "Twelve exercise books — enough for one child to write through the year.", kes: 600, category: "Books" },
  { id: "bedkit-boarder", childName: "A boarding student", childGrade: "Secondary", childLocation: "Loitokitok", childImage: "/img4.jpg", title: "A boarding bed kit", body: "Mattress, bedsheets, blanket, and a mosquito net for a secondary boarder.", kes: 5500, category: "Boarding" },
  { id: "shoes-any", childName: "Any child", childGrade: "Any grade", childLocation: "Loitokitok", childImage: "/img5.jpg", title: "School shoes for a child", body: "A sturdy pair of closed school shoes in the right size.", kes: 1500, category: "Uniform" },
  { id: "sanitary-term", childName: "A teenage girl", childGrade: "Secondary", childLocation: "Loitokitok", childImage: "/img3.jpg", title: "A term of sanitary supplies", body: "Everything a girl needs so she never misses school during her period.", kes: 900, category: "Health" },
];

const CHILDREN = [
  { id: "mk-0241", name: "Mercy", age: 11, birthYear: 2015, gender: "Female", grade: "Grade 5", location: "Loitokitok, Kajiado", region: "Loitokitok", dream: "Wants to become a nurse", story: "Mercy walks 4 km to school every morning. She is the eldest of four and helps her mother sell vegetables on weekends.", image: "/img3.jpg", monthly: 2500, funded: 68 },
  { id: "mk-0189", name: "Brian", age: 9, birthYear: 2017, gender: "Male", grade: "Grade 3", location: "Kimana, Kajiado", region: "Kimana", dream: "Wants to become a teacher", story: "Brian lost his father in 2022. Since joining the programme he has not missed a single day of school.", image: "/img1.jpg", monthly: 2500, funded: 42 },
  { id: "mk-0334", name: "Faith", age: 13, birthYear: 2013, gender: "Female", grade: "Grade 7", location: "Rombo, Kajiado", region: "Rombo", dream: "Wants to become an engineer", story: "Faith is the top of her class in mathematics. She walks 6 km daily to reach the nearest secondary school.", image: "/img4.jpg", monthly: 3500, funded: 91 },
  { id: "mk-0402", name: "Samuel", age: 8, birthYear: 2018, gender: "Male", grade: "Grade 2", location: "Entonet, Kajiado", region: "Entonet", dream: "Wants to become a pilot", story: "Samuel joined the programme last year. He is now the most curious reader in his class.", image: "/img5.jpg", monthly: 2500, funded: 15 },
  { id: "mk-0512", name: "Grace", age: 10, birthYear: 2016, gender: "Female", grade: "Grade 4", location: "Kimana, Kajiado", region: "Kimana", dream: "Wants to become a doctor", story: "Grace looks after her younger brother after school. She has perfect attendance and loves science.", image: "/img1.jpg", monthly: 2500, funded: 30 },
  { id: "mk-0603", name: "David", age: 12, birthYear: 2014, gender: "Male", grade: "Grade 6", location: "Namanga, Kajiado", region: "Namanga", dream: "Wants to become a footballer", story: "David is the captain of his school football team and helps his grandmother with the family shamba.", image: "/img4.jpg", monthly: 2500, funded: 55 },
  { id: "mk-0718", name: "Esther", age: 7, birthYear: 2019, gender: "Female", grade: "Grade 1", location: "Rombo, Kajiado", region: "Rombo", dream: "Wants to become a singer", story: "Esther is the youngest in her class and loves singing during morning assembly.", image: "/img3.jpg", monthly: 2500, funded: 22 },
  { id: "mk-0825", name: "Joseph", age: 14, birthYear: 2012, gender: "Male", grade: "Grade 8", location: "Loitokitok, Kajiado", region: "Loitokitok", dream: "Wants to become a lawyer", story: "Joseph is preparing for his final primary exams. He walks 5 km daily and mentors younger children in his village.", image: "/img5.jpg", monthly: 3500, funded: 78 },
];

const AGE_RANGES = [
  { id: "all", label: "All ages", test: null },
  { id: "under-8", label: "Under 8", test: (age) => age < 8 },
  { id: "8-10", label: "8 – 10", test: (age) => age >= 8 && age <= 10 },
  { id: "11-13", label: "11 – 13", test: (age) => age >= 11 && age <= 13 },
  { id: "14-plus", label: "14+", test: (age) => age >= 14 },
];

const GENDERS = [{ id: "all", label: "All" }, { id: "Female", label: "Girls" }, { id: "Male", label: "Boys" }];

const REGIONS = [
  { id: "all", label: "All regions" },
  { id: "Loitokitok", label: "Loitokitok" },
  { id: "Kimana", label: "Kimana" },
  { id: "Rombo", label: "Rombo" },
  { id: "Entonet", label: "Entonet" },
  { id: "Namanga", label: "Namanga" },
];

const COVERAGE = [
  { icon: "school", title: "School fees", body: "Termly fees paid directly to the school, so no child is sent home for lack of payment." },
  { icon: "book", title: "Books & uniform", body: "Textbooks, exercise books, uniforms, and shoes — replaced as the child grows." },
  { icon: "plate", title: "Daily meals", body: "A hot lunch at school every day, often the most reliable meal the child eats." },
  { icon: "heart", title: "Health & wellbeing", body: "Routine check-ups, treatment when sick, and counselling support when needed." },
  { icon: "user", title: "Mentorship", body: "A local mentor checks in monthly, tracks progress, and stands with the family." },
  { icon: "mail", title: "Letters & updates", body: "You receive a handwritten letter from your sponsored child twice a year." },
];

const SPONSOR_STEPS = [
  { n: "01", title: "Choose a child", body: "Browse children waiting for a sponsor. Every profile is real, verified by our field team." },
  { n: "02", title: "Set up your gift", body: "A monthly gift of KES 2,500 or more. Cancel anytime. 100% of the school-fee portion is passed directly to the school." },
  { n: "03", title: "Get matched", body: "Within 48 hours you receive your child's welcome pack — their photo, their story, and their first letter." },
  { n: "04", title: "Stay connected", body: "Two letters a year, one photo update, and an annual school report. You will know exactly where your gift went." },
];

const SPONSOR_FAQ = [
  { q: "How much does it cost to sponsor a child?", a: "Sponsorship starts at KES 2,500 per month (about $19 USD). This covers school fees, meals, learning materials, and health support. Older children in secondary school may require KES 3,500 per month." },
  { q: "Can I choose which child I sponsor?", a: "Yes. Every child on this page is a real child waiting for a sponsor. Pick the one whose story speaks to you, and we will match you within 48 hours." },
  { q: "How long does sponsorship last?", a: "Sponsorship usually runs from when a child joins the programme until they complete secondary school. There is no minimum commitment, and you may cancel at any time with no penalty." },
  { q: "Can I write to my sponsored child?", a: "Absolutely. We encourage it. Letters are translated where needed and passed to the child through their local mentor. Photos are allowed; gifts are not, to keep things fair across the programme." },
  { q: "How do I know my money reaches the child?", a: "Every sponsor receives a full annual report showing exactly how their gift was spent, plus termly school results. Our accounts are audited each year and published on the Publications page." },
];

const VOL_FILTERS = [
  { id: "all", label: "All roles" }, { id: "remote", label: "Remote" }, { id: "onsite", label: "On-site" },
  { id: "skilled", label: "Skilled" }, { id: "short", label: "Short-term" }, { id: "long", label: "Long-term" },
];

const OPPORTUNITIES = [];

const VOL_STEPS = [
  { n: "01", title: "Apply", body: "Pick a role and send us a short note about why it fits you. No CV required — we care about the fit, not the formatting." },
  { n: "02", title: "Chat with us", body: "A 20-minute call to make sure the role is right for both sides. We will tell you exactly what the work looks like." },
  { n: "03", title: "Onboard", body: "Background check (where required by law), safeguarding briefing, and a buddy who shows you the ropes." },
  { n: "04", title: "Get to work", body: "Start when you are ready. Regular check-ins, honest feedback, and a certificate at the end of your service." },
];

const PARTNER_TYPES = [
  { n: "01", icon: "briefcase", title: "Corporate CSR", body: "Match your team's giving, sponsor a school, or fund a whole programme. We co-design, you get the impact report.", examples: ["Payroll giving", "School sponsorship", "Cause campaigns"] },
  { n: "02", icon: "globe", title: "Foundations & Trusts", body: "Multi-year grants to fund our four pillars — education, health, child protection and livelihoods.", examples: ["Programme grants", "Core funding", "Capital projects"] },
  { n: "03", icon: "sparkle", title: "In-kind Giving", body: "Books, laptops, uniforms, medical supplies, training, or professional services. Every contribution moves work forward.", examples: ["Books & devices", "Medical supplies", "Pro-bono services"] },
  { n: "04", icon: "users", title: "Community & Faith", body: "Churches, mosques, schools and local groups raising funds or volunteering together for the children next door.", examples: ["Fundraisers", "Volunteer days", "Awareness drives"] },
  { n: "05", icon: "school", title: "Academic & Research", body: "Universities and research institutes partnering on programme design, monitoring, evaluation and learning.", examples: ["Impact studies", "M&E support", "Student placements"] },
  { n: "06", icon: "heart", title: "Government & Public", body: "County and national government departments aligning policy, funding and delivery with the communities we serve.", examples: ["County partnerships", "Policy alignment", "Public funding"] },
];

const PARTNER_BENEFITS = [
  { title: "Named on every report", body: "Your logo, your story, and the impact you made — published on our reports, website and media." },
  { title: "Field visits & storytelling", body: "Come see the work. Meet the children. We help you tell the story with dignity-first media." },
  { title: "Tax-deductible giving", body: "Registered as a Kenyan CSO/NGO. We provide receipts and compliance documentation for every gift." },
  { title: "Co-designed programmes", body: "Your goals, our expertise. We build partnerships that fit what you want to fund — not the other way around." },
];

const PARTNER_STEPS = [
  { n: "01", title: "Start a conversation", body: "A short call to understand your goals, values, and what you want to fund. No commitment required." },
  { n: "02", title: "Design together", body: "We draft a partnership brief — focus area, budget, timeframe, reporting cadence — and refine it with you." },
  { n: "03", title: "Sign & launch", body: "A formal MoU or grant agreement, plus a public announcement if you want one. We make it easy." },
  { n: "04", title: "Report & grow", body: "Quarterly updates, an annual report, and a yearly review to decide whether to renew, expand, or pivot." },
];

const PARTNER_LOGOS = [
  { logo: "/lake_region.jpg", name: "Lake Region" },
  { logo: "/eastern.jpg", name: "Eastern" },
  { logo: "/childfund.png", name: "ChildFund" },
  { logo: "/EDCA.png", name: "EDCA" },
];

const OTHER_WAYS = [
  { icon: "megaphone", title: "Fundraise for us", body: "Birthday, marathon, wedding, or a work bake-off — turn any moment into a fundraiser and we will send you the toolkit." },
  { icon: "briefcase", title: "Corporate partnership", body: "Match your team's giving, sponsor a school, or bring your skills to a project. We co-design every partnership." },
  { icon: "globe", title: "Legacy giving", body: "Leave a gift in your will that keeps a child in school long after you are gone. Our team will guide you through it." },
  { icon: "sparkle", title: "Give skills, not cash", body: "Pro-bono legal, design, monitoring and evaluation, translation, or engineering. We need all of it." },
];

const REPORT_RELATIONSHIPS = ["The child themselves", "Parent or guardian", "Teacher or school staff", "Community member", "MKCDP staff or volunteer", "Sponsor or donor", "Other"];

const REPORT_CONCERNS = [
  { id: "physical", label: "Physical abuse" },
  { id: "emotional", label: "Emotional abuse" },
  { id: "sexual", label: "Sexual abuse" },
  { id: "neglect", label: "Neglect" },
  { id: "child-labour", label: "Child labour" },
  { id: "online", label: "Online safety" },
  { id: "bullying", label: "Bullying" },
  { id: "other", label: "Other concern" },
];

const REPORT_URGENCY = [
  { id: "immediate", label: "Immediate danger", hint: "Child is at risk right now" },
  { id: "urgent", label: "Urgent", hint: "Within 24 hours" },
  { id: "standard", label: "Standard", hint: "Needs review" },
];

const REPORT_CONTACT = [
  { id: "phone", label: "Phone call" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Email" },
  { id: "none", label: "Do not contact" },
];

const HELPLINES = [
  { name: "Childline Kenya", number: "116", note: "Toll-free, 24/7. For children and anyone worried about a child.", href: "tel:116", primary: true },
  { name: "National GBV Helpline", number: "1195", note: "Toll-free, 24/7. For gender-based violence and abuse.", href: "tel:1195" },
  { name: "Police Emergency", number: "999", note: "For immediate danger. Ask for the child protection unit.", href: "tel:999" },
];

const inputClass =
  "w-full rounded-xl border border-green-700/15 bg-white px-4 py-4 text-[1rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15 sm:py-3.5 sm:text-[0.92rem]";

const formatDate = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

function SectionHeading({ eyebrow, title, intro, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-[720px] text-center" : "max-w-[720px]"}>
      <span className={`mb-4 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-green-700 ${align === "center" ? "justify-center" : ""}`}>
        <span className="h-px w-8 bg-green-700" />
        {eyebrow}
      </span>
      <h2 className="hero-serif text-[clamp(1.7rem,4vw,2.9rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#111111]">{title}</h2>
      {intro && <p className="mt-5 text-[1rem] leading-[1.85] text-[#4A4A42]">{intro}</p>}
    </div>
  );
}

function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border-b border-green-700/12">
      <button type="button" onClick={onToggle} aria-expanded={isOpen} className="group flex w-full items-center justify-between gap-4 py-5 text-left sm:gap-6 sm:py-6">
        <span className="hero-serif text-[1rem] font-bold leading-snug text-[#111111] transition-colors duration-200 group-hover:text-green-700 sm:text-[1.15rem]">{q}</span>
        <span className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border text-[1.15rem] font-bold leading-none transition-all duration-300 sm:h-9 sm:w-9 ${isOpen ? "border-green-700 bg-green-700 text-white" : "border-green-700/25 text-green-700 group-hover:border-green-700"}`}>
          {isOpen ? "–" : "+"}
        </span>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden"><p className="max-w-[820px] text-[0.95rem] leading-[1.85] text-[#4A4A42]">{a}</p></div>
      </div>
    </div>
  );
}

function MobileBreadcrumb({ label }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b border-green-700/12 bg-[#FBF7F0] lg:hidden"
    >
      <div className="mx-auto max-w-[1560px] px-5 py-3.5 sm:px-10">
        <ol className="flex flex-wrap items-center gap-2 text-sm font-bold uppercase tracking-wider">
          <li>
            <Link
              to="/take-action"
              className="text-green-700 transition-colors duration-200 hover:text-green-950 hover:underline"
            >
              Take Action
            </Link>
          </li>
          <li aria-hidden="true" className="text-green-700/35">
            ›
          </li>
          <li className="text-[#4A4A42]" aria-current="page">
            {label}
          </li>
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

function AmountSummary({ kesAmount, currencyCode, frequency }) {
  const cur = getCurrency(currencyCode);
  const local = fromKes(kesAmount, cur);
  const isKes = cur.code === "KES";
  return (
    <div className="rounded-2xl border border-green-700/12 bg-green-700/5 p-4">
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-green-700">{frequency === "monthly" ? "Your monthly gift" : "Your gift"}</p>
      <p className="hero-serif mt-1.5 text-[1.15rem] font-bold leading-tight text-[#111111]">{cur.symbol}{formatLocal(local, cur)} {cur.code}</p>
      {!isKes && <p className="mt-1 text-[0.78rem] text-[#4A4A42]/85">≈ KES {kesAmount.toLocaleString("en-US")} · converted at 1 {cur.code} = {cur.rate} KES</p>}
    </div>
  );
}

function Donate() {
  const [currencyCode, setCurrencyCode] = useState("KES");
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
  const currency = getCurrency(currencyCode);
  const localPresets = useMemo(() => PRESETS.map((p) => ({ ...p, local: fromKes(p.amount, currency) })), [currency]);

  const amountKes = useMemo(() => {
    const n = Number(custom);
    if (custom && Number.isFinite(n) && n > 0) return Math.round(toKes(n, currency));
    return preset;
  }, [custom, preset, currency]);

  const amountLocal = fromKes(amountKes, currency);

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!firstName.trim()) next.firstName = "Required";
    if (!lastName.trim()) next.lastName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email";
    if (!/^\+?[\d\s()-]{7,20}$/.test(phone)) next.phone = "Enter a valid phone number";
    if (!amountKes || amountKes < 100) next.amount = "Minimum gift is KES 100";
    setErrors(next);
    if (Object.keys(next).length === 0) setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <div className="hidden lg:block">
          <div className="relative flex min-h-[60vh] items-center justify-center rounded-3xl border border-green-700/12 bg-white/70 px-6 py-20">
            <div className="max-w-[560px] text-center">
              <span className="inline-flex rounded-full bg-green-700/10 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-green-700">Gift received</span>
              <h2 className="hero-serif mt-8 text-[clamp(1.6rem,5vw,2.6rem)] font-bold leading-tight text-[#111111]">Thank you, {firstName}.</h2>
              <p className="mt-5 text-[1rem] leading-[1.8] text-[#4A4A42]">
                Your {frequency === "once" ? "one-time" : "monthly"} gift of <span className="font-bold text-green-700">{currency.symbol}{formatLocal(amountLocal, currency)} {currency.code}</span> (≈ KES {amountKes.toLocaleString("en-US")}) has been received. A confirmation email is on its way to <span className="font-semibold text-[#111111]">{email}</span>.
              </p>
            </div>
          </div>
        </div>
        <div className="lg:hidden">
          <div className="rounded-3xl border border-green-700/20 bg-green-700/6 px-6 py-14 text-center">
            <span className="inline-flex rounded-full bg-green-700 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white">Gift received</span>
            <h2 className="hero-serif mt-6 text-[1.8rem] font-bold leading-tight text-[#111111]">Thank you, {firstName}.</h2>
            <p className="mt-4 text-[0.95rem] leading-[1.8] text-[#4A4A42]">
              Your {frequency === "once" ? "one-time" : "monthly"} gift of <span className="font-bold text-green-700">{currency.symbol}{formatLocal(amountLocal, currency)} {currency.code}</span> has been received. A confirmation email is on its way to <span className="font-semibold text-[#111111]">{email}</span>.
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
            <span className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-8 bg-green-700" />Gifts &amp; Donations</span>
            <h2 className="hero-serif text-[clamp(1.9rem,6vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.025em] text-[#111111]">
              Every shilling is a trust.
              <br />
              <span className="italic text-green-700">Every report is a promise kept.</span>
            </h2>
            <p className="mt-6 max-w-[480px] text-[1rem] leading-[1.8] text-[#4A4A42] sm:mt-7 sm:text-[1.02rem]">Your gift goes directly to programmes that put children in classrooms, families on their feet, and communities in charge of their own future.</p>
            <div className="mt-8 grid grid-cols-3 gap-3 sm:mt-10 sm:gap-4">
              {[{ t: "Audited", d: "Yearly" }, { t: "Secure", d: "Encrypted" }, { t: "Direct", d: "94%" }].map((item) => (
                <div key={item.t} className="rounded-2xl border border-green-700/12 bg-white/60 p-3 sm:p-4">
                  <span className="block h-1 w-7 rounded-full bg-green-700/70" />
                  <p className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-green-700 sm:mt-3 sm:text-[0.72rem]">{item.t}</p>
                  <p className="mt-0.5 text-[0.75rem] leading-snug text-[#4A4A42] sm:mt-1 sm:text-[0.82rem]">{item.d}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="relative rounded-[24px] border border-green-700/12 bg-white/85 p-5 shadow-[0_36px_80px_-44px_rgba(20,83,45,0.45)] backdrop-blur-sm sm:rounded-[28px] sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Give in your currency</p>
                <p className="mt-1 text-[0.82rem] text-[#4A4A42]/80">We'll convert to KES at the displayed rate on submit.</p>
              </div>
              <CurrencyPicker value={currencyCode} onChange={(code) => { setCurrencyCode(code); setCustom(""); }} className="sm:w-[200px]" />
            </div>

            <div className="mt-7">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Give</p>
              <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-green-700/6 p-1.5">
                {[{ id: "once", label: "One-time" }, { id: "monthly", label: "Monthly" }].map((opt) => (
                  <button key={opt.id} type="button" onClick={() => setFrequency(opt.id)} className={`rounded-lg py-3 text-[0.82rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 sm:py-2.5 sm:text-[0.8rem] ${frequency === opt.id ? "bg-green-700 text-white shadow-[0_10px_20px_-10px_rgba(28,107,75,0.9)]" : "text-[#4A4A42] hover:text-green-700"}`}>{opt.label}</button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Amount ({currency.code})</p>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {localPresets.map((p) => (
                  <button key={p.amount} type="button" onClick={() => { setPreset(p.amount); setCustom(""); }} className={`rounded-xl border px-3.5 py-4 text-left transition-all duration-200 sm:px-4 sm:py-3.5 ${amountKes === p.amount && !custom ? "border-green-700 bg-green-700/6 shadow-[0_10px_24px_-16px_rgba(28,107,75,0.9)]" : "border-green-700/15 bg-white hover:border-green-700/40"}`}>
                    <span className={`block text-[1rem] font-bold ${amountKes === p.amount && !custom ? "text-green-700" : "text-[#111111]"}`}>{currency.symbol}{formatLocal(p.local, currency)}</span>
                  </button>
                ))}
              </div>
              <div className="relative mt-3">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[0.85rem] font-bold text-green-700">{currency.symbol}</span>
                <input type="number" min="1" step="any" inputMode="decimal" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={`Enter amount in ${currency.code}`} className={`${inputClass} pl-14 ${errors.amount ? "border-[#E2703A]/60 focus:border-[#E2703A]" : ""}`} />
              </div>
              {errors.amount && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.amount}</p>}
            </div>

            <div className="mt-6 sm:mt-7">
              <AmountSummary kesAmount={amountKes} currencyCode={currencyCode} frequency={frequency} />
            </div>

            <div className="mt-7">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Payment method</p>
              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {PAY_METHODS.map((m) => (
                  <button key={m.id} type="button" onClick={() => setMethod(m.id)} className={`rounded-xl border px-4 py-3 text-left transition-all duration-200 ${method === m.id ? "border-green-700 bg-green-700/6" : "border-green-700/15 bg-white hover:border-green-700/40"}`}>
                    <span className={`block text-[0.88rem] font-bold ${method === m.id ? "text-green-700" : "text-[#111111]"}`}>{m.label}</span>
                    <span className="mt-0.5 block text-[0.7rem] text-[#4A4A42]/80">{m.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Your details</p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">First name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Amina" autoComplete="given-name" className={`${inputClass} ${errors.firstName ? "border-[#E2703A]/60" : ""}`} />
                  {errors.firstName && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Last name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Wanjiku" autoComplete="family-name" className={`${inputClass} ${errors.lastName ? "border-[#E2703A]/60" : ""}`} />
                  {errors.lastName && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Email address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                {errors.email ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p> : <p className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70">We'll send your receipt here.</p>}
              </div>
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Phone number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 7xx xxx xxx" autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                {errors.phone && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p>}
              </div>
            </div>

            <button type="submit" className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-green-700 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_20px_40px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] active:scale-[0.99] sm:mt-9 sm:px-8 sm:py-[1.15rem]">
              Give {currency.symbol}{formatLocal(amountLocal, currency)} {currency.code}
            </button>
            <p className="mt-5 border-l-2 border-green-700/40 pl-4 text-[0.78rem] leading-[1.7] text-[#4A4A42]/80">Your payment is processed over a secure connection. MKCDP never stores card details on its servers.</p>
          </form>
        </div>
      </div>

      <div className="lg:hidden">
        <div>
          <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-6 bg-green-700" />Gifts &amp; Donations</span>
          <h2 className="hero-serif text-[2rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111]">Every shilling is a trust. <span className="italic text-green-700">Every report is a promise kept.</span></h2>
          <p className="mt-4 text-[0.95rem] leading-[1.8] text-[#4A4A42]">Your gift goes directly to programmes that put children in classrooms, families on their feet, and communities in charge of their own future.</p>
          <div className="mt-6 grid grid-cols-3 divide-x divide-green-700/12 rounded-2xl border border-green-700/12 bg-white/60">
            {[{ t: "Audited", d: "Yearly" }, { t: "Secure", d: "Encrypted" }, { t: "Direct", d: "94%" }].map((item) => (
              <div key={item.t} className="px-3 py-4 text-center">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-green-700">{item.t}</p>
                <p className="mt-1 text-[0.75rem] text-[#4A4A42]">{item.d}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-7">
          <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.45)]">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">1 · Currency</p>
            <div className="mt-3">
              <CurrencyPicker value={currencyCode} onChange={(code) => { setCurrencyCode(code); setCustom(""); }} />
            </div>
            <p className="mt-7 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">2 · How often</p>
            <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-green-700/6 p-1.5">
              {[{ id: "once", label: "One-time" }, { id: "monthly", label: "Monthly" }].map((opt) => (
                <button key={opt.id} type="button" onClick={() => setFrequency(opt.id)} className={`rounded-lg py-3.5 text-[0.82rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${frequency === opt.id ? "bg-green-700 text-white" : "text-[#4A4A42]"}`}>{opt.label}</button>
              ))}
            </div>
            <p className="mt-7 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">3 · Amount ({currency.code})</p>
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
              <input type="number" min="1" step="any" inputMode="decimal" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={`Enter amount in ${currency.code}`} className={`${inputClass} pl-14`} />
            </div>
            {errors.amount && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.amount}</p>}
            <div className="mt-4"><AmountSummary kesAmount={amountKes} currencyCode={currencyCode} frequency={frequency} /></div>
          </div>

          <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">4 · Payment method</p>
            <div className="mt-3 space-y-2.5">
              {PAY_METHODS.map((m) => {
                const active = method === m.id;
                return (
                  <button key={m.id} type="button" onClick={() => setMethod(m.id)} className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-4 text-left transition-all duration-200 ${active ? "border-green-700 bg-green-700/6 ring-1 ring-green-700" : "border-green-700/15 bg-white"}`}>
                    <span>
                      <span className={`block text-[0.92rem] font-bold ${active ? "text-green-700" : "text-[#111111]"}`}>{m.label}</span>
                      <span className="mt-0.5 block text-[0.72rem] text-[#4A4A42]/80">{m.hint}</span>
                    </span>
                    <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${active ? "bg-green-700" : "bg-green-700/20"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">5 · Your details</p>
            <div className="mt-4 space-y-5">
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">First name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Amina" autoComplete="given-name" className={`${inputClass} ${errors.firstName ? "border-[#E2703A]/60" : ""}`} />
                {errors.firstName && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.firstName}</p>}
              </div>
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Last name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Wanjiku" autoComplete="family-name" className={`${inputClass} ${errors.lastName ? "border-[#E2703A]/60" : ""}`} />
                {errors.lastName && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.lastName}</p>}
              </div>
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Email address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                {errors.email ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p> : <p className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70">We'll send your receipt here.</p>}
              </div>
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Phone number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 7xx xxx xxx" autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                {errors.phone && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p>}
              </div>
            </div>
          </div>

          <div className="sticky bottom-3 z-30">
            <div className="rounded-2xl border border-green-700/15 bg-white/95 p-3 shadow-[0_18px_44px_-18px_rgba(20,83,45,0.55)] backdrop-blur">
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#4A4A42]">{frequency === "monthly" ? "Monthly gift" : "One-time gift"}</span>
                <span className="hero-serif text-[1.05rem] font-bold text-green-700">{currency.symbol}{formatLocal(amountLocal, currency)} {currency.code}</span>
              </div>
              <button type="submit" className="w-full rounded-xl bg-green-700 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-white transition-all duration-200 active:scale-[0.99]">Give now</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

function NeedCard({ need, currency, qty, onAdd, onDec }) {
  const priceLocal = fromKes(need.kes, currency);
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-green-700/12 bg-white/80 shadow-[0_20px_50px_-40px_rgba(20,83,45,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-40px_rgba(20,83,45,0.55)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={need.childImage} alt={need.childName} className="h-full w-full object-cover" loading="lazy" />
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
            <button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-full bg-green-700 px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-white transition-all duration-200 hover:bg-[#15543A] active:scale-95">Add</button>
          )}
        </div>
      </div>
    </article>
  );
}

function SendAGift() {
  const { cart, setCart } = useGiftCart();
  const [currencyCode, setCurrencyCode] = useState("KES");
  const currency = getCurrency(currencyCode);

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const need = NEEDS.find((n) => n.id === id);
        return need && qty > 0 ? { need, qty } : null;
      })
      .filter(Boolean);
  }, [cart]);

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
        <span className="inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-green-700"><span className="h-px w-6 bg-green-700" />Gift Marketplace</span>
        <h1 className="hero-serif mt-4 text-[clamp(1.9rem,6vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#111111]">
          Real needs. Real children.
          <br />
          <span className="italic text-green-700">Pick one. Or many.</span>
        </h1>
        <p className="mt-5 max-w-[620px] text-[0.98rem] leading-[1.85] text-[#4A4A42]">
          Every item below is a specific need one of our children has right now. Add what you want to cover, set the quantity, and check out in your own currency.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex items-center gap-3">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Currency</p>
          <CurrencyPicker value={currencyCode} onChange={setCurrencyCode} className="w-full sm:w-[190px]" />
        </div>
      </div>

      <div className="pb-24 sm:pb-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {NEEDS.map((need) => (
            <NeedCard key={need.id} need={need} currency={currency} qty={cart[need.id] || 0} onAdd={() => addToCart(need.id)} onDec={() => decFromCart(need.id)} />
          ))}
        </div>
      </div>

      {itemCount > 0 && (
        <div className="fixed inset-x-3 bottom-3 z-40 lg:sticky lg:inset-auto lg:bottom-6 lg:mx-auto lg:mt-8 lg:max-w-2xl">
          <Link to="/take-action/send-a-gift-cart" className="flex w-full items-center justify-between gap-3 rounded-2xl border border-green-700/20 bg-white/95 px-5 py-4 shadow-[0_20px_50px_-18px_rgba(20,83,45,0.55)] backdrop-blur transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] lg:bg-white">
            <span className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-green-700 text-[0.8rem] font-bold text-white">{itemCount}</span>
              <span className="text-left">
                <span className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">{itemCount === 1 ? "item in basket" : "items in basket"}</span>
                <span className="hero-serif block text-[1.05rem] font-bold leading-tight text-green-700">{currency.symbol}{formatLocal(totalLocal, currency)} {currency.code}</span>
              </span>
            </span>
            <span className="rounded-xl bg-green-700 px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-white">View basket →</span>
          </Link>
        </div>
      )}
    </div>
  );
}

function GiftCart() {
  const { cart, setCart } = useGiftCart();
  const [currencyCode, setCurrencyCode] = useState("KES");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", holder: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const currency = getCurrency(currencyCode);

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const need = NEEDS.find((n) => n.id === id);
        return need && qty > 0 ? { need, qty } : null;
      })
      .filter(Boolean);
  }, [cart]);

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
    setSubmitted(false);
    setCart({});
    setForm({ name: "", email: "", phone: "" });
    setCard({ number: "", expiry: "", cvc: "", holder: "" });
    setErrors({});
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email";
    if (cartItems.length === 0) next.cart = "Add at least one need to your basket";

    if (form.phone.trim() && !/^\+?[\d\s()-]{7,20}$/.test(form.phone)) {
      next.phone = "Enter a valid phone number";
    }
    if (paymentMethod === "phone") {
      if (!form.phone.trim()) {
        next.phone = "M-Pesa requires a phone number";
      } else {
        const cleaned = form.phone.replace(/[\s()-]/g, "");
        const kenyan = /^(\+?254|0)[17]\d{8}$/.test(cleaned);
        if (!kenyan) next.phone = "M-Pesa is only available for Kenyan numbers (+254).";
      }
    }
    if (paymentMethod === "card") {
      const num = card.number.replace(/\s/g, "");
      if (!/^\d{13,19}$/.test(num)) next.cardNumber = "Enter a valid card number";
      if (!/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(card.expiry)) next.cardExpiry = "MM / YY";
      if (!/^\d{3,4}$/.test(card.cvc)) next.cardCvc = "3 or 4 digits";
      if (!card.holder.trim()) next.cardHolder = "Name on card required";
    }

    setErrors(next);
    if (Object.keys(next).length === 0) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-[720px] px-5 py-16 sm:px-0 sm:py-20">
        <div className="rounded-3xl border border-green-700/20 bg-white/85 p-6 shadow-[0_36px_80px_-44px_rgba(20,83,45,0.5)] sm:p-10">
          <span className="inline-flex rounded-full bg-green-700/10 px-4 py-1.5 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-green-700">Gift sent</span>
          <h2 className="hero-serif mt-6 text-[clamp(1.6rem,5vw,2.4rem)] font-bold leading-tight text-[#111111]">Thank you, {form.name.split(" ")[0]}.</h2>
          <p className="mt-4 text-[0.95rem] leading-[1.8] text-[#4A4A42]">
            Your gift of <span className="font-bold text-green-700">{currency.symbol}{formatLocal(totalLocal, currency)} {currency.code}</span> (≈ KES {totalKes.toLocaleString("en-US")}) has been received. A confirmation email is on its way to <span className="font-semibold text-[#111111]">{form.email}</span>.
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
            Send another gift
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-[720px] py-16 sm:py-20">
        <div className="rounded-3xl border border-dashed border-green-700/25 bg-white/50 p-12 text-center">
          <p className="hero-serif text-[1.3rem] font-bold text-[#111111]">Your basket is empty.</p>
          <p className="mt-2 text-[0.9rem] text-[#4A4A42]">Browse the needs and add what you'd like to cover.</p>
          <Link to="/take-action/send-a-gift" className="mt-6 inline-flex items-center rounded-xl bg-green-700 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white transition-all duration-200 hover:bg-[#15543A]">
            Browse
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
            <h2 className="hero-serif text-[1.3rem] font-bold text-[#111111] sm:text-[1.5rem]">Your basket</h2>
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
                        <button type="button" onClick={() => removeItem(need.id)} className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#E2703A] transition-colors hover:text-[#c95c2b]">Remove</button>
                      </div>
                    </div>
                    <p className="flex-shrink-0 text-[0.9rem] font-bold text-green-700">{currency.symbol}{formatLocal(lineLocal, currency)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="hero-serif text-[1.3rem] font-bold text-[#111111] sm:text-[1.5rem]">Your details</h2>
            <div className="mt-4 space-y-5">
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Full name</label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Amina Wanjiku" autoComplete="name" className={`${inputClass} ${errors.name ? "border-[#E2703A]/60" : ""}`} />
                {errors.name && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Email address</label>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@example.com" autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                {errors.email ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p> : <p className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70">We'll send your receipt here.</p>}
              </div>
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Phone number <span className="font-medium normal-case tracking-normal text-[#4A4A42]/60">(optional)</span></label>
                <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+254 7xx xxx xxx" autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                {errors.phone ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p> : paymentMethod === "phone" ? <p className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70">Required for M-Pesa. Kenyan numbers only (+254).</p> : <p className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70">Not needed for card payments.</p>}
              </div>
            </div>
          </div>

          <div>
            <h2 className="hero-serif text-[1.3rem] font-bold text-[#111111] sm:text-[1.5rem]">Payment</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-green-700/15 bg-white p-1">
              <button type="button" onClick={() => setPaymentMethod("card")} className={`rounded-lg px-3 py-3 text-[0.75rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${paymentMethod === "card" ? "bg-green-700 text-white shadow-[0_10px_20px_-10px_rgba(28,107,75,0.9)]" : "text-[#4A4A42] hover:text-green-700"}`}>
                Card
                <span className="mt-0.5 block text-[0.58rem] font-medium normal-case tracking-normal opacity-80">Visa · Mastercard · Worldwide</span>
              </button>
              <button type="button" onClick={() => setPaymentMethod("phone")} className={`rounded-lg px-3 py-3 text-[0.75rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${paymentMethod === "phone" ? "bg-green-700 text-white shadow-[0_10px_20px_-10px_rgba(28,107,75,0.9)]" : "text-[#4A4A42] hover:text-green-700"}`}>
                M-Pesa
                <span className="mt-0.5 block text-[0.58rem] font-medium normal-case tracking-normal opacity-80">Kenya only (+254)</span>
              </button>
            </div>

            {paymentMethod === "card" && (
              <div className="mt-4 space-y-4 rounded-2xl border border-green-700/12 bg-white/70 p-4">
                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Card number</label>
                  <input type="text" inputMode="numeric" value={card.number} onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))} placeholder="1234 5678 9012 3456" autoComplete="cc-number" className={`${inputClass} ${errors.cardNumber ? "border-[#E2703A]/60" : ""}`} />
                  {errors.cardNumber && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Expiry</label>
                    <input type="text" inputMode="numeric" value={card.expiry} onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))} placeholder="MM / YY" autoComplete="cc-exp" className={`${inputClass} ${errors.cardExpiry ? "border-[#E2703A]/60" : ""}`} />
                    {errors.cardExpiry && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.cardExpiry}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">CVC</label>
                    <input type="text" inputMode="numeric" value={card.cvc} onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value }))} placeholder="123" autoComplete="cc-csc" className={`${inputClass} ${errors.cardCvc ? "border-[#E2703A]/60" : ""}`} />
                    {errors.cardCvc && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.cardCvc}</p>}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Name on card</label>
                  <input type="text" value={card.holder} onChange={(e) => setCard((c) => ({ ...c, holder: e.target.value }))} placeholder="AMINA WANJIKU" autoComplete="cc-name" className={`${inputClass} ${errors.cardHolder ? "border-[#E2703A]/60" : ""}`} />
                  {errors.cardHolder && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.cardHolder}</p>}
                </div>
              </div>
            )}

            {paymentMethod === "phone" && (
              <div className="mt-4 rounded-2xl border border-green-700/12 bg-green-700/5 p-4">
                <p className="text-[0.85rem] leading-[1.7] text-[#4A4A42]">
                  We'll send an <span className="font-bold text-green-700">M-Pesa STK push</span> to the phone number you entered above. Approve it on your handset to complete the payment.
                </p>
                <p className="mt-2 text-[0.72rem] text-[#4A4A42]/80">Available for Kenyan numbers only (+254 7xx / +254 1xx).</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-40 lg:self-start">
          <div className="rounded-3xl border border-green-700/12 bg-white/85 p-6 shadow-[0_28px_70px_-46px_rgba(20,83,45,0.5)]">
            <h3 className="hero-serif text-[1.15rem] font-bold text-[#111111]">Order summary</h3>
            <div className="mt-4 space-y-2 border-b border-green-700/12 pb-4 text-[0.85rem]">
              <div className="flex justify-between text-[#4A4A42]"><span>Items</span><span className="font-bold text-[#111111]">{itemCount}</span></div>
              <div className="flex justify-between text-[#4A4A42]"><span>Subtotal (KES)</span><span className="font-bold text-[#111111]">KES {totalKes.toLocaleString("en-US")}</span></div>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <span className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-green-700">Total</span>
              <div className="text-right">
                <p className="hero-serif text-[1.6rem] font-bold leading-none text-green-700">{currency.symbol}{formatLocal(totalLocal, currency)}</p>
                <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#4A4A42]/80">{currency.code}</p>
              </div>
            </div>
            {currency.code !== "KES" && (
              <p className="mt-2 text-[0.72rem] text-[#4A4A42]/80">≈ KES {totalKes.toLocaleString("en-US")} · 1 {currency.code} = {currency.rate} KES</p>
            )}
            {errors.cart && <p className="mt-4 text-[0.75rem] font-medium text-[#E2703A]">{errors.cart}</p>}
            <button type="submit" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-green-700 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_20px_40px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] active:scale-[0.99]">
              Checkout · {currency.symbol}{formatLocal(totalLocal, currency)}
            </button>
            <Link to="/take-action/send-a-gift" className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-green-700/20 px-6 py-3 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-all duration-200 hover:bg-green-700/6">
              Add more needs
            </Link>
            <p className="mt-4 text-[0.72rem] leading-[1.7] text-[#4A4A42]/80">Payments are processed over a secure connection. MKCDP never stores card details on its servers.</p>
          </div>
        </div>
      </form>
    </div>
  );
}

function ChildCard({ child, onSelect }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-green-700/12 bg-white/70 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-40px_rgba(20,83,45,0.55)]">
      <div className="relative aspect-[5/4] overflow-hidden sm:aspect-[4/3]">
        <img src={child.image} alt={`Photo of ${child.name}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-green-700 backdrop-blur sm:left-4 sm:top-4 sm:px-3 sm:text-[0.65rem]">ID {child.id}</span>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="hero-serif text-[1.6rem] font-bold leading-tight sm:text-[1.5rem]">{child.name}, {child.age}</p>
          <p className="mt-0.5 text-[0.8rem] font-medium text-white/85 sm:text-[0.78rem]">{child.grade} · {child.location}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-5">
        <p className="hero-serif text-[1rem] italic leading-[1.6] text-green-700 sm:text-[0.95rem]">{child.dream}.</p>
        <p className="mt-3 flex-1 text-[0.9rem] leading-[1.7] text-[#4A4A42] sm:text-[0.85rem]">{child.story}</p>
        <div className="mt-5">
          <div className="flex items-center justify-between text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#4A4A42]"><span>Funded</span><span className="text-green-700">{child.funded}%</span></div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-green-700/10"><div className="h-full rounded-full bg-green-700 transition-all duration-700" style={{ width: `${child.funded}%` }} /></div>
        </div>
        <button type="button" onClick={() => onSelect(child)} className="mt-5 inline-flex items-center justify-center rounded-xl bg-green-700 px-5 py-4 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-[#15543A] active:scale-[0.99] sm:py-3.5 sm:text-[0.78rem]">Sponsor {child.name} · KES {child.monthly.toLocaleString("en-US")}/mo</button>
      </div>
    </article>
  );
}

function MobileChildCard({ child, onSelect }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-green-700/12 bg-white shadow-[0_20px_50px_-36px_rgba(20,83,45,0.4)]">
      <div className="relative aspect-[5/4] overflow-hidden">
        <img src={child.image} alt={`Photo of ${child.name}`} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-green-700">ID {child.id}</span>
        <span className="absolute right-4 top-4 rounded-full bg-green-700/90 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white">{child.funded}% funded</span>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="hero-serif text-[1.7rem] font-bold leading-tight">{child.name}, {child.age}</p>
          <p className="mt-1 text-[0.8rem] font-medium text-white/85">{child.grade} · {child.location}</p>
        </div>
      </div>
      <div className="p-5">
        <p className="hero-serif text-[1rem] italic leading-[1.6] text-green-700">{child.dream}.</p>
        <p className="mt-3 text-[0.9rem] leading-[1.7] text-[#4A4A42]">{child.story}</p>
        <div className="mt-5"><div className="h-1.5 w-full overflow-hidden rounded-full bg-green-700/10"><div className="h-full rounded-full bg-green-700 transition-all duration-700" style={{ width: `${child.funded}%` }} /></div></div>
        <button type="button" onClick={() => onSelect(child)} className="mt-5 w-full rounded-xl bg-green-700 px-5 py-4 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white transition-all duration-200 active:scale-[0.99]">Sponsor {child.name} · KES {child.monthly.toLocaleString("en-US")}/mo</button>
      </div>
    </article>
  );
}

function SponsorAChild() {
  const [selected, setSelected] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ age: "all", birthYear: "all", gender: "all", region: "all" });

  const birthYears = useMemo(() => [...new Set(CHILDREN.map((c) => c.birthYear))].sort((a, b) => b - a), []);

  const filteredChildren = useMemo(() => {
    return CHILDREN.filter((child) => {
      const ageRange = AGE_RANGES.find((r) => r.id === filters.age);
      if (ageRange?.test && !ageRange.test(child.age)) return false;
      if (filters.birthYear !== "all" && String(child.birthYear) !== filters.birthYear) return false;
      if (filters.gender !== "all" && child.gender !== filters.gender) return false;
      if (filters.region !== "all" && child.region !== filters.region) return false;
      return true;
    });
  }, [filters]);

  const activeFilterCount = (filters.age !== "all" ? 1 : 0) + (filters.birthYear !== "all" ? 1 : 0) + (filters.gender !== "all" ? 1 : 0) + (filters.region !== "all" ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0;
  const setFilter = (field, value) => setFilters((f) => ({ ...f, [field]: value }));
  const clearFilters = () => setFilters({ age: "all", birthYear: "all", gender: "all", region: "all" });
  const handleSelect = (child) => {
    setSelected(child);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const chipClass = (active) => `flex-shrink-0 rounded-full border px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.08em] transition-all duration-200 ${active ? "border-green-700 bg-green-700 text-white" : "border-green-700/20 bg-white text-[#4A4A42]"}`;

  return (
    <>
      <div className="hidden lg:block">
        <div className="space-y-16 lg:space-y-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-green-700"><span className="h-px w-8 bg-green-700" />Sponsor a Child</span>
              <h1 className="hero-serif text-[clamp(2rem,7vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#111111]">One child. One sponsor.<br /><span className="italic text-green-700">One future rewritten.</span></h1>
              <p className="mt-6 max-w-[520px] text-[1rem] leading-[1.8] text-[#4A4A42] sm:mt-8 sm:text-[1.0625rem]">For KES 2,500 a month — about the price of two cups of coffee a week — you can put a real child in a real classroom and keep them there, term after term, until they walk out with a future.</p>
              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                <a href="#children" className="inline-flex items-center justify-center rounded-full bg-green-700 px-8 py-[1.15rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_-16px_rgba(20,83,45,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A]">Meet the children</a>
                <a href="#how" className="inline-flex items-center justify-center rounded-full border border-green-700/25 px-8 py-[1.15rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-all duration-300 hover:border-green-700/60 hover:bg-green-700/5">How it works</a>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-green-700/12 pt-8 sm:mt-12 sm:gap-6">
                {[{ v: "8,750+", l: "Children sponsored" }, { v: "14", l: "Partner schools" }, { v: "94%", l: "Gift to programme" }].map((item) => (
                  <div key={item.l}>
                    <p className="hero-serif text-[clamp(1.2rem,4.5vw,2rem)] font-bold leading-none text-green-700">{item.v}</p>
                    <p className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]/80 sm:text-[0.72rem] sm:tracking-[0.12em]">{item.l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-[44px] bg-gradient-to-br from-[#F2B33D]/25 via-transparent to-[#E2703A]/15 blur-2xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-green-700/10 bg-white shadow-[0_40px_90px_-50px_rgba(20,83,45,0.6)] sm:rounded-[36px]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={CHILDREN[0].image} alt="Featured sponsored child" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-6 sm:left-6 sm:right-6">
                    <span className="inline-flex items-center rounded-full bg-[#F2B33D] px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#1C6B4B] sm:text-[0.62rem]">Waiting for a sponsor</span>
                    <p className="hero-serif mt-3 text-[1.75rem] font-bold leading-tight sm:mt-4 sm:text-[2rem]">{CHILDREN[0].name}, {CHILDREN[0].age}</p>
                    <p className="mt-1 text-[0.82rem] text-white/85 sm:text-[0.85rem]">{CHILDREN[0].grade} · {CHILDREN[0].location}</p>
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-[0.9rem] leading-[1.7] text-[#4A4A42]">{CHILDREN[0].story}</p>
                  <button type="button" onClick={() => handleSelect(CHILDREN[0])} className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-green-700 px-5 py-4 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-[#15543A] active:scale-[0.99] sm:py-3.5 sm:text-[0.78rem]">Sponsor {CHILDREN[0].name}</button>
                </div>
              </div>
            </div>
          </div>

          {selected && (
            <div className="flex flex-col items-start gap-5 rounded-3xl border border-green-700/15 bg-white/80 p-5 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.5)] sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex items-center gap-4 sm:gap-5">
                <img src={selected.image} alt={selected.name} className="h-16 w-16 flex-shrink-0 rounded-2xl object-cover sm:h-20 sm:w-20" />
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-green-700">Your choice</p>
                  <p className="hero-serif mt-1 text-[1.25rem] font-bold leading-tight text-[#111111] sm:text-[1.4rem]">{selected.name}, {selected.age}</p>
                  <p className="mt-0.5 text-[0.85rem] text-[#4A4A42]">{selected.grade} · {selected.location}</p>
                </div>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <Link to="/take-action/donate" className="inline-flex items-center justify-center rounded-xl bg-green-700 px-6 py-4 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] active:scale-[0.99] sm:py-3.5 sm:text-[0.78rem]">Continue to give · KES {selected.monthly.toLocaleString("en-US")}/mo</Link>
                <button type="button" onClick={() => setSelected(null)} className="py-2 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42] transition-colors duration-200 hover:text-green-700 sm:text-[0.72rem]">Change</button>
              </div>
            </div>
          )}

          <div id="children">
            <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[640px]">
                <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-8 bg-green-700" />Waiting for a sponsor</span>
                <h2 className="hero-serif text-[clamp(1.6rem,5.5vw,3.2rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#111111]">Real children, real classrooms, right now.</h2>
              </div>
              <p className="max-w-[380px] text-[0.95rem] leading-[1.8] text-[#4A4A42] sm:text-[1rem]">Each child below has been visited by our field team. Their profiles are current as of this month.</p>
            </div>

            <div className="mb-6 flex items-center justify-between gap-4 sm:mb-10">
              <button type="button" onClick={() => setShowFilters((v) => !v)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 sm:hidden ${hasActiveFilters ? "border-green-700 bg-green-700 text-white" : "border-green-700/20 bg-white text-[#4A4A42]"}`}>
                Filter
                {activeFilterCount > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-white/25 text-[0.62rem]">{activeFilterCount}</span>}
              </button>
              <p className="text-[0.8rem] text-[#4A4A42]/80 sm:hidden"><span className="font-bold text-[#111111]">{filteredChildren.length}</span> of {CHILDREN.length}</p>
            </div>

            <div className={`mb-8 rounded-3xl border border-green-700/12 bg-white/60 p-5 transition-all duration-300 sm:mb-10 sm:block sm:p-7 ${showFilters ? "block" : "hidden"}`}>
              <div className="mb-5 hidden flex-wrap items-center justify-between gap-3 sm:flex">
                <p className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-green-700"><span className="h-px w-5 bg-green-700" />Filter children</p>
                <div className="flex items-center gap-5">
                  <p className="text-[0.78rem] text-[#4A4A42]/80">Showing <span className="font-bold text-[#111111]">{filteredChildren.length}</span> of {CHILDREN.length}</p>
                  {hasActiveFilters && <button type="button" onClick={clearFilters} className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#E2703A] transition-colors duration-200 hover:text-[#c95c2b]">Clear all</button>}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Age</label>
                  <select value={filters.age} onChange={(e) => setFilter("age", e.target.value)} className="w-full rounded-xl border border-green-700/15 bg-white px-4 py-3.5 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15 sm:py-3 sm:text-[0.88rem]">
                    {AGE_RANGES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Birth year</label>
                  <select value={filters.birthYear} onChange={(e) => setFilter("birthYear", e.target.value)} className="w-full rounded-xl border border-green-700/15 bg-white px-4 py-3.5 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15 sm:py-3 sm:text-[0.88rem]">
                    <option value="all">All years</option>
                    {birthYears.map((y) => <option key={y} value={String(y)}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    {GENDERS.map((g) => {
                      const active = filters.gender === g.id;
                      return (
                        <button key={g.id} type="button" onClick={() => setFilter("gender", g.id)} className={`rounded-xl border px-2 py-3 text-[0.8rem] font-semibold transition-all duration-200 ${active ? "border-green-700 bg-green-700 text-white" : "border-green-700/15 bg-white text-[#4A4A42] hover:border-green-700/40"}`}>{g.label}</button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Region</label>
                  <select value={filters.region} onChange={(e) => setFilter("region", e.target.value)} className="w-full rounded-xl border border-green-700/15 bg-white px-4 py-3.5 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15 sm:py-3 sm:text-[0.88rem]">
                    {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                  </select>
                </div>
              </div>
              {hasActiveFilters && <button type="button" onClick={clearFilters} className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-green-700/20 px-5 py-3 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:bg-green-700/5 sm:hidden">Clear filters</button>}
            </div>

            {filteredChildren.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-green-700/25 bg-white/50 p-10 text-center sm:p-12">
                <p className="hero-serif text-[1.2rem] font-bold text-[#111111] sm:text-[1.3rem]">No children match those filters right now.</p>
                <p className="mt-2 text-[0.9rem] text-[#4A4A42]">Try widening your search, or check back soon — new profiles are added every month.</p>
                <button type="button" onClick={clearFilters} className="mt-6 inline-flex items-center rounded-xl border border-green-700/20 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700/5">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {filteredChildren.map((child) => <ChildCard key={child.id} child={child} onSelect={handleSelect} />)}
              </div>
            )}
          </div>

          <div className="relative overflow-hidden bg-green-700">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.55]" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(251,247,240,0.09) 0px, rgba(251,247,240,0.09) 1px, transparent 1px, transparent 22px)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)", maskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)" }} />
            <div className="relative mx-auto max-w-[1360px] px-6 py-20 sm:px-10 lg:px-14 lg:py-28">
              <div className="mb-10 max-w-[720px] sm:mb-14">
                <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]"><span className="h-px w-8 bg-[#F2B33D]" />What your gift covers</span>
                <h2 className="hero-serif text-[clamp(1.6rem,5.5vw,3.2rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#FBF7F0]">Nothing hidden. Every shilling accounted for.</h2>
                <p className="mt-5 text-[0.95rem] leading-[1.8] text-[#FBF7F0]/70 sm:mt-6 sm:text-[1rem]">Your monthly gift is pooled with other sponsors to cover the full cost of one child's education. Here is exactly where it goes.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {COVERAGE.map((c) => (
                  <div key={c.title} className="rounded-2xl border border-[#FBF7F0]/12 bg-[#FBF7F0]/5 p-5 transition-colors duration-300 hover:border-[#FBF7F0]/30 hover:bg-[#FBF7F0]/8 sm:p-6">
                    <span className="block h-1 w-9 rounded-full bg-[#F2B33D]" />
                    <p className="hero-serif mt-4 text-[1.1rem] font-bold leading-tight text-[#FBF7F0] sm:mt-5 sm:text-[1.15rem]">{c.title}</p>
                    <p className="mt-2 text-[0.88rem] leading-[1.7] text-[#FBF7F0]/65">{c.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div id="how">
            <div className="mb-10 max-w-[680px] sm:mb-14">
              <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-8 bg-green-700" />How it works</span>
              <h2 className="hero-serif text-[clamp(1.6rem,5.5vw,3.2rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#111111]">Four steps from stranger to sponsor.</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {SPONSOR_STEPS.map((step) => (
                <div key={step.n} className="relative rounded-2xl border border-green-700/12 bg-white/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-40px_rgba(20,83,45,0.4)] sm:p-6">
                  <span className="hero-serif text-[2rem] font-bold leading-none text-green-700/25 sm:text-[2.4rem]">{step.n}</span>
                  <p className="hero-serif mt-3 text-[1.15rem] font-bold leading-tight text-[#111111] sm:text-[1.2rem]">{step.title}</p>
                  <p className="mt-3 text-[0.88rem] leading-[1.7] text-[#4A4A42]">{step.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-2xl border border-green-700/12 border-l-2 border-l-green-700 bg-white/70 p-5 sm:mt-14 sm:p-6">
              <p className="text-[0.95rem] font-bold text-[#111111]">Our promise to every sponsor</p>
              <p className="mt-2 text-[0.9rem] leading-[1.75] text-[#4A4A42]">Your money never touches a middleman. School fees are paid directly to the school. Meals are delivered by our field team. Health costs are receipted. You receive the full report every year.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-green-700/12 bg-white/55 p-6 sm:p-12 lg:p-14">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
              <div>
                <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-8 bg-green-700" />Common questions</span>
                <h2 className="hero-serif text-[clamp(1.6rem,5.5vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#111111]">Everything you were going to ask.</h2>
                <p className="mt-5 max-w-[420px] text-[0.95rem] leading-[1.8] text-[#4A4A42] sm:mt-6 sm:text-[1rem]">Still unsure? Our sponsorship team is on hand at <a href="mailto:sponsor@mkcdp.org" className="font-bold text-green-700 underline decoration-green-700/30 underline-offset-4 hover:decoration-green-700">sponsor@mkcdp.org</a>.</p>
              </div>
              <div>{SPONSOR_FAQ.map((item, i) => <FaqItem key={item.q} q={item.q} a={item.a} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="space-y-14">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-6 bg-green-700" />Sponsor a Child</span>
            <h1 className="hero-serif text-[2.1rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111]">One child. One sponsor. <span className="italic text-green-700">One future rewritten.</span></h1>
            <p className="mt-4 text-[0.95rem] leading-[1.8] text-[#4A4A42]">For KES 2,500 a month you can put a real child in a real classroom and keep them there, term after term, until they walk out with a future.</p>
            <div className="mt-6 flex flex-col gap-3">
              <a href="#children-m" className="inline-flex items-center justify-center rounded-full bg-green-700 px-8 py-4 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_-16px_rgba(20,83,45,0.9)] active:scale-[0.99]">Meet the children</a>
              <a href="#how-m" className="inline-flex items-center justify-center rounded-full border border-green-700/25 px-8 py-4 text-[0.78rem] font-bold uppercase tracking-[0.12em] text-green-700">How it works</a>
            </div>
            <div className="mt-8 grid grid-cols-3 divide-x divide-green-700/12 rounded-2xl border border-green-700/12 bg-white/60">
              {[{ v: "8,750+", l: "Children sponsored" }, { v: "14", l: "Partner schools" }, { v: "94%", l: "Gift to programme" }].map((item) => (
                <div key={item.l} className="px-3 py-4 text-center">
                  <p className="hero-serif text-[1.2rem] font-bold leading-none text-green-700">{item.v}</p>
                  <p className="mt-2 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]/80">{item.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-green-700/10 bg-white shadow-[0_28px_60px_-40px_rgba(20,83,45,0.5)]">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={CHILDREN[0].image} alt="Featured sponsored child" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="inline-flex items-center rounded-full bg-[#F2B33D] px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#1C6B4B]">Waiting for a sponsor</span>
                <p className="hero-serif mt-3 text-[1.75rem] font-bold leading-tight">{CHILDREN[0].name}, {CHILDREN[0].age}</p>
                <p className="mt-1 text-[0.82rem] text-white/85">{CHILDREN[0].grade} · {CHILDREN[0].location}</p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-[0.9rem] leading-[1.7] text-[#4A4A42]">{CHILDREN[0].story}</p>
              <button type="button" onClick={() => handleSelect(CHILDREN[0])} className="mt-5 w-full rounded-xl bg-green-700 px-5 py-4 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white active:scale-[0.99]">Sponsor {CHILDREN[0].name}</button>
            </div>
          </div>

          {selected && (
            <div className="rounded-3xl border border-green-700/15 bg-white/85 p-5 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.5)]">
              <div className="flex items-center gap-4">
                <img src={selected.image} alt={selected.name} className="h-16 w-16 flex-shrink-0 rounded-2xl object-cover" />
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-green-700">Your choice</p>
                  <p className="hero-serif mt-1 text-[1.25rem] font-bold leading-tight text-[#111111]">{selected.name}, {selected.age}</p>
                  <p className="mt-0.5 text-[0.82rem] text-[#4A4A42]">{selected.grade} · {selected.location}</p>
                </div>
              </div>
              <Link to="/take-action/donate" className="mt-5 flex w-full items-center justify-center rounded-xl bg-green-700 px-6 py-4 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white active:scale-[0.99]">Continue to give · KES {selected.monthly.toLocaleString("en-US")}/mo</Link>
              <button type="button" onClick={() => setSelected(null)} className="mt-3 w-full py-2 text-center text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Change choice</button>
            </div>
          )}

          <div id="children-m">
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-6 bg-green-700" />Waiting for a sponsor</span>
            <h2 className="hero-serif text-[1.8rem] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111]">Real children, real classrooms, right now.</h2>
            <p className="mt-3 text-[0.9rem] leading-[1.75] text-[#4A4A42]">Each child below has been visited by our field team. Profiles are current as of this month.</p>
            <div className="mt-6 space-y-5 rounded-3xl border border-green-700/12 bg-white/60 p-5">
              <div className="flex items-center justify-between">
                <p className="inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-green-700"><span className="h-px w-5 bg-green-700" />Filter children</p>
                <p className="text-[0.75rem] text-[#4A4A42]/80"><span className="font-bold text-[#111111]">{filteredChildren.length}</span> of {CHILDREN.length}</p>
              </div>
              <div>
                <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Age</p>
                <div className="scrollbar-hide -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
                  {AGE_RANGES.map((r) => <button key={r.id} type="button" onClick={() => setFilter("age", r.id)} className={chipClass(filters.age === r.id)}>{r.label}</button>)}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Birth year</p>
                <div className="scrollbar-hide -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
                  <button type="button" onClick={() => setFilter("birthYear", "all")} className={chipClass(filters.birthYear === "all")}>All years</button>
                  {birthYears.map((y) => <button key={y} type="button" onClick={() => setFilter("birthYear", String(y))} className={chipClass(filters.birthYear === String(y))}>{y}</button>)}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Gender</p>
                <div className="flex gap-2">
                  {GENDERS.map((g) => <button key={g.id} type="button" onClick={() => setFilter("gender", g.id)} className={`${chipClass(filters.gender === g.id)} flex-1`}>{g.label}</button>)}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Region</p>
                <div className="scrollbar-hide -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
                  {REGIONS.map((r) => <button key={r.id} type="button" onClick={() => setFilter("region", r.id)} className={chipClass(filters.region === r.id)}>{r.label}</button>)}
                </div>
              </div>
              {hasActiveFilters && <button type="button" onClick={clearFilters} className="w-full rounded-xl border border-green-700/20 px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-green-700">Clear all filters</button>}
            </div>
            <div className="mt-6 space-y-5">
              {filteredChildren.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-green-700/25 bg-white/50 p-8 text-center">
                  <p className="hero-serif text-[1.2rem] font-bold text-[#111111]">No children match those filters right now.</p>
                  <p className="mt-2 text-[0.88rem] text-[#4A4A42]">Try widening your search — new profiles are added every month.</p>
                  <button type="button" onClick={clearFilters} className="mt-5 inline-flex items-center rounded-xl border border-green-700/20 px-6 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700">Clear filters</button>
                </div>
              ) : (
                filteredChildren.map((child) => <MobileChildCard key={child.id} child={child} onSelect={handleSelect} />)
              )}
            </div>
          </div>

          <div className="-mx-5 bg-green-700 px-5 py-14">
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]"><span className="h-px w-6 bg-[#F2B33D]" />What your gift covers</span>
            <h2 className="hero-serif text-[1.8rem] font-bold leading-[1.1] tracking-[-0.02em] text-[#FBF7F0]">Nothing hidden. Every shilling accounted for.</h2>
            <p className="mt-4 text-[0.9rem] leading-[1.8] text-[#FBF7F0]/70">Your monthly gift is pooled with other sponsors to cover the full cost of one child's education.</p>
            <div className="mt-8 space-y-3">
              {COVERAGE.map((c) => (
                <div key={c.title} className="rounded-2xl border border-[#FBF7F0]/12 bg-[#FBF7F0]/5 p-5">
                  <span className="block h-1 w-8 rounded-full bg-[#F2B33D]" />
                  <p className="hero-serif mt-3 text-[1.05rem] font-bold leading-tight text-[#FBF7F0]">{c.title}</p>
                  <p className="mt-2 text-[0.85rem] leading-[1.7] text-[#FBF7F0]/65">{c.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="how-m">
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-6 bg-green-700" />How it works</span>
            <h2 className="hero-serif text-[1.8rem] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111]">Four steps from stranger to sponsor.</h2>
            <div className="relative mt-8 space-y-6 before:absolute before:bottom-2 before:left-[1.05rem] before:top-2 before:w-px before:bg-green-700/15">
              {SPONSOR_STEPS.map((step) => (
                <div key={step.n} className="relative flex gap-4">
                  <span className="z-10 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-green-700 text-[0.68rem] font-bold text-white">{step.n}</span>
                  <div className="rounded-2xl border border-green-700/12 bg-white/70 p-4">
                    <p className="hero-serif text-[1.05rem] font-bold leading-tight text-[#111111]">{step.title}</p>
                    <p className="mt-2 text-[0.85rem] leading-[1.7] text-[#4A4A42]">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-green-700/12 border-l-2 border-l-green-700 bg-white/70 p-5">
              <p className="text-[0.92rem] font-bold text-[#111111]">Our promise to every sponsor</p>
              <p className="mt-2 text-[0.88rem] leading-[1.75] text-[#4A4A42]">Your money never touches a middleman. School fees are paid directly to the school. Meals are delivered by our field team. Health costs are receipted. You receive the full report every year.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-green-700/12 bg-white/55 p-5">
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-6 bg-green-700" />Common questions</span>
            <h2 className="hero-serif text-[1.7rem] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111]">Everything you were going to ask.</h2>
            <p className="mt-4 text-[0.9rem] leading-[1.8] text-[#4A4A42]">Still unsure? Email <a href="mailto:sponsor@mkcdp.org" className="font-bold text-green-700 underline decoration-green-700/30 underline-offset-4">sponsor@mkcdp.org</a>.</p>
            <div className="mt-6">{SPONSOR_FAQ.map((item, i) => <FaqItem key={item.q} q={item.q} a={item.a} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />)}</div>
          </div>
        </div>
      </div>
    </>
  );
}

function OpportunityCard({ role, onApply }) {
  const start = formatDate(role.startDate);
  const deadline = formatDate(role.deadline);
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-green-700/12 bg-white/70 p-5 shadow-[0_24px_60px_-46px_rgba(20,83,45,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-green-700/30 hover:shadow-[0_30px_70px_-46px_rgba(20,83,45,0.55)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-green-700/8 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-green-700">ID {role.id}</span>
        <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/60">{role.org}</span>
      </div>
      <h3 className="hero-serif mt-5 text-[1.25rem] font-bold leading-tight text-[#111111] sm:text-[1.3rem]">{role.title}</h3>
      <div className="mt-4 space-y-2 text-[0.82rem] text-[#4A4A42]">
        <span className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-700" />{role.location}</span>
        <span className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-700" />{role.commitment}</span>
        {start && <span className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-700" />Starts {start}</span>}
        {deadline && <span className="flex items-center gap-2.5 font-semibold text-[#E2703A]"><span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E2703A]" />Apply by {deadline}</span>}
      </div>
      <p className="mt-5 flex-1 text-[0.9rem] leading-[1.75] text-[#4A4A42]">{role.desc}</p>
      <div className="mt-5 flex flex-wrap gap-2">{role.skills.map((s) => <span key={s} className="rounded-full border border-green-700/15 px-3 py-1 text-[0.68rem] font-semibold text-[#4A4A42]">{s}</span>)}</div>
      <button type="button" onClick={() => onApply(role)} className="mt-6 inline-flex items-center justify-center rounded-xl bg-green-700 px-5 py-4 text-[0.8rem] font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-[#15543A] active:scale-[0.99] sm:py-3.5 sm:text-[0.78rem]">Apply for this role</button>
    </article>
  );
}

function MobileOpportunityCard({ role, onApply }) {
  const start = formatDate(role.startDate);
  const deadline = formatDate(role.deadline);
  return (
    <article className="rounded-3xl border border-green-700/12 bg-white p-5 shadow-[0_20px_50px_-40px_rgba(20,83,45,0.4)]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-green-700/8 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-green-700">ID {role.id}</span>
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/60">{role.org}</span>
      </div>
      <h3 className="hero-serif mt-4 text-[1.25rem] font-bold leading-tight text-[#111111]">{role.title}</h3>
      <div className="mt-4 grid grid-cols-1 gap-2 text-[0.82rem] text-[#4A4A42]">
        <span className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-700" />{role.location}</span>
        <span className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-700" />{role.commitment}</span>
        {start && <span className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-700" />Starts {start}</span>}
        {deadline && <span className="flex items-center gap-2.5 font-semibold text-[#E2703A]"><span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E2703A]" />Apply by {deadline}</span>}
      </div>
      <p className="mt-4 text-[0.88rem] leading-[1.75] text-[#4A4A42]">{role.desc}</p>
      <div className="mt-4 flex flex-wrap gap-2">{role.skills.map((s) => <span key={s} className="rounded-full border border-green-700/15 px-3 py-1 text-[0.66rem] font-semibold text-[#4A4A42]">{s}</span>)}</div>
      <button type="button" onClick={() => onApply(role)} className="mt-5 w-full rounded-xl bg-green-700 px-5 py-4 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white active:scale-[0.99]">Apply for this role</button>
    </article>
  );
}

function Volunteer() {
  const [filter, setFilter] = useState("all");
  const [applied, setApplied] = useState(null);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", availability: "", note: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const hasRoles = OPPORTUNITIES.length > 0;
  const filtered = useMemo(() => filter === "all" ? OPPORTUNITIES : OPPORTUNITIES.filter((r) => r.tags.includes(filter)), [filter]);
  const AVAILABILITY_OPTIONS = [
    { id: "weekday-am", label: "Weekday mornings" },
    { id: "weekday-pm", label: "Weekday afternoons" },
    { id: "weekends", label: "Weekends" },
    { id: "evenings", label: "Evenings" },
    { id: "flexible", label: "Flexible / any time" },
  ];
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
  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Please enter your full name.";
    if (!/^\+?[\d\s()-]{7,20}$/.test(form.phone)) next.phone = "Enter a valid phone number.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email or leave this blank.";
    if (!form.availability) next.availability = "Please tell us when you are available.";
    setErrors(next);
    if (Object.keys(next).length === 0) setSubmitted(true);
  };

  return (
    <>
      <div className="hidden lg:block">
        <div className="space-y-16 lg:space-y-28">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <span className="mb-5 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-green-700"><span className="h-px w-8 bg-green-700" />Volunteer with MKCDP</span>
              <h1 className="hero-serif text-[clamp(2rem,7vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#111111]">Give an hour.<br /><span className="italic text-green-700">Change a childhood.</span></h1>
              <p className="mt-6 max-w-[520px] text-[1rem] leading-[1.8] text-[#4A4A42] sm:mt-8 sm:text-[1.0625rem]">Whether you can teach maths on Saturday, translate a letter, or photograph a field visit twice a year — there is a role here that needs exactly your skills.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[{ v: String(OPPORTUNITIES.length), l: "Open roles" }, { v: "Flexible", l: "Commitment" }].map((item) => (
                <div key={item.l} className="rounded-2xl border border-green-700/12 bg-white/70 p-4 sm:p-5">
                  <p className="hero-serif text-[clamp(1.2rem,4.5vw,1.8rem)] font-bold leading-none text-green-700">{item.v}</p>
                  <p className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/80 sm:text-[0.68rem]">{item.l}</p>
                </div>
              ))}
            </div>
          </div>

          {applied && !submitted && (
            <div className="relative overflow-hidden rounded-[24px] border border-green-700/15 bg-white/85 p-5 shadow-[0_36px_80px_-44px_rgba(20,83,45,0.5)] backdrop-blur-sm sm:rounded-[32px] sm:p-10 lg:p-12">
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-700 via-[#7FB069] to-[#F2B33D]" />
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="flex-1">
                  <span className="inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-6 bg-green-700" />Application form</span>
                  <h2 className="hero-serif mt-4 text-[clamp(1.35rem,4.5vw,2rem)] font-bold leading-tight text-[#111111]">Apply: {applied.title}</h2>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.82rem] text-[#4A4A42]">
                    <span className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-green-700" />{applied.location}</span>
                    <span className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-green-700" />{applied.commitment}</span>
                  </div>
                </div>
                <button type="button" onClick={closeApplication} className="self-start text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42] transition-colors duration-200 hover:text-green-700">Cancel</button>
              </div>
              <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Full name <span className="text-[#E2703A]">*</span></label>
                    <input type="text" value={form.fullName} onChange={handleChange("fullName")} placeholder="e.g. Amina Wanjiku" autoComplete="name" className={`${inputClass} ${errors.fullName ? "border-[#E2703A]/60" : ""}`} />
                    {errors.fullName && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Phone number <span className="text-[#E2703A]">*</span></label>
                    <input type="tel" value={form.phone} onChange={handleChange("phone")} placeholder="+254 7xx xxx xxx" autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                    {errors.phone ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p> : <p className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70">We'll reach you by phone or WhatsApp.</p>}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Email address <span className="font-medium normal-case tracking-normal text-[#4A4A42]/60">(optional)</span></label>
                  <input type="email" value={form.email} onChange={handleChange("email")} placeholder="you@example.com" autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                  {errors.email ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p> : <p className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70">Not required. We'll use it only if you have one.</p>}
                </div>
                <div>
                  <label className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">When are you available? <span className="text-[#E2703A]">*</span></label>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {AVAILABILITY_OPTIONS.map((opt) => {
                      const active = form.availability === opt.id;
                      return (
                        <button key={opt.id} type="button" onClick={() => setForm((f) => ({ ...f, availability: opt.id }))} className={`rounded-xl border px-4 py-3.5 text-left text-[0.85rem] font-semibold transition-all duration-200 sm:py-3 ${active ? "border-green-700 bg-green-700/6 text-green-700" : "border-green-700/15 bg-white text-[#4A4A42] hover:border-green-700/40"}`}>{opt.label}</button>
                      );
                    })}
                  </div>
                  {errors.availability && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.availability}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Anything we should know? <span className="font-medium normal-case tracking-normal text-[#4A4A42]/60">(optional)</span></label>
                  <textarea value={form.note} onChange={handleChange("note")} rows={4} placeholder="Relevant experience, questions, or anything that would help us match you well." className="w-full resize-none rounded-xl border border-green-700/15 bg-white px-4 py-4 text-[1rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15 sm:py-3.5 sm:text-[0.92rem]" />
                </div>
                <div className="flex flex-col gap-4 border-t border-green-700/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="order-2 text-[0.75rem] leading-[1.6] text-[#4A4A42]/80 sm:order-1">By submitting, you agree to our volunteer code of conduct and safeguarding briefing.</p>
                  <button type="submit" className="order-1 inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-green-700 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] active:scale-[0.99] sm:order-2 sm:px-8 sm:py-[1.05rem] sm:text-[0.78rem]">Submit application</button>
                </div>
              </form>
            </div>
          )}

          {applied && submitted && (
            <div className="relative overflow-hidden rounded-[24px] border border-green-700/20 bg-green-700/6 p-6 sm:rounded-[32px] sm:p-12 lg:p-14">
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
                <div>
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">Application received</p>
                  <h2 className="hero-serif mt-3 text-[clamp(1.35rem,4.5vw,1.9rem)] font-bold leading-tight text-[#111111]">Thank you, {form.fullName.split(" ")[0]}.</h2>
                  <p className="mt-3 max-w-[560px] text-[0.95rem] leading-[1.8] text-[#4A4A42]">We've got your application for <span className="font-bold text-[#111111]">{applied.title}</span> at {applied.org}. Our volunteer coordinator will call <span className="font-semibold text-[#111111]">{form.phone}</span> within 48 hours{form.email ? `, or email ${form.email}` : ""} with next steps.</p>
                </div>
                <button type="button" onClick={closeApplication} className="inline-flex items-center rounded-xl border border-green-700/20 px-5 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white sm:px-6">Browse other roles</button>
              </div>
            </div>
          )}

          <div>
            <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="mb-3 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-8 bg-green-700" />Open opportunities</span>
                <h2 className="hero-serif text-[clamp(1.6rem,5.5vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#111111]">Browse and pick your fit.</h2>
              </div>
              {hasRoles && <p className="max-w-[360px] text-[0.95rem] leading-[1.75] text-[#4A4A42] sm:text-[0.98rem]">{filtered.length} role{filtered.length === 1 ? "" : "s"} matching your filters.</p>}
            </div>
            <div className="scrollbar-hide -mx-6 mb-8 flex gap-2.5 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              {VOL_FILTERS.map((f) => {
                const active = filter === f.id;
                return (
                  <button key={f.id} type="button" onClick={() => setFilter(f.id)} className={`flex-shrink-0 rounded-full border px-5 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${active ? "border-green-700 bg-green-700 text-white shadow-[0_12px_26px_-14px_rgba(20,83,45,0.9)]" : "border-green-700/20 bg-white/60 text-[#4A4A42] hover:border-green-700/50 hover:text-green-700"}`}>{f.label}</button>
                );
              })}
            </div>
            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-green-700/25 bg-white/50 p-10 text-center sm:p-12">
                <p className="hero-serif text-[1.2rem] font-bold text-[#111111] sm:text-[1.3rem]">{hasRoles ? "No roles match that filter right now." : "New opportunities are on the way."}</p>
                <p className="mt-2 text-[0.9rem] text-[#4A4A42]">{hasRoles ? "Try another filter — or check back soon, we post new roles regularly." : "We're preparing the next round of volunteer roles. Please check back frequently — new opportunities are added here as soon as they open."}</p>
                {!hasRoles && <a href="mailto:volunteer@mkcdp.org?subject=Notify%20me%20about%20new%20volunteer%20roles" className="mt-6 inline-flex items-center rounded-xl bg-green-700 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A]">Get notified</a>}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {filtered.map((role) => <OpportunityCard key={role.id} role={role} onApply={handleApply} />)}
              </div>
            )}
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-green-700 px-5 py-14 sm:px-14 sm:py-16 lg:px-20 lg:py-24">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.55]" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(251,247,240,0.09) 0px, rgba(251,247,240,0.09) 1px, transparent 1px, transparent 22px)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)", maskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)" }} />
            <div className="relative">
              <div className="mb-10 max-w-[680px] sm:mb-14">
                <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]"><span className="h-px w-8 bg-[#F2B33D]" />How it works</span>
                <h2 className="hero-serif text-[clamp(1.6rem,5.5vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#FBF7F0]">From application to impact in four steps.</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {VOL_STEPS.map((step) => (
                  <div key={step.n} className="rounded-2xl border border-[#FBF7F0]/12 bg-[#FBF7F0]/5 p-5 transition-colors duration-300 hover:border-[#FBF7F0]/30 hover:bg-[#FBF7F0]/8 sm:p-6">
                    <span className="hero-serif text-[2rem] font-bold leading-none text-[#F2B33D]/50 sm:text-[2.4rem]">{step.n}</span>
                    <p className="hero-serif mt-3 text-[1.1rem] font-bold leading-tight text-[#FBF7F0] sm:text-[1.15rem]">{step.title}</p>
                    <p className="mt-3 text-[0.88rem] leading-[1.7] text-[#FBF7F0]/65">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-8 bg-green-700" />What to expect</span>
              <h2 className="hero-serif text-[clamp(1.6rem,5.5vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#111111]">We take volunteering seriously — yours and ours.</h2>
              <p className="mt-6 max-w-[480px] text-[0.95rem] leading-[1.8] text-[#4A4A42] sm:mt-7 sm:text-[1rem]">Every volunteer is safeguarded, briefed, and set up for success. Here's what you can expect from us.</p>
              <div className="mt-8 space-y-4 sm:mt-10">
                {["Safeguarding briefing and background check where required by law", "A named buddy who answers questions during your first weeks", "Clear deliverables and a regular check-in cadence", "A written reference and certificate at the end of your service", "Reasonable field expenses covered for on-site roles"].map((line) => (
                  <div key={line} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-700" />
                    <p className="text-[0.92rem] leading-[1.75] text-[#4A4A42]">{line}</p>
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
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-6 bg-green-700" />Volunteer with MKCDP</span>
            <h1 className="hero-serif text-[2.1rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111]">Give an hour. <span className="italic text-green-700">Change a childhood.</span></h1>
            <p className="mt-4 text-[0.95rem] leading-[1.8] text-[#4A4A42]">Whether you can teach maths on Saturday, translate a letter, or photograph a field visit — there is a role here that needs exactly your skills.</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[{ v: String(OPPORTUNITIES.length), l: "Open roles" }, { v: "Flexible", l: "Commitment" }].map((item) => (
                <div key={item.l} className="rounded-2xl border border-green-700/12 bg-white/70 p-4">
                  <p className="hero-serif text-[1.3rem] font-bold leading-none text-green-700">{item.v}</p>
                  <p className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/80">{item.l}</p>
                </div>
              ))}
            </div>
          </div>

          {applied && !submitted && (
            <div className="relative overflow-hidden rounded-3xl border border-green-700/15 bg-white/85 p-5 shadow-[0_28px_60px_-40px_rgba(20,83,45,0.5)]">
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-700 via-[#7FB069] to-[#F2B33D]" />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-5 bg-green-700" />Application form</span>
                  <h2 className="hero-serif mt-3 text-[1.4rem] font-bold leading-tight text-[#111111]">Apply: {applied.title}</h2>
                  <p className="mt-2 text-[0.8rem] text-[#4A4A42]">{applied.location} · {applied.commitment}</p>
                </div>
                <button type="button" onClick={closeApplication} className="flex-shrink-0 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Cancel</button>
              </div>
              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Full name <span className="text-[#E2703A]">*</span></label>
                  <input type="text" value={form.fullName} onChange={handleChange("fullName")} placeholder="e.g. Amina Wanjiku" autoComplete="name" className={`${inputClass} ${errors.fullName ? "border-[#E2703A]/60" : ""}`} />
                  {errors.fullName && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Phone number <span className="text-[#E2703A]">*</span></label>
                  <input type="tel" value={form.phone} onChange={handleChange("phone")} placeholder="+254 7xx xxx xxx" autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                  {errors.phone ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p> : <p className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70">We'll reach you by phone or WhatsApp.</p>}
                </div>
                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Email address <span className="font-medium normal-case tracking-normal text-[#4A4A42]/60">(optional)</span></label>
                  <input type="email" value={form.email} onChange={handleChange("email")} placeholder="you@example.com" autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                  {errors.email && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p>}
                </div>
                <div>
                  <label className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">When are you available? <span className="text-[#E2703A]">*</span></label>
                  <div className="space-y-2.5">
                    {AVAILABILITY_OPTIONS.map((opt) => {
                      const active = form.availability === opt.id;
                      return (
                        <button key={opt.id} type="button" onClick={() => setForm((f) => ({ ...f, availability: opt.id }))} className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left text-[0.88rem] font-semibold transition-all duration-200 ${active ? "border-green-700 bg-green-700/6 text-green-700 ring-1 ring-green-700" : "border-green-700/15 bg-white text-[#4A4A42]"}`}>
                          <span>{opt.label}</span>
                          <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${active ? "bg-green-700" : "bg-green-700/20"}`} />
                        </button>
                      );
                    })}
                  </div>
                  {errors.availability && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.availability}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Anything we should know? <span className="font-medium normal-case tracking-normal text-[#4A4A42]/60">(optional)</span></label>
                  <textarea value={form.note} onChange={handleChange("note")} rows={4} placeholder="Relevant experience, questions, or anything that would help us match you well." className="w-full resize-none rounded-xl border border-green-700/15 bg-white px-4 py-4 text-[1rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15" />
                </div>
                <button type="submit" className="w-full rounded-xl bg-green-700 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] active:scale-[0.99]">Submit application</button>
                <p className="text-[0.72rem] leading-[1.6] text-[#4A4A42]/80">By submitting, you agree to our volunteer code of conduct and safeguarding briefing.</p>
              </form>
            </div>
          )}

          {applied && submitted && (
            <div className="rounded-3xl border border-green-700/20 bg-green-700/6 p-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700">Application received</p>
              <h2 className="hero-serif mt-3 text-[1.5rem] font-bold leading-tight text-[#111111]">Thank you, {form.fullName.split(" ")[0]}.</h2>
              <p className="mt-3 text-[0.9rem] leading-[1.8] text-[#4A4A42]">We've got your application for <span className="font-bold text-[#111111]">{applied.title}</span> at {applied.org}. Our volunteer coordinator will call <span className="font-semibold text-[#111111]">{form.phone}</span> within 48 hours{form.email ? `, or email ${form.email}` : ""} with next steps.</p>
              <button type="button" onClick={closeApplication} className="mt-6 w-full rounded-xl border border-green-700/20 px-5 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700">Browse other roles</button>
            </div>
          )}

          <div>
            <span className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-6 bg-green-700" />Open opportunities</span>
            <h2 className="hero-serif text-[1.8rem] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111]">Browse and pick your fit.</h2>
            <div className="scrollbar-hide -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-1">
              {VOL_FILTERS.map((f) => {
                const active = filter === f.id;
                return (
                  <button key={f.id} type="button" onClick={() => setFilter(f.id)} className={`flex-shrink-0 rounded-full border px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${active ? "border-green-700 bg-green-700 text-white" : "border-green-700/20 bg-white text-[#4A4A42]"}`}>{f.label}</button>
                );
              })}
            </div>
            <div className="mt-6 space-y-5">
              {filtered.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-green-700/25 bg-white/50 p-8 text-center">
                  <p className="hero-serif text-[1.2rem] font-bold text-[#111111]">{hasRoles ? "No roles match that filter right now." : "New opportunities are on the way."}</p>
                  <p className="mt-2 text-[0.88rem] leading-[1.7] text-[#4A4A42]">{hasRoles ? "Try another filter — or check back soon, we post new roles regularly." : "We're preparing the next round of volunteer roles. New opportunities are added here as soon as they open."}</p>
                  {!hasRoles && <a href="mailto:volunteer@mkcdp.org?subject=Notify%20me%20about%20new%20volunteer%20roles" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-green-700 px-6 py-4 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white active:scale-[0.99]">Get notified</a>}
                </div>
              ) : (
                filtered.map((role) => <MobileOpportunityCard key={role.id} role={role} onApply={handleApply} />)
              )}
            </div>
          </div>

          <div className="-mx-5 bg-green-700 px-5 py-14">
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]"><span className="h-px w-6 bg-[#F2B33D]" />How it works</span>
            <h2 className="hero-serif text-[1.8rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#FBF7F0]">From application to impact in four steps.</h2>
            <div className="relative mt-8 space-y-5 before:absolute before:bottom-2 before:left-[1.05rem] before:top-2 before:w-px before:bg-[#FBF7F0]/15">
              {VOL_STEPS.map((step) => (
                <div key={step.n} className="relative flex gap-4">
                  <span className="z-10 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-[#F2B33D] text-[0.68rem] font-bold text-[#1C6B4B]">{step.n}</span>
                  <div className="rounded-2xl border border-[#FBF7F0]/12 bg-[#FBF7F0]/5 p-4">
                    <p className="hero-serif text-[1.05rem] font-bold leading-tight text-[#FBF7F0]">{step.title}</p>
                    <p className="mt-2 text-[0.85rem] leading-[1.7] text-[#FBF7F0]/65">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-6 bg-green-700" />What to expect</span>
            <h2 className="hero-serif text-[1.8rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111]">We take volunteering seriously — yours and ours.</h2>
            <div className="mt-6 space-y-4">
              {["Safeguarding briefing and background check where required by law", "A named buddy who answers questions during your first weeks", "Clear deliverables and a regular check-in cadence", "A written reference and certificate at the end of your service", "Reasonable field expenses covered for on-site roles"].map((line) => (
                <div key={line} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-700" />
                  <p className="text-[0.9rem] leading-[1.75] text-[#4A4A42]">{line}</p>
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
  const [form, setForm] = useState({ org: "", contact: "", email: "", phone: "", type: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.org.trim()) next.org = "Please enter your organisation name.";
    if (!form.contact.trim()) next.contact = "Please enter a contact name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.phone && !/^\+?[\d\s()-]{7,20}$/.test(form.phone)) next.phone = "Enter a valid phone number or leave blank.";
    if (!form.type) next.type = "Please choose a partnership type.";
    setErrors(next);
    if (Object.keys(next).length === 0) setSubmitted(true);
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
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">Enquiry received</p>
                <h2 className="hero-serif mt-3 text-[clamp(1.35rem,4.5vw,2rem)] font-bold leading-tight text-[#111111]">Thank you, {form.contact.split(" ")[0]}.</h2>
                <p className="mt-3 max-w-[560px] text-[0.95rem] leading-[1.8] text-[#4A4A42]">We've received your enquiry on behalf of <span className="font-bold text-[#111111]">{form.org}</span>. Our partnerships team will reply to <span className="font-semibold text-[#111111]">{form.email}</span> within two working days with next steps.</p>
              </div>
              <button type="button" onClick={reset} className="inline-flex items-center rounded-xl border border-green-700/20 px-5 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white sm:px-6">Send another</button>
            </div>
          </div>
        </div>
        <div className="lg:hidden">
          <div className="rounded-3xl border border-green-700/20 bg-green-700/6 p-6">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700">Enquiry received</p>
            <h2 className="hero-serif mt-3 text-[1.5rem] font-bold leading-tight text-[#111111]">Thank you, {form.contact.split(" ")[0]}.</h2>
            <p className="mt-3 text-[0.9rem] leading-[1.8] text-[#4A4A42]">We've received your enquiry on behalf of <span className="font-bold text-[#111111]">{form.org}</span>. Our partnerships team will reply to <span className="font-semibold text-[#111111]">{form.email}</span> within two working days with next steps.</p>
            <button type="button" onClick={reset} className="mt-6 w-full rounded-xl border border-green-700/20 px-5 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700">Send another enquiry</button>
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
            <span className="inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-6 bg-green-700" />Start a conversation</span>
            <h2 className="hero-serif mt-4 text-[clamp(1.6rem,5.5vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111]">Tell us about your organisation.</h2>
            <p className="mt-5 text-[0.95rem] leading-[1.8] text-[#4A4A42] sm:text-[0.98rem]">A short form is all we need. No commitment. Our team will reply within two working days with ideas that fit your goals.</p>
          </div>
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Organisation <span className="text-[#E2703A]">*</span></label>
                <input type="text" value={form.org} onChange={handleChange("org")} placeholder="e.g. Acacia Foundation" className={`${inputClass} ${errors.org ? "border-[#E2703A]/60" : ""}`} />
                {errors.org && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.org}</p>}
              </div>
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Contact person <span className="text-[#E2703A]">*</span></label>
                <input type="text" value={form.contact} onChange={handleChange("contact")} placeholder="e.g. Amina Wanjiku" className={`${inputClass} ${errors.contact ? "border-[#E2703A]/60" : ""}`} />
                {errors.contact && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.contact}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Email address <span className="text-[#E2703A]">*</span></label>
                <input type="email" value={form.email} onChange={handleChange("email")} placeholder="you@organisation.com" autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                {errors.email && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Phone number <span className="font-medium normal-case tracking-normal text-[#4A4A42]/60">(optional)</span></label>
                <input type="tel" value={form.phone} onChange={handleChange("phone")} placeholder="+254 7xx xxx xxx" autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                {errors.phone && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p>}
              </div>
            </div>
            <div>
              <label className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Partnership type <span className="text-[#E2703A]">*</span></label>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {PARTNER_TYPES.map((opt) => {
                  const active = form.type === opt.title;
                  return (
                    <button key={opt.title} type="button" onClick={() => setForm((f) => ({ ...f, type: opt.title }))} className={`rounded-xl border px-4 py-3.5 text-left text-[0.85rem] font-semibold transition-all duration-200 sm:py-3 ${active ? "border-green-700 bg-green-700/6 text-green-700" : "border-green-700/15 bg-white text-[#4A4A42] hover:border-green-700/40"}`}>{opt.title}</button>
                  );
                })}
              </div>
              {errors.type && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.type}</p>}
            </div>
            <div>
              <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Anything else we should know? <span className="font-medium normal-case tracking-normal text-[#4A4A42]/60">(optional)</span></label>
              <textarea value={form.message} onChange={handleChange("message")} rows={4} placeholder="Tell us about your goals, budget range, or the programmes you're most interested in." className="w-full resize-none rounded-xl border border-green-700/15 bg-white px-4 py-4 text-[1rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15 sm:py-3.5 sm:text-[0.92rem]" />
            </div>
            <div className="flex flex-col gap-4 border-t border-green-700/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="order-2 text-[0.75rem] leading-[1.6] text-[#4A4A42]/80 sm:order-1">We treat every enquiry in confidence and reply within two working days.</p>
              <button type="submit" className="order-1 inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-green-700 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] active:scale-[0.99] sm:order-2 sm:px-8 sm:py-[1.05rem] sm:text-[0.78rem]">Send enquiry</button>
            </div>
          </form>
        </div>
      </div>

      <div className="lg:hidden">
        <div>
          <span className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-5 bg-green-700" />Start a conversation</span>
          <h2 className="hero-serif mt-3 text-[1.8rem] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111]">Tell us about your organisation.</h2>
          <p className="mt-4 text-[0.92rem] leading-[1.8] text-[#4A4A42]">A short form is all we need. No commitment. Our team will reply within two working days with ideas that fit your goals.</p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
          <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.45)]">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">1 · Organisation</p>
            <div className="mt-4 space-y-5">
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Organisation <span className="text-[#E2703A]">*</span></label>
                <input type="text" value={form.org} onChange={handleChange("org")} placeholder="e.g. Acacia Foundation" className={`${inputClass} ${errors.org ? "border-[#E2703A]/60" : ""}`} />
                {errors.org && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.org}</p>}
              </div>
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Contact person <span className="text-[#E2703A]">*</span></label>
                <input type="text" value={form.contact} onChange={handleChange("contact")} placeholder="e.g. Amina Wanjiku" className={`${inputClass} ${errors.contact ? "border-[#E2703A]/60" : ""}`} />
                {errors.contact && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.contact}</p>}
              </div>
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Email address <span className="text-[#E2703A]">*</span></label>
                <input type="email" value={form.email} onChange={handleChange("email")} placeholder="you@organisation.com" autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                {errors.email && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Phone number <span className="font-medium normal-case tracking-normal text-[#4A4A42]/60">(optional)</span></label>
                <input type="tel" value={form.phone} onChange={handleChange("phone")} placeholder="+254 7xx xxx xxx" autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                {errors.phone && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p>}
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.45)]">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">2 · Partnership type <span className="text-[#E2703A]">*</span></p>
            <div className="mt-4 space-y-2.5">
              {PARTNER_TYPES.map((opt) => {
                const active = form.type === opt.title;
                return (
                  <button key={opt.title} type="button" onClick={() => setForm((f) => ({ ...f, type: opt.title }))} className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left text-[0.88rem] font-semibold transition-all duration-200 ${active ? "border-green-700 bg-green-700/6 text-green-700 ring-1 ring-green-700" : "border-green-700/15 bg-white text-[#4A4A42]"}`}>
                    <span>{opt.title}</span>
                    <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${active ? "bg-green-700" : "bg-green-700/20"}`} />
                  </button>
                );
              })}
            </div>
            {errors.type && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.type}</p>}
          </div>
          <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.45)]">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">3 · Anything else</p>
            <textarea value={form.message} onChange={handleChange("message")} rows={4} placeholder="Tell us about your goals, budget range, or the programmes you're most interested in." className="mt-4 w-full resize-none rounded-xl border border-green-700/15 bg-white px-4 py-4 text-[1rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15" />
          </div>
          <button type="submit" className="w-full rounded-xl bg-green-700 px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] active:scale-[0.99]">Send enquiry</button>
          <p className="text-[0.72rem] leading-[1.6] text-[#4A4A42]/80">We treat every enquiry in confidence and reply within two working days.</p>
        </form>
      </div>
    </>
  );
}

function ReportSafeguarding() {
  const [form, setForm] = useState({ reporterType: "", fullName: "", phone: "", email: "", relationship: "", childName: "", location: "", concerns: [], urgency: "", description: "", contactPreference: "", anonymous: false, acknowledged: false });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const toggleConcern = (id) => {
    setForm((f) => {
      const has = f.concerns.includes(id);
      return { ...f, concerns: has ? f.concerns.filter((c) => c !== id) : [...f.concerns, id] };
    });
  };
  const handleSubmit = (e) => {
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
    if (Object.keys(next).length === 0) setSubmitted(true);
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
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">Report received</p>
                  <h2 className="hero-serif mt-3 text-[clamp(1.35rem,4.5vw,2rem)] font-bold leading-tight text-[#111111]">Thank you for speaking up.</h2>
                  <p className="mt-3 max-w-[620px] text-[0.95rem] leading-[1.8] text-[#4A4A42]">Your report has reached our safeguarding team. Every concern is handled in strict confidence, reviewed within 24 hours, and acted on in line with our safeguarding policy and Kenyan child protection law. If you left contact details, we will reach out — but only in the way you asked us to.</p>
                </div>
                <button type="button" onClick={reset} className="inline-flex items-center rounded-xl border border-green-700/20 px-5 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white sm:px-6">Make another report</button>
              </div>
            </div>
            <div>
              <SectionHeading eyebrow="If you need help right now" title="These lines are free and always open." intro="If a child is in immediate danger, please do not wait for us. Call one of these numbers now." />
              <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-5">
                {HELPLINES.map((h) => (
                  <a key={h.number} href={h.href} className={`group flex flex-col rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 sm:p-6 ${h.primary ? "border-green-700 bg-green-700 text-white shadow-[0_24px_60px_-40px_rgba(20,83,45,0.6)]" : "border-green-700/15 bg-white/70 hover:border-green-700/40"}`}>
                    <span className={`text-[0.68rem] font-bold uppercase tracking-[0.16em] ${h.primary ? "text-white/70" : "text-green-700"}`}>{h.name}</span>
                    <span className={`hero-serif mt-3 text-[2rem] font-bold leading-none ${h.primary ? "text-white" : "text-[#111111]"}`}>{h.number}</span>
                    <span className={`mt-3 text-[0.85rem] leading-[1.7] ${h.primary ? "text-white/80" : "text-[#4A4A42]"}`}>{h.note}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:hidden">
          <div className="space-y-10">
            <div className="rounded-3xl border border-green-700/20 bg-green-700/6 p-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700">Report received</p>
              <h2 className="hero-serif mt-3 text-[1.5rem] font-bold leading-tight text-[#111111]">Thank you for speaking up.</h2>
              <p className="mt-3 text-[0.9rem] leading-[1.8] text-[#4A4A42]">Your report has reached our safeguarding team. Every concern is reviewed within 24 hours and handled in strict confidence. If you left contact details, we will reach out — but only in the way you asked us to.</p>
              <button type="button" onClick={reset} className="mt-6 w-full rounded-xl border border-green-700/20 px-5 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700">Make another report</button>
            </div>
            <div>
              <span className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-6 bg-green-700" />If you need help right now</span>
              <h2 className="hero-serif text-[1.6rem] font-bold leading-[1.12] text-[#111111]">These lines are free and always open.</h2>
              <div className="mt-6 space-y-3">
                {HELPLINES.map((h) => (
                  <a key={h.number} href={h.href} className={`flex items-center justify-between gap-4 rounded-2xl border p-5 active:scale-[0.99] ${h.primary ? "border-green-700 bg-green-700 text-white" : "border-green-700/15 bg-white/70"}`}>
                    <span>
                      <span className={`block text-[0.65rem] font-bold uppercase tracking-[0.16em] ${h.primary ? "text-white/70" : "text-green-700"}`}>{h.name}</span>
                      <span className={`mt-1 block text-[0.8rem] leading-[1.6] ${h.primary ? "text-white/80" : "text-[#4A4A42]"}`}>{h.note}</span>
                    </span>
                    <span className={`hero-serif flex-shrink-0 text-[1.6rem] font-bold leading-none ${h.primary ? "text-[#F2B33D]" : "text-green-700"}`}>{h.number}</span>
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
              <span className="mb-5 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-green-700"><span className="h-px w-8 bg-green-700" />Report a Safeguarding Concern</span>
              <h1 className="hero-serif text-[clamp(1.9rem,6.5vw,3.8rem)] font-bold leading-[1.05] tracking-[-0.028em] text-[#111111]">If something worries you,<br /><span className="italic text-green-700">please tell us.</span></h1>
              <p className="mt-6 max-w-[520px] text-[1rem] leading-[1.8] text-[#4A4A42] sm:mt-8 sm:text-[1.0625rem]">Every concern — big or small, certain or unsure — is taken seriously. You can report anonymously. You can report on behalf of someone else. What matters is that a child is safer because you spoke up.</p>
              <div className="mt-8 grid grid-cols-3 gap-3 sm:mt-10 sm:gap-4">
                {[{ t: "Confidential", d: "Small team" }, { t: "Reviewed", d: "24 hours" }, { t: "Protected", d: "Anonymous OK" }].map((item) => (
                  <div key={item.t} className="rounded-2xl border border-green-700/12 bg-white/60 p-3 sm:p-4">
                    <span className="block h-1 w-7 rounded-full bg-green-700/70" />
                    <p className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-green-700 sm:mt-3 sm:text-[0.72rem]">{item.t}</p>
                    <p className="mt-0.5 text-[0.75rem] leading-snug text-[#4A4A42] sm:mt-1 sm:text-[0.82rem]">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[24px] border border-green-700/12 bg-green-700 p-6 text-white shadow-[0_28px_60px_-34px_rgba(20,83,45,0.6)] sm:rounded-[28px] sm:p-10">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.4]" style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(251,247,240,0.09) 0px, rgba(251,247,240,0.09) 1px, transparent 1px, transparent 22px)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)", maskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)" }} />
              <div className="relative">
                <span className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]"><span className="h-px w-6 bg-[#F2B33D]" />If a child is in danger now</span>
                <h2 className="hero-serif text-[clamp(1.4rem,4.5vw,2rem)] font-bold leading-tight text-white">Do not wait. Call now.</h2>
                <p className="mt-4 max-w-[420px] text-[0.92rem] leading-[1.8] text-white/75">These national lines are free, confidential and open 24 hours a day. They are trained to help children and the adults who care about them.</p>
                <div className="mt-6 space-y-3 sm:mt-8">
                  {HELPLINES.map((h) => (
                    <a key={h.number} href={h.href} className="group flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 p-4 transition-all duration-300 hover:border-white/40 hover:bg-white/10 sm:p-5">
                      <div>
                        <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/70 sm:text-[0.68rem]">{h.name}</p>
                        <p className="mt-1 text-[0.82rem] text-white/80 sm:text-[0.85rem]">{h.note}</p>
                      </div>
                      <span className="hero-serif flex-shrink-0 text-[1.4rem] font-bold leading-none text-[#F2B33D] sm:text-[1.5rem]">{h.number}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-green-700/12 bg-white/55 p-5 sm:p-12 lg:p-14">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
              <div className="lg:sticky lg:top-40 lg:self-start">
                <SectionHeading eyebrow="How we handle your report" title="What happens after you press send." intro="We follow a clear, confidential process for every concern. These are the four things that happen next." />
                <ul className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
                  {[
                    { t: "Your report is received", b: "It lands directly with our designated Safeguarding Lead — and no one else. Not the wider team, not the person being reported." },
                    { t: "We assess the risk within 24 hours", b: "A small group reviews the concern, decides on the immediate steps needed to keep the child safe, and agrees what further action to take." },
                    { t: "We act, in line with the law", b: "Depending on what we find, we may involve the child's guardian, the county child protection unit, the police, or other authorities — always in the best interests of the child." },
                    { t: "We close the loop with you", b: "If you left contact details, we will update you on what was done — while keeping the child's identity and rights fully protected." },
                  ].map((step, i) => (
                    <li key={step.t} className="flex items-start gap-4 sm:gap-5">
                      <span className="mt-0.5 grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-green-700 text-[0.68rem] font-bold text-white sm:h-9 sm:w-9 sm:text-[0.72rem]">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <p className="hero-serif text-[1rem] font-bold text-[#111111] sm:text-[1.05rem]">{step.t}</p>
                        <p className="mt-2 text-[0.9rem] leading-[1.8] text-[#4A4A42]">{step.b}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 rounded-2xl border border-[#E2703A]/25 border-l-2 border-l-[#E2703A] bg-[#E2703A]/5 p-4 sm:mt-10 sm:p-5">
                  <p className="text-[0.92rem] font-bold text-[#111111]">Please do not investigate yourself.</p>
                  <p className="mt-1 text-[0.88rem] leading-[1.75] text-[#4A4A42]">If you suspect abuse, do not question the child, do not contact the person suspected, and do not try to gather evidence. Just tell us what you saw or heard, and let our trained team take it from there.</p>
                </div>
              </div>
              <form onSubmit={handleSubmit} noValidate className="relative rounded-[24px] border border-green-700/12 bg-white/85 p-5 shadow-[0_36px_80px_-44px_rgba(20,83,45,0.45)] backdrop-blur-sm sm:rounded-[28px] sm:p-8 lg:p-10">
                <div className="rounded-2xl border border-green-700/12 border-l-2 border-l-green-700 bg-green-700/5 p-4">
                  <p className="text-[0.85rem] leading-[1.7] text-[#4A4A42]">Your report goes straight to the Safeguarding Lead. We do not share it with anyone else, and we never reveal who reported a concern.</p>
                </div>
                <div className="mt-7 space-y-6 sm:mt-8">
                  <div>
                    <label className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Who are you? <span className="text-[#E2703A]">*</span></label>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                      {REPORT_RELATIONSHIPS.map((opt) => (
                        <button key={opt} type="button" onClick={() => setForm((f) => ({ ...f, reporterType: opt }))} className={optionRowClass(form.reporterType === opt)}>{opt}</button>
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
                      <span className="block text-[0.88rem] font-semibold text-[#111111]">I want to report this anonymously</span>
                      <span className="mt-1 block text-[0.78rem] leading-[1.6] text-[#4A4A42]/80">We will still act on your report. We just won't be able to follow up with you.</span>
                    </span>
                  </label>

                  {!form.anonymous && (
                    <>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                        <div>
                          <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Your name <span className="text-[#E2703A]">*</span></label>
                          <input type="text" value={form.fullName} onChange={handleChange("fullName")} placeholder="e.g. Amina Wanjiku" autoComplete="name" className={`${inputClass} ${errors.fullName ? "border-[#E2703A]/60" : ""}`} />
                          {errors.fullName && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.fullName}</p>}
                        </div>
                        <div>
                          <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Phone number</label>
                          <input type="tel" value={form.phone} onChange={handleChange("phone")} placeholder="+254 7xx xxx xxx" autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                          {errors.phone && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Email address</label>
                        <input type="email" value={form.email} onChange={handleChange("email")} placeholder="you@example.com" autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                        {errors.email && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p>}
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Your relationship to the child <span className="text-[#E2703A]">*</span></label>
                      <input type="text" value={form.relationship} onChange={handleChange("relationship")} placeholder="e.g. Teacher, aunt, neighbour" className={`${inputClass} ${errors.relationship ? "border-[#E2703A]/60" : ""}`} />
                      {errors.relationship && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.relationship}</p>}
                    </div>
                    <div>
                      <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Where did this happen? <span className="text-[#E2703A]">*</span></label>
                      <input type="text" value={form.location} onChange={handleChange("location")} placeholder="e.g. Loitokitok, Kimana" className={`${inputClass} ${errors.location ? "border-[#E2703A]/60" : ""}`} />
                      {errors.location && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.location}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Child's name <span className="font-medium normal-case tracking-normal text-[#4A4A42]/60">(optional)</span></label>
                    <input type="text" value={form.childName} onChange={handleChange("childName")} placeholder="First name or nickname is enough" className={inputClass} />
                  </div>
                  <div>
                    <label className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">What kind of concern is this? <span className="text-[#E2703A]">*</span></label>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {REPORT_CONCERNS.map((c) => (
                        <button key={c.id} type="button" onClick={() => toggleConcern(c.id)} className={optionRowClass(form.concerns.includes(c.id))}>{c.label}</button>
                      ))}
                    </div>
                    {errors.concerns && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.concerns}</p>}
                  </div>
                  <div>
                    <label className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">How urgent is this? <span className="text-[#E2703A]">*</span></label>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                      {REPORT_URGENCY.map((u) => {
                        const active = form.urgency === u.id;
                        const isImmediate = u.id === "immediate";
                        return (
                          <button key={u.id} type="button" onClick={() => setForm((f) => ({ ...f, urgency: u.id }))} className={`rounded-xl border px-4 py-3.5 text-left transition-all duration-200 sm:py-3.5 ${active ? isImmediate ? "border-[#E2703A] bg-[#E2703A]/8" : "border-green-700 bg-green-700/6" : "border-green-700/15 bg-white hover:border-green-700/40"}`}>
                            <span className={`block text-[0.88rem] font-bold ${active ? isImmediate ? "text-[#E2703A]" : "text-green-700" : "text-[#111111]"}`}>{u.label}</span>
                            <span className="mt-0.5 block text-[0.7rem] leading-snug text-[#4A4A42]/80">{u.hint}</span>
                          </button>
                        );
                      })}
                    </div>
                    {errors.urgency && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.urgency}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Tell us what happened <span className="text-[#E2703A]">*</span></label>
                    <textarea value={form.description} onChange={handleChange("description")} rows={6} placeholder="Describe what you saw, heard or were told — as clearly as you can. Please write in your own words; you do not need to be certain." className={`w-full resize-none rounded-xl border bg-white px-4 py-4 text-[1rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:ring-2 sm:py-3.5 sm:text-[0.92rem] ${errors.description ? "border-[#E2703A]/60 focus:border-[#E2703A] focus:ring-[#E2703A]/20" : "border-green-700/15 focus:border-green-700 focus:ring-green-700/15"}`} />
                    {errors.description ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.description}</p> : <p className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70">A short paragraph is enough. You are not expected to be certain or complete.</p>}
                  </div>
                  <div>
                    <label className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">How may we contact you? <span className="text-[#E2703A]">*</span></label>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                      {REPORT_CONTACT.map((c) => (
                        <button key={c.id} type="button" onClick={() => setForm((f) => ({ ...f, contactPreference: c.id }))} className={optionRowClass(form.contactPreference === c.id)}>{c.label}</button>
                      ))}
                    </div>
                    {errors.contactPreference && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.contactPreference}</p>}
                  </div>
                  <label htmlFor="acknowledged" className="group flex cursor-pointer items-start gap-3.5 rounded-xl border border-green-700/12 bg-white/55 p-4 transition-colors duration-200 hover:border-green-700/25 hover:bg-white/85">
                    <span className="relative mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center">
                      <input id="acknowledged" type="checkbox" checked={form.acknowledged} onChange={(e) => setForm((f) => ({ ...f, acknowledged: e.target.checked }))} className="peer sr-only" />
                      <span className={`h-5 w-5 rounded-md border transition-all duration-200 ${form.acknowledged ? "border-green-700 bg-green-700" : errors.acknowledged ? "border-[#E2703A]/60 bg-white" : "border-green-700/25 bg-white"}`} />
                    </span>
                    <span className="text-[0.82rem] leading-[1.7] text-[#4A4A42]">I understand that this report will be handled confidentially by the MKCDP Safeguarding Lead, may be shared with child protection authorities where required by law, and that deliberately false reports are not acceptable.</span>
                  </label>
                  {errors.acknowledged && <p className="-mt-3 text-[0.75rem] font-medium text-[#E2703A]">{errors.acknowledged}</p>}
                </div>
                <button type="submit" className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#E2703A] px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_20px_40px_-18px_rgba(226,112,58,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c95c2b] active:scale-[0.99] sm:mt-9 sm:px-8 sm:py-[1.15rem]">Submit confidential report</button>
                <p className="mt-5 border-l-2 border-green-700/40 pl-4 text-[0.78rem] leading-[1.7] text-[#4A4A42]/80">If a child is in immediate danger, please do not wait for this form. Call <a href="tel:116" className="font-bold text-green-700 underline decoration-green-700/30 underline-offset-4 hover:decoration-green-700">116</a> (Childline Kenya) or <a href="tel:999" className="font-bold text-green-700 underline decoration-green-700/30 underline-offset-4 hover:decoration-green-700">999</a> (Police).</p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="space-y-12">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-6 bg-green-700" />Report a Safeguarding Concern</span>
            <h1 className="hero-serif text-[2rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111]">If something worries you, <span className="italic text-green-700">please tell us.</span></h1>
            <p className="mt-4 text-[0.95rem] leading-[1.8] text-[#4A4A42]">Every concern — big or small, certain or unsure — is taken seriously. You can report anonymously, and you can report on behalf of someone else.</p>
            <div className="mt-6 grid grid-cols-3 divide-x divide-green-700/12 rounded-2xl border border-green-700/12 bg-white/60">
              {[{ t: "Confidential", d: "Small team" }, { t: "Reviewed", d: "24 hours" }, { t: "Protected", d: "Anonymous OK" }].map((item) => (
                <div key={item.t} className="px-3 py-4 text-center">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.12em] text-green-700">{item.t}</p>
                  <p className="mt-1 text-[0.72rem] text-[#4A4A42]">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="-mx-5 bg-green-700 px-5 py-10">
            <span className="mb-3 inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]"><span className="h-px w-5 bg-[#F2B33D]" />If a child is in danger now</span>
            <h2 className="hero-serif text-[1.5rem] font-bold leading-tight text-white">Do not wait. Tap to call.</h2>
            <div className="mt-6 space-y-3">
              {HELPLINES.map((h) => (
                <a key={h.number} href={h.href} className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 p-4 active:scale-[0.99] active:bg-white/10">
                  <span>
                    <span className="block text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/70">{h.name}</span>
                    <span className="mt-1 block text-[0.78rem] leading-[1.55] text-white/80">{h.note}</span>
                  </span>
                  <span className="hero-serif flex-shrink-0 text-[1.5rem] font-bold leading-none text-[#F2B33D]">{h.number}</span>
                </a>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-6 bg-green-700" />How we handle your report</span>
            <h2 className="hero-serif text-[1.7rem] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111]">What happens after you press send.</h2>
            <div className="relative mt-7 space-y-6 before:absolute before:bottom-2 before:left-[1.05rem] before:top-2 before:w-px before:bg-green-700/15">
              {[
                { t: "Your report is received", b: "It lands directly with our designated Safeguarding Lead — and no one else." },
                { t: "We assess the risk within 24 hours", b: "A small group reviews the concern and decides the steps needed to keep the child safe." },
                { t: "We act, in line with the law", b: "We may involve the child's guardian, the county child protection unit, or the police — always in the child's best interests." },
                { t: "We close the loop with you", b: "If you left contact details, we update you on what was done while protecting the child's identity." },
              ].map((step, i) => (
                <div key={step.t} className="relative flex gap-4">
                  <span className="z-10 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-green-700 text-[0.68rem] font-bold text-white">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="hero-serif text-[1rem] font-bold text-[#111111]">{step.t}</p>
                    <p className="mt-1.5 text-[0.88rem] leading-[1.75] text-[#4A4A42]">{step.b}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 rounded-2xl border border-[#E2703A]/25 border-l-2 border-l-[#E2703A] bg-[#E2703A]/5 p-4">
              <p className="text-[0.9rem] font-bold text-[#111111]">Please do not investigate yourself.</p>
              <p className="mt-1 text-[0.85rem] leading-[1.75] text-[#4A4A42]">Do not question the child, do not contact the person suspected, and do not gather evidence. Just tell us what you saw or heard.</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="rounded-2xl border border-green-700/12 border-l-2 border-l-green-700 bg-green-700/5 p-4">
              <p className="text-[0.85rem] leading-[1.7] text-[#4A4A42]">Your report goes straight to the Safeguarding Lead. We never reveal who reported a concern.</p>
            </div>
            <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">1 · Who are you? <span className="text-[#E2703A]">*</span></p>
              <div className="mt-4 space-y-2.5">
                {REPORT_RELATIONSHIPS.map((opt) => {
                  const active = form.reporterType === opt;
                  return (
                    <button key={opt} type="button" onClick={() => setForm((f) => ({ ...f, reporterType: opt }))} className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left text-[0.88rem] font-semibold transition-all duration-200 ${active ? "border-green-700 bg-green-700/6 text-green-700 ring-1 ring-green-700" : "border-green-700/15 bg-white text-[#4A4A42]"}`}>
                      <span>{opt}</span>
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
                  <span className="block text-[0.88rem] font-semibold text-[#111111]">I want to report this anonymously</span>
                  <span className="mt-1 block text-[0.76rem] leading-[1.6] text-[#4A4A42]/80">We will still act on your report. We just won't be able to follow up with you.</span>
                </span>
              </label>
            </div>
            {!form.anonymous && (
              <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">2 · Your details</p>
                <div className="mt-4 space-y-5">
                  <div>
                    <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Your name <span className="text-[#E2703A]">*</span></label>
                    <input type="text" value={form.fullName} onChange={handleChange("fullName")} placeholder="e.g. Amina Wanjiku" autoComplete="name" className={`${inputClass} ${errors.fullName ? "border-[#E2703A]/60" : ""}`} />
                    {errors.fullName && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Phone number</label>
                    <input type="tel" value={form.phone} onChange={handleChange("phone")} placeholder="+254 7xx xxx xxx" autoComplete="tel" inputMode="tel" className={`${inputClass} ${errors.phone ? "border-[#E2703A]/60" : ""}`} />
                    {errors.phone && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Email address</label>
                    <input type="email" value={form.email} onChange={handleChange("email")} placeholder="you@example.com" autoComplete="email" inputMode="email" className={`${inputClass} ${errors.email ? "border-[#E2703A]/60" : ""}`} />
                    {errors.email && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p>}
                  </div>
                </div>
              </div>
            )}
            <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">{!form.anonymous ? "3" : "2"} · The child &amp; the place</p>
              <div className="mt-4 space-y-5">
                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Your relationship to the child <span className="text-[#E2703A]">*</span></label>
                  <input type="text" value={form.relationship} onChange={handleChange("relationship")} placeholder="e.g. Teacher, aunt, neighbour" className={`${inputClass} ${errors.relationship ? "border-[#E2703A]/60" : ""}`} />
                  {errors.relationship && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.relationship}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Where did this happen? <span className="text-[#E2703A]">*</span></label>
                  <input type="text" value={form.location} onChange={handleChange("location")} placeholder="e.g. Loitokitok, Kimana" className={`${inputClass} ${errors.location ? "border-[#E2703A]/60" : ""}`} />
                  {errors.location && <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.location}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">Child's name <span className="font-medium normal-case tracking-normal text-[#4A4A42]/60">(optional)</span></label>
                  <input type="text" value={form.childName} onChange={handleChange("childName")} placeholder="First name or nickname is enough" className={inputClass} />
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">{!form.anonymous ? "4" : "3"} · Type of concern <span className="text-[#E2703A]">*</span></p>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {REPORT_CONCERNS.map((c) => {
                  const active = form.concerns.includes(c.id);
                  return (
                    <button key={c.id} type="button" onClick={() => toggleConcern(c.id)} className={`rounded-xl border px-3.5 py-3.5 text-left text-[0.82rem] font-semibold transition-all duration-200 ${active ? "border-green-700 bg-green-700/6 text-green-700 ring-1 ring-green-700" : "border-green-700/15 bg-white text-[#4A4A42]"}`}>{c.label}</button>
                  );
                })}
              </div>
              {errors.concerns && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.concerns}</p>}
              <p className="mt-6 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">How urgent is this? <span className="text-[#E2703A]">*</span></p>
              <div className="mt-3 space-y-2.5">
                {REPORT_URGENCY.map((u) => {
                  const active = form.urgency === u.id;
                  const isImmediate = u.id === "immediate";
                  return (
                    <button key={u.id} type="button" onClick={() => setForm((f) => ({ ...f, urgency: u.id }))} className={`w-full rounded-xl border px-4 py-4 text-left transition-all duration-200 ${active ? isImmediate ? "border-[#E2703A] bg-[#E2703A]/8 ring-1 ring-[#E2703A]" : "border-green-700 bg-green-700/6 ring-1 ring-green-700" : "border-green-700/15 bg-white"}`}>
                      <span className={`block text-[0.9rem] font-bold ${active ? isImmediate ? "text-[#E2703A]" : "text-green-700" : "text-[#111111]"}`}>{u.label}</span>
                      <span className="mt-0.5 block text-[0.72rem] leading-snug text-[#4A4A42]/80">{u.hint}</span>
                    </button>
                  );
                })}
              </div>
              {errors.urgency && <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.urgency}</p>}
            </div>
            <div className="rounded-3xl border border-green-700/12 bg-white/85 p-5">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">{!form.anonymous ? "5" : "4"} · What happened <span className="text-[#E2703A]">*</span></p>
              <textarea value={form.description} onChange={handleChange("description")} rows={6} placeholder="Describe what you saw, heard or were told — in your own words. You do not need to be certain." className={`mt-4 w-full resize-none rounded-xl border bg-white px-4 py-4 text-[1rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:ring-2 ${errors.description ? "border-[#E2703A]/60 focus:border-[#E2703A] focus:ring-[#E2703A]/20" : "border-green-700/15 focus:border-green-700 focus:ring-green-700/15"}`} />
              {errors.description ? <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.description}</p> : <p className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70">A short paragraph is enough.</p>}
              <p className="mt-6 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">How may we contact you? <span className="text-[#E2703A]">*</span></p>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {REPORT_CONTACT.map((c) => {
                  const active = form.contactPreference === c.id;
                  return (
                    <button key={c.id} type="button" onClick={() => setForm((f) => ({ ...f, contactPreference: c.id }))} className={`rounded-xl border px-3.5 py-3.5 text-left text-[0.82rem] font-semibold transition-all duration-200 ${active ? "border-green-700 bg-green-700/6 text-green-700 ring-1 ring-green-700" : "border-green-700/15 bg-white text-[#4A4A42]"}`}>{c.label}</button>
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
              <span className="text-[0.8rem] leading-[1.7] text-[#4A4A42]">I understand that this report will be handled confidentially by the MKCDP Safeguarding Lead, may be shared with child protection authorities where required by law, and that deliberately false reports are not acceptable.</span>
            </label>
            {errors.acknowledged && <p className="-mt-3 text-[0.75rem] font-medium text-[#E2703A]">{errors.acknowledged}</p>}
            <div className="sticky bottom-3 z-30">
              <button type="submit" className="w-full rounded-xl bg-[#E2703A] px-6 py-4 text-[0.82rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_20px_40px_-18px_rgba(226,112,58,0.9)] active:scale-[0.99]">Submit confidential report</button>
            </div>
            <p className="border-l-2 border-green-700/40 pl-4 text-[0.78rem] leading-[1.7] text-[#4A4A42]/80">If a child is in immediate danger, do not wait for this form. Call <a href="tel:116" className="font-bold text-green-700 underline decoration-green-700/30 underline-offset-4">116</a> (Childline Kenya) or <a href="tel:999" className="font-bold text-green-700 underline decoration-green-700/30 underline-offset-4">999</a> (Police).</p>
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
            <span className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-green-700"><span className="h-px w-8 bg-green-700" />Take Action</span>
            <h1 className="hero-serif text-[clamp(2rem,8vw,4.4rem)] font-bold leading-[1.05] tracking-[-0.022em] text-[#111111]">Change does not<br />happen by watching.<br /><span className="italic text-green-700">It happens by moving.</span></h1>
          </div>
          <div className="lg:pb-3">
            <p className="max-w-[520px] text-[0.98rem] leading-[1.85] text-[#3D3D37] sm:text-[1.0625rem]">Six ways to stand with the children and families we serve. Give monthly, give once, browse the gift marketplace, give your time, partner with us, or help keep a child safe. Every one of them changes a life — including, quietly, your own.</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-green-700/15 pt-6 sm:gap-x-10">
              {[{ v: "Six", l: "Ways to move" }, { v: "One", l: "Shared mission" }, { v: "Every", l: "Life changed counts" }].map((item) => (
                <div key={item.l}>
                  <p className="hero-serif text-[1.15rem] font-bold leading-none text-green-700 sm:text-[1.25rem]">{item.v}</p>
                  <p className="mt-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/75 sm:text-[0.68rem]">{item.l}</p>
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
  return (
    <>
      <div className="hidden lg:block">
        <TakeActionHero />
        <section className="relative py-14 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-14">
            <SectionHeading eyebrow="Choose your path" title="Six ways to move with us." intro="Give monthly, give once, browse the gift marketplace, give your time, partner with us, or help keep a child safe. Every one of them moves the same work forward." />
            <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {VISIBLE_SECTIONS.map((s, i) => (
                <Link key={s.slug} to={`/take-action/${s.slug}`} className={`group relative flex flex-col rounded-[24px] border border-green-700/12 bg-white/70 p-6 shadow-[0_28px_70px_-46px_rgba(20,83,45,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:border-green-700/30 hover:bg-white/85 hover:shadow-[0_36px_80px_-46px_rgba(20,83,45,0.65)] active:scale-[0.99] sm:rounded-[28px] sm:p-8 ${i === 1 ? "lg:mt-8" : i === 2 ? "lg:mt-16" : ""}`}>
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700">{s.tag}</p>
                  <h3 className="hero-serif mt-3 text-[clamp(1.4rem,5vw,2rem)] font-bold leading-tight text-[#111111] sm:mt-4">{s.label}</h3>
                  <p className="mt-4 flex-1 text-[0.92rem] leading-[1.8] text-[#4A4A42] sm:mt-5 sm:text-[0.95rem]">{s.desc}</p>
                  <div className="mt-6 inline-flex items-center justify-between gap-3 border-t border-green-700/15 pt-5 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-colors duration-300 group-hover:text-[#15543A] sm:mt-8 sm:pt-6">
                    <span>{s.slug === "donate" ? "Make a gift" : s.slug === "sponsor-a-child" ? "Meet the children" : s.slug === "send-a-gift" ? "Browse the marketplace" : s.slug === "volunteer" ? "Browse opportunities" : s.slug === "partnerships" ? "Partner with us" : "Report a concern"}</span>
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
          <span className="mb-4 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700"><span className="h-px w-6 bg-green-700" />Take Action</span>
          <h1 className="hero-serif text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] text-[#111111]">Change does not happen by watching. <span className="italic text-green-700">It happens by moving.</span></h1>
          <p className="mt-4 text-[0.95rem] leading-[1.8] text-[#3D3D37]">Six ways to stand with the children and families we serve. Every one of them changes a life — including, quietly, your own.</p>
          <div className="mt-7 grid grid-cols-3 divide-x divide-green-700/12 rounded-2xl border border-green-700/12 bg-white/60">
            {[{ v: "Six", l: "Ways to move" }, { v: "One", l: "Shared mission" }, { v: "Every", l: "Life counts" }].map((item) => (
              <div key={item.l} className="px-3 py-4 text-center">
                <p className="hero-serif text-[1.1rem] font-bold leading-none text-green-700">{item.v}</p>
                <p className="mt-2 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]/75">{item.l}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-3 px-5 pb-16 pt-8">
          {VISIBLE_SECTIONS.map((s) => (
            <Link key={s.slug} to={`/take-action/${s.slug}`} className="block rounded-2xl border border-green-700/12 bg-white/80 p-5 shadow-[0_20px_50px_-40px_rgba(20,83,45,0.5)] transition-all duration-200 active:scale-[0.99]">
              <span className="block h-1 w-10 rounded-full" style={{ backgroundColor: s.accent }} />
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-green-700">{s.tag}</p>
                  <h3 className="hero-serif mt-2 text-[1.45rem] font-bold leading-tight text-[#111111]">{s.label}</h3>
                </div>
                <span className="mt-1 flex-shrink-0 rounded-full border border-green-700/20 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-green-700">Open</span>
              </div>
              <p className="mt-3 text-[0.88rem] leading-[1.75] text-[#4A4A42]">{s.desc}</p>
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
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700">Page not found</p>
        <h1 className="hero-serif mt-5 text-[clamp(1.6rem,6vw,2.8rem)] font-bold leading-tight text-[#111111]">We couldn't find that page in the Take Action section.</h1>
        <Link to="/take-action" className="mt-10 inline-flex items-center rounded-xl bg-green-700 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-950">Back to Take Action</Link>
      </div>
    </section>
  );
}

export default function TakeAction() {
  const { section } = useParams();

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [section]);

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
              {active.id === "sponsor-a-child" && <SponsorAChild />}
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