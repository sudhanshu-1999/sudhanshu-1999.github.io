# Product

<!-- impeccable:product-schema 1 -->

> Inferred from the repository, README and `src/content/site.ts`, then approved by the owner as "infer PRODUCT.md". Items marked (inferred) were not stated directly and can be corrected.

## Platform

web

## Stack

Existing: Next.js 16 static export (`output: "export"`), React 19, TypeScript, Tailwind CSS v4, Motion, Recharts, Lucide. Deployed to GitHub Pages by `.github/workflows/deploy.yml` on push to `main`. No new dependencies for the Stark-theme work.

## Users

- Recruiters, hiring managers and engineering leaders evaluating Sudhanshu Singh for AI engineering roles, remote or with relocation (inferred from the hero availability badge and the job-hunt project).
- They skim in a few minutes, often on a phone first, and want proof of real systems rather than claims.

## Product Purpose

A personal portfolio for an AI engineer: shows 4 years of production enterprise software, agentic and RAG systems, case studies with real architecture diagrams, and a way to make contact. Success is a visitor who opens the resume, a case study or the contact form.

## Positioning

Every claim is verified against the owner's resume and public repos. Case studies carry real metrics (for example YOLOv8 mAP@50 0.909) and real architecture, and private-source work says so instead of linking a repo that does not exist.

## Operating Context

Single-page site with sections: Hero, About, Stack (Arsenal), Work (Projects and modal), Architecture, Experience, Exploring, Contact, Footer. All copy lives in `src/content/site.ts`. The contact form falls back to `mailto:` unless a `FORM_ENDPOINT` is configured.

## Capabilities and Constraints

- Content in `site.ts` is the single source of truth and must not change in the visual transformation.
- No fabricated projects, metrics, qualifications, photographs, avatars or AI-generated images.
- Routes and functionality (filters, project modal, architecture diagrams, contact form, resume download) stay as they are.
- Static export: no server code.

## Brand Commitments

- Name: Sudhanshu Singh. Hero headline "Engineering Intelligence." is confirmed and stays.
- Binding visual brief from the owner (2026-11-23): Iron Man / Stark-inspired engineering interface using original forms only (no Marvel assets, no armor or helmet), with subtle comic-book influence. Palette: midnight navy, graphite, near-black, electric cyan, arc-reactor blue, gold, orange, controlled red, crisp white and muted silver. No purple gradients. Fonts from Space Grotesk, Sora, IBM Plex Mono. No characters, avatars or photos.

## Evidence on Hand

Resume at `public/resume.pdf`; case studies in `site.ts` (DocuMind, fall detection, Voyager Live Tracker, and others); training log data in `src/content/fallTraining.ts`; OG image at `public/og.png`. No photograph of the owner exists in the repo and none may be invented.

## Product Principles

1. Truth over spectacle: the interface may be dramatic, the claims may not.
2. The work leads; the theme frames it.
3. Mature and recruiter-safe: technology-lab, not fan site or game dashboard.
4. Readable first on mobile; HUD effects simplify on small screens and under reduced motion.

## Accessibility & Inclusion

Keep WCAG AA contrast, visible focus, skip link, keyboard-operable controls and a real reduced-motion alternative.
