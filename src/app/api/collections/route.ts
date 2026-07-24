import { NextResponse } from "next/server";
import { collections } from "@/data/collections";

export async function GET() {
  return NextResponse.json(collections);
}
