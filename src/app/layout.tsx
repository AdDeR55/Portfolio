import type { Metadata, Viewport } from "next";
import { Playfair_Display, VT323, Permanent_Marker, Inter, JetBrains_Mono } from "next/font/google";
import { site, links } from "@/config/site";
import "./globals.css";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], weight: ["700", "800", "900"], display: "swap" });
const vt = VT323({ variable: "--font-vt", subsets: ["latin"], weight: "400", display: "swap" });
const marker = Permanent_Marker({ variable: "--font-marker", subsets: ["latin"], weight: "400", display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const jbmono = JetBrains_Mono({ variable: "--font-jbmono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.title}`, template: `%s | ${site.name}` },
  description: site.description,
  keywords: ["Meet Jaiswal", "Front-End Engineer", "Full-Stack Developer", "React", "Next.js", "TypeScript", "AI", "Portfolio"],
  authors: [{ name: site.name, url: links.github }],
  openGraph: {
    title: `${site.name} — Developer Portfolio`,
    description: site.description,
    type: "website",
    url: site.url,
  },
  twitter: { card: "summary_large_image", title: `${site.name} — Developer Portfolio`, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#080808", colorScheme: "dark" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: "Front-End Engineer / Full-Stack Developer",
  url: site.url,
  email: `mailto:${links.email}`,
  sameAs: [links.github, links.linkedin],
  alumniOf: { "@type": "CollegeOrUniversity", name: "SRM University-AP" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${vt.variable} ${marker.variable} ${inter.variable} ${jbmono.variable}`}>
      <body className="min-h-screen antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
