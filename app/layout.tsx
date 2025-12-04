// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gucci Shop",
  description: "A clean, modern landing page template for a waitlist.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ fontFamily: `"Courier New", Courier, monospace` }}>
      <body className="bg-slate-950 text-slate-50 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
