import type { Metadata } from "next";
import "./globals.css";
import "./presentation.css";

export const metadata: Metadata = {
  title: "Final Internship Presentation | Amirul Shahrul",
  description: "LOCUS-T x DigitalBee final internship presentation",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
