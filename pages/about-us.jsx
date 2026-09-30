import About from "../components/about";

export const metadata = {
  title: "About Us | MKCDP",
  description:
    "Mt. Kilimanjaro Child Development Programme is a registered, child-centered NGO empowering children, families and communities across Kajiado South, Kenya.",
  keywords: [
    "MKCDP",
    "child development Kenya",
    "Kajiado South NGO",
    "child sponsorship Kenya",
    "community development",
    "safeguarding",
    "education Kenya",
  ],
  openGraph: {
    title: "About Us | MKCDP",
    description:
      "Discover who we are, our 2025–2030 strategy, our accountability commitments, safeguarding standards, leadership team and development partners.",
    type: "website",
    locale: "en_KE",
    siteName: "MKCDP",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | MKCDP",
    description:
      "A child-centered NGO empowering children and communities in Kajiado South, Kenya.",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <About />;
}