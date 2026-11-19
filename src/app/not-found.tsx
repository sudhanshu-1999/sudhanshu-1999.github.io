import Link from "next/link";

export const metadata = { title: "404 · Not found" };

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div aria-hidden="true" className="grid-bg absolute inset-0" />
      <div aria-hidden="true" className="absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.14),transparent)]" />
      <div className="relative max-w-lg text-center">
        <p className="font-mono text-[12px] text-cyan">retrieval.miss · top_k = 0</p>
        <h1 className="mt-4 text-7xl font-semibold tracking-[-0.05em] text-text md:text-8xl">
          4<span className="font-serif font-normal italic text-gradient">0</span>4
        </h1>
        <p className="mt-5 text-lg text-muted">
          No relevant chunks found for this path. Rather than hallucinate a page, here&apos;s the way back.
        </p>
        <div className="mt-9 flex justify-center gap-3">
          <Link href="/" className="rounded-xl bg-text px-5 py-3 text-sm font-medium text-bg transition hover:bg-white">
            Back home
          </Link>
          <Link href="/#work" className="rounded-xl border border-line-strong px-5 py-3 text-sm text-text transition hover:border-cyan/50">
            See projects
          </Link>
        </div>
      </div>
    </main>
  );
}
