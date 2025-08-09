import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Breeds",
  description: "List of breeds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
