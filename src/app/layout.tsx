import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduOps Nepal",
  description: "Multi-tenant school management for Nepal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
