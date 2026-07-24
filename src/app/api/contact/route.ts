import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // 1. Basic Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address format." },
        { status: 400 }
      );
    }

    // 2. SMTP Environment Variables Check
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const recipient = process.env.CONTACT_EMAIL_TO || user;

    if (!user || !pass || user.includes("your-email") || pass.includes("your-app-password")) {
      return NextResponse.json(
        {
          error:
            "SMTP credentials are not configured yet. Please set SMTP_USER and SMTP_PASS in your .env file.",
        },
        { status: 500 }
      );
    }

    // 3. Create Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for 587 or other ports
      auth: {
        user,
        pass,
      },
    });

    // 4. HTML Email Template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #f5f5f7; border: 1px solid #222; padding: 30px; border-radius: 8px;">
        <h2 style="color: #c9a96e; border-bottom: 1px solid #333; padding-bottom: 12px; margin-top: 0;">
          New Contact Inquiry
        </h2>
        <p style="margin-bottom: 20px; font-size: 14px; color: #a1a1aa;">
          You received a new message from the website contact section:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="padding: 8px 0; color: #888; font-weight: bold; width: 100px;">Name:</td>
            <td style="padding: 8px 0; color: #fff;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #888; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0; color: #c9a96e;"><a href="mailto:${escapeHtml(email)}" style="color: #c9a96e; text-decoration: none;">${escapeHtml(email)}</a></td>
          </tr>
        </table>

        <div style="background-color: #141414; border-left: 3px solid #c9a96e; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #e4e4e7; white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>

        <p style="font-size: 12px; color: #52525b; margin-top: 30px; border-top: 1px solid #222; pt: 16px;">
          Sent automatically via Watch Brand Website Contact System.
        </p>
      </div>
    `;

    // 5. Send Mail
    await transporter.sendMail({
      from: `"${name}" <${user}>`,
      replyTo: email,
      to: recipient,
      subject: `[Contact Form] New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: htmlContent,
    });

    return NextResponse.json(
      { success: true, message: "Your message has been sent successfully." },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error sending contact email:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to send email.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
