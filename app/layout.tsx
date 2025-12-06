import type { Metadata } from "next";
import { CartProvider } from "./lib/CartContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Güero Gucci",
  description: "Premium merchandise store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}