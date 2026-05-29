import type { Metadata } from "next";
import { Cormorant_Garamond, Karla } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const fontDisplay = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const fontSans = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Voyager — Travel Journal",
  description: "Capture the essence of every journey.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fontDisplay.variable} ${fontSans.variable} antialiased`}
    >
      <body className="min-h-screen">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
