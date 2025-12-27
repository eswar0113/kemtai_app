import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Kemtai AI Fitness",
  description: "Real-time AI fitness trainer with pose detection and feedback",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans min-h-screen antialiased text-gray-900 bg-white selection:bg-blue-500/30 selection:text-blue-900`}>
        <div className="mx-auto">{children}</div>
      </body>
    </html>
  );
}


