import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const SECTIONS = [
  {
    slug: "donate",
    id: "donate",
    label: "Donate",
    desc: "Every shilling is a trust, every report a promise kept. Fund meals, books, health, and the everyday cost of staying in school.",
    tag: "Give once or often",
    image: "/img1.jpg",
    accent: "#E2703A",
  },
  {
    slug: "sponsor-a-child",
    id: "sponsor-a-child",
    label: "Sponsor a Child",
    desc: "Put a real child in a real classroom for KES 2,500 a month. Real names. Real schools. Real letters twice a year.",
    tag: "Give monthly",
    image: "/img3.jpg",
    accent: "#F2B33D",
  },
  {
    slug: "volunteer",
    id: "volunteer",
    label: "Volunteer",
    desc: "Teach, mentor, design, translate, or help us run the field. Skilled and unskilled roles, on-site and remote.",
    tag: "Give your time",
    image: "/img4.jpg",
    accent: "#7FB069",
  },
  {
    slug: "partnerships",
    id: "partnerships",
    label: "Partnerships",
    desc: "Companies, foundations, governments and faith groups — co-design a partnership that moves children's futures forward.",
    tag: "Give together",
    image: "/img5.jpg",
    accent: "#1C6B4B",
  },
  {
    slug: "report-safeguarding",
    id: "report-safeguarding",
    label: "Report a Concern",
    desc: "A safe, confidential way to report a safeguarding concern about a child. Every report is taken seriously and handled with care.",
    tag: "Keep children safe",
    image: "/img8.png",
    accent: "#E2703A",
  },
];

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

const CHILDREN = [
  {
    id: "mk-0241",
    name: "Mercy",
    age: 11,
    birthYear: 2015,
    gender: "Female",
    grade: "Grade 5",
    location: "Loitokitok, Kajiado",
    region: "Loitokitok",
    dream: "Wants to become a nurse",
    story:
      "Mercy walks 4 km to school every morning. She is the eldest of four and helps her mother sell vegetables on weekends.",
    image: "/img3.jpg",
    monthly: 2500,
    funded: 68,
  },
  {
    id: "mk-0189",
    name: "Brian",
    age: 9,
    birthYear: 2017,
    gender: "Male",
    grade: "Grade 3",
    location: "Kimana, Kajiado",
    region: "Kimana",
    dream: "Wants to become a teacher",
    story:
      "Brian lost his father in 2022. Since joining the programme he has not missed a single day of school.",
    image: "/img1.jpg",
    monthly: 2500,
    funded: 42,
  },
  {
    id: "mk-0334",
    name: "Faith",
    age: 13,
    birthYear: 2013,
    gender: "Female",
    grade: "Grade 7",
    location: "Rombo, Kajiado",
    region: "Rombo",
    dream: "Wants to become an engineer",
    story:
      "Faith is the top of her class in mathematics. She walks 6 km daily to reach the nearest secondary school.",
    image: "/img4.jpg",
    monthly: 3500,
    funded: 91,
  },
  {
    id: "mk-0402",
    name: "Samuel",
    age: 8,
    birthYear: 2018,
    gender: "Male",
    grade: "Grade 2",
    location: "Entonet, Kajiado",
    region: "Entonet",
    dream: "Wants to become a pilot",
    story:
      "Samuel joined the programme last year. He is now the most curious reader in his class.",
    image: "/img5.jpg",
    monthly: 2500,
    funded: 15,
  },
  {
    id: "mk-0512",
    name: "Grace",
    age: 10,
    birthYear: 2016,
    gender: "Female",
    grade: "Grade 4",
    location: "Kimana, Kajiado",
    region: "Kimana",
    dream: "Wants to become a doctor",
    story:
      "Grace looks after her younger brother after school. She has perfect attendance and loves science.",
    image: "/img1.jpg",
    monthly: 2500,
    funded: 30,
  },
  {
    id: "mk-0603",
    name: "David",
    age: 12,
    birthYear: 2014,
    gender: "Male",
    grade: "Grade 6",
    location: "Namanga, Kajiado",
    region: "Namanga",
    dream: "Wants to become a footballer",
    story:
      "David is the captain of his school football team and helps his grandmother with the family shamba.",
    image: "/img4.jpg",
    monthly: 2500,
    funded: 55,
  },
  {
    id: "mk-0718",
    name: "Esther",
    age: 7,
    birthYear: 2019,
    gender: "Female",
    grade: "Grade 1",
    location: "Rombo, Kajiado",
    region: "Rombo",
    dream: "Wants to become a singer",
    story:
      "Esther is the youngest in her class and loves singing during morning assembly.",
    image: "/img3.jpg",
    monthly: 2500,
    funded: 22,
  },
  {
    id: "mk-0825",
    name: "Joseph",
    age: 14,
    birthYear: 2012,
    gender: "Male",
    grade: "Grade 8",
    location: "Loitokitok, Kajiado",
    region: "Loitokitok",
    dream: "Wants to become a lawyer",
    story:
      "Joseph is preparing for his final primary exams. He walks 5 km daily and mentors younger children in his village.",
    image: "/img5.jpg",
    monthly: 3500,
    funded: 78,
  },
];

const AGE_RANGES = [
  { id: "all", label: "All ages", test: null },
  { id: "under-8", label: "Under 8", test: (age) => age < 8 },
  { id: "8-10", label: "8 – 10 years", test: (age) => age >= 8 && age <= 10 },
  { id: "11-13", label: "11 – 13 years", test: (age) => age >= 11 && age <= 13 },
  { id: "14-plus", label: "14 years and above", test: (age) => age >= 14 },
];

const GENDERS = [
  { id: "all", label: "All genders" },
  { id: "Female", label: "Girls" },
  { id: "Male", label: "Boys" },
];

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
  { id: "all", label: "All roles" },
  { id: "remote", label: "Remote" },
  { id: "onsite", label: "On-site" },
  { id: "skilled", label: "Skilled" },
  { id: "short", label: "Short-term" },
  { id: "long", label: "Long-term" },
];

const OPPORTUNITIES = [];

const VOL_STEPS = [
  { n: "01", title: "Apply", body: "Pick a role and send us a short note about why it fits you. No CV required — we care about the fit, not the formatting." },
  { n: "02", title: "Chat with us", body: "A 20-minute call to make sure the role is right for both sides. We will tell you exactly what the work looks like." },
  { n: "03", title: "Onboard", body: "Background check (where required by law), safeguarding briefing, and a buddy who shows you the ropes." },
  { n: "04", title: "Get to work", body: "Start when you are ready. Regular check-ins, honest feedback, and a certificate at the end of your service." },
];

