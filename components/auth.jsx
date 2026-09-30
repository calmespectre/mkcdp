import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const flagOf = (code) =>
  code.replace(/[A-Z]/g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));

const COUNTRIES = [
  { code: "AF", name: "Afghanistan", dial: "+93" },
  { code: "AL", name: "Albania", dial: "+355" },
  { code: "DZ", name: "Algeria", dial: "+213" },
  { code: "AD", name: "Andorra", dial: "+376" },
  { code: "AO", name: "Angola", dial: "+244" },
  { code: "AG", name: "Antigua and Barbuda", dial: "+1268" },
  { code: "AR", name: "Argentina", dial: "+54" },
  { code: "AM", name: "Armenia", dial: "+374" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "AT", name: "Austria", dial: "+43" },
  { code: "AZ", name: "Azerbaijan", dial: "+994" },
  { code: "BS", name: "Bahamas", dial: "+1242" },
  { code: "BH", name: "Bahrain", dial: "+973" },
  { code: "BD", name: "Bangladesh", dial: "+880" },
  { code: "BB", name: "Barbados", dial: "+1246" },
  { code: "BY", name: "Belarus", dial: "+375" },
  { code: "BE", name: "Belgium", dial: "+32" },
  { code: "BZ", name: "Belize", dial: "+501" },
  { code: "BJ", name: "Benin", dial: "+229" },
  { code: "BT", name: "Bhutan", dial: "+975" },
  { code: "BO", name: "Bolivia", dial: "+591" },
  { code: "BA", name: "Bosnia and Herzegovina", dial: "+387" },
  { code: "BW", name: "Botswana", dial: "+267" },
  { code: "BR", name: "Brazil", dial: "+55" },
  { code: "BN", name: "Brunei", dial: "+673" },
  { code: "BG", name: "Bulgaria", dial: "+359" },
  { code: "BF", name: "Burkina Faso", dial: "+226" },
  { code: "BI", name: "Burundi", dial: "+257" },
  { code: "CV", name: "Cabo Verde", dial: "+238" },
  { code: "KH", name: "Cambodia", dial: "+855" },
  { code: "CM", name: "Cameroon", dial: "+237" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "CF", name: "Central African Republic", dial: "+236" },
  { code: "TD", name: "Chad", dial: "+235" },
  { code: "CL", name: "Chile", dial: "+56" },
  { code: "CN", name: "China", dial: "+86" },
  { code: "CO", name: "Colombia", dial: "+57" },
  { code: "KM", name: "Comoros", dial: "+269" },
  { code: "CG", name: "Congo (Republic)", dial: "+242" },
  { code: "CD", name: "Congo (DRC)", dial: "+243" },
  { code: "CR", name: "Costa Rica", dial: "+506" },
  { code: "CI", name: "Côte d'Ivoire", dial: "+225" },
  { code: "HR", name: "Croatia", dial: "+385" },
  { code: "CU", name: "Cuba", dial: "+53" },
  { code: "CY", name: "Cyprus", dial: "+357" },
  { code: "CZ", name: "Czechia", dial: "+420" },
  { code: "DK", name: "Denmark", dial: "+45" },
  { code: "DJ", name: "Djibouti", dial: "+253" },
  { code: "DM", name: "Dominica", dial: "+1767" },
  { code: "DO", name: "Dominican Republic", dial: "+1809" },
  { code: "EC", name: "Ecuador", dial: "+593" },
  { code: "EG", name: "Egypt", dial: "+20" },
  { code: "SV", name: "El Salvador", dial: "+503" },
  { code: "GQ", name: "Equatorial Guinea", dial: "+240" },
  { code: "ER", name: "Eritrea", dial: "+291" },
  { code: "EE", name: "Estonia", dial: "+372" },
  { code: "SZ", name: "Eswatini", dial: "+268" },
  { code: "ET", name: "Ethiopia", dial: "+251" },
  { code: "FJ", name: "Fiji", dial: "+679" },
  { code: "FI", name: "Finland", dial: "+358" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "GA", name: "Gabon", dial: "+241" },
  { code: "GM", name: "Gambia", dial: "+220" },
  { code: "GE", name: "Georgia", dial: "+995" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "GH", name: "Ghana", dial: "+233" },
  { code: "GR", name: "Greece", dial: "+30" },
  { code: "GD", name: "Grenada", dial: "+1473" },
  { code: "GT", name: "Guatemala", dial: "+502" },
  { code: "GN", name: "Guinea", dial: "+224" },
  { code: "GW", name: "Guinea-Bissau", dial: "+245" },
  { code: "GY", name: "Guyana", dial: "+592" },
  { code: "HT", name: "Haiti", dial: "+509" },
  { code: "HN", name: "Honduras", dial: "+504" },
  { code: "HU", name: "Hungary", dial: "+36" },
  { code: "IS", name: "Iceland", dial: "+354" },
  { code: "IN", name: "India", dial: "+91" },
  { code: "ID", name: "Indonesia", dial: "+62" },
  { code: "IR", name: "Iran", dial: "+98" },
  { code: "IQ", name: "Iraq", dial: "+964" },
  { code: "IE", name: "Ireland", dial: "+353" },
  { code: "IL", name: "Israel", dial: "+972" },
  { code: "IT", name: "Italy", dial: "+39" },
  { code: "JM", name: "Jamaica", dial: "+1876" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "JO", name: "Jordan", dial: "+962" },
  { code: "KZ", name: "Kazakhstan", dial: "+7" },
  { code: "KE", name: "Kenya", dial: "+254" },
  { code: "KI", name: "Kiribati", dial: "+686" },
  { code: "KW", name: "Kuwait", dial: "+965" },
  { code: "KG", name: "Kyrgyzstan", dial: "+996" },
  { code: "LA", name: "Laos", dial: "+856" },
  { code: "LV", name: "Latvia", dial: "+371" },
  { code: "LB", name: "Lebanon", dial: "+961" },
  { code: "LS", name: "Lesotho", dial: "+266" },
  { code: "LR", name: "Liberia", dial: "+231" },
  { code: "LY", name: "Libya", dial: "+218" },
  { code: "LI", name: "Liechtenstein", dial: "+423" },
  { code: "LT", name: "Lithuania", dial: "+370" },
  { code: "LU", name: "Luxembourg", dial: "+352" },
  { code: "MG", name: "Madagascar", dial: "+261" },
  { code: "MW", name: "Malawi", dial: "+265" },
  { code: "MY", name: "Malaysia", dial: "+60" },
  { code: "MV", name: "Maldives", dial: "+960" },
  { code: "ML", name: "Mali", dial: "+223" },
  { code: "MT", name: "Malta", dial: "+356" },
  { code: "MH", name: "Marshall Islands", dial: "+692" },
  { code: "MR", name: "Mauritania", dial: "+222" },
  { code: "MU", name: "Mauritius", dial: "+230" },
  { code: "MX", name: "Mexico", dial: "+52" },
  { code: "FM", name: "Micronesia", dial: "+691" },
  { code: "MD", name: "Moldova", dial: "+373" },
  { code: "MC", name: "Monaco", dial: "+377" },
  { code: "MN", name: "Mongolia", dial: "+976" },
  { code: "ME", name: "Montenegro", dial: "+382" },
  { code: "MA", name: "Morocco", dial: "+212" },
  { code: "MZ", name: "Mozambique", dial: "+258" },
  { code: "MM", name: "Myanmar", dial: "+95" },
  { code: "NA", name: "Namibia", dial: "+264" },
  { code: "NR", name: "Nauru", dial: "+674" },
  { code: "NP", name: "Nepal", dial: "+977" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "NZ", name: "New Zealand", dial: "+64" },
  { code: "NI", name: "Nicaragua", dial: "+505" },
  { code: "NE", name: "Niger", dial: "+227" },
  { code: "NG", name: "Nigeria", dial: "+234" },
  { code: "KP", name: "North Korea", dial: "+850" },
  { code: "MK", name: "North Macedonia", dial: "+389" },
  { code: "NO", name: "Norway", dial: "+47" },
  { code: "OM", name: "Oman", dial: "+968" },
  { code: "PK", name: "Pakistan", dial: "+92" },
  { code: "PW", name: "Palau", dial: "+680" },
  { code: "PS", name: "Palestine", dial: "+970" },
  { code: "PA", name: "Panama", dial: "+507" },
  { code: "PG", name: "Papua New Guinea", dial: "+675" },
  { code: "PY", name: "Paraguay", dial: "+595" },
  { code: "PE", name: "Peru", dial: "+51" },
  { code: "PH", name: "Philippines", dial: "+63" },
  { code: "PL", name: "Poland", dial: "+48" },
  { code: "PT", name: "Portugal", dial: "+351" },
  { code: "QA", name: "Qatar", dial: "+974" },
  { code: "RO", name: "Romania", dial: "+40" },
  { code: "RU", name: "Russia", dial: "+7" },
  { code: "RW", name: "Rwanda", dial: "+250" },
  { code: "KN", name: "Saint Kitts and Nevis", dial: "+1869" },
  { code: "LC", name: "Saint Lucia", dial: "+1758" },
  { code: "VC", name: "Saint Vincent and the Grenadines", dial: "+1784" },
  { code: "WS", name: "Samoa", dial: "+685" },
  { code: "SM", name: "San Marino", dial: "+378" },
  { code: "ST", name: "Sao Tome and Principe", dial: "+239" },
  { code: "SA", name: "Saudi Arabia", dial: "+966" },
  { code: "SN", name: "Senegal", dial: "+221" },
  { code: "RS", name: "Serbia", dial: "+381" },
  { code: "SC", name: "Seychelles", dial: "+248" },
  { code: "SL", name: "Sierra Leone", dial: "+232" },
  { code: "SG", name: "Singapore", dial: "+65" },
  { code: "SK", name: "Slovakia", dial: "+421" },
  { code: "SI", name: "Slovenia", dial: "+386" },
  { code: "SB", name: "Solomon Islands", dial: "+677" },
  { code: "SO", name: "Somalia", dial: "+252" },
  { code: "ZA", name: "South Africa", dial: "+27" },
  { code: "KR", name: "South Korea", dial: "+82" },
  { code: "SS", name: "South Sudan", dial: "+211" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "LK", name: "Sri Lanka", dial: "+94" },
  { code: "SD", name: "Sudan", dial: "+249" },
  { code: "SR", name: "Suriname", dial: "+597" },
  { code: "SE", name: "Sweden", dial: "+46" },
  { code: "CH", name: "Switzerland", dial: "+41" },
  { code: "SY", name: "Syria", dial: "+963" },
  { code: "TW", name: "Taiwan", dial: "+886" },
  { code: "TJ", name: "Tajikistan", dial: "+992" },
  { code: "TZ", name: "Tanzania", dial: "+255" },
  { code: "TH", name: "Thailand", dial: "+66" },
  { code: "TL", name: "Timor-Leste", dial: "+670" },
  { code: "TG", name: "Togo", dial: "+228" },
  { code: "TO", name: "Tonga", dial: "+676" },
  { code: "TT", name: "Trinidad and Tobago", dial: "+1868" },
  { code: "TN", name: "Tunisia", dial: "+216" },
  { code: "TR", name: "Turkey", dial: "+90" },
  { code: "TM", name: "Turkmenistan", dial: "+993" },
  { code: "TV", name: "Tuvalu", dial: "+688" },
  { code: "UG", name: "Uganda", dial: "+256" },
  { code: "UA", name: "Ukraine", dial: "+380" },
  { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "UY", name: "Uruguay", dial: "+598" },
  { code: "UZ", name: "Uzbekistan", dial: "+998" },
  { code: "VU", name: "Vanuatu", dial: "+678" },
  { code: "VA", name: "Vatican City", dial: "+379" },
  { code: "VE", name: "Venezuela", dial: "+58" },
  { code: "VN", name: "Vietnam", dial: "+84" },
  { code: "YE", name: "Yemen", dial: "+967" },
  { code: "ZM", name: "Zambia", dial: "+260" },
  { code: "ZW", name: "Zimbabwe", dial: "+263" },
];

