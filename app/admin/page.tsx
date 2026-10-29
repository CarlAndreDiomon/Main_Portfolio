import { Metadata } from "next";
import AdminPanel from "./_components/AdminPanel";

export const metadata: Metadata = {
  title: "Admin Dashboard — Portfolio Control Center",
  description: "Secure CMS control center to manage portfolio projects, skills, experience, and content dynamically.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminPanel />;
}
