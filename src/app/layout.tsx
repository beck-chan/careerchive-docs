import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Chonburi, Instrument_Serif, Jost } from "next/font/google";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const chonburi = Chonburi({
  variable: "--font-chonburi",
  subsets: ["latin"],
  weight: "400",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "CareerChive",
  description:
    "Gain oversight over your professional accomplishments and experiences at work.",
  icons: {
    icon: { url: "/favicon-light.svg", type: "image/svg+xml" },
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jost.variable} ${chonburi.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script
          id="theme-boot"
          dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }}
        />
        {children}
      </body>
    </html>
  );
}
