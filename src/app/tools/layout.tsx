import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Developer Tools",
    template: "%s | ESYSTEMLK Tools",
  },
  description: "A comprehensive suite of online developer tools for encoding, formatting, conversion, and testing. Free to use forever.",
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
