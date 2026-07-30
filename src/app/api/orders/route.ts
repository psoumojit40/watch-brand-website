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
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ orders: user?.orders || [] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { items, shippingAddress, paymentMethod } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Calculate total amount and find products
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const staticP = staticProducts.find((p) => p.id === item.productId || p.slug === item.productId);
      const searchSlug = staticP ? staticP.slug : item.productId;

      // Find product in DB by ID or Slug
      let product = await prisma.product.findFirst({
        where: {
          OR: [
            { id: item.productId },
            { slug: searchSlug },
          ],
        },
      });

      if (staticP) {
        if (!product) {
          product = await prisma.product.create({
            data: {
              id: staticP.id,
              name: staticP.name,
              slug: staticP.slug,
              collection: staticP.collection,
              price: staticP.price,
              currency: staticP.currency || "INR",
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
        } else if (product.price !== staticP.price) {
          // Sync database product price with INR price from website static data
          product = await prisma.product.update({
            where: { id: product.id },
            data: {
              price: staticP.price,
              currency: staticP.currency || "INR",
            },
          });
        }
      }

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }

      const effectivePrice = staticP ? staticP.price : product.price;
      const itemTotal = effectivePrice * (item.quantity || 1);
      totalAmount += itemTotal;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity || 1,
        price: effectivePrice,
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        shippingAddress: shippingAddress || user.address || "Main Boutique Pickup",
        paymentMethod: paymentMethod || "Credit Card / Wire Transfer",
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Clear user cart after placing order
    await prisma.cartItem.deleteMany({ where: { userId: user.id } });

    return NextResponse.json({ order, message: "Order placed successfully." }, { status: 201 });
  } catch (error: any) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ error: "Failed to process order." }, { status: 500 });
  }
}
