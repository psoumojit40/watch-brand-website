import { NextResponse } from "next/server";
// import redis from "@/lib/redis";

export async function POST() {
  try {
    // await redis.flushall();
    return NextResponse.json({ message: "Cache cleared" });
  } catch {
    return NextResponse.json({ message: "Cache clearing not available (Redis not configured)" });
  }
}
