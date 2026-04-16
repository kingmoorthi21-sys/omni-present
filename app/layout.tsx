import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://omni-present-xi.vercel.app'),
  title: "Omni Present – Web Design, Development & Digital Marketing Agency in Australia",
  description: "Helping Australian businesses grow leads & sales through high-converting websites, SEO, Google Ads and social media marketing.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: './',
  },
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