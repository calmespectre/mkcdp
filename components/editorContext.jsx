import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";

const STORAGE_KEY = "mkcdp.edits.v2";
const AUTH_API = import.meta.env?.VITE_API_URL || "http://127.0.0.1:8000/api/auth";
const API_BASE = AUTH_API.replace(/\/auth\/?$/, "") + "/site-content";
const ACCESS_KEY = "mkcdp.access";
const SAVE_DEBOUNCE_MS = 700;
const MAX_IMAGE_MB = 10;

function readAccessToken() {
  try {
    return window.localStorage.getItem(ACCESS_KEY);
  } catch {
    return null;
  }
}

export const DEFAULT_CONTENT = {
  takeAction: {
    sections: [
      { slug: "donate", id: "donate", label: "Donate", short: "Donate", desc: "Every shilling is a trust, every report a promise kept. Fund meals, books, health, and the everyday cost of staying in school.", tag: "Give once or often", image: "/img1.jpg", accent: "#E2703A", ctaLabel: "Make a gift", hidden: false },
      { slug: "sponsor-a-child", id: "sponsor-a-child", label: "Sponsor a Child", short: "Sponsor", desc: "Put a real child in a real classroom for KES 2,500 a month. Real names. Real schools. Real letters twice a year.", tag: "Give monthly", image: "/img3.jpg", accent: "#F2B33D", ctaLabel: "Meet the children", hidden: false },
      { slug: "send-a-gift", id: "send-a-gift", label: "Send a Gift", short: "Gift", desc: "Browse real needs from real children. Pick what you want to cover, set the quantity, and check out in your own currency.", tag: "Gift marketplace", image: "/img5.jpg", accent: "#7FB069", ctaLabel: "Browse the marketplace", hidden: false },
      { slug: "send-a-gift-cart", id: "send-a-gift-cart", label: "Basket", short: "Basket", desc: "Review your basket and check out.", tag: "Checkout", image: "/img5.jpg", accent: "#7FB069", ctaLabel: "Open", hidden: true },
      { slug: "volunteer", id: "volunteer", label: "Volunteer", short: "Volunteer", desc: "Teach, mentor, design, translate, or help us run the field. Skilled and unskilled roles, on-site and remote.", tag: "Give your time", image: "/img4.jpg", accent: "#7FB069", ctaLabel: "Browse opportunities", hidden: false },
      { slug: "partnerships", id: "partnerships", label: "Partnerships", short: "Partner", desc: "Companies, foundations, governments and faith groups — co-design a partnership that moves children's futures forward.", tag: "Give together", image: "/img5.jpg", accent: "#1C6B4B", ctaLabel: "Partner with us", hidden: false },
      { slug: "report-safeguarding", id: "report-safeguarding", label: "Report a Concern", short: "Report", desc: "A safe, confidential way to report a safeguarding concern about a child. Every report is taken seriously and handled with care.", tag: "Keep children safe", image: "/img8.png", accent: "#E2703A", ctaLabel: "Report a concern", hidden: false },
    ],
    hub: {
      kicker: "Take Action",
      title: "Change does not\nhappen by watching.\nIt happens by moving.",
      subtitle: "Six ways to stand with the children and families we serve. Give monthly, give once, browse the gift marketplace, give your time, partner with us, or help keep a child safe. Every one of them changes a life — including, quietly, your own.",
      headingTitle: "Six ways to move with us.",
      headingIntro: "Give monthly, give once, browse the gift marketplace, give your time, partner with us, or help keep a child safe. Every one of them moves the same work forward.",
      stats: [
        { v: "Six", l: "Ways to move" },
        { v: "One", l: "Shared mission" },
        { v: "Every", l: "Life changed counts" },
      ],
    },
    payMethods: [
      { id: "mpesa", label: "M-Pesa", hint: "Fastest in Kenya" },
      { id: "card", label: "Card", hint: "Visa · Mastercard" },
      { id: "bank", label: "Bank transfer", hint: "For larger gifts" },
    ],
    needs: [
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
    ],
    coverage: [
      { icon: "school", title: "School fees", body: "Termly fees paid directly to the school, so no child is sent home for lack of payment." },
      { icon: "book", title: "Books & uniform", body: "Textbooks, exercise books, uniforms, and shoes — replaced as the child grows." },
      { icon: "plate", title: "Daily meals", body: "A hot lunch at school every day, often the most reliable meal the child eats." },
      { icon: "heart", title: "Health & wellbeing", body: "Routine check-ups, treatment when sick, and counselling support when needed." },
      { icon: "user", title: "Mentorship", body: "A local mentor checks in monthly, tracks progress, and stands with the family." },
      { icon: "mail", title: "Letters & updates", body: "You receive a handwritten letter from your sponsored child twice a year." },
    ],
    sponsorSteps: [
      { n: "01", title: "Choose a child", body: "Browse children waiting for a sponsor. Every profile is real, verified by our field team." },
      { n: "02", title: "Set up your gift", body: "A monthly gift of KES 2,500 or more. Cancel anytime. 100% of the school-fee portion is passed directly to the school." },
      { n: "03", title: "Get matched", body: "Within 48 hours you receive your child's welcome pack — their photo, their story, and their first letter." },
      { n: "04", title: "Stay connected", body: "Two letters a year, one photo update, and an annual school report. You will know exactly where your gift went." },
    ],
    sponsorFaq: [
      { q: "How much does it cost to sponsor a child?", a: "Sponsorship starts at KES 2,500 per month (about $19 USD). This covers school fees, meals, learning materials, and health support. Older children in secondary school may require KES 3,500 per month." },
      { q: "Can I choose which child I sponsor?", a: "Yes. Every child on this page is a real child waiting for a sponsor. Pick the one whose story speaks to you, and we will match you within 48 hours." },
      { q: "How long does sponsorship last?", a: "Sponsorship usually runs from when a child joins the programme until they complete secondary school. There is no minimum commitment, and you may cancel at any time with no penalty." },
      { q: "Can I write to my sponsored child?", a: "Absolutely. We encourage it. Letters are translated where needed and passed to the child through their local mentor. Photos are allowed; gifts are not, to keep things fair across the programme." },
      { q: "How do I know my money reaches the child?", a: "Every sponsor receives a full annual report showing exactly how their gift was spent, plus termly school results. Our accounts are audited each year and published on the Publications page." },
    ],
    donut: {},
    donate: {
      eyebrow: "Gifts & Donations",
      titleLine1: "Every shilling is a trust.",
      titleLine2: "Every report is a promise kept.",
      subtitle: "Your gift goes directly to programmes that put children in classrooms, families on their feet, and communities in charge of their own future.",
      badges: [
        { t: "Audited", d: "Yearly" },
        { t: "Secure", d: "Encrypted" },
        { t: "Direct", d: "94%" },
      ],
      currencyLabel: "Give in your currency",
      currencyHint: "We'll convert to KES at the displayed rate on submit.",
      giveLabel: "Give",
      frequencyOnce: "One-time",
      frequencyMonthly: "Monthly",
      amountLabel: "Amount",
      amountPlaceholderPrefix: "Enter amount in",
      methodLabel: "Payment method",
      detailsLabel: "Your details",
      firstNameLabel: "First name",
      firstNamePlaceholder: "Amina",
      lastNameLabel: "Last name",
      lastNamePlaceholder: "Wanjiku",
      emailLabel: "Email address",
      emailPlaceholder: "you@example.com",
      emailHint: "We'll send your receipt here.",
      phoneLabel: "Phone number",
      phonePlaceholder: "+254 7xx xxx xxx",
      submitPrefix: "Give",
      secure: "Your payment is processed over a secure connection. MKCDP never stores card details on its servers.",
      mobileSteps: ["1 · Currency", "2 · How often", "3 · Amount", "4 · Payment method", "5 · Your details"],
      mobileMonthly: "Monthly gift",
      mobileOneTime: "One-time gift",
      mobileGiveNow: "Give now",
      monthlySummary: "Your monthly gift",
      oneTimeSummary: "Your gift",
      successKicker: "Gift received",
      successTitlePrefix: "Thank you,",
      successBodyOnce: "one-time",
      successBodyMonthly: "monthly",
      successBodyMiddle: "gift of",
      successBodySuffix: "has been received. A confirmation email is on its way to",
    },
    gift: {
      kicker: "Gift Marketplace",
      titleLine1: "Real needs. Real children.",
      titleLine2: "Pick one. Or many.",
      subtitle: "Every item below is a specific need one of our children has right now. Add what you want to cover, set the quantity, and check out in your own currency.",
      currencyLabel: "Currency",
      addLabel: "Add",
      basketSingular: "item in basket",
      basketPlural: "items in basket",
      viewBasket: "View basket →",
    },
    cart: {
      title: "Your basket",
      removeLabel: "Remove",
      detailsTitle: "Your details",
      fullNameLabel: "Full name",
      fullNamePlaceholder: "Amina Wanjiku",
      emailLabel: "Email address",
      emailPlaceholder: "you@example.com",
      emailHint: "We'll send your receipt here.",
      phoneLabel: "Phone number",
      phoneOptional: "(optional)",
      phonePlaceholder: "+254 7xx xxx xxx",
      phoneHintMpesa: "Required for M-Pesa. Kenyan numbers only (+254).",
      phoneHintCard: "Not needed for card payments.",
      paymentTitle: "Payment",
      cardLabel: "Card",
      cardSub: "Visa · Mastercard · Worldwide",
      mpesaLabel: "M-Pesa",
      mpesaSub: "Kenya only (+254)",
      cardNumberLabel: "Card number",
      cardNumberPlaceholder: "1234 5678 9012 3456",
      expiryLabel: "Expiry",
      expiryPlaceholder: "MM / YY",
      cvcLabel: "CVC",
      cvcPlaceholder: "123",
      cardHolderLabel: "Name on card",
      cardHolderPlaceholder: "AMINA WANJIKU",
      mpesaNote: "We'll send an M-Pesa STK push to the phone number you entered above. Approve it on your handset to complete the payment.",
      mpesaNoteSub: "Available for Kenyan numbers only (+254 7xx / +254 1xx).",
      orderSummary: "Order summary",
      itemsLabel: "Items",
      subtotalLabel: "Subtotal (KES)",
      totalLabel: "Total",
      checkoutPrefix: "Checkout ·",
      addMore: "Add more needs",
      secure: "Payments are processed over a secure connection. MKCDP never stores card details on its servers.",
      emptyTitle: "Your basket is empty.",
      emptyBrowse: "Browse",
      successKicker: "Gift sent",
      successTitlePrefix: "Thank you,",
      successBodyPrefix: "Your gift of",
      successBodyMiddle: "has been received. A confirmation email is on its way to",
      successAnother: "Send another gift",
    },
    sponsor: {
      kicker: "Sponsor a Child",
      titleLine1: "One child. One sponsor.",
      titleLine2: "One future rewritten.",
      subtitle: "For KES 2,500 a month — about the price of two cups of coffee a week — you can put a real child in a real classroom and keep them there, term after term, until they walk out with a future.",
      ctaMeet: "Meet the children",
      ctaHow: "How it works",
      heroStats: [
        { v: "8,750+", l: "Children sponsored" },
        { v: "14", l: "Partner schools" },
        { v: "94%", l: "Gift to programme" },
      ],
      featuredBadge: "Waiting for a sponsor",
      featuredCtaPrefix: "Sponsor",
      yourChoiceLabel: "Your choice",
      continuePrefix: "Continue to give · KES",
      continueSuffix: "/mo",
      changeChoice: "Change",
      listKicker: "Waiting for a sponsor",
      listTitle: "Real children, real classrooms, right now.",
      listIntro: "Each child below has been visited by our field team. Their profiles are current as of this month.",
      filterApply: "Filter",
      filterOf: "of",
      filterTitle: "Filter children",
      filterShowing: "Showing",
      filterClearAll: "Clear all",
      filterAge: "Age",
      filterBirthYear: "Birth year",
      filterAllYears: "All years",
      filterGender: "Gender",
      filterRegion: "Region",
      filterClear: "Clear filters",
      emptyTitle: "No children match those filters right now.",
      emptyBody: "Try widening your search, or check back soon — new profiles are added every month.",
      coverageKicker: "What your gift covers",
      coverageTitle: "Nothing hidden. Every shilling accounted for.",
      coverageIntro: "Your monthly gift is pooled with other sponsors to cover the full cost of one child's education. Here is exactly where it goes.",
      howKicker: "How it works",
      howTitle: "Four steps from stranger to sponsor.",
      promiseTitle: "Our promise to every sponsor",
      promiseBody: "Your money never touches a middleman. School fees are paid directly to the school. Meals are delivered by our field team. Health costs are receipted. You receive the full report every year.",
      faqKicker: "Common questions",
      faqTitle: "Everything you were going to ask.",
      faqIntro: "Still unsure? Our sponsorship team is on hand at",
      faqEmail: "sponsor@mkcdp.org",
    },
    volunteer: {
      kicker: "Volunteer with MKCDP",
      titleLine1: "Give an hour.",
      titleLine2: "Change a childhood.",
      subtitle: "Whether you can teach maths on Saturday, translate a letter, or photograph a field visit twice a year — there is a role here that needs exactly your skills.",
      statRoles: "Open roles",
      statCommitment: "Commitment",
      statCommitmentValue: "Flexible",
      formKicker: "Application form",
      formTitlePrefix: "Apply:",
      formCancel: "Cancel",
      formFullName: "Full name",
      formFullNamePlaceholder: "e.g. Amina Wanjiku",
      formPhone: "Phone number",
      formPhonePlaceholder: "+254 7xx xxx xxx",
      formPhoneHint: "We'll reach you by phone or WhatsApp.",
      formEmail: "Email address",
      formEmailPlaceholder: "you@example.com",
      formEmailHint: "Not required. We'll use it only if you have one.",
      formNoteOptional: "(optional)",
      formAvailability: "When are you available?",
      formNote: "Anything we should know?",
      formNotePlaceholder: "Relevant experience, questions, or anything that would help us match you well.",
      formSubmit: "Submit application",
      formTerms: "By submitting, you agree to our volunteer code of conduct and safeguarding briefing.",
      successKicker: "Application received",
      successTitlePrefix: "Thank you,",
      successBodyPrefix: "We've got your application for",
      successBodyAt: "at",
      successBodyMiddle: "Our volunteer coordinator will call",
      successBodySuffix: "within 48 hours",
      successBodyEmail: "or email",
      successBodyEnd: "with next steps.",
      successBrowse: "Browse other roles",
      listKicker: "Open opportunities",
      listTitle: "Browse and pick your fit.",
      listEmptyTitle: "No roles match that filter right now.",
      listEmptyBody: "Try another filter — or check back soon, we post new roles regularly.",
      listEmptyNoRolesTitle: "New opportunities are on the way.",
      listEmptyNoRolesBody: "We're preparing the next round of volunteer roles. Please check back frequently — new opportunities are added here as soon as they open.",
      notifyCta: "Get notified",
      email: "volunteer@mkcdp.org",
      howKicker: "How it works",
      howTitle: "From application to impact in four steps.",
      expectKicker: "What to expect",
      expectTitle: "We take volunteering seriously — yours and ours.",
      expectIntro: "Every volunteer is safeguarded, briefed, and set up for success. Here's what you can expect from us.",
      expectList: [
        "Safeguarding briefing and background check where required by law",
        "A named buddy who answers questions during your first weeks",
        "Clear deliverables and a regular check-in cadence",
        "A written reference and certificate at the end of your service",
        "Reasonable field expenses covered for on-site roles",
      ],
    },
    volFilters: [
      { id: "all", label: "All roles" },
      { id: "remote", label: "Remote" },
      { id: "onsite", label: "On-site" },
      { id: "skilled", label: "Skilled" },
      { id: "short", label: "Short-term" },
      { id: "long", label: "Long-term" },
    ],
    volSteps: [
      { n: "01", title: "Apply", body: "Pick a role and send us a short note about why it fits you. No CV required — we care about the fit, not the formatting." },
      { n: "02", title: "Chat with us", body: "A 20-minute call to make sure the role is right for both sides. We will tell you exactly what the work looks like." },
      { n: "03", title: "Onboard", body: "Background check (where required by law), safeguarding briefing, and a buddy who shows you the ropes." },
      { n: "04", title: "Get to work", body: "Start when you are ready. Regular check-ins, honest feedback, and a certificate at the end of your service." },
    ],
    availabilityOptions: [
      { id: "weekday-am", label: "Weekday mornings" },
      { id: "weekday-pm", label: "Weekday afternoons" },
      { id: "weekends", label: "Weekends" },
      { id: "evenings", label: "Evenings" },
      { id: "flexible", label: "Flexible / any time" },
    ],
    opportunities: [],
    partnerships: {
      kicker: "Start a conversation",
      title: "Tell us about your organisation.",
      subtitle: "A short form is all we need. No commitment. Our team will reply within two working days with ideas that fit your goals.",
      mobileSteps: ["1 · Organisation", "2 · Partnership type", "3 · Anything else"],
      orgLabel: "Organisation",
      orgPlaceholder: "e.g. Acacia Foundation",
      contactLabel: "Contact person",
      contactPlaceholder: "e.g. Amina Wanjiku",
      emailLabel: "Email address",
      emailPlaceholder: "you@organisation.com",
      phoneLabel: "Phone number",
      phoneOptional: "(optional)",
      phonePlaceholder: "+254 7xx xxx xxx",
      typeLabel: "Partnership type",
      messageLabel: "Anything else we should know?",
      messageOptional: "(optional)",
      messagePlaceholder: "Tell us about your goals, budget range, or the programmes you're most interested in.",
      terms: "We treat every enquiry in confidence and reply within two working days.",
      submit: "Send enquiry",
      successKicker: "Enquiry received",
      successTitlePrefix: "Thank you,",
      successBodyPrefix: "We've received your enquiry on behalf of",
      successBodyMiddle: "Our partnerships team will reply to",
      successBodySuffix: "within two working days with next steps.",
      successAnother: "Send another",
      successAnotherMobile: "Send another enquiry",
    },
    partnerTypes: [
      { n: "01", icon: "briefcase", title: "Corporate CSR", body: "Match your team's giving, sponsor a school, or fund a whole programme. We co-design, you get the impact report.", examples: ["Payroll giving", "School sponsorship", "Cause campaigns"] },
      { n: "02", icon: "globe", title: "Foundations & Trusts", body: "Multi-year grants to fund our four pillars — education, health, child protection and livelihoods.", examples: ["Programme grants", "Core funding", "Capital projects"] },
      { n: "03", icon: "sparkle", title: "In-kind Giving", body: "Books, laptops, uniforms, medical supplies, training, or professional services. Every contribution moves work forward.", examples: ["Books & devices", "Medical supplies", "Pro-bono services"] },
      { n: "04", icon: "users", title: "Community & Faith", body: "Churches, mosques, schools and local groups raising funds or volunteering together for the children next door.", examples: ["Fundraisers", "Volunteer days", "Awareness drives"] },
      { n: "05", icon: "school", title: "Academic & Research", body: "Universities and research institutes partnering on programme design, monitoring, evaluation and learning.", examples: ["Impact studies", "M&E support", "Student placements"] },
      { n: "06", icon: "heart", title: "Government & Public", body: "County and national government departments aligning policy, funding and delivery with the communities we serve.", examples: ["County partnerships", "Policy alignment", "Public funding"] },
    ],
    safeguarding: {
      kicker: "Report a Safeguarding Concern",
      titleLine1: "If something worries you,",
      titleLine2: "please tell us.",
      subtitle: "Every concern — big or small, certain or unsure — is taken seriously. You can report anonymously. You can report on behalf of someone else. What matters is that a child is safer because you spoke up.",
      badges: [
        { t: "Confidential", d: "Small team" },
        { t: "Reviewed", d: "24 hours" },
        { t: "Protected", d: "Anonymous OK" },
      ],
      dangerKicker: "If a child is in danger now",
      dangerTitle: "Do not wait. Call now.",
      dangerBody: "These national lines are free, confidential and open 24 hours a day. They are trained to help children and the adults who care about them.",
      mobileCallTo: "Do not wait. Tap to call.",
      confidential: "Your report goes straight to the Safeguarding Lead. We do not share it with anyone else, and we never reveal who reported a concern.",
      formWhoAreYou: "Who are you?",
      formAnonymous: "I want to report this anonymously",
      formAnonymousHint: "We will still act on your report. We just won't be able to follow up with you.",
      formYourName: "Your name",
      formYourNamePlaceholder: "e.g. Amina Wanjiku",
      formPhone: "Phone number",
      formPhonePlaceholder: "+254 7xx xxx xxx",
      formEmail: "Email address",
      formEmailPlaceholder: "you@example.com",
      formRelationship: "Your relationship to the child",
      formRelationshipPlaceholder: "e.g. Teacher, aunt, neighbour",
      formLocation: "Where did this happen?",
      formLocationPlaceholder: "e.g. Loitokitok, Kimana",
      formChildName: "Child's name",
      formChildNameOptional: "(optional)",
      formChildNamePlaceholder: "First name or nickname is enough",
      formConcernType: "What kind of concern is this?",
      formUrgency: "How urgent is this?",
      formDescription: "Tell us what happened",
      formDescriptionPlaceholder: "Describe what you saw, heard or were told — as clearly as you can. Please write in your own words; you do not need to be certain.",
      formDescriptionHint: "A short paragraph is enough. You are not expected to be certain or complete.",
      formContactPref: "How may we contact you?",
      formAcknowledge: "I understand that this report will be handled confidentially by the MKCDP Safeguarding Lead, may be shared with child protection authorities where required by law, and that deliberately false reports are not acceptable.",
      formSubmit: "Submit confidential report",
      formFootnote: "If a child is in immediate danger, please do not wait for this form. Call",
      formFootnoteMiddle: "(Childline Kenya) or",
      formFootnoteEnd: "(Police).",
      howKicker: "How we handle your report",
      howTitle: "What happens after you press send.",
      howIntro: "We follow a clear, confidential process for every concern. These are the four things that happen next.",
      howSteps: [
        { t: "Your report is received", b: "It lands directly with our designated Safeguarding Lead — and no one else. Not the wider team, not the person being reported." },
        { t: "We assess the risk within 24 hours", b: "A small group reviews the concern, decides on the immediate steps needed to keep the child safe, and agrees what further action to take." },
        { t: "We act, in line with the law", b: "Depending on what we find, we may involve the child's guardian, the county child protection unit, the police, or other authorities — always in the best interests of the child." },
        { t: "We close the loop with you", b: "If you left contact details, we will update you on what was done — while keeping the child's identity and rights fully protected." },
      ],
      investigateTitle: "Please do not investigate yourself.",
      investigateBody: "If you suspect abuse, do not question the child, do not contact the person suspected, and do not try to gather evidence. Just tell us what you saw or heard, and let our trained team take it from there.",
      helpKicker: "If you need help right now",
      helpTitle: "These lines are free and always open.",
      helpIntro: "If a child is in immediate danger, please do not wait for us. Call one of these numbers now.",
      successKicker: "Report received",
      successTitle: "Thank you for speaking up.",
      successBody: "Your report has reached our safeguarding team. Every concern is handled in strict confidence, reviewed within 24 hours, and acted on in line with our safeguarding policy and Kenyan child protection law. If you left contact details, we will reach out — but only in the way you asked us to.",
      successAnother: "Make another report",
    },
    reportRelationships: ["The child themselves", "Parent or guardian", "Teacher or school staff", "Community member", "MKCDP staff or volunteer", "Sponsor or donor", "Other"],
    reportConcerns: [
      { id: "physical", label: "Physical abuse" },
      { id: "emotional", label: "Emotional abuse" },
      { id: "sexual", label: "Sexual abuse" },
      { id: "neglect", label: "Neglect" },
      { id: "child-labour", label: "Child labour" },
      { id: "online", label: "Online safety" },
      { id: "bullying", label: "Bullying" },
      { id: "other", label: "Other concern" },
    ],
    reportUrgency: [
      { id: "immediate", label: "Immediate danger", hint: "Child is at risk right now" },
      { id: "urgent", label: "Urgent", hint: "Within 24 hours" },
      { id: "standard", label: "Standard", hint: "Needs review" },
    ],
    reportContact: [
      { id: "phone", label: "Phone call" },
      { id: "whatsapp", label: "WhatsApp" },
      { id: "email", label: "Email" },
      { id: "none", label: "Do not contact" },
    ],
    helplines: [
      { name: "Childline Kenya", number: "116", note: "Toll-free, 24/7. For children and anyone worried about a child.", href: "tel:116", primary: true },
      { name: "National GBV Helpline", number: "1195", note: "Toll-free, 24/7. For gender-based violence and abuse.", href: "tel:1195", primary: false },
      { name: "Police Emergency", number: "999", note: "For immediate danger. Ask for the child protection unit.", href: "tel:999", primary: false },
    ],
    notFound: {
      kicker: "Page not found",
      title: "We couldn't find that page in the Take Action section.",
      cta: "Back to Take Action",
    },
  },
  children: [
    { id: "mk-0241", name: "Mercy", age: 11, birthYear: 2015, gender: "Female", grade: "Grade 5", location: "Loitokitok, Kajiado", region: "Loitokitok", dream: "Wants to become a nurse", story: "Mercy walks 4 km to school every morning. She is the eldest of four and helps her mother sell vegetables on weekends.", image: "/img3.jpg", monthly: 2500, funded: 68 },
    { id: "mk-0189", name: "Brian", age: 9, birthYear: 2017, gender: "Male", grade: "Grade 3", location: "Kimana, Kajiado", region: "Kimana", dream: "Wants to become a teacher", story: "Brian lost his father in 2022. Since joining the programme he has not missed a single day of school.", image: "/img1.jpg", monthly: 2500, funded: 42 },
    { id: "mk-0334", name: "Faith", age: 13, birthYear: 2013, gender: "Female", grade: "Grade 7", location: "Rombo, Kajiado", region: "Rombo", dream: "Wants to become an engineer", story: "Faith is the top of her class in mathematics. She walks 6 km daily to reach the nearest secondary school.", image: "/img4.jpg", monthly: 3500, funded: 91 },
    { id: "mk-0402", name: "Samuel", age: 8, birthYear: 2018, gender: "Male", grade: "Grade 2", location: "Entonet, Kajiado", region: "Entonet", dream: "Wants to become a pilot", story: "Samuel joined the programme last year. He is now the most curious reader in his class.", image: "/img5.jpg", monthly: 2500, funded: 15 },
    { id: "mk-0512", name: "Grace", age: 10, birthYear: 2016, gender: "Female", grade: "Grade 4", location: "Kimana, Kajiado", region: "Kimana", dream: "Wants to become a doctor", story: "Grace looks after her younger brother after school. She has perfect attendance and loves science.", image: "/img1.jpg", monthly: 2500, funded: 30 },
    { id: "mk-0603", name: "David", age: 12, birthYear: 2014, gender: "Male", grade: "Grade 6", location: "Namanga, Kajiado", region: "Namanga", dream: "Wants to become a footballer", story: "David is the captain of his school football team and helps his grandmother with the family shamba.", image: "/img4.jpg", monthly: 2500, funded: 55 },
    { id: "mk-0718", name: "Esther", age: 7, birthYear: 2019, gender: "Female", grade: "Grade 1", location: "Rombo, Kajiado", region: "Rombo", dream: "Wants to become a singer", story: "Esther is the youngest in her class and loves singing during morning assembly.", image: "/img3.jpg", monthly: 2500, funded: 22 },
    { id: "mk-0825", name: "Joseph", age: 14, birthYear: 2012, gender: "Male", grade: "Grade 8", location: "Loitokitok, Kajiado", region: "Loitokitok", dream: "Wants to become a lawyer", story: "Joseph is preparing for his final primary exams. He walks 5 km daily and mentors younger children in his village.", image: "/img5.jpg", monthly: 3500, funded: 78 },
  ],
};

