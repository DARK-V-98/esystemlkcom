
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase/client-provider";

const inter = Inter({ subsets: ["latin"] });

const siteConfig = {
  name: "ESYSTEMLK",
  url: "https://esystemlk.com",
  ogImage: "https://esystemlk.com/logo.png",
  description: "ESYSTEMLK is a leading software company in Sri Lanka, specializing in custom web development, web applications, and software systems with lifetime free maintenance.",
  keywords: [
    "software company sri lanka", "web development sri lanka", "web application development", "custom software solutions", "esystemlk", "pos system sri lanka", "ecommerce website", "mobile app development",
    "software company colombo", "it services sri lanka", "digital transformation colombo", "software developers sri lanka", "web design company kandy", "bespoke software solutions", "enterprise software development",
    "point of sale software sri lanka", "inventory management system", "pos software for retail", "restaurant pos system lk", "pharmacy management software", "hrm software sri lanka", "payroll management system",
    "custom erp solutions", "crm software colombo", "school management system", "hospital management software sri lanka", "hotel booking engine", "ecommerce platform sri lanka", "online shopping store development",
    "next.js development service", "react developer sri lanka", "typescript experts", "tailwind css design company", "modern ui ux design sri lanka", "responsive website development", "mobile first web design",
    "free developer tools", "online api tester", "xml sitemap generator", "robots.txt generator online", "meta tag generator seo", "favicon generator multi size", "image compressor webp", "online barcode generator",
    "qr code creator online", "website uptime checker", "ssl checker tool", "json to csv converter online", "csv to json converter", "developer utility tools", "seo tools suite", "og image generator",
    "ai automation sri lanka", "artificial intelligence companies colombo", "natural language processing", "ai chatbot development", "machine learning integration", "data analytics services sri lanka", "business process automation",
    "flutter app development sri lanka", "react native developers colombo", "ios android app development", "hybrid mobile applications", "progressive web apps pwa", "cross platform development",
    "cloud computing sri lanka", "aws azure cloud hosting", "serverless architecture", "dedicated software team", "maintenance free software", "lifetime software support", "software security audit",
    "digital marketing sri lanka", "seo services colombo", "keyword research expert", "social media marketing lk", "google search console setup", "website traffic growth", "online brand strategy",
    "how to build custom software", "professional technology partner", "scalable web applications", "secure software solutions", "high performance websites", "custom api integration", "modern software engineering"
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Custom Software & Web Solutions`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "ESYSTEMLK", url: siteConfig.url }],
  creator: "ESYSTEMLK",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 800,
        height: 600,
        alt: `${siteConfig.name} Logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@esystemlk",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  other: {
    "google-adsense-account": "ca-pub-1128178534139221",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <FirebaseClientProvider>
          <Navbar />
          <main className="pt-20">{children}</main>
          <Footer />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
