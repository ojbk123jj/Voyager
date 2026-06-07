import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Karla } from "next/font/google";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { ToastProvider } from "@/components/toast";
import { EntryPanel } from "@/components/entry-panel";
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
  title: {
    default: "Voyager — Travel Journal",
    template: "%s · Voyager",
  },
  description:
    "A personal travel journal to document the places that moved you. Capture the essence of every journey.",
  applicationName: "Voyager",
  authors: [{ name: "Voyager" }],
  keywords: ["travel", "journal", "diary", "destinations", "memories"],
  openGraph: {
    title: "Voyager — Travel Journal",
    description: "Capture the essence of every journey.",
    type: "website",
    siteName: "Voyager",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voyager — Travel Journal",
    description: "Capture the essence of every journey.",
  },
};

export const viewport: Viewport = {
  themeColor: "#FCF9F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fontDisplay.variable} ${fontSans.variable} antialiased`}
    >
      <body className="min-h-screen">
        <ToastProvider>
          <Suspense fallback={<div className="h-18 border-b border-line" />}>
            <SiteHeader />
          </Suspense>
          {children}
          {modal}
          <Suspense fallback={null}>
            <EntryPanel />
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  );
}