function getDeep(obj, path) {
  if (!path || !obj) return undefined;
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function applyEdits(defaultValue, basePath, edits) {
  if (defaultValue === null || defaultValue === undefined) return defaultValue;
  if (Array.isArray(defaultValue)) {
    return defaultValue.map((item, i) => applyEdits(item, `${basePath}.${i}`, edits));
  }
  if (typeof defaultValue === "object") {
    const next = {};
    for (const k of Object.keys(defaultValue)) {
      next[k] = applyEdits(defaultValue[k], `${basePath}.${k}`, edits);
    }
    return next;
  }
  return basePath in edits ? edits[basePath] : defaultValue;
}

function diffEdits(prev, next) {
  const updates = {};
  const deletes = [];
  for (const key of Object.keys(next)) {
    if (prev[key] !== next[key]) updates[key] = next[key];
  }
  for (const key of Object.keys(prev)) {
    if (!(key in next)) deletes.push(key);
  }
  return { updates, deletes };
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

async function uploadImageFile(file) {
  const token = readAccessToken();

  if (!token) {
    return fileToDataUrl(file);
  }

  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API_BASE}/upload/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });

  if (!res.ok) {
    let detail = "Upload failed.";
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {}
    if (res.status === 404 || res.status === 405) {
      return fileToDataUrl(file);
    }
    throw new Error(detail);
  }

  const data = await res.json();
  if (!data?.url) throw new Error("Upload returned no URL.");
  return data.url;
}

