import Link from "next/link";

export const metadata = { title: "404 · Not found" };

export default function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-bg px-4">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[32%] bg-red [clip-path:polygon(30%_0,100%_0,100%_100%,0_100%)]">
        <div className="halftone absolute inset-0 text-ink/45" />
      </div>
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[32%] bg-gold [clip-path:polygon(30%_0,32.5%_0,2.5%_100%,0_100%)]" />
      <div className="relative max-w-lg text-center">
        <p className="tag bg-gold text-ink"><span>retrieval.miss · top_k = 0</span></p>
        <h1 className="mt-5 text-8xl font-extrabold tracking-[-0.04em] text-text md:text-9xl">
          4<span className="type-offset text-gold">0</span>4
        </h1>
        <p className="mt-5 text-lg text-muted">
          No relevant chunks found for this path. Rather than hallucinate a page, here&apos;s the way back.
        </p>
        <div className="mt-9 flex justify-center gap-3">
          <Link href="/" className="btn-primary">
            Back home
          </Link>
          <Link href="/#work" className="btn-ghost">
            See projects
          </Link>
        </div>
      </div>
    </main>
  );
}
