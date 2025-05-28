"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Facebook, Linkedin, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);

    // Show success dialog
    setShowSuccessDialog(true);

    // Reset form after submission
    setFormData({ name: "", email: "", message: "" });
  };

  const developers = [
    {
      name: "Mark Jaily Peña",
      email: "markjaily09@gmail.com",
      image: "/dev-profile/Mark.png",
      facebook: "https://www.facebook.com/makku.jaily",
      linkedin: "https://www.linkedin.com/in/makkukuma/",
    },
    {
      name: "Rommel Rutherford Yong",
      email: "rommelyong25@gmail.com",
      image: "/dev-profile/Rommel.png",
      facebook: "https://www.facebook.com/rommelrutherford.yong/",
      linkedin: "https://www.linkedin.com/in/rommel-yong-a83460157/",
    },
    {
      name: "Cristieneil Ceballos",
      email: "ceballoscristieneil@gmail.com",
      image: "/dev-profile/Cristieneil.png",
      facebook: "https://www.facebook.com/cristieneilceballos/",
      linkedin: "https://www.linkedin.com/in/cris-ceballos/",
    },
    {
      name: "Jodi Gabano",
      email: "jodi.gabano@gmail.com",
      image: "/dev-profile/Jodi.png",
      facebook: "https://www.facebook.com/Jodi.Gabano",
      linkedin: "https://www.linkedin.com/in/jodi-gabano/",
    },
  ];

  return (
    <div className="mx-auto px-4 h-full">
      <div className="max-w-6xl mx-auto bg-white rounded-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 pt-6 pl-6 pr-6 pb-[70px]">
          {/* Left Column - Message Form */}
          <div>
            <h2 className="text-2xl font-bold mb-1">Message Us</h2>
            <p className="text-color-primary font-medium mb-6">
              got a problem? send us a message!
            </p>

            <div className="p-4 rounded-lg border border-[#D9D9D9] shadow-sm">
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
                    className="min-h-[200px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full font-semibold text-white bg-[#034078] hover:bg-[#182657] cursor-pointer"
                >
                  Submit
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column - Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-1">Contact Us</h2>
            <p className="text-color-primary font-medium mb-6">
              send your inquiries directly to us
            </p>

            <div className="mb-8">
              <h3 className="font-bold text-lg mb-2">Address</h3>
              <p className="mb-1">College of Science and Mathematics,</p>
              <p className="mb-1">UP Mindanao, Tugbok, Davao City</p>
            </div>

            <div className="mb-8">
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p className="mb-1">projectcrams@gmail.com</p>
            </div>

            {/* Developer Profiles - Changed to "Support the devs" as requested */}
            <h3 className="font-bold text-lg mb-2">Support the devs</h3>
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
                  <div className="ml-3 w-[220px]">
                    <p className="font-medium">{dev.name}</p>
                    <p className="text-sm text-gray-600">{dev.email}</p>
                  </div>
                  <div className="ml-auto flex space-x-2">
                    {dev.linkedin && (
                      <a
                        href={dev.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 w-8 color-primary text-white rounded-full flex items-center justify-center hover:bg-[#182657]"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {dev.facebook && (
                      <a
                        href={dev.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 w-8 color-primary text-white rounded-full flex items-center justify-center hover:bg-[#182657]"
                      >
                        <Facebook className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Success!
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              {
                "You've successfully submitted your message. Kindly check your email for the updates."
              }
            </p>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-[#034078] hover:bg-[#182657] text-white"
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
