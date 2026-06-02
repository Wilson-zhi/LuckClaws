import { SiteShell } from "@/components/layout/SiteShell";

type SupportPageLayoutProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

type InfoSectionProps = {
  title: string;
  children: React.ReactNode;
};

type PolicySection = {
  title: string;
  text: string;
};

export function SupportPageLayout({
  eyebrow,
  title,
  description,
  children
}: SupportPageLayoutProps) {
  return (
    <SiteShell>
      <section className="section-shell py-10 md:py-16">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-primary-container/20 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary">
            {eyebrow}
          </span>
          <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight md:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-base leading-8 text-on-surface-variant md:text-lg">
              {description}
            </p>
          )}
        </div>
      </section>
      <section className="section-shell pb-16 md:pb-24">
        <div className="max-w-5xl">{children}</div>
      </section>
    </SiteShell>
  );
}

export function InfoSection({ title, children }: InfoSectionProps) {
  return (
    <section className="ambient-card p-6 md:p-8">
      <h2 className="font-heading text-2xl font-bold">{title}</h2>
      <div className="mt-4 text-sm leading-7 text-on-surface-variant md:text-base">{children}</div>
    </section>
  );
}

export function PolicySections({ sections }: { sections: PolicySection[] }) {
  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <InfoSection key={section.title} title={section.title}>
          <p>{section.text}</p>
        </InfoSection>
      ))}
    </div>
  );
}
