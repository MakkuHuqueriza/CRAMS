import ContactUsEmailTemplate from "@/app/components/ContactUsEmailTemplate";
import React from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  const { name, email, message } = body;

  try {
    const { data, error } = await resend.emails.send({
      from: "contact-us@crams.space",
      to: ["projectcrams@gmail.com"], // Change to your admin/support email
      subject: "New Contact Us Message",
      react: ContactUsEmailTemplate({
        name,
        email,
        message,
      }) as React.ReactElement,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