function ImageEditModal({ open, initialValue, onCancel, onSave }) {
  const [url, setUrl] = useState(initialValue || "");
  const [preview, setPreview] = useState(initialValue || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUrl(initialValue || "");
      setPreview(initialValue || "");
      setError("");
      setUploading(false);
      setDragActive(false);
    }
  }, [open, initialValue]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG, JPG, WEBP, GIF).");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`Image is larger than ${MAX_IMAGE_MB} MB.`);
      return;
    }
    setError("");
    setUploading(true);
    try {
      const uploadedUrl = await uploadImageFile(file);
      setUrl(uploadedUrl);
      setPreview(uploadedUrl);
    } catch (err) {
      setError(err?.message || "Could not upload the image.");
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999]">
      <div
        onClick={onCancel}
        aria-hidden="true"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onCancel();
        }}
        className="relative mx-auto flex h-full w-full items-center justify-center px-3 py-4 sm:px-4 sm:py-6"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xl overflow-hidden rounded-2xl border border-green-700/15 bg-[#FBF7F0] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-green-700/10 px-4 py-3 sm:px-5 sm:py-3.5">
            <h3 className="text-[0.82rem] font-bold uppercase tracking-[0.14em] text-green-700 sm:text-[0.9rem]">
              Edit image
            </h3>
            <button
              type="button"
              onClick={onCancel}
              className="grid h-9 w-9 place-items-center rounded-lg text-[#4A4A42] transition-colors hover:bg-green-700/8"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-5">
            <div className="mb-5">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-green-700/12 bg-white">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-contain" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[0.85rem] text-[#4A4A42]/70">
                    No image selected
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  </div>
                )}
              </div>
            </div>

            <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
              Image URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setPreview(e.target.value);
              }}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-xl border border-green-700/15 bg-white px-4 py-3 text-[0.92rem] text-[#111111] outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/15 sm:text-[0.88rem]"
            />

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-green-700/15" />
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#4A4A42]/60">
                or
              </span>
              <span className="h-px flex-1 bg-green-700/15" />
            </div>

            <label className="mb-2 block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
              Upload from your device
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFile(e.dataTransfer?.files?.[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-6 text-center transition-colors sm:py-8 ${
                dragActive
                  ? "border-green-700 bg-green-700/6"
                  : "border-green-700/25 bg-white/60 hover:border-green-700/50 hover:bg-white/85"
              }`}
            >
              <span className="mb-2 grid h-11 w-11 place-items-center rounded-full bg-green-700/8 text-green-700">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4v12" />
                  <path d="m7 9 5-5 5 5" />
                  <path d="M4 20h16" />
                </svg>
              </span>
              <p className="text-[0.9rem] font-semibold text-[#111111]">
                Tap to choose a photo, or drag one here
              </p>
              <p className="mt-1 text-[0.72rem] text-[#4A4A42]/75">
                PNG, JPG, WEBP, GIF · up to {MAX_IMAGE_MB} MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="hidden"
              />
            </div>

            {error && (
              <p className="mt-3 text-[0.78rem] font-medium text-[#E2703A]">{error}</p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-green-700/10 bg-white/50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-end sm:px-5">
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-lg border border-green-700/15 px-4 py-3 text-[0.74rem] font-bold uppercase tracking-[0.1em] text-[#4A4A42] transition hover:bg-green-700/6 sm:w-auto sm:py-2"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={uploading || !url.trim()}
              onClick={() => onSave(url.trim())}
              className="w-full rounded-lg bg-amber-500 px-5 py-3 text-[0.74rem] font-bold uppercase tracking-[0.1em] text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
            >
              Save image
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

const SiteContentContext = createContext(null);

export function EditorProvider({ children }) {
  const [isEditing, setIsEditing] = useState(false);
  const [edits, setEdits] = useState(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pending, setPending] = useState(false);
  const [lastError, setLastError] = useState(null);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [syncMode, setSyncMode] = useState("idle");
  const [defaultRegistry, setDefaultRegistry] = useState({});

  const lastSyncedRef = useRef({});
  const syncTimerRef = useRef(null);
  const saveInFlightRef = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
    } catch {}
  }, [edits]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = readAccessToken();
      try {
        const headers = { Accept: "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch(`${API_BASE}/`, { headers });
        if (!res.ok) throw new Error("load failed");
        const data = await res.json();
        const serverEdits = data?.edits && typeof data.edits === "object" ? data.edits : {};
        if (cancelled) return;
        setEdits(serverEdits);
        lastSyncedRef.current = { ...serverEdits };
        setLastSyncedAt(data?.last_updated ? new Date(data.last_updated) : new Date());
        setSyncMode("synced");
      } catch {
        if (!cancelled) {
          setSyncMode(token ? "error" : "local");
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return undefined;

    const token = readAccessToken();
    if (!token) {
      setPending(false);
      return undefined;
    }

    const { updates, deletes } = diffEdits(lastSyncedRef.current, edits);
    const hasChanges = Object.keys(updates).length > 0 || deletes.length > 0;

    if (!hasChanges) {
      setPending(false);
      return undefined;
    }

    setPending(true);

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(async () => {
      if (saveInFlightRef.current) return;
      saveInFlightRef.current = true;
      setSaving(true);
      setLastError(null);

      const payload = { edits: updates, deletes };

      try {
        const res = await fetch(`${API_BASE}/bulk/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.detail || "Save rejected.");
        }
        lastSyncedRef.current = { ...edits };
        setLastSyncedAt(new Date());
        setPending(false);
        setSyncMode("synced");
      } catch (err) {
        setLastError(err?.message || "Could not save.");
        setSyncMode("error");
      } finally {
        setSaving(false);
        saveInFlightRef.current = false;
      }
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [edits, loaded]);

  const getPath = useCallback(
    (path) => {
      const base = getDeep(DEFAULT_CONTENT, path);
      return applyEdits(base, path, edits);
    },
    [edits]
  );

  const setPath = useCallback((path, value) => {
    setEdits((prev) => (prev[path] === value ? prev : { ...prev, [path]: value }));
  }, []);

  const resetPath = useCallback((path) => {
    setEdits((prev) => {
      if (!(path in prev)) return prev;
      const next = { ...prev };
      delete next[path];
      return next;
    });
  }, []);

  const resetPrefix = useCallback((prefix) => {
    setEdits((prev) => {
      const next = { ...prev };
      for (const k of Object.keys(next)) if (k.startsWith(prefix)) delete next[k];
      return next;
    });
  }, []);

  const resetAll = useCallback(() => setEdits({}), []);

  const getValue = useCallback(
    (key, fallback) => (edits[key] !== undefined ? edits[key] : fallback),
    [edits]
  );

  const setValue = useCallback((key, value) => {
    setEdits((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }, []);

  const resetKey = useCallback((key) => {
    setEdits((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const registerDefault = useCallback((key, value) => {
    if (!key || value === undefined || value === null) return;
    if (typeof value !== "string" && typeof value !== "number") return;
    setDefaultRegistry((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }));
  }, []);

  const flushNow = useCallback(async () => {
    const token = readAccessToken();
    if (!token) return false;

    const { updates, deletes } = diffEdits(lastSyncedRef.current, edits);
    if (Object.keys(updates).length === 0 && deletes.length === 0) return true;

    setSaving(true);
    setLastError(null);
    try {
      const res = await fetch(`${API_BASE}/bulk/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ edits: updates, deletes }),
      });
      if (!res.ok) throw new Error("Save rejected.");
      lastSyncedRef.current = { ...edits };
      setLastSyncedAt(new Date());
      setPending(false);
      setSyncMode("synced");
      return true;
    } catch (err) {
      setLastError(err?.message || "Could not save.");
      setSyncMode("error");
      return false;
    } finally {
      setSaving(false);
    }
  }, [edits]);

  const reloadFromServer = useCallback(async () => {
    const token = readAccessToken();
    setSaving(true);
    setLastError(null);
    try {
      const headers = { Accept: "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/`, { headers });
      if (!res.ok) throw new Error("Reload failed.");
      const data = await res.json();
      const serverEdits = data?.edits && typeof data.edits === "object" ? data.edits : {};
      setEdits(serverEdits);
      lastSyncedRef.current = { ...serverEdits };
      setLastSyncedAt(data?.last_updated ? new Date(data.last_updated) : new Date());
      setPending(false);
      setSyncMode("synced");
      return true;
    } catch (err) {
      setLastError(err?.message || "Could not reload.");
      setSyncMode("error");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const resetOnServer = useCallback(async (prefix) => {
    const token = readAccessToken();
    if (!token) return false;
    try {
      const res = await fetch(`${API_BASE}/reset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(prefix ? { prefix } : {}),
      });
      if (!res.ok) throw new Error("Reset failed.");
      const data = await res.json();
      if (prefix) {
        resetPrefix(prefix);
      } else {
        setEdits({});
      }
      lastSyncedRef.current = {};
      setLastSyncedAt(new Date());
      setPending(false);
      setSyncMode("synced");
      return data;
    } catch (err) {
      setLastError(err?.message || "Could not reset.");
      setSyncMode("error");
      return false;
    }
  }, [resetPrefix]);

  const value = useMemo(
    () => ({
      isEditing,
      setIsEditing,
      edits,
      getPath,
      setPath,
      resetPath,
      resetPrefix,
      resetAll,
      getValue,
      setValue,
      resetKey,
      defaultRegistry,
      registerDefault,
      saving,
      pending,
      lastError,
      lastSyncedAt,
      syncMode,
      flushNow,
      reloadFromServer,
      resetOnServer,
    }),
    [
      isEditing, edits, getPath, setPath, resetPath, resetPrefix, resetAll,
      getValue, setValue, resetKey, defaultRegistry, registerDefault,
      saving, pending, lastError, lastSyncedAt,
      syncMode, flushNow, reloadFromServer, resetOnServer,
    ]
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error("useSiteContent must be used inside EditorProvider");
  return ctx;
}

export function useEditor() {
  return useSiteContent();
}

function EditableBase({
  path,
  id,
  defaultValue,
  as: Tag = "span",
  multiline = false,
  className = "",
  children,
  type = "text",
  onChange,
  ...rest
}) {
  const ctx = useSiteContent();
  const key = path || id;
  const hasPathMode = Boolean(path);
  const fallback =
    defaultValue !== undefined
      ? defaultValue
      : typeof children === "string"
      ? children
      : "";

  const value = hasPathMode ? ctx.getPath(path) : ctx.getValue(key, fallback);
  const ref = useRef(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!hasPathMode) return;
    if (typeof fallback !== "string") return;
    if (!fallback.trim()) return;
    ctx.registerDefault(path, fallback);
  }, [hasPathMode, path, fallback, ctx]);

  useEffect(() => {
    if (!ctx.isEditing) return;
    if (type !== "text") return;
    if (ref.current && document.activeElement !== ref.current) {
      if (ref.current.textContent !== String(value)) ref.current.textContent = String(value);
    }
  }, [ctx.isEditing, value, type]);

  if (type === "number") {
    if (!ctx.isEditing) {
      const display = typeof value === "number" ? value.toLocaleString("en-US") : value;
      return <Tag className={className} {...rest}>{display}</Tag>;
    }
    return (
      <Tag className={`${className} inline-flex items-baseline gap-1`} {...rest}>
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const next = Number(e.target.value) || 0;
            hasPathMode ? ctx.setPath(path, next) : ctx.setValue(key, next);
          }}
          onContextMenu={(e) => {
            if (e.altKey) {
              e.preventDefault();
              hasPathMode ? ctx.resetPath(path) : ctx.resetKey(key);
            }
          }}
          className="w-28 rounded-sm border-2 border-amber-400 bg-amber-50 px-2 py-1 text-[0.9em] tabular-nums text-inherit outline-none sm:py-0.5"
        />
      </Tag>
    );
  }

  if (!ctx.isEditing) {
    return <Tag className={className} {...rest}>{value}</Tag>;
  }

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        setFocused(false);
        const next = e.currentTarget.textContent ?? "";
        if (next !== value) {
          hasPathMode ? ctx.setPath(path, next) : ctx.setValue(key, next);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.currentTarget.blur();
          return;
        }
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      onContextMenu={(e) => {
        if (e.altKey) {
          e.preventDefault();
          hasPathMode ? ctx.resetPath(path) : ctx.resetKey(key);
        }
      }}
      title="Tap to edit · Alt + right-click to reset"
      className={`${className} cursor-text rounded-sm outline-dashed outline-1 outline-amber-400/70 transition hover:outline-amber-500 focus:bg-amber-50/40 focus:outline-2 focus:outline-amber-500 ${
        focused ? "bg-amber-50/40 outline-2 outline-amber-500" : ""
      }`}
      style={{ WebkitTapHighlightColor: "rgba(245, 158, 11, 0.15)", minHeight: "1.2em" }}
      {...rest}
    >
      {value}
    </Tag>
  );
}

export function EditableText(props) {
  return <EditableBase type="text" {...props} />;
}

export function EditableNumber(props) {
  return <EditableBase type="number" {...props} />;
}

function hasRoundedFullClass(node) {
  if (!node) return false;
  let current = node;
  let hops = 0;
  while (current && hops < 4) {
    const cls = typeof current.className === "string" ? current.className : "";
    if (
      /(^|\s)rounded-full(\s|$)/.test(cls) ||
      cls.includes("rounded-[50%]") ||
      cls.includes("rounded-[9999px]") ||
      cls.includes("rounded-[100%]")
    ) {
      return true;
    }
    current = current.parentElement;
    hops += 1;
  }
  return false;
}

export function EditableImage({
  path,
  id,
  defaultValue,
  src,
  alt = "",
  className = "",
  imgClassName = "",
  wrapperClassName = "",
  circular: circularProp,
  ...rest
}) {
  const ctx = useSiteContent();
  const key = path || id;
  const hasPathMode = Boolean(path);
  const fallback = defaultValue ?? src ?? "";
  const value = hasPathMode ? ctx.getPath(path) : ctx.getValue(key, fallback);

  const wrapRef = useRef(null);
  const [autoCircular, setAutoCircular] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (circularProp !== undefined) return;
    if (!wrapRef.current) return;
    setAutoCircular(hasRoundedFullClass(wrapRef.current));
  }, [circularProp]);

  const circular = circularProp !== undefined ? circularProp : autoCircular;

  const openEditor = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
  };

  const saveImage = (nextUrl) => {
    if (hasPathMode) ctx.setPath(path, nextUrl);
    else ctx.setValue(key, nextUrl);
    setModalOpen(false);
  };

  return (
    <>
      <span ref={wrapRef} className={`relative block ${wrapperClassName}`}>
        <img
          src={value}
          alt={alt}
          className={`${className} ${imgClassName}`.trim()}
          loading="lazy"
          {...rest}
        />
        {ctx.isEditing && (
          circular ? (
            <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-black/25"
              />
              <button
                type="button"
                onClick={openEditor}
                className="pointer-events-auto relative rounded-full bg-amber-500 px-4 py-2 text-[0.66rem] font-bold uppercase tracking-wider text-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.7)] transition hover:bg-amber-600 active:scale-95 sm:px-3.5 sm:py-1.5 sm:text-[0.62rem]"
              >
                Change
              </button>
            </span>
          ) : (
            <span className="pointer-events-none absolute inset-0 z-10 flex items-start justify-end p-2">
              <button
                type="button"
                onClick={openEditor}
                className="pointer-events-auto rounded-full bg-amber-500 px-3.5 py-2 text-[0.62rem] font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-amber-600 active:scale-95 sm:py-1"
              >
                Change image
              </button>
            </span>
          )
        )}
      </span>

      <ImageEditModal
        open={modalOpen}
        initialValue={value}
        onCancel={() => setModalOpen(false)}
        onSave={saveImage}
      />
    </>
  );
}

export function EditableVideo({ path, id, defaultValue, youtubeId, title = "", className = "" }) {
  const ctx = useSiteContent();
  const key = path || id;
  const hasPathMode = Boolean(path);
  const fallback = defaultValue ?? youtubeId ?? "";
  const value = hasPathMode ? ctx.getPath(path) : ctx.getValue(key, fallback);

  return (
    <div className={`relative h-full w-full ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${value}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 h-full w-full"
      />
      {ctx.isEditing && (
        <div className="absolute inset-x-0 top-0 z-10 flex justify-end p-3">
          <div className="flex flex-wrap items-center gap-2 rounded-full bg-black/80 px-3 py-2 backdrop-blur">
            <span className="text-[0.58rem] font-bold uppercase tracking-wider text-white/70">
              YouTube ID
            </span>
            <input
              value={value}
              onChange={(e) => {
                const next = e.target.value.trim();
                hasPathMode ? ctx.setPath(path, next) : ctx.setValue(key, next);
              }}
              className="w-40 rounded-md bg-white/95 px-2 py-1.5 text-[0.75rem] text-black outline-none sm:w-44 sm:py-1 sm:text-[0.72rem]"
            />
            <button
              type="button"
              onClick={() => {
                hasPathMode ? ctx.resetPath(path) : ctx.resetKey(key);
              }}
              className="text-[0.58rem] font-bold uppercase tracking-wider text-white/75 hover:text-white"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function statusLabel(syncMode, saving, pending, lastError, lastSyncedAt) {
  if (syncMode === "local") return { text: "Local only", tone: "text-white/50" };
  if (lastError) return { text: "Save failed", tone: "text-red-400" };
  if (saving) return { text: "Saving…", tone: "text-amber-300" };
  if (pending) return { text: "Unsaved", tone: "text-amber-300" };
  if (lastSyncedAt) {
    const t = lastSyncedAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    return { text: `Synced ${t}`, tone: "text-emerald-400" };
  }
  return { text: "Ready", tone: "text-white/50" };
}

export function EditorToolbar() {
  const {
    isEditing,
    setIsEditing,
    edits,
    resetAll,
    saving,
    pending,
    lastError,
    lastSyncedAt,
    syncMode,
    flushNow,
    reloadFromServer,
    resetOnServer,
  } = useSiteContent();
  const [collapsed, setCollapsed] = useState(false);
  const count = Object.keys(edits).length;

  if (!isEditing) return null;

  const status = statusLabel(syncMode, saving, pending, lastError, lastSyncedAt);

  const handleResetAll = async () => {
    if (!window.confirm("Discard ALL saved edits across the site, on the server and in this browser?")) return;
    const result = await resetOnServer();
    if (result === false) resetAll();
  };

  return (
    <div
      className="fixed inset-x-3 bottom-3 z-[9998] sm:inset-x-auto sm:right-135 sm:bottom-4"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto w-full max-w-[560px] rounded-2xl border border-amber-400/60 bg-[#141414]/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur sm:max-w-none sm:w-auto">
        {collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left sm:hidden"
            aria-label="Expand editor toolbar"
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
              <span className="text-[0.66rem] font-bold uppercase tracking-[0.14em] text-amber-400">
                Editing
              </span>
              <span className="text-[0.66rem] text-white/60">
                {count} change{count === 1 ? "" : "s"}
              </span>
            </span>
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m6 15 6-6 6 6" />
            </svg>
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2 px-3 py-3 sm:px-4 sm:py-3">
            <span className="flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-amber-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
              Editing
            </span>
            <span className="text-[0.66rem] text-white/50">
              {count} change{count === 1 ? "" : "s"}
            </span>
            <span className={`text-[0.62rem] font-bold uppercase tracking-wider ${status.tone}`}>
              {status.text}
            </span>

            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="ml-auto rounded-lg border border-white/15 p-1.5 text-white/70 transition hover:bg-white/5 sm:hidden"
              aria-label="Collapse editor toolbar"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:ml-2">
              <button
                type="button"
                onClick={flushNow}
                disabled={saving || !pending}
                className="flex-1 rounded-lg border border-white/15 px-3 py-2.5 text-[0.66rem] font-bold uppercase tracking-wider text-white/80 transition hover:bg-white/5 disabled:opacity-40 sm:flex-none sm:py-1.5 sm:text-[0.62rem]"
              >
                Save
              </button>
              <button
                type="button"
                onClick={reloadFromServer}
                disabled={saving}
                className="flex-1 rounded-lg border border-white/15 px-3 py-2.5 text-[0.66rem] font-bold uppercase tracking-wider text-white/80 transition hover:bg-white/5 disabled:opacity-40 sm:flex-none sm:py-1.5 sm:text-[0.62rem]"
              >
                Reload
              </button>
              <button
                type="button"
                onClick={handleResetAll}
                className="flex-1 rounded-lg border border-white/15 px-3 py-2.5 text-[0.66rem] font-bold uppercase tracking-wider text-red-400 transition hover:bg-red-500/10 sm:flex-none sm:py-1.5 sm:text-[0.62rem]"
              >
                Reset all
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-[0.68rem] font-bold uppercase tracking-wider text-black transition hover:bg-amber-400 sm:w-auto sm:py-1.5 sm:text-[0.62rem]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}