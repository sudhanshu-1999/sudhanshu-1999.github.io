# sudhanshu-1999.github.io

Personal portfolio of **Sudhanshu Singh**, AI Engineer. Live at https://sudhanshu-1999.github.io

Next.js (static export) · TypeScript · Tailwind CSS v4 · Motion · Recharts · Lucide.

## Edit content

Every word on the site lives in [`src/content/site.ts`](src/content/site.ts): profile links, stats, skills,
projects (case studies), architecture diagrams, experience, certifications and the "currently exploring" list.
Fall-detection training curves come from [`src/content/fallTraining.ts`](src/content/fallTraining.ts)
(generated from the real training log in the `yolov8-fall-detection` repo).

Replace `public/resume.pdf` to update the downloadable resume.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds and publishes `out/` to GitHub Pages.
One-time setup: repo **Settings → Pages → Source: GitHub Actions**.

Contact form: GitHub Pages has no server, so by default the form opens the visitor's mail app (mailto).
To receive messages directly, create a free form endpoint (e.g. Formspree) and add it as a repository
variable named `FORM_ENDPOINT`.
