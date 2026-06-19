import { Logo } from "./Logo";

export function Footer() {
  const cols = [
    { title: "Platform", links: ["Tailors", "Marketplace", "Pricing", "Mobile app"] },
    { title: "Company", links: ["About", "Press", "Careers", "Contact"] },
    { title: "Resources", links: ["Help center", "Style guide", "Blog", "Status"] },
    { title: "Legal", links: ["Privacy", "Terms", "Cookies", "Security"] },
  ];
  return (
    <footer className="relative mt-20 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-6">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Custom tailoring without the stress. Verified tailors, secure payment and end-to-end order tracking.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">{c.title}</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {c.links.map((l) => (
                  <li key={l}><a href="#" className="transition-colors hover:text-foreground">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>© 2026 i-sew. Crafted with care.</p>
          <p>Made for people who care about fit.</p>
        </div>
      </div>
    </footer>
  );
}
