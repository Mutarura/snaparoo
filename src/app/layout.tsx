import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Snaparoo by Hili — Disposable Camera for Events",
  description:
    "The digital disposable camera for events. No app download needed — guests scan a QR code and start snapping. Event organizers get full control over branding, gallery visibility, media limits and more.",
  keywords: "disposable camera, event photos, QR code camera, event photography, Snaparoo",
  openGraph: {
    title: "Snaparoo by Hili",
    description: "The disposable camera for the digital age.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
