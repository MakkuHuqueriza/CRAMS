import RejectEmailTemplate from "@/app/components/RejectEmailTemplate";
import React from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  const email = body.email;
  const reason = body.reason;
  const reservation = body.reservation;

  try {
    const { data, error } = await resend.emails.send({
      from: "teams@crams.space",
      to: [email],
      subject: "Your Reservation is REJECTED",
      react: RejectEmailTemplate({ reason, reservation }) as React.ReactElement,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
