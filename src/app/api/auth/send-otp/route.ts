import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: "Invalid email address format." }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser && existingUser.password) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 400 }
      );
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    // Delete previous OTP for this email if exists, then create new
    await prisma.verificationToken.deleteMany({
      where: { identifier: normalizedEmail },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: normalizedEmail,
        token: otp,
        expires,
      },
    });

    // SMTP Config
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER || "psoumojit40@gmail.com";
    const pass = (process.env.SMTP_PASS || "hggr myhh wunc udcr").replace(/\s+/g, "");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });

    // Luxury HTML OTP Email Template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; background-color: #0d0c0a; color: #f5f0e8; border: 1px solid #3d3321; border-radius: 12px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 50%; border: 1px solid #c9a96e; background-color: #14120e; color: #e6ce96; font-weight: bold; font-size: 16px;">
            AP
          </div>
          <h2 style="color: #f5f0e8; font-weight: 300; margin-top: 12px; margin-bottom: 4px; font-size: 22px;">
            Email Verification Code
          </h2>
          <p style="color: #a39474; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0;">
            Audemars Piguet Account Security
          </p>
        </div>

        <p style="font-size: 13px; color: #d6c5a3; line-height: 1.6; margin-bottom: 24px; text-align: center;">
          Thank you for creating an account. Please use the verification code below to verify your email address:
        </p>

        <div style="background-color: #14120e; border: 1px solid #c9a96e; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <span style="font-family: monospace; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #f3d687;">
            ${otp}
          </span>
          <p style="font-size: 10px; color: #a39474; margin-top: 8px; margin-bottom: 0; text-transform: uppercase; letter-spacing: 1px;">
            Valid for 10 minutes &middot; Do not share this code
          </p>
        </div>

        <p style="font-size: 11px; color: #71717a; text-align: center; margin-top: 24px; border-top: 1px solid #2e2617; padding-top: 16px;">
          If you did not request this verification code, please ignore this email.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Audemars Piguet" <${user}>`,
      to: normalizedEmail,
      subject: `${otp} is your verification code`,
      text: `Your verification code is ${otp}. It expires in 10 minutes.`,
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email address.",
    });
  } catch (error: any) {
    console.error("Send OTP Error:", error);
    return NextResponse.json(
      { error: "Failed to send verification code. Please check your email address." },
      { status: 500 }
    );
  }
}
