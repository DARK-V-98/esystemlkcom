import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Sections";

export function PolicyLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <span className="badge-pill">Legal</span>
        <h1 className="mt-4 font-display font-extrabold text-4xl lg:text-5xl tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-sm text-text-muted">Last updated: {lastUpdated}</p>
        <div className="mt-10 policy-content space-y-8">{children}</div>
        <div className="mt-14 card-neon rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg text-foreground">Contact Us</h2>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            If you have any questions about this {title}, please contact us:
          </p>
          <ul className="mt-3 space-y-1 text-sm text-text-secondary">
            <li><span className="font-semibold text-foreground">ESYSTEMLK</span></li>
            <li>No 618, 6th Floor, Jana Jaya City Mall, Rajagiriya, Sri Lanka</li>
            <li>Email: <a href="mailto:esystemlk@gmail.com" className="text-neon font-semibold">esystemlk@gmail.com</a></li>
            <li>Phone: +94 76 571 1396 · +94 77 581 1396 · +94 70 671 1396</li>
            <li>Website: <a href="https://www.esystemlk.com" className="text-neon font-semibold">www.esystemlk.com</a></li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display font-bold text-2xl text-foreground">{title}</h2>
      <div className="mt-3 text-text-secondary leading-relaxed space-y-3 text-[15px]">{children}</div>
    </section>
  );
}

export function PolicyList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}
