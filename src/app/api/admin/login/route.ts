import { NextRequest, NextResponse } from "next/server";
import { getAdminPassword, generateAdminToken, COOKIE_NAME } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const expectedPassword = getAdminPassword();

    if (!password || password !== expectedPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid admin password." },
        { status: 401 }
      );
    }

    const token = generateAdminToken();
    const response = NextResponse.json({ success: true, message: "Logged in successfully." });

    // Set secure HttpOnly cookie valid for 7 days
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, message: "An error occurred during authentication." },
      { status: 500 }
    );
  }
}
