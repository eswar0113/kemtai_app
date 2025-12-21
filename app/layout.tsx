import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kemtai AI Fitness",
  description: "Real-time AI fitness trainer with pose detection and feedback"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-gray-100 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
      </body>
    </html>
  );
}


