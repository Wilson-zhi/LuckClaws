import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="section-shell py-16 md:py-24">
        <div className="ambient-card mx-auto max-w-3xl p-8 text-center md:p-16">
          <span className="inline-flex rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
            404
          </span>
          <h1 className="mt-6 font-heading text-4xl font-extrabold md:text-6xl">
            Page not found
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-on-surface-variant">
            The page you&apos;re looking for may have moved, but your pet&apos;s next favorite find is still waiting.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/collections"
              className="rounded-full bg-primary-container px-8 py-3 font-heading font-bold text-on-primary-container transition hover:bg-[#e08f00]"
            >
              Shop All
            </Link>
            <Link
              href="/"
              className="rounded-full border border-outline-variant bg-white px-8 py-3 font-heading font-bold text-on-surface transition hover:border-primary hover:text-primary"
            >
              Back Home
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
