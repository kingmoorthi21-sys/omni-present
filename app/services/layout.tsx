import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services – Web Design, SEO, Google Ads | Omni Present",
  description: "Explore Omni Present's full range of digital services — Web Design, SEO, Google Ads, Social Media Marketing and more.",
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}