const PARTNER_TYPES = [
  {
    n: "01",
    icon: "briefcase",
    title: "Corporate CSR",
    body: "Match your team's giving, sponsor a school, or fund a whole programme. We co-design, you get the impact report.",
    examples: ["Payroll giving", "School sponsorship", "Cause campaigns"],
  },
  {
    n: "02",
    icon: "globe",
    title: "Foundations & Trusts",
    body: "Multi-year grants to fund our four pillars — education, health, child protection and livelihoods.",
    examples: ["Programme grants", "Core funding", "Capital projects"],
  },
  {
    n: "03",
    icon: "sparkle",
    title: "In-kind Giving",
    body: "Books, laptops, uniforms, medical supplies, training, or professional services. Every contribution moves work forward.",
    examples: ["Books & devices", "Medical supplies", "Pro-bono services"],
  },
  {
    n: "04",
    icon: "users",
    title: "Community & Faith",
    body: "Churches, mosques, schools and local groups raising funds or volunteering together for the children next door.",
    examples: ["Fundraisers", "Volunteer days", "Awareness drives"],
  },
  {
    n: "05",
    icon: "school",
    title: "Academic & Research",
    body: "Universities and research institutes partnering on programme design, monitoring, evaluation and learning.",
    examples: ["Impact studies", "M&E support", "Student placements"],
  },
  {
    n: "06",
    icon: "heart",
    title: "Government & Public",
    body: "County and national government departments aligning policy, funding and delivery with the communities we serve.",
    examples: ["County partnerships", "Policy alignment", "Public funding"],
  },
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

const REPORT_RELATIONSHIPS = [
  "The child themselves",
  "Parent or guardian",
  "Teacher or school staff",
  "Community member",
  "MKCDP staff or volunteer",
  "Sponsor or donor",
  "Other",
];

const REPORT_CONCERNS = [
  { id: "physical", label: "Physical abuse" },
  { id: "emotional", label: "Emotional or psychological abuse" },
  { id: "sexual", label: "Sexual abuse or exploitation" },
  { id: "neglect", label: "Neglect or inadequate care" },
  { id: "child-labour", label: "Child labour" },
  { id: "online", label: "Online safety or exploitation" },
  { id: "bullying", label: "Bullying or peer harm" },
  { id: "other", label: "Other safeguarding concern" },
];

const REPORT_URGENCY = [
  { id: "immediate", label: "Immediate danger", hint: "Child is at risk right now" },
  { id: "urgent", label: "Urgent", hint: "Needs action within 24 hours" },
  { id: "standard", label: "Standard", hint: "Concern that needs review" },
];

const REPORT_CONTACT = [
  { id: "phone", label: "Phone call" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Email" },
  { id: "none", label: "Do not contact me" },
];

const HELPLINES = [
  {
    name: "Childline Kenya",
    number: "116",
    note: "Toll-free, 24/7. For children and anyone worried about a child.",
    href: "tel:116",
    primary: true,
  },
  {
    name: "National GBV Helpline",
    number: "1195",
    note: "Toll-free, 24/7. For gender-based violence and abuse.",
    href: "tel:1195",
  },
  {
    name: "Police Emergency",
    number: "999",
    note: "For immediate danger. Ask for the child protection unit.",
    href: "tel:999",
  },
];

const Icon = {
  Heart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" />
    </svg>
  ),
  Gift: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="9" width="18" height="12" rx="2" />
      <path d="M3 13h18M12 9v12M8 9a2.5 2.5 0 1 1 4-4M16 9a2.5 2.5 0 1 0-4-4" />
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
  Megaphone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 10v4a1 1 0 0 0 1 1h2l7 4V5L7 9H5a1 1 0 0 0-1 1Z" />
      <path d="M18 8.5a5 5 0 0 1 0 7" />
    </svg>
  ),
  Briefcase: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3 13h18" />
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
  ChevronDown: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m6 9 6 6 6-6" />
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
  Plate: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  MapPin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  Clock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  Calendar: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
  Alert: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3 2 20h20z" />
      <path d="M12 9v5M12 17.5v.5" />
    </svg>
  ),
  Eye: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
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
    gift: Icon.Gift,
    users: Icon.Users,
    megaphone: Icon.Megaphone,
    briefcase: Icon.Briefcase,
    globe: Icon.Globe,
    sparkle: Icon.Sparkle,
    school: Icon.School,
    book: Icon.Book,
    plate: Icon.Plate,
    user: Icon.User,
    mail: Icon.Mail,
    alert: Icon.Alert,
    shield: Icon.Shield,
  };
  const Cmp = map[key] || Icon.Heart;
  return <Cmp className={cls} />;
};

const inputClass =
  "w-full rounded-xl border border-green-700/15 bg-white px-4 py-3.5 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15";

const inputWithIcon =
  "w-full rounded-xl border border-green-700/15 bg-white py-3.5 pl-11 pr-4 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15";

const formatDate = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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

function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border-b border-green-700/12">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="hero-serif text-[1.05rem] font-bold leading-snug text-[#111111] transition-colors duration-200 group-hover:text-green-700 sm:text-[1.15rem]">
          {q}
        </span>
        <span
          className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-full border transition-all duration-300 ${
            isOpen
              ? "border-green-700 bg-green-700 text-white"
              : "border-green-700/25 text-green-700 group-hover:border-green-700"
          }`}
        >
          <Icon.ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-[820px] text-[0.95rem] leading-[1.85] text-[#4A4A42]">{a}</p>
        </div>
      </div>
    </div>
  );
}

function Donate() {
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
      <div className="relative flex min-h-[60vh] items-center justify-center rounded-3xl border border-green-700/12 bg-white/70 px-6 py-20">
        <div className="max-w-[560px] text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-700 text-white">
            <Icon.Check className="h-7 w-7" />
          </span>
          <h2 className="hero-serif mt-8 text-[clamp(1.8rem,4vw,2.6rem)] font-bold leading-tight text-[#111111]">
            Thank you, {firstName}.
          </h2>
          <p className="mt-5 text-[1rem] leading-[1.8] text-[#4A4A42]">
            Your {frequency === "once" ? "one-time" : "monthly"} gift of{" "}
            <span className="font-bold text-green-700">
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
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
      <div className="relative lg:sticky lg:top-40 lg:self-start">
        <span className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-green-700">
          <span className="h-px w-8 bg-green-700" />
          Gifts &amp; Donations
        </span>

        <h2 className="hero-serif text-[clamp(2rem,5vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.025em] text-[#111111]">
          Every shilling is a trust.
          <br />
          <span className="italic text-green-700">Every report is a promise kept.</span>
        </h2>

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
            <div key={item.t} className="rounded-2xl border border-green-700/12 bg-white/60 p-4">
              <item.icon className="h-5 w-5 text-green-700" />
              <p className="mt-3 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-green-700">
                {item.t}
              </p>
              <p className="mt-1 text-[0.82rem] leading-relaxed text-[#4A4A42]">{item.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-start gap-4 rounded-2xl border border-green-700/12 bg-white/60 p-5">
          <span className="mt-0.5 grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-green-700 text-white">
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
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="relative rounded-[28px] border border-green-700/12 bg-white/85 p-6 shadow-[0_36px_80px_-44px_rgba(20,83,45,0.45)] backdrop-blur-sm sm:p-8 lg:p-10"
      >
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">Give</p>
          <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-green-700/6 p-1.5">
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
                    ? "bg-green-700 text-white shadow-[0_10px_20px_-10px_rgba(28,107,75,0.9)]"
                    : "text-[#4A4A42] hover:text-green-700"
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
                    ? "border-green-700 bg-green-700/6 shadow-[0_10px_24px_-16px_rgba(28,107,75,0.9)]"
                    : "border-green-700/15 bg-white hover:border-green-700/40"
                }`}
              >
                <span
                  className={`block text-[1rem] font-bold ${
                    amount === p.amount && !custom ? "text-green-700" : "text-[#111111]"
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
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[0.82rem] font-bold text-green-700">
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
            <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.amount}</p>
          )}
        </div>

        <div className="mt-7 rounded-2xl border border-green-700/12 bg-green-700/5 p-4">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-green-700">
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
                    ? "border-green-700 bg-green-700/6"
                    : "border-green-700/15 bg-white hover:border-green-700/40"
                }`}
              >
                <span
                  className={`block text-[0.88rem] font-bold ${
                    method === m.id ? "text-green-700" : "text-[#111111]"
                  }`}
                >
                  {m.label}
                </span>
                <span className="mt-0.5 block text-[0.7rem] text-[#4A4A42]/80">{m.hint}</span>
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
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
                  <Icon.User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Amina"
                  className={`${inputWithIcon} ${errors.firstName ? "border-[#E2703A]/60" : ""}`}
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
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
                  <Icon.User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Wanjiku"
                  className={`${inputWithIcon} ${errors.lastName ? "border-[#E2703A]/60" : ""}`}
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
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
                <Icon.Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`${inputWithIcon} ${errors.email ? "border-[#E2703A]/60" : ""}`}
              />
            </div>
            {errors.email ? (
              <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p>
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
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
                <Icon.Phone className="h-4 w-4" />
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 7xx xxx xxx"
                className={`${inputWithIcon} ${errors.phone ? "border-[#E2703A]/60" : ""}`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.phone}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="group mt-9 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-green-700 px-8 py-[1.15rem] text-[0.82rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_20px_40px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] active:scale-[0.99]"
        >
          Give KES {amount.toLocaleString("en-US")}
          <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        <div className="mt-5 flex items-start gap-3 text-[0.78rem] leading-[1.7] text-[#4A4A42]/80">
          <Icon.Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-700" />
          <p>
            Your payment is processed over a secure connection. MKCDP never stores card
            details on its servers.
          </p>
        </div>
      </form>
    </div>
  );
}

function ChildCard({ child, onSelect }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-green-700/12 bg-white/70 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-40px_rgba(20,83,45,0.55)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={child.image}
          alt={`Photo of ${child.name}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-green-700 backdrop-blur">
          ID {child.id}
        </span>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="hero-serif text-[1.5rem] font-bold leading-tight">
            {child.name}, {child.age}
          </p>
          <p className="mt-0.5 text-[0.78rem] font-medium text-white/85">
            {child.grade} · {child.location}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="hero-serif text-[0.95rem] italic leading-[1.6] text-green-700">
          {child.dream}.
        </p>
        <p className="mt-3 flex-1 text-[0.85rem] leading-[1.7] text-[#4A4A42]">{child.story}</p>

        <div className="mt-5">
          <div className="flex items-center justify-between text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#4A4A42]">
            <span>Funded</span>
            <span className="text-green-700">{child.funded}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-green-700/10">
            <div
              className="h-full rounded-full bg-green-700 transition-all duration-700"
              style={{ width: `${child.funded}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelect(child)}
          className="group/btn mt-5 inline-flex items-center justify-between gap-3 rounded-xl bg-green-700 px-5 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-[#15543A]"
        >
          <span>
            Sponsor {child.name} · KES {child.monthly.toLocaleString("en-US")}/mo
          </span>
          <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </article>
  );
}

