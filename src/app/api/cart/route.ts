import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ cart: [] });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ cart: user?.cartItems || [] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, quantity } = await req.json();
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const item = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
      update: {
        quantity: { increment: quantity || 1 },
      },
      create: {
        userId: user.id,
        productId,
        quantity: quantity || 1,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId } = await req.json();
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (productId) {
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId: user.id,
            productId,
          },
        },
      });
    } else {
      await prisma.cartItem.deleteMany({
        where: { userId: user.id },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 });
  }
}
