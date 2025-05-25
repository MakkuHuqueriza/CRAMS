"use client";

import Link from "next/link";
import { Mail, Clock, Phone, ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Footer() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full bg-[#1e4976] text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and tagline */}
          <div className="flex flex-col space-y-4 pl-4 mb-2 md:mb-0">
            <Link href="/" className="flex items-center w-[150px]">
              <Image
                src="/CRAMS_ALL_WHITE_LOGO.svg"
                alt="CRAMS Logo"
                width={150}
                height={50}
                className="h-auto"
              />
            </Link>
            <p className="text-sm text-gray-200 cursor-default">
              Classroom Reservation and Management System
            </p>
            <button
              onClick={scrollToTop}
              className={`flex items-center w-[160px] space-x-2 text-gray-300 hover:text-white transition ${showButton ? "opacity-100" : "opacity-0"}`}
              aria-label="Return to top"
            >
              <div className="flex items-center space-x-2 border-2 border-gray-300 hover:border-white transition p-2 rounded-md">
                <ArrowUp className="h-5 w-5" />
                <span className="font-medium">Return to top</span>
              </div>
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <div className="border-t border-gray-500 mt-1 mb-2 pt-6 flex flex-col md:flex-row md:hidden justify-between items-center"></div>
            <h3 className="text-lg font-semibold mb-4 text-center cursor-default">
              Quick Links
            </h3>
            <ul className="space-y-2 flex flex-col items-center">
              <li>
                <Link
                  href="/"
                  className="text-gray-200 hover:text-white transition text-left w-fit"
                >
                  Available Rooms
                </Link>
              </li>
              <li>
                <Link
                  href="/pending-reservations"
                  className="text-gray-200 hover:text-white transition text-left w-fit"
                >
                  Pending Reservations
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-gray-200 hover:text-white transition text-left w-fit"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center cursor-default">
              Contact Us
            </h3>
            <ul className="space-y-3 flex flex-col items-center">
              <li className="flex items-center space-x-3 cursor-default">
                <Mail className="h-5 w-5 text-gray-200" />
                <span className="text-gray-200">projectcrams@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3 cursor-default">
                <Phone className="h-5 w-5 text-gray-200" />
                <span className="text-gray-200">(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 cursor-default">
                <Clock className="h-5 w-5 text-gray-200" />
                <span className="text-gray-200">Mon-Fri: 8AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-500 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center cursor-default">
          <p className="text-sm text-gray-300">
            &copy; {new Date().getFullYear()} CRAMS. All rights reserved.
          </p>
        </div>
      </div>
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-white p-3 rounded-full shadow-lg transition-opacity duration-300 ${showButton ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-label="Return to top"
      >
        <ArrowUp className="h-5 w-5 text-[#1e4976]" />
      </button>
    </footer>
  );
}
