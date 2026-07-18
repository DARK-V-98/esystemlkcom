import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home",      href: "/"            },
  { label: "Services",  href: "/#services"   },
  { label: "Portfolio", href: "/projects"    },
  { label: "Pricing",   href: "/#pricing"    },
  { label: "Tools",     href: "/#tools"      },
  { label: "Store",     href: "/store"       },
  { label: "Why Us",    href: "/#why"        },
  { label: "FAQ",       href: "/#faq"        },
  { label: "Contact",   href: "/#contact"    },
];

/* ── Wordmark logotype — no icon, pure typography ── */
export function Logotype({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-lg tracking-[-0.04em]",
    md: "text-xl tracking-[-0.04em]",
    lg: "text-3xl tracking-[-0.05em]",
  };
  return (
    <a href="/" className={`font-display font-black ${sizes[size]} select-none`}>
      <span className="text-foreground">E</span>
      <span className="text-foreground">SYSTEM</span>
      <span
        className="relative"
        style={{
          background: "linear-gradient(90deg, #00bfff 0%, #0077ff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        LK
      </span>
      <span
        className="ml-1 inline-block w-1.5 h-1.5 rounded-full align-middle mb-1"
        style={{ background: "#00bfff", boxShadow: "0 0 6px #00bfff" }}
      />
    </a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-border shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          : "bg-white border-b border-border"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logotype />

        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="relative text-sm font-medium text-text-secondary hover:text-foreground transition-colors group"
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-neon transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="/#contact" className="hidden sm:inline-flex btn-primary rounded-lg px-5 py-2 text-sm font-semibold">
            Get Started
          </a>
          <button
            className="lg:hidden p-2 rounded-md text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden border-t border-border bg-white">
          <div className="px-4 py-5 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-blue hover:text-neon transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-3 btn-primary rounded-lg px-4 py-2.5 text-sm font-semibold text-center"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
