import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, otp } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (!otp) {
      return NextResponse.json(
        { error: "Verification code is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 400 }
      );
    }

    // Verify OTP in VerificationToken table
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: normalizedEmail,
        token: cleanOtp,
      },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired verification code. Please request a new code." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        password: hashedPassword,
        emailVerified: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Delete token after successful registration
    await prisma.verificationToken.deleteMany({
      where: { identifier: normalizedEmail },
    });

    return NextResponse.json({ user, message: "Account created and verified successfully." }, { status: 201 });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Something went wrong during account creation." },
      { status: 500 }
    );
  }
}
