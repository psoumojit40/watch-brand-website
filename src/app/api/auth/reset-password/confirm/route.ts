import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Email, verification code, and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const cleanOtp = String(otp).trim();
    const resetIdentifier = `reset_${normalizedEmail}`;

    // Verify token in VerificationToken table
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: resetIdentifier,
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

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    // Hash new password and update user record
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    // Clean up reset token
    await prisma.verificationToken.deleteMany({
      where: { identifier: resetIdentifier },
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error: any) {
    console.error("Reset Password Confirm Error:", error);
    return NextResponse.json(
      { error: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}
