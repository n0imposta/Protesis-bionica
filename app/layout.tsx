import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bionic-prosthetics.local"),
  title: {
    default: "Bionic Prosthetics Innovation Toolkit",
    template: "%s | Bionic Prosthetics",
  },
  description:
    "HealthTech innovation platform for low-cost bionic prosthetics research, design, validation, and clinical documentation.",
  keywords: [
    "bionic prosthetics",
    "healthtech",
    "biomedical research",
    "innovation toolkit",
    "myoelectric prosthetics",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
