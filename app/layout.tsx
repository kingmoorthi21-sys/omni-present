import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Omni Present – Web Design, Development & Digital Marketing Agency in Australia",
  description: "Helping Australian businesses grow leads & sales through high-converting websites, SEO, Google Ads and social media marketing. Get your free strategy session today.",
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