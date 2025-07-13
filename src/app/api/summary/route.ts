import EmailTemplate from '@/app/components/EmailReservationSummary';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {

  const body = await req.json();

  const email = body.email;
  try {
    const { data, error } = await resend.emails.send({
      from: 'teams@crams.space',
      to: [email],
      subject: 'Reservation Summary',
      react: EmailTemplate(body) as React.ReactElement,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}