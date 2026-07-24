import { NextResponse } from "next/server";
// import redis from "@/lib/redis";
// import prisma from "@/lib/db";
import { products } from "@/data/products";

export async function GET() {
  try {
    // const cached = await redis.get("products");
    // if (cached) return NextResponse.json(cached);
    // const data = await prisma.product.findMany();
    // await redis.set("products", JSON.stringify(data), { ex: 3600 });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(products);
  }
}
