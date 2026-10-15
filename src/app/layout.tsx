import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { SiteLoader } from "@/components/site-loader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Premium UI/UX — Cover Letter",
  description:
    "I build premium UI/UX for organisation that cares about user.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={GeistSans.variable}><SiteLoader>{children}</SiteLoader></body>
    </html>
  );
}
