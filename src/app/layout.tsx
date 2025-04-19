import type { Metadata } from "next";
import { Montserrat, Manrope } from "next/font/google";
import "@/styles/globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${manrope.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
