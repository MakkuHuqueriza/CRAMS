import type { Metadata } from "next";
import { Montserrat, Manrope } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { getUser } from "@/utils/supabase/server";

const montserrat = Montserrat({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-secondary",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CRAMS - Classroom Reservation and Management System",
};

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  const name = user?.user_metadata.full_name;
  const avatar_url = user?.user_metadata.avatar_url;
  const email = user?.user_metadata.email;

  return (
    <div
      className={`${montserrat.variable} ${manrope.variable} antialiased flex flex-col min-h-screen`}
    >
      {/* Navbar */}
      <Navbar name={name} avatar_url={avatar_url} email={email} />

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
