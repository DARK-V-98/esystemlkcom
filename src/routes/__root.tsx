import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const LD_ORGANIZATION = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "ESYSTEMLK",
  "url": "https://www.esystemlk.com",
  "description": "Sri Lanka's custom software, web app and website development company. Lifetime free maintenance, 24/7 support, based in Rajagiriya.",
  "foundingDate": "2018",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "No 618, 6th Floor, Jana Jaya City Mall",
    "addressLocality": "Rajagiriya",
    "addressCountry": "LK"
  },
  "contactPoint": [
    { "@type": "ContactPoint", "telephone": "+94-76-571-1396", "contactType": "customer service", "availableLanguage": ["English", "Sinhala"] },
    { "@type": "ContactPoint", "telephone": "+94-77-581-1396", "contactType": "customer service" }
  ],
  "email": "esystemlk@gmail.com",
  "areaServed": ["Sri Lanka", "Global"],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Software & Web Development Services",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Business Website Development" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web Application Development" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Software Systems" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "UI/UX Design" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cloud Hosting & Maintenance" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Logo & Brand Design" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "WhatsApp Automation" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "SEO & Analytics" } }
    ]
  }
});

const LD_WEBSITE = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ESYSTEMLK",
  "url": "https://www.esystemlk.com"
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "ESYSTEMLK" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow" },
      { name: "theme-color", content: "#00bfff" },
      { name: "geo.region", content: "LK" },
      { name: "geo.placename", content: "Rajagiriya, Sri Lanka" },
      { name: "language", content: "English" },
      { property: "og:locale", content: "en_US" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "ESYSTEMLK" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@esystemlk" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      { type: "application/ld+json", children: LD_ORGANIZATION },
      { type: "application/ld+json", children: LD_WEBSITE },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
