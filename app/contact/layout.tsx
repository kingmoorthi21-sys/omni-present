import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us – Omni Present | Free Strategy Session",
  description: "Get in touch with Omni Present. Book your free 20-minute strategy session and discover how we can help grow your Australian business.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}