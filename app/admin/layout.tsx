import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Back-office", template: "%s · Back-office Little" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="bo">{children}</div>;
}
