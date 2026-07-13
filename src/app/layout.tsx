import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sravan Ship Co — Luxury Cruises & Voyages",
  description: "Experience premium boutique travel across the world's most breathtaking waters. Exquisite cruises, Michelin-starred dining, and luxury suites.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
