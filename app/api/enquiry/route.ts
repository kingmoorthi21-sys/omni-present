import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, phone, email, message, product } = await req.json();

    if (!name || !phone || !email) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'Omni Present <onboarding@resend.dev>',
      to:   process.env.ENQUIRY_EMAIL || 'kingmoorthi21@gmail.com',
      replyTo: email,
      subject: `Wheel Enquiry: ${product}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #E8520A; border-bottom: 2px solid #E8520A; padding-bottom: 12px;">
            New Product Enquiry
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; color: #999; width: 120px;">Product</td>
                <td style="padding: 10px 0; font-weight: bold;">${product}</td></tr>
            <tr><td style="padding: 10px 0; color: #999;">Name</td>
                <td style="padding: 10px 0;">${name}</td></tr>
            <tr><td style="padding: 10px 0; color: #999;">Phone</td>
                <td style="padding: 10px 0;"><a href="tel:${phone}">${phone}</a></td></tr>
            <tr><td style="padding: 10px 0; color: #999;">Email</td>
                <td style="padding: 10px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            ${message ? `<tr><td style="padding: 10px 0; color: #999; vertical-align: top;">Message</td>
                <td style="padding: 10px 0;">${message}</td></tr>` : ''}
          </table>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Enquiry error:', err);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}