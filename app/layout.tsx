import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    title: "LUMEN — Archive of Spatial Light",
    description:
      "An immersive architectural archive. Break the seal, roam the living map, and descend into spatial records drawn in silver light.",
    openGraph: {
      title: "LUMEN — Archive of Spatial Light",
      description: "A dark magical archive of architecture, atmosphere and living light.",
      images: [`${origin}/og.png`],
    },
    twitter: {
      card: "summary_large_image",
      title: "LUMEN — Archive of Spatial Light",
      description: "A dark magical archive of architecture, atmosphere and living light.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${display.variable} ${mono.variable} ${sans.variable}`}
        style={{ ["--font-serif" as string]: "var(--font-display)" }}
      >
        {children}
      </body>
    </html>
  );
}
