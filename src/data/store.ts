/**
 * Store catalogue — ESYSTEMLK Store
 *
 * Three categories:
 *  - "software"  → desktop software (CrossCore, etc.)
 *  - "app"       → mobile / web apps
 *  - "template"  → design templates + code kits for other developers to copy
 *
 * Add new items to STORE_ITEMS. The featured hero slot on /store is driven by
 * FEATURED_ID — point it at whichever product should sit at the top.
 */

export type StoreCategory = "software" | "app" | "template";

export type StoreItem = {
  id: string;
  category: StoreCategory;
  name: string;
  tagline: string;
  description: string;
  /** Small labels shown on the card. */
  tags: string[];
  /** Free download link — leave "" to hide the download button. */
  downloadUrl: string;
  /** Where "Go Premium" points. Leave "" to hide the premium button. */
  premiumUrl: string;
  /** Free price label, e.g. "Free" or "Rs 0". */
  price: string;
  /** Premium price label — leave "" if there is no paid tier yet. */
  premiumPrice: string;
  /** Platforms / stack line under the title. */
  platforms: string[];
  /** Optional version string. */
  version?: string;
  /** Optional preview image in /public. */
  image?: string;
  /** Free-tier bullet points. */
  features: string[];
  /**
   * Premium-tier bullet points.
   * TODO: replace with the real CrossCore premium feature list once finalised.
   */
  premiumFeatures: string[];
  /** Marks the item as not downloadable yet. */
  comingSoon?: boolean;
};

/** The product shown in the large hero slot at the top of /store. */
export const FEATURED_ID = "crosscore";

export const STORE_ITEMS: StoreItem[] = [
  /* ─────────────── SOFTWARE ─────────────── */
  {
    id: "crosscore",
    category: "software",
    name: "CrossCore",
    tagline: "Custom crosshair overlay & utility suite for gamers",
    description:
      "CrossCore puts a pixel-perfect custom crosshair on top of any game, plus a set of everyday utilities gamers actually use — FPS overlay, quick capture, and hotkey macros. Lightweight, no bloat, runs in the tray.",
    tags: ["Gaming", "Overlay", "Windows"],
    downloadUrl: "#",
    premiumUrl: "#premium",
    price: "Free",
    premiumPrice: "Coming soon",
    platforms: ["Windows 10 / 11"],
    version: "v1.0",
    features: [
      "Custom crosshair overlay on any game",
      "Preset crosshair shapes, colours and sizes",
      "Works in fullscreen and borderless windowed",
      "Low overhead — sits in the system tray",
      "Free forever, no account needed",
    ],
    premiumFeatures: [
      // TODO: premium feature list to be supplied.
      "Premium features coming soon",
    ],
  },

  /* ─────────────── APPS ─────────────── */
  // Add mobile / web apps here.

  /* ─────────────── TEMPLATES ─────────────── */
  // Add design templates and code kits here.
];

export const CATEGORIES: {
  key: StoreCategory;
  label: string;
  blurb: string;
}[] = [
  {
    key: "software",
    label: "Software",
    blurb:
      "Desktop software built in-house. Download the free build, upgrade to premium when you need more.",
  },
  {
    key: "app",
    label: "Apps",
    blurb: "Mobile and web apps you can install and start using right away.",
  },
  {
    key: "template",
    label: "Templates & Code",
    blurb:
      "Designs, components and starter code for developers to copy, remix and ship AI-powered websites faster.",
  },
];
