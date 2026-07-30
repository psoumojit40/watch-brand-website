import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { products as staticProducts } from "@/data/products";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        appointments: {
          orderBy: { createdAt: "desc" },
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ appointments: user?.appointments || [] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, boutique, date, timeSlot, notes } = await req.json();

    if (!productId || !boutique || !date || !timeSlot) {
      return NextResponse.json(
        { error: "Product, boutique, date, and time slot are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const staticP = staticProducts.find((p) => p.id === productId || p.slug === productId);
    const searchSlug = staticP ? staticP.slug : productId;

    // Ensure product exists in DB by ID or Slug
    let product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: productId },
          { slug: searchSlug },
        ],
      },
    });

    if (!product && staticP) {
      product = await prisma.product.upsert({
        where: { slug: staticP.slug },
        update: {},
        create: {
          id: staticP.id,
          name: staticP.name,
          slug: staticP.slug,
          collection: staticP.collection,
          price: staticP.price,
          currency: staticP.currency || "CHF",
          description: staticP.description,
          shortDescription: staticP.shortDescription,
          images: staticP.images,
          movement: staticP.movement,
          caseMaterial: staticP.case_material,
          caseDiameter: staticP.case_diameter,
          waterResistance: staticP.water_resistance,
          powerReserve: staticP.power_reserve,
          features: staticP.features,
          isNew: staticP.isNew || false,
          isLimited: staticP.isLimited || false,
          limitedEdition: staticP.limitedEdition || null,
        },
      });
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        productId: product.id,
        boutique,
        date: String(date),
        timeSlot: String(timeSlot),
        notes: notes ? String(notes) : null,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(
      { appointment, message: "Appointment booked successfully." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Appointment Error:", error);
    return NextResponse.json({ error: "Failed to book appointment." }, { status: 500 });
  }
}