function SponsorAChild() {
  const [selected, setSelected] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [filters, setFilters] = useState({
    age: "all",
    birthYear: "all",
    gender: "all",
    region: "all",
  });

  const birthYears = useMemo(() => {
    const years = [...new Set(CHILDREN.map((c) => c.birthYear))];
    return years.sort((a, b) => b - a);
  }, []);

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

  const hasActiveFilters =
    filters.age !== "all" ||
    filters.birthYear !== "all" ||
    filters.gender !== "all" ||
    filters.region !== "all";

  const setFilter = (field, value) =>
    setFilters((f) => ({ ...f, [field]: value }));

  const clearFilters = () =>
    setFilters({ age: "all", birthYear: "all", gender: "all", region: "all" });

  const handleSelect = (child) => {
    setSelected(child);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-20 lg:space-y-28">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-green-700">
            <span className="h-px w-8 bg-green-700" />
            Sponsor a Child
          </span>

          <h1 className="hero-serif text-[clamp(2.2rem,5.4vw,4rem)] font-bold leading-[1.03] tracking-[-0.03em] text-[#111111]">
            One child. One sponsor.
            <br />
            <span className="italic text-green-700">One future rewritten.</span>
          </h1>

          <p className="mt-8 max-w-[520px] text-[1.0625rem] leading-[1.8] text-[#4A4A42]">
            For KES 2,500 a month — about the price of two cups of coffee a week — you can put
            a real child in a real classroom and keep them there, term after term, until they
            walk out with a future.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#children"
              className="group inline-flex items-center gap-3 rounded-full bg-green-700 px-8 py-[1.15rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_-16px_rgba(20,83,45,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A]"
            >
              Meet the children
              <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-3 rounded-full border border-green-700/25 px-8 py-[1.15rem] text-[0.78rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-all duration-300 hover:border-green-700/60 hover:bg-green-700/5"
            >
              How it works
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-green-700/12 pt-8">
            {[
              { v: "8,750+", l: "Children sponsored" },
              { v: "14", l: "Partner schools" },
              { v: "94%", l: "Gift to programme" },
            ].map((item) => (
              <div key={item.l}>
                <p className="hero-serif text-[clamp(1.4rem,2.6vw,2rem)] font-bold leading-none text-green-700">
                  {item.v}
                </p>
                <p className="mt-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#4A4A42]/80">
                  {item.l}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[44px] bg-gradient-to-br from-[#F2B33D]/25 via-transparent to-[#E2703A]/15 blur-2xl" />

          <div className="relative overflow-hidden rounded-[36px] border border-green-700/10 bg-white shadow-[0_40px_90px_-50px_rgba(20,83,45,0.6)]">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={CHILDREN[0].image}
                alt="Featured sponsored child"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#F2B33D] px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#1C6B4B]">
                  <Icon.Heart className="h-3 w-3" />
                  Waiting for a sponsor
                </span>
                <p className="hero-serif mt-4 text-[2rem] font-bold leading-tight">
                  {CHILDREN[0].name}, {CHILDREN[0].age}
                </p>
                <p className="mt-1 text-[0.85rem] text-white/85">
                  {CHILDREN[0].grade} · {CHILDREN[0].location}
                </p>
              </div>
            </div>

            <div className="p-6">
              <p className="text-[0.9rem] leading-[1.7] text-[#4A4A42]">{CHILDREN[0].story}</p>
              <button
                type="button"
                onClick={() => handleSelect(CHILDREN[0])}
                className="group mt-5 inline-flex w-full items-center justify-between gap-3 rounded-xl bg-green-700 px-5 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-[#15543A]"
              >
                Sponsor {CHILDREN[0].name}
                <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <svg viewBox="0 0 100 100" aria-hidden="true" className="pointer-events-none absolute -right-6 -top-6 hidden w-20 rotate-12 lg:block">
            <path d="M52 9c21 1 38 15 37 36-1 24-20 45-44 44C24 88 8 70 9 49 10 26 28 8 52 9Z" fill="none" stroke="#E2703A" strokeWidth="4.5" strokeLinecap="round" />
          </svg>

          <svg viewBox="0 0 80 80" aria-hidden="true" className="pointer-events-none absolute -bottom-4 -left-6 hidden w-16 -rotate-6 lg:block">
            <path d="M14 56c10-6 16-18 16-32 0-6 8-6 8 0 0 16 8 28 20 34" fill="none" stroke="#F2B33D" strokeWidth="7" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {selected && (
        <div className="flex flex-col items-start gap-5 rounded-3xl border border-green-700/15 bg-white/80 p-6 shadow-[0_24px_60px_-40px_rgba(20,83,45,0.5)] sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-5">
            <img
              src={selected.image}
              alt={selected.name}
              className="h-20 w-20 flex-shrink-0 rounded-2xl object-cover"
            />
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-green-700">
                Your choice
              </p>
              <p className="hero-serif mt-1 text-[1.4rem] font-bold leading-tight text-[#111111]">
                {selected.name}, {selected.age}
              </p>
              <p className="mt-0.5 text-[0.85rem] text-[#4A4A42]">
                {selected.grade} · {selected.location}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link
              to="/take-action/donate"
              className="group inline-flex items-center justify-center gap-3 rounded-xl bg-green-700 px-6 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A]"
            >
              Continue to give · KES {selected.monthly.toLocaleString("en-US")}/mo
              <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42] transition-colors duration-200 hover:text-green-700"
            >
              Change
            </button>
          </div>
        </div>
      )}

      <div id="children">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[640px]">
            <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-8 bg-green-700" />
              Waiting for a sponsor
            </span>
            <h2 className="hero-serif text-[clamp(1.9rem,4.4vw,3.2rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#111111]">
              Real children, real classrooms, right now.
            </h2>
          </div>
          <p className="max-w-[380px] text-[1rem] leading-[1.8] text-[#4A4A42]">
            Each child below has been visited by our field team. Their profiles are current as of
            this month.
          </p>
        </div>

        <div className="mb-10 rounded-3xl border border-green-700/12 bg-white/60 p-6 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-green-700">
              <Icon.Target className="h-3.5 w-3.5" />
              Filter children
            </p>
            <div className="flex items-center gap-5">
              <p className="text-[0.78rem] text-[#4A4A42]/80">
                Showing <span className="font-bold text-[#111111]">{filteredChildren.length}</span> of{" "}
                {CHILDREN.length}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#E2703A] transition-colors duration-200 hover:text-[#c95c2b]"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                Age
              </label>
              <div className="relative">
                <select
                  value={filters.age}
                  onChange={(e) => setFilter("age", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-green-700/15 bg-white px-4 py-3 pr-10 text-[0.88rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
                >
                  {AGE_RANGES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-green-700/50">
                  <Icon.ChevronDown className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                Birth year
              </label>
              <div className="relative">
                <select
                  value={filters.birthYear}
                  onChange={(e) => setFilter("birthYear", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-green-700/15 bg-white px-4 py-3 pr-10 text-[0.88rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
                >
                  <option value="all">All years</option>
                  {birthYears.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-green-700/50">
                  <Icon.ChevronDown className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                Gender
              </label>
              <div className="relative">
                <select
                  value={filters.gender}
                  onChange={(e) => setFilter("gender", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-green-700/15 bg-white px-4 py-3 pr-10 text-[0.88rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
                >
                  {GENDERS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-green-700/50">
                  <Icon.ChevronDown className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                Region
              </label>
              <div className="relative">
                <select
                  value={filters.region}
                  onChange={(e) => setFilter("region", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-green-700/15 bg-white px-4 py-3 pr-10 text-[0.88rem] text-[#111111] outline-none transition-all duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
                >
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-green-700/50">
                  <Icon.ChevronDown className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {filteredChildren.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-green-700/25 bg-white/50 p-12 text-center">
            <p className="hero-serif text-[1.3rem] font-bold text-[#111111]">
              No children match those filters right now.
            </p>
            <p className="mt-2 text-[0.9rem] text-[#4A4A42]">
              Try widening your search, or check back soon — new profiles are added every month.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-green-700/20 px-6 py-3 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700/5"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredChildren.map((child) => (
              <ChildCard key={child.id} child={child} onSelect={handleSelect} />
            ))}
          </div>
        )}
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-green-700 px-8 py-16 sm:px-14 lg:px-20 lg:py-24">
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

        <div className="relative">
          <div className="mb-14 max-w-[720px]">
            <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
              <span className="h-px w-8 bg-[#F2B33D]" />
              What your gift covers
            </span>
            <h2 className="hero-serif text-[clamp(1.9rem,4.4vw,3.2rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#FBF7F0]">
              Nothing hidden. Every shilling accounted for.
            </h2>
            <p className="mt-6 text-[1rem] leading-[1.8] text-[#FBF7F0]/70">
              Your monthly gift is pooled with other sponsors to cover the full cost of one
              child's education. Here is exactly where it goes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COVERAGE.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl border border-[#FBF7F0]/12 bg-[#FBF7F0]/5 p-6 transition-colors duration-300 hover:border-[#FBF7F0]/30 hover:bg-[#FBF7F0]/8"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#F2B33D] text-[#1C6B4B]">
                  {wayIcon(c.icon, "h-5 w-5")}
                </span>
                <p className="hero-serif mt-5 text-[1.15rem] font-bold leading-tight text-[#FBF7F0]">
                  {c.title}
                </p>
                <p className="mt-2 text-[0.88rem] leading-[1.7] text-[#FBF7F0]/65">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="how">
        <div className="mb-14 max-w-[680px]">
          <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700">
            <span className="h-px w-8 bg-green-700" />
            How it works
          </span>
          <h2 className="hero-serif text-[clamp(1.9rem,4.4vw,3.2rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#111111]">
            Four steps from stranger to sponsor.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SPONSOR_STEPS.map((step) => (
            <div
              key={step.n}
              className="relative rounded-2xl border border-green-700/12 bg-white/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-40px_rgba(20,83,45,0.4)]"
            >
              <span className="hero-serif text-[2.4rem] font-bold leading-none text-green-700/25">
                {step.n}
              </span>
              <p className="hero-serif mt-3 text-[1.2rem] font-bold leading-tight text-[#111111]">
                {step.title}
              </p>
              <p className="mt-3 text-[0.88rem] leading-[1.7] text-[#4A4A42]">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex items-start gap-4 rounded-2xl border border-green-700/12 bg-white/70 p-6">
          <span className="mt-0.5 grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-green-700 text-white">
            <Icon.Shield className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[0.95rem] font-bold text-[#111111]">Our promise to every sponsor</p>
            <p className="mt-2 text-[0.9rem] leading-[1.75] text-[#4A4A42]">
              Your money never touches a middleman. School fees are paid directly to the school.
              Meals are delivered by our field team. Health costs are receipted. You receive the
              full report every year.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-green-700/12 bg-white/55 p-8 sm:p-12 lg:p-14">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-8 bg-green-700" />
              Common questions
            </span>
            <h2 className="hero-serif text-[clamp(1.7rem,4vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#111111]">
              Everything you were going to ask.
            </h2>
            <p className="mt-6 max-w-[420px] text-[1rem] leading-[1.8] text-[#4A4A42]">
              Still unsure? Our sponsorship team is on hand at{" "}
              <a
                href="mailto:sponsor@mkcdp.org"
                className="font-bold text-green-700 underline decoration-green-700/30 underline-offset-4 hover:decoration-green-700"
              >
                sponsor@mkcdp.org
              </a>
              .
            </p>
          </div>

          <div>
            {SPONSOR_FAQ.map((item, i) => (
              <FaqItem
                key={item.q}
                q={item.q}
                a={item.a}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OpportunityCard({ role, onApply }) {
  const start = formatDate(role.startDate);
  const deadline = formatDate(role.deadline);

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-green-700/12 bg-white/70 p-6 shadow-[0_24px_60px_-46px_rgba(20,83,45,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-green-700/30 hover:shadow-[0_30px_70px_-46px_rgba(20,83,45,0.55)]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-green-700/8 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-green-700">
          ID {role.id}
        </span>
        <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/60">
          {role.org}
        </span>
      </div>

      <h3 className="hero-serif mt-5 text-[1.3rem] font-bold leading-tight text-[#111111]">
        {role.title}
      </h3>

      <div className="mt-4 space-y-2 text-[0.82rem] text-[#4A4A42]">
        <span className="flex items-center gap-2">
          <Icon.MapPin className="h-3.5 w-3.5 flex-shrink-0 text-green-700" />
          {role.location}
        </span>
        <span className="flex items-center gap-2">
          <Icon.Clock className="h-3.5 w-3.5 flex-shrink-0 text-green-700" />
          {role.commitment}
        </span>
        {start && (
          <span className="flex items-center gap-2">
            <Icon.Calendar className="h-3.5 w-3.5 flex-shrink-0 text-green-700" />
            Starts {start}
          </span>
        )}
        {deadline && (
          <span className="flex items-center gap-2 font-semibold text-[#E2703A]">
            <Icon.Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            Apply by {deadline}
          </span>
        )}
      </div>

      <p className="mt-5 flex-1 text-[0.9rem] leading-[1.75] text-[#4A4A42]">{role.desc}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {role.skills.map((s) => (
          <span
            key={s}
            className="rounded-full border border-green-700/15 px-3 py-1 text-[0.68rem] font-semibold text-[#4A4A42]"
          >
            {s}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onApply(role)}
        className="group/btn mt-6 inline-flex items-center justify-between gap-3 rounded-xl bg-green-700 px-5 py-3.5 text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-[#15543A]"
      >
        <span>Apply for this role</span>
        <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
      </button>
    </article>
  );
}

function Volunteer() {
  const [filter, setFilter] = useState("all");
  const [applied, setApplied] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    availability: "",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const hasRoles = OPPORTUNITIES.length > 0;

  const filtered = useMemo(() => {
    if (filter === "all") return OPPORTUNITIES;
    return OPPORTUNITIES.filter((r) => r.tags.includes(filter));
  }, [filter]);

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
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const closeApplication = () => {
    setApplied(null);
    setSubmitted(false);
    setForm({ fullName: "", phone: "", email: "", availability: "", note: "" });
    setErrors({});
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Please enter your full name.";
    if (!/^\+?[\d\s()-]{7,20}$/.test(form.phone))
      next.phone = "Enter a valid phone number.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email or leave this blank.";
    if (!form.availability)
      next.availability = "Please tell us when you are available.";
    setErrors(next);
    if (Object.keys(next).length === 0) setSubmitted(true);
  };

  return (
    <div className="space-y-20 lg:space-y-28">
      <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-green-700">
            <span className="h-px w-8 bg-green-700" />
            Volunteer with MKCDP
          </span>

          <h1 className="hero-serif text-[clamp(2.2rem,5.4vw,4rem)] font-bold leading-[1.03] tracking-[-0.03em] text-[#111111]">
            Give an hour.
            <br />
            <span className="italic text-green-700">Change a childhood.</span>
          </h1>

          <p className="mt-8 max-w-[520px] text-[1.0625rem] leading-[1.8] text-[#4A4A42]">
            Whether you can teach maths on Saturday, translate a letter, or photograph a field
            visit twice a year — there is a role here that needs exactly your skills.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { v: String(OPPORTUNITIES.length), l: "Open roles" },
            { v: "Flexible", l: "Commitment" },
          ].map((item) => (
            <div key={item.l} className="rounded-2xl border border-green-700/12 bg-white/70 p-5">
              <p className="hero-serif text-[clamp(1.3rem,2.4vw,1.8rem)] font-bold leading-none text-green-700">
                {item.v}
              </p>
              <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/80">
                {item.l}
              </p>
            </div>
          ))}
        </div>
      </div>

      {applied && !submitted && (
        <div className="relative overflow-hidden rounded-[32px] border border-green-700/15 bg-white/85 p-6 shadow-[0_36px_80px_-44px_rgba(20,83,45,0.5)] backdrop-blur-sm sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-700 via-[#7FB069] to-[#F2B33D]"
          />

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
                <span className="h-px w-6 bg-green-700" />
                Application form
              </span>
              <h2 className="hero-serif mt-4 text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight text-[#111111]">
                Apply: {applied.title}
              </h2>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.82rem] text-[#4A4A42]">
                <span className="flex items-center gap-2">
                  <Icon.MapPin className="h-3.5 w-3.5 text-green-700" />
                  {applied.location}
                </span>
                <span className="flex items-center gap-2">
                  <Icon.Clock className="h-3.5 w-3.5 text-green-700" />
                  {applied.commitment}
                </span>
                <span className="rounded-full bg-green-700/8 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-green-700">
                  ID {applied.id}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeApplication}
              className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42] transition-colors duration-200 hover:text-green-700"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                  Full name <span className="text-[#E2703A]">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
                    <Icon.User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={handleChange("fullName")}
                    placeholder="e.g. Amina Wanjiku"
                    autoComplete="name"
                    className={`${inputWithIcon} ${errors.fullName ? "border-[#E2703A]/60" : ""}`}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                  Phone number <span className="text-[#E2703A]">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
                    <Icon.Phone className="h-4 w-4" />
                  </span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="+254 7xx xxx xxx"
                    autoComplete="tel"
                    className={`${inputWithIcon} ${errors.phone ? "border-[#E2703A]/60" : ""}`}
                  />
                </div>
                {errors.phone ? (
                  <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                    {errors.phone}
                  </p>
                ) : (
                  <p className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70">
                    We'll reach you by phone or WhatsApp.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                Email address{" "}
                <span className="font-medium normal-case tracking-normal text-[#4A4A42]/60">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
                  <Icon.Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`${inputWithIcon} ${errors.email ? "border-[#E2703A]/60" : ""}`}
                />
              </div>
              {errors.email ? (
                <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.email}</p>
              ) : (
                <p className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70">
                  Not required. We'll use it only if you have one.
                </p>
              )}
            </div>

            <div>
              <label className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                When are you available? <span className="text-[#E2703A]">*</span>
              </label>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {AVAILABILITY_OPTIONS.map((opt) => {
                  const active = form.availability === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setForm((f) => ({ ...f, availability: opt.id }))
                      }
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-[0.85rem] font-semibold transition-all duration-200 ${
                        active
                          ? "border-green-700 bg-green-700/6 text-green-700"
                          : "border-green-700/15 bg-white text-[#4A4A42] hover:border-green-700/40"
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span
                        className={`grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border transition-all duration-200 ${
                          active
                            ? "border-green-700 bg-green-700 text-white"
                            : "border-green-700/25 text-transparent"
                        }`}
                      >
                        <Icon.Check className="h-3 w-3" />
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.availability && (
                <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">
                  {errors.availability}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                Anything we should know?{" "}
                <span className="font-medium normal-case tracking-normal text-[#4A4A42]/60">
                  (optional)
                </span>
              </label>
              <textarea
                value={form.note}
                onChange={handleChange("note")}
                rows={4}
                placeholder="Relevant experience, questions, or anything that would help us match you well."
                className="w-full resize-none rounded-xl border border-green-700/15 bg-white px-4 py-3.5 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
              />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-green-700/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[0.75rem] leading-[1.6] text-[#4A4A42]/80">
                By submitting, you agree to our volunteer code of conduct and safeguarding
                briefing.
              </p>
              <button
                type="submit"
                className="group inline-flex flex-shrink-0 items-center justify-center gap-3 rounded-xl bg-green-700 px-8 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] active:scale-[0.99]"
              >
                Submit application
                <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </div>
      )}

      {applied && submitted && (
        <div className="relative overflow-hidden rounded-[32px] border border-green-700/20 bg-green-700/6 p-8 sm:p-12 lg:p-14">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-green-700 text-white">
              <Icon.Check className="h-7 w-7" />
            </span>

            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
                Application received
              </p>
              <h2 className="hero-serif mt-3 text-[clamp(1.4rem,2.8vw,1.9rem)] font-bold leading-tight text-[#111111]">
                Thank you, {form.fullName.split(" ")[0]}.
              </h2>
              <p className="mt-3 max-w-[560px] text-[0.95rem] leading-[1.8] text-[#4A4A42]">
                We've got your application for{" "}
                <span className="font-bold text-[#111111]">{applied.title}</span> at{" "}
                {applied.org}. Our volunteer coordinator will call{" "}
                <span className="font-semibold text-[#111111]">{form.phone}</span> within 48
                hours
                {form.email ? `, or email ${form.email}` : ""} with next steps.
              </p>
            </div>

            <button
              type="button"
              onClick={closeApplication}
              className="inline-flex items-center gap-2 rounded-xl border border-green-700/20 px-6 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              Browse other roles
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700">
              <span className="h-px w-8 bg-green-700" />
              Open opportunities
            </span>
            <h2 className="hero-serif text-[clamp(1.7rem,4vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.025em] text-[#111111]">
              Browse and pick your fit.
            </h2>
          </div>
          {hasRoles && (
            <p className="max-w-[360px] text-[0.98rem] leading-[1.75] text-[#4A4A42]">
              {filtered.length} role{filtered.length === 1 ? "" : "s"} matching your filters.
            </p>
          )}
        </div>

          <>
            <div className="mb-10 flex flex-wrap gap-2.5">
              {VOL_FILTERS.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={`rounded-full border px-5 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 ${
                      active
                        ? "border-green-700 bg-green-700 text-white shadow-[0_12px_26px_-14px_rgba(20,83,45,0.9)]"
                        : "border-green-700/20 bg-white/60 text-[#4A4A42] hover:border-green-700/50 hover:text-green-700"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-green-700/25 bg-white/50 p-12 text-center">
                <p className="hero-serif text-[1.3rem] font-bold text-[#111111]">
                  No roles match that filter right now.
                </p>
                <p className="mt-2 text-[0.9rem] text-[#4A4A42]">
                  Try another filter — or check back soon, we post new roles regularly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((role) => (
                  <OpportunityCard key={role.id} role={role} onApply={handleApply} />
                ))}
              </div>
            )}
          </>

      </div>

      <div className="relative overflow-hidden rounded-3xl bg-green-700 px-8 py-16 sm:px-14 lg:px-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(251,247,240,0.09) 0px, rgba(251,247,240,0.09) 1px, transparent 1px, transparent 22px)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)",
            maskImage:
              "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)",
          }}
        />

        <div className="relative">
          <div className="mb-14 max-w-[680px]">
            <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
              <span className="h-px w-8 bg-[#F2B33D]" />
              How it works
            </span>
            <h2 className="hero-serif text-[clamp(1.9rem,4.4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#FBF7F0]">
              From application to impact in four steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VOL_STEPS.map((step) => (
              <div
                key={step.n}
                className="rounded-2xl border border-[#FBF7F0]/12 bg-[#FBF7F0]/5 p-6 transition-colors duration-300 hover:border-[#FBF7F0]/30 hover:bg-[#FBF7F0]/8"
              >
                <span className="hero-serif text-[2.4rem] font-bold leading-none text-[#F2B33D]/50">
                  {step.n}
                </span>
                <p className="hero-serif mt-3 text-[1.15rem] font-bold leading-tight text-[#FBF7F0]">
                  {step.title}
                </p>
                <p className="mt-3 text-[0.88rem] leading-[1.7] text-[#FBF7F0]/65">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <span className="mb-4 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-green-700">
            <span className="h-px w-8 bg-green-700" />
            What to expect
          </span>
          <h2 className="hero-serif text-[clamp(1.9rem,4.4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.025em] text-[#111111]">
            We take volunteering seriously — yours and ours.
          </h2>
          <p className="mt-7 max-w-[480px] text-[1rem] leading-[1.8] text-[#4A4A42]">
            Every volunteer is safeguarded, briefed, and set up for success. Here's what you can
            expect from us.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Safeguarding briefing and background check where required by law",
              "A named buddy who answers questions during your first weeks",
              "Clear deliverables and a regular check-in cadence",
              "A written reference and certificate at the end of your service",
              "Reasonable field expenses covered for on-site roles",
            ].map((line) => (
              <div key={line} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-green-700 text-white">
                  <Icon.Check className="h-3 w-3" />
                </span>
                <p className="text-[0.92rem] leading-[1.75] text-[#4A4A42]">{line}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Partnerships() {
  const [form, setForm] = useState({
    org: "",
    contact: "",
    email: "",
    phone: "",
    type: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.org.trim()) next.org = "Please enter your organisation name.";
    if (!form.contact.trim()) next.contact = "Please enter a contact name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (form.phone && !/^\+?[\d\s()-]{7,20}$/.test(form.phone))
      next.phone = "Enter a valid phone number or leave blank.";
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
      <div className="relative overflow-hidden rounded-[32px] border border-green-700/20 bg-green-700/6 p-8 sm:p-12 lg:p-16">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-green-700 text-white">
            <Icon.Check className="h-7 w-7" />
          </span>

          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
              Enquiry received
            </p>
            <h2 className="hero-serif mt-3 text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight text-[#111111]">
              Thank you, {form.contact.split(" ")[0]}.
            </h2>
            <p className="mt-3 max-w-[560px] text-[0.95rem] leading-[1.8] text-[#4A4A42]">
              We've received your enquiry on behalf of{" "}
              <span className="font-bold text-[#111111]">{form.org}</span>. Our partnerships
              team will reply to{" "}
              <span className="font-semibold text-[#111111]">{form.email}</span> within two
              working days with next steps.
            </p>
          </div>

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-green-700/20 px-6 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
      />

      <div className="max-w-[720px]">
        <span className="inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
          <span className="h-px w-6 bg-green-700" />
          Start a conversation
        </span>
        <h2 className="hero-serif mt-4 text-[clamp(1.7rem,4vw,2.6rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[#111111]">
          Tell us about your organisation.
        </h2>
        <p className="mt-5 text-[0.98rem] leading-[1.8] text-[#4A4A42]">
          A short form is all we need. No commitment. Our team will reply within two
          working days with ideas that fit your goals.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
              Organisation <span className="text-[#E2703A]">*</span>
            </label>
            <input
              type="text"
              value={form.org}
              onChange={handleChange("org")}
              placeholder="e.g. Acacia Foundation"
              className={`${inputClass} ${errors.org ? "border-[#E2703A]/60" : ""}`}
            />
            {errors.org && (
              <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                {errors.org}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
              Contact person <span className="text-[#E2703A]">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
                <Icon.User className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={form.contact}
                onChange={handleChange("contact")}
                placeholder="e.g. Amina Wanjiku"
                className={`${inputWithIcon} ${errors.contact ? "border-[#E2703A]/60" : ""}`}
              />
            </div>
            {errors.contact && (
              <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                {errors.contact}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
              Email address <span className="text-[#E2703A]">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
                <Icon.Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="you@organisation.com"
                className={`${inputWithIcon} ${errors.email ? "border-[#E2703A]/60" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
              Phone number{" "}
              <span className="font-medium normal-case tracking-normal text-[#4A4A42]/60">
                (optional)
              </span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
                <Icon.Phone className="h-4 w-4" />
              </span>
              <input
                type="tel"
                value={form.phone}
                onChange={handleChange("phone")}
                placeholder="+254 7xx xxx xxx"
                className={`${inputWithIcon} ${errors.phone ? "border-[#E2703A]/60" : ""}`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
            Partnership type <span className="text-[#E2703A]">*</span>
          </label>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNER_TYPES.map((opt) => {
              const active = form.type === opt.title;
              return (
                <button
                  key={opt.title}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: opt.title }))}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-[0.85rem] font-semibold transition-all duration-200 ${
                    active
                      ? "border-green-700 bg-green-700/6 text-green-700"
                      : "border-green-700/15 bg-white text-[#4A4A42] hover:border-green-700/40"
                  }`}
                >
                  <span>{opt.title}</span>
                  <span
                    className={`grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border transition-all duration-200 ${
                      active
                        ? "border-green-700 bg-green-700 text-white"
                        : "border-green-700/25 text-transparent"
                    }`}
                  >
                    <Icon.Check className="h-3 w-3" />
                  </span>
                </button>
              );
            })}
          </div>
          {errors.type && (
            <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.type}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
            Anything else we should know?{" "}
            <span className="font-medium normal-case tracking-normal text-[#4A4A42]/60">
              (optional)
            </span>
          </label>
          <textarea
            value={form.message}
            onChange={handleChange("message")}
            rows={4}
            placeholder="Tell us about your goals, budget range, or the programmes you're most interested in."
            className="w-full resize-none rounded-xl border border-green-700/15 bg-white px-4 py-3.5 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-green-700/12 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.75rem] leading-[1.6] text-[#4A4A42]/80">
            We treat every enquiry in confidence and reply within two working days.
          </p>
          <button
            type="submit"
            className="group inline-flex flex-shrink-0 items-center justify-center gap-3 rounded-xl bg-green-700 px-8 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#15543A] active:scale-[0.99]"
          >
            Send enquiry
            <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </form>
    </div>
  );
}

function ReportSafeguarding() {
  const [form, setForm] = useState({
    reporterType: "",
    fullName: "",
    phone: "",
    email: "",
    relationship: "",
    childName: "",
    location: "",
    concerns: [],
    urgency: "",
    description: "",
    contactPreference: "",
    anonymous: false,
    acknowledged: false,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const toggleConcern = (id) => {
    setForm((f) => {
      const has = f.concerns.includes(id);
      return {
        ...f,
        concerns: has ? f.concerns.filter((c) => c !== id) : [...f.concerns, id],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.reporterType) next.reporterType = "Please tell us who you are.";
    if (!form.anonymous) {
      if (!form.fullName.trim()) next.fullName = "Please enter your name, or choose to remain anonymous.";
      if (!form.phone.trim() && !form.email.trim())
        next.phone = "Give us a phone number or email so we can follow up — or choose to remain anonymous.";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (form.phone && !/^\+?[\d\s()-]{7,20}$/.test(form.phone))
      next.phone = "Enter a valid phone number.";
    if (!form.relationship) next.relationship = "Please tell us your relationship to the child.";
    if (!form.location.trim()) next.location = "Please tell us roughly where this happened.";
    if (form.concerns.length === 0) next.concerns = "Please choose at least one type of concern.";
    if (!form.urgency) next.urgency = "Please tell us how urgent this is.";
    if (!form.description.trim() || form.description.trim().length < 20)
      next.description = "Please describe what happened in at least a sentence or two.";
    if (!form.contactPreference) next.contactPreference = "Please choose how you'd like to be contacted.";
    if (!form.acknowledged)
      next.acknowledged = "Please confirm you understand how we handle this report.";

    setErrors(next);
    if (Object.keys(next).length === 0) setSubmitted(true);
  };

  const reset = () => {
    setForm({
      reporterType: "",
      fullName: "",
      phone: "",
      email: "",
      relationship: "",
      childName: "",
      location: "",
      concerns: [],
      urgency: "",
      description: "",
      contactPreference: "",
      anonymous: false,
      acknowledged: false,
    });
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="space-y-16 lg:space-y-20">
        <div className="relative overflow-hidden rounded-[32px] border border-green-700/20 bg-green-700/6 p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-green-700 text-white">
              <Icon.Check className="h-7 w-7" />
            </span>

            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-green-700">
                Report received
              </p>
              <h2 className="hero-serif mt-3 text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight text-[#111111]">
                Thank you for speaking up.
              </h2>
              <p className="mt-3 max-w-[620px] text-[0.95rem] leading-[1.8] text-[#4A4A42]">
                Your report has reached our safeguarding team. Every concern is handled in strict
                confidence, reviewed within 24 hours, and acted on in line with our safeguarding
                policy and Kenyan child protection law. If you left contact details, we will reach
                out — but only in the way you asked us to.
              </p>
            </div>

            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl border border-green-700/20 px-6 py-3.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-green-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              Make another report
            </button>
          </div>
        </div>

        <div>
          <SectionHeading
            eyebrow="If you need help right now"
            title="These lines are free and always open."
            intro="If a child is in immediate danger, please do not wait for us. Call one of these numbers now."
          />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {HELPLINES.map((h) => (
              <a
                key={h.number}
                href={h.href}
                className={`group flex flex-col rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                  h.primary
                    ? "border-green-700 bg-green-700 text-white shadow-[0_24px_60px_-40px_rgba(20,83,45,0.6)]"
                    : "border-green-700/15 bg-white/70 hover:border-green-700/40"
                }`}
              >
                <span
                  className={`text-[0.68rem] font-bold uppercase tracking-[0.16em] ${
                    h.primary ? "text-white/70" : "text-green-700"
                  }`}
                >
                  {h.name}
                </span>
                <span
                  className={`hero-serif mt-3 text-[2rem] font-bold leading-none ${
                    h.primary ? "text-white" : "text-[#111111]"
                  }`}
                >
                  {h.number}
                </span>
                <span
                  className={`mt-3 text-[0.85rem] leading-[1.7] ${
                    h.primary ? "text-white/80" : "text-[#4A4A42]"
                  }`}
                >
                  {h.note}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 lg:space-y-20">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <span className="mb-5 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.24em] text-green-700">
            <span className="h-px w-8 bg-green-700" />
            Report a Safeguarding Concern
          </span>

          <h1 className="hero-serif text-[clamp(2rem,5.2vw,3.8rem)] font-bold leading-[1.05] tracking-[-0.028em] text-[#111111]">
            If something worries you,
            <br />
            <span className="italic text-green-700">please tell us.</span>
          </h1>

          <p className="mt-8 max-w-[520px] text-[1.0625rem] leading-[1.8] text-[#4A4A42]">
            Every concern — big or small, certain or unsure — is taken seriously. You can report
            anonymously. You can report on behalf of someone else. What matters is that a child is
            safer because you spoke up.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: Icon.Lock, t: "Confidential", d: "Handled by a small team" },
              { icon: Icon.Clock, t: "Reviewed", d: "Within 24 hours" },
              { icon: Icon.Shield, t: "Protected", d: "You can stay anonymous" },
            ].map((item) => (
              <div key={item.t} className="rounded-2xl border border-green-700/12 bg-white/60 p-4">
                <item.icon className="h-5 w-5 text-green-700" />
                <p className="mt-3 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-green-700">
                  {item.t}
                </p>
                <p className="mt-1 text-[0.82rem] leading-relaxed text-[#4A4A42]">{item.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] border border-green-700/12 bg-green-700 p-8 text-white shadow-[0_28px_60px_-34px_rgba(20,83,45,0.6)] sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(251,247,240,0.09) 0px, rgba(251,247,240,0.09) 1px, transparent 1px, transparent 22px)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)",
              maskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)",
            }}
          />

          <div className="relative">
            <span className="mb-3 inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#F2B33D]">
              <span className="h-px w-6 bg-[#F2B33D]" />
              If a child is in danger now
            </span>
            <h2 className="hero-serif text-[clamp(1.5rem,3vw,2rem)] font-bold leading-tight text-white">
              Do not wait. Call now.
            </h2>
            <p className="mt-4 max-w-[420px] text-[0.92rem] leading-[1.8] text-white/75">
              These national lines are free, confidential and open 24 hours a day. They are trained
              to help children and the adults who care about them.
            </p>

            <div className="mt-8 space-y-3">
              {HELPLINES.map((h) => (
                <a
                  key={h.number}
                  href={h.href}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 p-5 transition-all duration-300 hover:border-white/40 hover:bg-white/10"
                >
                  <div>
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white/70">
                      {h.name}
                    </p>
                    <p className="mt-1 text-[0.85rem] text-white/80">{h.note}</p>
                  </div>
                  <span className="hero-serif flex-shrink-0 text-[1.5rem] font-bold leading-none text-[#F2B33D]">
                    {h.number}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-green-700/12 bg-white/55 p-8 sm:p-12 lg:p-14">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-40 lg:self-start">
            <SectionHeading
              eyebrow="How we handle your report"
              title="What happens after you press send."
              intro="We follow a clear, confidential process for every concern. These are the four things that happen next."
            />

            <ul className="mt-10 space-y-6">
              {[
                {
                  t: "Your report is received",
                  b: "It lands directly with our designated Safeguarding Lead — and no one else. Not the wider team, not the person being reported.",
                },
                {
                  t: "We assess the risk within 24 hours",
                  b: "A small group reviews the concern, decides on the immediate steps needed to keep the child safe, and agrees what further action to take.",
                },
                {
                  t: "We act, in line with the law",
                  b: "Depending on what we find, we may involve the child's guardian, the county child protection unit, the police, or other authorities — always in the best interests of the child.",
                },
                {
                  t: "We close the loop with you",
                  b: "If you left contact details, we will update you on what was done — while keeping the child's identity and rights fully protected.",
                },
              ].map((step, i) => (
                <li key={step.t} className="flex items-start gap-5">
                  <span className="mt-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-green-700 text-[0.72rem] font-bold text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="hero-serif text-[1.05rem] font-bold text-[#111111]">{step.t}</p>
                    <p className="mt-2 text-[0.9rem] leading-[1.8] text-[#4A4A42]">{step.b}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex items-start gap-4 rounded-2xl border border-[#E2703A]/25 bg-[#E2703A]/5 p-5">
              <span className="mt-0.5 grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-[#E2703A] text-white">
                <Icon.Alert className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[0.92rem] font-bold text-[#111111]">
                  Please do not investigate yourself.
                </p>
                <p className="mt-1 text-[0.88rem] leading-[1.75] text-[#4A4A42]">
                  If you suspect abuse, do not question the child, do not contact the person
                  suspected, and do not try to gather evidence. Just tell us what you saw or heard,
                  and let our trained team take it from there.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="relative rounded-[28px] border border-green-700/12 bg-white/85 p-6 shadow-[0_36px_80px_-44px_rgba(20,83,45,0.45)] backdrop-blur-sm sm:p-8 lg:p-10"
          >
            <div className="flex items-start gap-4 rounded-2xl border border-green-700/12 bg-green-700/5 p-4">
              <span className="mt-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-green-700 text-white">
                <Icon.Lock className="h-4 w-4" />
              </span>
              <p className="text-[0.85rem] leading-[1.7] text-[#4A4A42]">
                Your report goes straight to the Safeguarding Lead. We do not share it with
                anyone else, and we never reveal who reported a concern.
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <label className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                  Who are you? <span className="text-[#E2703A]">*</span>
                </label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {REPORT_RELATIONSHIPS.map((opt) => {
                    const active = form.reporterType === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, reporterType: opt }))}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-[0.85rem] font-semibold transition-all duration-200 ${
                          active
                            ? "border-green-700 bg-green-700/6 text-green-700"
                            : "border-green-700/15 bg-white text-[#4A4A42] hover:border-green-700/40"
                        }`}
                      >
                        <span>{opt}</span>
                        <span
                          className={`grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border transition-all duration-200 ${
                            active
                              ? "border-green-700 bg-green-700 text-white"
                              : "border-green-700/25 text-transparent"
                          }`}
                        >
                          <Icon.Check className="h-3 w-3" />
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.reporterType && (
                  <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">
                    {errors.reporterType}
                  </p>
                )}
              </div>

              <label
                htmlFor="anonymous"
                className="group flex cursor-pointer items-start gap-3.5 rounded-xl border border-green-700/12 bg-white/55 p-4 transition-colors duration-200 hover:border-green-700/25 hover:bg-white/85"
              >
                <span className="relative mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center">
                  <input
                    id="anonymous"
                    type="checkbox"
                    checked={form.anonymous}
                    onChange={(e) => setForm((f) => ({ ...f, anonymous: e.target.checked }))}
                    className="peer sr-only"
                  />
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-md border transition-all duration-200 ${
                      form.anonymous
                        ? "border-green-700 bg-green-700 text-[#FBF7F0]"
                        : "border-green-700/25 bg-white text-transparent"
                    }`}
                  >
                    <Icon.Check className="h-3 w-3" />
                  </span>
                </span>
                <span>
                  <span className="block text-[0.88rem] font-semibold text-[#111111]">
                    I want to report this anonymously
                  </span>
                  <span className="mt-1 block text-[0.78rem] leading-[1.6] text-[#4A4A42]/80">
                    We will still act on your report. We just won't be able to follow up with you.
                  </span>
                </span>
              </label>

              {!form.anonymous && (
                <>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                        Your name <span className="text-[#E2703A]">*</span>
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
                          <Icon.User className="h-4 w-4" />
                        </span>
                        <input
                          type="text"
                          value={form.fullName}
                          onChange={handleChange("fullName")}
                          placeholder="e.g. Amina Wanjiku"
                          className={`${inputWithIcon} ${errors.fullName ? "border-[#E2703A]/60" : ""}`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                        Phone number
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
                          <Icon.Phone className="h-4 w-4" />
                        </span>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={handleChange("phone")}
                          placeholder="+254 7xx xxx xxx"
                          className={`${inputWithIcon} ${errors.phone ? "border-[#E2703A]/60" : ""}`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                      Email address
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
                        <Icon.Mail className="h-4 w-4" />
                      </span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={handleChange("email")}
                        placeholder="you@example.com"
                        className={`${inputWithIcon} ${errors.email ? "border-[#E2703A]/60" : ""}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                    Your relationship to the child <span className="text-[#E2703A]">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.relationship}
                    onChange={handleChange("relationship")}
                    placeholder="e.g. Teacher, aunt, neighbour"
                    className={`${inputClass} ${errors.relationship ? "border-[#E2703A]/60" : ""}`}
                  />
                  {errors.relationship && (
                    <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                      {errors.relationship}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                    Where did this happen? <span className="text-[#E2703A]">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
                      <Icon.MapPin className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={form.location}
                      onChange={handleChange("location")}
                      placeholder="e.g. Loitokitok, Kimana"
                      className={`${inputWithIcon} ${errors.location ? "border-[#E2703A]/60" : ""}`}
                    />
                  </div>
                  {errors.location && (
                    <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                  Child's name{" "}
                  <span className="font-medium normal-case tracking-normal text-[#4A4A42]/60">
                    (optional — leave blank if you do not know)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.childName}
                  onChange={handleChange("childName")}
                  placeholder="First name or nickname is enough"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                  What kind of concern is this? <span className="text-[#E2703A]">*</span>
                </label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {REPORT_CONCERNS.map((c) => {
                    const active = form.concerns.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleConcern(c.id)}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-[0.85rem] font-semibold transition-all duration-200 ${
                          active
                            ? "border-green-700 bg-green-700/6 text-green-700"
                            : "border-green-700/15 bg-white text-[#4A4A42] hover:border-green-700/40"
                        }`}
                      >
                        <span>{c.label}</span>
                        <span
                          className={`grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border transition-all duration-200 ${
                            active
                              ? "border-green-700 bg-green-700 text-white"
                              : "border-green-700/25 text-transparent"
                          }`}
                        >
                          <Icon.Check className="h-3 w-3" />
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.concerns && (
                  <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">
                    {errors.concerns}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                  How urgent is this? <span className="text-[#E2703A]">*</span>
                </label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {REPORT_URGENCY.map((u) => {
                    const active = form.urgency === u.id;
                    const isImmediate = u.id === "immediate";
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, urgency: u.id }))}
                        className={`rounded-xl border px-4 py-3.5 text-left transition-all duration-200 ${
                          active
                            ? isImmediate
                              ? "border-[#E2703A] bg-[#E2703A]/8"
                              : "border-green-700 bg-green-700/6"
                            : "border-green-700/15 bg-white hover:border-green-700/40"
                        }`}
                      >
                        <span
                          className={`block text-[0.88rem] font-bold ${
                            active
                              ? isImmediate
                                ? "text-[#E2703A]"
                                : "text-green-700"
                              : "text-[#111111]"
                          }`}
                        >
                          {u.label}
                        </span>
                        <span className="mt-0.5 block text-[0.7rem] leading-snug text-[#4A4A42]/80">
                          {u.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.urgency && (
                  <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.urgency}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                  Tell us what happened <span className="text-[#E2703A]">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={handleChange("description")}
                  rows={6}
                  placeholder="Describe what you saw, heard or were told — as clearly as you can. Please write in your own words; you do not need to be certain."
                  className={`w-full resize-none rounded-xl border bg-white px-4 py-3.5 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:ring-2 ${
                    errors.description
                      ? "border-[#E2703A]/60 focus:border-[#E2703A] focus:ring-[#E2703A]/20"
                      : "border-green-700/15 focus:border-green-700 focus:ring-green-700/15"
                  }`}
                />
                {errors.description ? (
                  <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">
                    {errors.description}
                  </p>
                ) : (
                  <p className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70">
                    A short paragraph is enough. You are not expected to be certain or complete.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-3 block text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42]">
                  How may we contact you? <span className="text-[#E2703A]">*</span>
                </label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                  {REPORT_CONTACT.map((c) => {
                    const active = form.contactPreference === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, contactPreference: c.id }))}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-[0.82rem] font-semibold transition-all duration-200 ${
                          active
                            ? "border-green-700 bg-green-700/6 text-green-700"
                            : "border-green-700/15 bg-white text-[#4A4A42] hover:border-green-700/40"
                        }`}
                      >
                        <span>{c.label}</span>
                        <span
                          className={`grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border transition-all duration-200 ${
                            active
                              ? "border-green-700 bg-green-700 text-white"
                              : "border-green-700/25 text-transparent"
                          }`}
                        >
                          <Icon.Check className="h-3 w-3" />
                        </span>
                      </button>
                    );
                  })}
                </div>
                {errors.contactPreference && (
                  <p className="mt-2 text-[0.75rem] font-medium text-[#E2703A]">
                    {errors.contactPreference}
                  </p>
                )}
              </div>

              <label
                htmlFor="acknowledged"
                className="group flex cursor-pointer items-start gap-3.5 rounded-xl border border-green-700/12 bg-white/55 p-4 transition-colors duration-200 hover:border-green-700/25 hover:bg-white/85"
              >
                <span className="relative mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center">
                  <input
                    id="acknowledged"
                    type="checkbox"
                    checked={form.acknowledged}
                    onChange={(e) => setForm((f) => ({ ...f, acknowledged: e.target.checked }))}
                    className="peer sr-only"
                  />
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-md border transition-all duration-200 ${
                      form.acknowledged
                        ? "border-green-700 bg-green-700 text-[#FBF7F0]"
                        : errors.acknowledged
                        ? "border-[#E2703A]/60 bg-white text-transparent"
                        : "border-green-700/25 bg-white text-transparent"
                    }`}
                  >
                    <Icon.Check className="h-3 w-3" />
                  </span>
                </span>
                <span className="text-[0.82rem] leading-[1.7] text-[#4A4A42]">
                  I understand that this report will be handled confidentially by the MKCDP
                  Safeguarding Lead, may be shared with child protection authorities where
                  required by law, and that deliberately false reports are not acceptable.
                </span>
              </label>
              {errors.acknowledged && (
                <p className="-mt-3 text-[0.75rem] font-medium text-[#E2703A]">
                  {errors.acknowledged}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="group mt-9 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#E2703A] px-8 py-[1.15rem] text-[0.82rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_20px_40px_-18px_rgba(226,112,58,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c95c2b] active:scale-[0.99]"
            >
              Submit confidential report
              <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <div className="mt-5 flex items-start gap-3 text-[0.78rem] leading-[1.7] text-[#4A4A42]/80">
              <Icon.Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-700" />
              <p>
                If a child is in immediate danger, please do not wait for this form. Call{" "}
                <a href="tel:116" className="font-bold text-green-700 underline decoration-green-700/30 underline-offset-4 hover:decoration-green-700">
                  116
                </a>{" "}
                (Childline Kenya) or{" "}
                <a href="tel:999" className="font-bold text-green-700 underline decoration-green-700/30 underline-offset-4 hover:decoration-green-700">
                  999
                </a>{" "}
                (Police).
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function TakeActionHero() {
  return (
    <section className="relative overflow-hidden bg-[#FBF7F0] pt-16 lg:pt-24">
      <div className="mx-auto max-w-[1560px] px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-green-700">
              <span className="h-px w-8 bg-green-700" />
              Take Action
            </span>
            <h1 className="hero-serif text-[clamp(2.1rem,6.4vw,4.4rem)] font-bold leading-[1.06] tracking-[-0.022em] text-[#111111]">
              Change does not
              <br />
              happen by watching.
              <br />
              <span className="italic text-green-700">It happens by moving.</span>
            </h1>
          </div>

          <div className="lg:pb-3">
            <p className="max-w-[520px] text-[1.0625rem] leading-[1.85] text-[#3D3D37]">
              Five ways to stand with the children and families we serve. Give monthly, give once,
              give your time, partner with us, or help keep a child safe. Every one of them changes
              a life — including, quietly, your own.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-green-700/15 pt-6">
              {[
                { v: "Five", l: "Ways to move" },
                { v: "One", l: "Shared mission" },
                { v: "Every", l: "Life changed counts" },
              ].map((item) => (
                <div key={item.l}>
                  <p className="hero-serif text-[1.25rem] font-bold leading-none text-green-700">
                    {item.v}
                  </p>
                  <p className="mt-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]/75">
                    {item.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(20,83,45,0.09) 0px, rgba(20,83,45,0.09) 1px, transparent 1px, transparent 22px)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 65%, transparent)",
          maskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 65%, transparent)",
        }}
      />
    </section>
  );
}

function TakeActionHub() {
  return (
    <>
      <TakeActionHero />

      <section className="relative py-20 lg:py-28">
        <div className="mx-auto max-w-[1560px] px-6 sm:px-10 lg:px-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.55]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(20,83,45,0.09) 0px, rgba(20,83,45,0.09) 1px, transparent 1px, transparent 22px)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 65%, transparent)",
              maskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 65%, transparent)",
            }}
          />
          <SectionHeading
            eyebrow="Choose your path"
            title="Five ways to move with us."
            intro="Give monthly, give once, give your time, partner with us, or help keep a child safe. Every one of them moves the same work forward."
          />

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((s, i) => (
              <Link
                key={s.slug}
                to={`/take-action/${s.slug}`}
                className={`group relative flex flex-col rounded-[28px] border border-green-700/12 bg-white/70 p-8 shadow-[0_28px_70px_-46px_rgba(20,83,45,0.5)] transition-all duration-500 hover:-translate-y-1.5 hover:border-green-700/30 hover:bg-white/85 hover:shadow-[0_36px_80px_-46px_rgba(20,83,45,0.65)] ${
                  i === 1 ? "lg:mt-8" : i === 2 ? "lg:mt-16" : ""
                }`}
              >
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-green-700">
                  {s.tag}
                </p>

                <h3 className="hero-serif mt-4 text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-tight text-[#111111]">
                  {s.label}
                </h3>

                <p className="mt-5 flex-1 text-[0.95rem] leading-[1.8] text-[#4A4A42]">
                  {s.desc}
                </p>

                <div className="mt-8 inline-flex items-center justify-between gap-3 border-t border-green-700/15 pt-6 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-green-700 transition-colors duration-300 group-hover:text-[#15543A]">
                  <span>
                    {s.slug === "donate"
                      ? "Make a gift"
                      : s.slug === "sponsor-a-child"
                      ? "Meet the children"
                      : s.slug === "volunteer"
                      ? "Browse opportunities"
                      : s.slug === "partnerships"
                      ? "Partner with us"
                      : "Report a concern"}
                  </span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Breadcrumb({ label }) {
  return (
    <nav aria-label="Breadcrumb" className="relative border-b border-green-700/12 bg-[#FBF7F0]">
      <div className="mx-auto max-w-[1560px] px-6 py-5 sm:px-10 lg:px-14 lg:py-6">
        <ol className="flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.16em]">
          <li>
            <Link
              to="/take-action"
              className="text-green-700 transition-colors duration-200 hover:text-green-950 hover:underline"
            >
              Take Action
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
          We couldn't find that page in the Take Action section.
        </h1>
        <Link
          to="/take-action"
          className="mt-10 inline-flex items-center gap-3 rounded-xl bg-green-700 px-7 py-[1.05rem] text-[0.78rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_16px_34px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-950"
        >
          Back to Take Action
          <Icon.ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export default function TakeAction() {
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

      {!section && <TakeActionHub />}

      {section && !active && <NotFound />}

      {section && active && (
        <>
          <Breadcrumb label={active.label} />
          <main className="relative py-16 lg:py-24">
            <div className="mx-auto max-w-[1560px] px-6 sm:px-10 lg:px-14">
              {active.id === "donate" && <Donate />}
              {active.id === "sponsor-a-child" && <SponsorAChild />}
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