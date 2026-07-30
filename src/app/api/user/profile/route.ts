import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, phone, address, currentPassword, newPassword } = body;

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = String(name).trim();
    if (phone !== undefined) updateData.phone = String(phone).trim();
    if (address !== undefined) updateData.address = String(address).trim();

    // Password change verification
    if (newPassword) {
      if (!currentUser.password) {
        return NextResponse.json(
          { error: "OAuth accounts cannot change password directly. Set up password authentication." },
          { status: 400 }
        );
      }
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password." },
          { status: 400 }
        );
      }
      const isValid = await bcrypt.compare(currentPassword, currentUser.password);
      if (!isValid) {
        return NextResponse.json({ error: "Incorrect current password." }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters long." },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        image: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser, message: "Profile updated successfully." });
  } catch (error: any) {
    console.error("Update Profile Error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
