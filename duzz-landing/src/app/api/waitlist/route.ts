import { NextRequest, NextResponse } from "next/server";
import { addUser } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { email, name, school, eventInterest, referral, honeypot } = body;

    // Honeypot check — if filled, it's a bot
    if (honeypot) {
      return NextResponse.json({ success: true, message: "You're on the list." });
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const result = addUser({
      email: email.trim().toLowerCase(),
      name: (name || "").trim(),
      school: (school || "").trim(),
      eventInterest: (eventInterest || "").trim(),
      referral: (referral || "").trim(),
    });

    return NextResponse.json(result, {
      status: result.success ? 200 : 409,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
