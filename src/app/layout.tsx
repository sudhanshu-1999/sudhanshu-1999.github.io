import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Sora, Space_Grotesk } from "next/font/google";
import { MotionConfig } from "motion/react";
import { site } from "@/content/site";
import "./globals.css";

const space = Space_Grotesk({ variable: "--font-space", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

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
  themeColor: "#050912",
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
    <html lang="en" className={`${space.variable} ${sora.variable} ${plexMono.variable} antialiased`}>
      <body className="min-h-screen bg-bg text-text">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
