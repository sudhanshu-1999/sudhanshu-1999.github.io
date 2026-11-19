import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { MotionConfig } from "motion/react";
import { site } from "@/content/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

const title = "Sudhanshu Singh · AI Engineer";
const description =
  "AI Engineer building agentic systems, production RAG platforms and reliable backends. LangGraph, MCP, FastAPI, Google Cloud, PyTorch.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s · Sudhanshu Singh" },
  description,
  applicationName: "Sudhanshu Singh",
  authors: [{ name: site.name, url: site.url }],
  keywords: ["AI Engineer", "LLM", "RAG", "Agentic AI", "LangGraph", "MCP", "FastAPI", "Google Cloud", "Machine Learning", "Sudhanshu Singh"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title,
    description,
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Sudhanshu Singh · Engineering Intelligence." }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#04060c",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: "AI Engineer",
  worksFor: { "@type": "Organization", name: "CloudMetic" },
  alumniOf: [{ "@type": "CollegeOrUniversity", name: "ABES Engineering College" }],
  sameAs: [site.linkedin, site.github],
  knowsAbout: ["Large Language Models", "Retrieval-Augmented Generation", "AI Agents", "Machine Learning", "Backend Engineering", "Google Cloud"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${serif.variable} antialiased`}>
      <body className="min-h-screen bg-bg text-text">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