const PASSWORD_RULES = [
  { id: "length", label: "At least 6 characters", test: (v) => v.length >= 6 },
  { id: "letter", label: "Contains a letter", test: (v) => /[A-Za-z]/.test(v) },
  { id: "number", label: "Contains a number", test: (v) => /[0-9]/.test(v) },
  { id: "symbol", label: "Contains a symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const USERNAME_RULE = /^[A-Za-z][A-Za-z0-9_-]{2,19}$/;
const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RULE = /^\+?[\d\s()-]{7,20}$/;

const Icon = {
  Google: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  ),
  Apple: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  ),
  Eye: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.4 0-10-7-10-7a19.8 19.8 0 0 1 5.06-5.94M9.9 5.24A10.94 10.94 0 0 1 12 5c6.4 0 10 7 10 7a19.9 19.9 0 0 1-2.87 3.87M1 1l22 22M9.88 9.88a3 3 0 0 0 4.24 4.24" />
    </svg>
  ),
  Check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="m5 12.5 5 5 9-11" />
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
  User: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M4.5 20c.9-3.8 3.8-6 7.5-6s6.6 2.2 7.5 6" />
    </svg>
  ),
  At: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.9 7.9" />
    </svg>
  ),
  Lock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="4" y="10" width="16" height="11" rx="2.5" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3" />
    </svg>
  ),
  Globe: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
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
  Heart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" />
    </svg>
  ),
  Bell: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M18 16V11a6 6 0 1 0-12 0v5l-1.5 3h15zM10 21.5a2 2 0 0 0 4 0" />
    </svg>
  ),
};

