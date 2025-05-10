import type { Metadata } from "next";
import { Montserrat, Manrope } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/app/components/Navbar";
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
    <html lang="en">
      <body
        className={`${montserrat.variable} ${manrope.variable} antialiased`}
      >
        <Navbar name={name} avatar_url={avatar_url} email={email} />
        {children}
      </body>
    </html>
  );
}
