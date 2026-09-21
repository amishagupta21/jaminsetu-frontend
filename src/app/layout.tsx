import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PropertyProvider } from "@/context/PropertyContext";
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
  title: "BiharLand - ZameenSetu",
  description: "Verified land properties in Rohtas District, Bihar",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <PropertyProvider>{children}</PropertyProvider>
      </body>
    </html>
  );
}