function Field({ id, label, hint, error, icon: IconCmp, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
        {label}
      </label>
      <div className="relative mt-2">
        {IconCmp && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
            <IconCmp className="h-4 w-4" />
          </span>
        )}
        <input
          id={id}
          {...props}
          className={`w-full rounded-xl border bg-white text-[0.92rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:ring-2 ${
            IconCmp ? "pl-11 pr-4" : "px-4"
          } py-3.5 ${
            error
              ? "border-[#E2703A]/60 focus:border-[#E2703A] focus:ring-[#E2703A]/20"
              : "border-green-700/15 focus:border-green-700 focus:ring-green-700/15"
          }`}
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70">{hint}</p>
      ) : null}
    </div>
  );
}

function PasswordField({ id, label, value, onChange, error, show, onToggle, hint }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
        {label}
      </label>
      <div className="relative mt-2">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
          <Icon.Lock className="h-4 w-4" />
        </span>
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-12 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 placeholder:text-[#4A4A42]/40 focus:ring-2 ${
            error
              ? "border-[#E2703A]/60 focus:border-[#E2703A] focus:ring-[#E2703A]/20"
              : "border-green-700/15 focus:border-green-700 focus:ring-green-700/15"
          }`}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-[#4A4A42]/60 transition-colors duration-200 hover:bg-green-700/5 hover:text-green-700"
        >
          {show ? <Icon.EyeOff className="h-4 w-4" /> : <Icon.Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? (
        <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-[0.75rem] text-[#4A4A42]/70">{hint}</p>
      ) : null}
    </div>
  );
}

export default function Auth() {
  const [mode, setMode] = useState("signin");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.code === country) || null,
    [country]
  );

  const phonePlaceholder = selectedCountry
    ? `${selectedCountry.dial} 123 456 789`
    : "Select a country first";

  const passingRules = useMemo(
    () => PASSWORD_RULES.filter((r) => r.test(password)).length,
    [password]
  );

  const strength = useMemo(() => {
    if (!password) return { label: "", tone: "idle", width: 0 };
    if (passingRules <= 2) return { label: "Weak", tone: "weak", width: 33 };
    if (passingRules === 3) return { label: "Good", tone: "good", width: 66 };
    return { label: "Strong", tone: "strong", width: 100 };
  }, [password, passingRules]);

  const switchMode = (next) => {
    setMode(next);
    setErrors({});
    setSubmitted(false);
  };

  const handleSocial = (provider) => {
    setErrors({});
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 3200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};

    if (mode === "signup") {
      if (!fullName.trim()) next.fullName = "Please enter your full name.";
      if (!USERNAME_RULE.test(username))
        next.username = "3–20 chars, start with a letter. Letters, numbers, _ and - only.";
      if (!country) next.country = "Please select your country.";
      if (!PHONE_RULE.test(phone)) next.phone = "Enter a valid phone number.";
      if (!agree) next.agree = "You must accept the terms to continue.";
    }

    if (!EMAIL_RULE.test(email)) next.email = "Enter a valid email address.";

    if (mode === "signup") {
      if (passingRules < 4) next.password = "Password does not meet all requirements.";
      if (!confirm) next.confirm = "Please confirm your password.";
      else if (password !== confirm) next.confirm = "Passwords do not match.";
    } else if (!password) {
      next.password = "Please enter your password.";
    }

    setErrors(next);

    if (Object.keys(next).length === 0) {
      setSubmitted(true);
    }
  };

  return (
    <div className="hero-sans relative min-h-screen overflow-x-hidden bg-[#FBF7F0] text-[#141414] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800;900&display=swap');
        .hero-serif { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
        .hero-sans { font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        ::selection { background: #14532D; color: #FBF7F0; }
      `}</style>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(20,83,45,0.06) 0px, rgba(20,83,45,0.06) 1px, transparent 1px, transparent 22px)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)",
          maskImage: "linear-gradient(to bottom, transparent, #000 40%, #000 60%, transparent)",
        }}
      />

      <svg viewBox="0 0 120 120" aria-hidden="true" className="pointer-events-none fixed -left-10 top-24 w-40 -rotate-12 opacity-25">
        <path d="M18 76c6-30 34-54 66-50 20 3 30 20 22 34-10 17-36 24-58 18" fill="none" stroke="#7FB069" strokeWidth="8" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 100 100" aria-hidden="true" className="pointer-events-none fixed -right-8 bottom-16 w-32 rotate-12 opacity-25">
        <path d="M52 9c21 1 38 15 37 36-1 24-20 45-44 44C24 88 8 70 9 49 10 26 28 8 52 9Z" fill="none" stroke="#F2B33D" strokeWidth="3.5" strokeLinecap="round" />
      </svg>

      <div className="relative flex min-h-screen flex-col items-center px-6 py-8 sm:px-10 lg:py-10">
        <div className="flex w-full max-w-[560px] items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42] transition-colors duration-200 hover:text-green-700"
          >
            <Icon.ArrowLeft className="h-3.5 w-3.5" />
            Back to site
          </Link>
        </div>

        <div className="w-full max-w-[560px] flex-1 py-12">
          {mode === "signup" && (
            <p className="leading-tight text-[#111111] mb-12">
              By creating an account with MKCDP, you'll receive updates on ongoing and upcoming projects, events, and other relevant news. You can change your preferences at any time.
            </p>
          )}

          {submitted && (
            <div className="mt-8 flex items-start gap-4 rounded-2xl border border-green-700/20 bg-green-700/6 p-5">
              <span className="mt-0.5 grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-green-700 text-[#FBF7F0]">
                <Icon.Check className="h-4 w-4" />
              </span>
              <div>
                <p className="hero-serif text-[1.05rem] font-bold leading-tight text-[#111111]">
                  {mode === "signup" ? "Account created." : "Signed in."}
                </p>
                <p className="mt-1 text-[0.85rem] leading-[1.7] text-[#4A4A42]">
                  {mode === "signup"
                    ? "Check your inbox to confirm your email and set up your giving preferences."
                    : "Redirecting you to your dashboard."}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {mode === "signup" && (
              <>
                <Field
                  id="fullName"
                  label="Full name"
                  icon={Icon.User}
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  error={errors.fullName}
                />

                <Field
                  id="username"
                  label="Username"
                  icon={Icon.At}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                  placeholder="Enter a username"
                  autoComplete="username"
                  hint="Pick your own — 3–20 characters. Letters, numbers, _ and - only."
                  error={errors.username}
                />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="country" className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                      Country
                    </label>
                    <div className="relative mt-2">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-green-700/45">
                        <Icon.Globe className="h-4 w-4" />
                      </span>
                      <select
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className={`w-full appearance-none rounded-xl border bg-white py-3.5 pl-11 pr-10 text-[0.92rem] text-[#111111] outline-none transition-all duration-200 focus:ring-2 ${
                          errors.country
                            ? "border-[#E2703A]/60 focus:border-[#E2703A] focus:ring-[#E2703A]/20"
                            : "border-green-700/15 focus:border-green-700 focus:ring-green-700/15"
                        }`}
                      >
                        <option value="">Select your country</option>
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {flagOf(c.code)} {c.name} ({c.dial})
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-green-700/45">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </span>
                    </div>
                    {errors.country && (
                      <p className="mt-1.5 text-[0.75rem] font-medium text-[#E2703A]">{errors.country}</p>
                    )}
                  </div>

                  <Field
                    id="phone"
                    label="Phone number"
                    icon={Icon.Phone}
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={phonePlaceholder}
                    autoComplete="tel"
                    hint={selectedCountry ? `Use the ${selectedCountry.dial} country code.` : undefined}
                    error={errors.phone}
                  />
                </div>
              </>
            )}

            <Field
              id="email"
              label="Email address"
              icon={Icon.At}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              autoComplete="email"
              error={errors.email}
            />

            <PasswordField
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              show={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
              error={errors.password}
            />

            {mode === "signup" && (
              <>
                <div>
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#4A4A42]">
                      Password strength
                    </span>
                    <span
                      className={`text-[0.68rem] font-bold uppercase tracking-[0.14em] ${
                        strength.tone === "weak"
                          ? "text-[#E2703A]"
                          : strength.tone === "good"
                          ? "text-[#F2B33D]"
                          : strength.tone === "strong"
                          ? "text-green-700"
                          : "text-[#4A4A42]/40"
                      }`}
                    >
                      {strength.label || "—"}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-green-700/8">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        strength.tone === "weak"
                          ? "bg-[#E2703A]"
                          : strength.tone === "good"
                          ? "bg-[#F2B33D]"
                          : "bg-green-700"
                      }`}
                      style={{ width: `${strength.width}%` }}
                    />
                  </div>
                  <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {PASSWORD_RULES.map((r) => {
                      const passed = r.test(password);
                      return (
                        <li
                          key={r.id}
                          className={`flex items-center gap-2.5 text-[0.78rem] transition-colors duration-200 ${
                            passed ? "text-green-700" : "text-[#4A4A42]/70"
                          }`}
                        >
                          <span
                            className={`grid h-4 w-4 flex-shrink-0 place-items-center rounded-full transition-colors duration-200 ${
                              passed
                                ? "bg-green-700 text-[#FBF7F0]"
                                : "border border-green-700/20 text-transparent"
                            }`}
                          >
                            <Icon.Check className="h-2.5 w-2.5" />
                          </span>
                          {r.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <PasswordField
                  id="confirm"
                  label="Confirm password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  show={showConfirm}
                  onToggle={() => setShowConfirm((v) => !v)}
                  error={errors.confirm}
                />
              </>
            )}

            {mode === "signup" && (
              <>
                <label
                  htmlFor="newsletter"
                  className="group flex cursor-pointer items-start gap-3.5 rounded-xl border border-green-700/12 bg-white/55 p-4 transition-colors duration-200 hover:border-green-700/25 hover:bg-white/85"
                >
                  <span className="relative mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center">
                    <input
                      id="newsletter"
                      type="checkbox"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span
                      className={`grid h-5 w-5 place-items-center rounded-md border transition-all duration-200 ${
                        newsletter
                          ? "border-green-700 bg-green-700 text-[#FBF7F0]"
                          : "border-green-700/25 bg-white text-transparent"
                      }`}
                    >
                      <Icon.Check className="h-3 w-3" />
                    </span>
                  </span>
                  <span>
                    <span className="block text-[0.88rem] font-semibold text-[#111111]">
                      Send me news, impact stories and giving updates
                    </span>
                    <span className="mt-1 block text-[0.78rem] leading-[1.6] text-[#4A4A42]/80">
                      Roughly one email a month. No spam, unsubscribe anytime.
                    </span>
                  </span>
                </label>

                <label htmlFor="agree" className="group flex cursor-pointer items-start gap-3.5">
                  <span className="relative mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center">
                    <input
                      id="agree"
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span
                      className={`grid h-5 w-5 place-items-center rounded-md border transition-all duration-200 ${
                        agree
                          ? "border-green-700 bg-green-700 text-[#FBF7F0]"
                          : errors.agree
                          ? "border-[#E2703A]/60 bg-white text-transparent"
                          : "border-green-700/25 bg-white text-transparent"
                      }`}
                    >
                      <Icon.Check className="h-3 w-3" />
                    </span>
                  </span>
                  <span className="text-[0.82rem] leading-[1.7] text-[#4A4A42]">
                    I agree to the{" "}
                    <Link to="/terms" className="font-semibold text-green-700 underline decoration-green-700/30 underline-offset-4 hover:decoration-green-700">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy-policy" className="font-semibold text-green-700 underline decoration-green-700/30 underline-offset-4 hover:decoration-green-700">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                {errors.agree && (
                  <p className="-mt-2 text-[0.75rem] font-medium text-[#E2703A]">{errors.agree}</p>
                )}
              </>
            )}

            <button
              type="submit"
              className="group mt-2 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-green-700 px-8 py-[1.1rem] text-[0.82rem] font-bold uppercase tracking-[0.1em] text-white shadow-[0_18px_36px_-18px_rgba(20,83,45,0.95)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-950 active:scale-[0.99]"
            >
              {mode === "signup" ? "Create my account" : "Sign in"}
              <Icon.ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <p className="pt-2 text-center text-[0.85rem] text-[#4A4A42]">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className="font-semibold text-green-700 underline decoration-green-700/30 underline-offset-4 hover:decoration-green-700"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="font-semibold text-green-700 underline decoration-green-700/30 underline-offset-4 hover:decoration-green-700"
                  >
                    Create an account
                  </button>
                </>
              )}
            </p>
          </form>
          <div className="my-8 flex items-center gap-4">
            <span className="h-px flex-1 bg-green-700/15" />
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#4A4A42]/70">
              or
            </span>
            <span className="h-px flex-1 bg-green-700/15" />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => handleSocial("google")}
              className="inline-flex items-center justify-center gap-3 rounded-xl border border-green-700/15 bg-white px-5 py-3.5 text-[0.82rem] font-bold text-[#111111] transition-all duration-200 hover:-translate-y-0.5 hover:border-green-700/30 hover:shadow-[0_14px_28px_-18px_rgba(20,83,45,0.5)]"
            >
              <Icon.Google className="h-5 w-5" />
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => handleSocial("apple")}
              className="inline-flex items-center justify-center gap-3 rounded-xl border border-green-700/15 bg-[#111111] px-5 py-3.5 text-[0.82rem] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_14px_28px_-18px_rgba(0,0,0,0.5)]"
            >
              <Icon.Apple className="h-5 w-5" />
              Continue with Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}