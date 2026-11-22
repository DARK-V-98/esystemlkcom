/**
 * MIRRA — product data shared by the /mirra pages and the licence server.
 * Prices here are the real prices charged (the server reads this file too),
 * so editing a price here changes what PayHere / bank transfer customers pay.
 */

export const MIRRA_VERSION = "1.2.0";
export const MIRRA_CURRENCY = "LKR";

export type MirraPlan = {
  id: string;
  name: string;
  /** Whole rupees. */
  price: number;
  /** Licence length after first activation. null = lifetime. */
  days: number | null;
  /** How many PCs one key can be active on at the same time. */
  devices: number;
  blurb: string;
  featured?: boolean;
};

export const MIRRA_PLANS: MirraPlan[] = [
  { id: "monthly", name: "Premium Monthly", price: 1500, days: 30, devices: 1, blurb: "Try every Premium feature for a month." },
  { id: "yearly", name: "Premium Yearly", price: 9900, days: 365, devices: 1, blurb: "Best value for regular streamers.", featured: true },
  { id: "lifetime", name: "Premium Lifetime", price: 19900, days: null, devices: 2, blurb: "Pay once. Use it on 2 PCs, forever." },
];

export const mirraPlan = (id: string) => MIRRA_PLANS.find((p) => p.id === id);

export const MIRRA_FREE_FEATURES = [
  "USB and Wi-Fi mirroring",
  "720p at 30 fps",
  "Mouse and keyboard control",
  "Full screen and clean view",
  "Small MIRRA watermark",
];

export const MIRRA_PREMIUM_FEATURES = [
  "1080p, 2K and 4K",
  "60, 90, 120 and 144 fps",
  "Up to 80 Mbps bitrate",
  "No watermark",
  "Stream output window for OBS",
  "Recording to MP4",
  "Key mapping for mobile games",
];

export const MIRRA_SETUP_STEPS = [
  { title: "Install MIRRA", body: "Download the installer and run it. Everything MIRRA needs is included — nothing else to install." },
  { title: "Turn on USB debugging", body: "On the phone: Settings → About phone → tap Build number 7 times. Then Developer options → USB debugging → On." },
  { title: "Plug in and allow", body: "Connect the phone by USB and tap Allow on the phone. MIRRA shows it straight away." },
  { title: "Go wireless (optional)", body: "Click Switch to Wi-Fi in MIRRA's Devices page, then unplug. PC and phone must be on the same Wi-Fi." },
];

export const lkr = (n: number) => `Rs ${n.toLocaleString("en-LK")}`;
