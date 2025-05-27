"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Linkedin, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset form after submission
    setFormData({ name: "", email: "", message: "" });
  };

  const developers = [
    {
      name: "Mark Jaily Pena",
      email: "mhpena@up.edu.ph",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Mark Jaily Pena",
      email: "mhpena@up.edu.ph",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Mark Jaily Pena",
      email: "mhpena@up.edu.ph",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Mark Jaily Pena",
      email: "mhpena@up.edu.ph",
      image: "/placeholder.svg?height=60&width=60",
    },
  ];

  return (
    <div className="bg-zinc-900 min-h-screen p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-blue-800 mr-2">📋</div>
            <h1 className="text-xl font-bold">CRAMS</h1>
          </div>
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="User"
              />
              <AvatarFallback>MK</AvatarFallback>
            </Avatar>
            <span className="ml-2">Makku Kuma</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Left Column - Message Form */}
          <div>
            <h2 className="text-2xl font-bold mb-1">Message Us</h2>
            <p className="text-gray-600 mb-6">
              got a problem? send us a message!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  className="min-h-[150px]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-800 hover:bg-blue-900"
              >
                Submit
              </Button>
            </form>
          </div>

          {/* Right Column - Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-1">Contact Us</h2>
            <p className="text-gray-600 mb-6">
              send your inquiries directly to us
            </p>

            {/* Address Section - Moved to the top as requested */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-2">ADDRESS</h3>
              <p className="mb-1">College of Science and Mathematics,</p>
              <p className="mb-1">UP Mindanao, Tugbok, Davao City</p>
              <p className="mb-1">(082) 293 0303</p>
              <p className="mb-1">projectcrams@gmail.com</p>
            </div>

            {/* Developer Profiles - Changed to "Support the devs" as requested */}
            <h3 className="font-bold text-lg mb-4">Support the devs</h3>
            <div className="space-y-4">
              {developers.map((dev, index) => (
                <div key={index} className="flex items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={dev.image || "/placeholder.svg"}
                      alt={dev.name}
                    />
                    <AvatarFallback>{dev.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="font-medium">{dev.name}</p>
                    <p className="text-sm text-gray-600">{dev.email}</p>
                  </div>
                  <div className="ml-auto flex space-x-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-blue-800 text-white hover:bg-blue-900"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-blue-800 text-white hover:bg-blue-900"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-blue-800 text-white hover:bg-blue-900"
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
