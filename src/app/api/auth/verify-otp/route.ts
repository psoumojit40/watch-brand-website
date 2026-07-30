import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email address and verification code are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: normalizedEmail,
        token: cleanOtp,
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Invalid verification code. Please check your email and try again." },
        { status: 400 }
      );
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token: cleanOtp },
      });
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new code." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email address verified successfully.",
    });
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { error: "Failed to verify code. Please try again." },
      { status: 500 }
    );
  }
}
