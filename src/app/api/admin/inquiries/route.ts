import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/adminAuth";
import { getInquiries, updateInquiryStatus, InquiryStatus } from "@/lib/storage";

export async function GET(req: NextRequest) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusParam = (searchParams.get("status") || "all") as "all" | InquiryStatus;

  const inquiries = await getInquiries(statusParam);
  return NextResponse.json({ success: true, inquiries });
}

export async function PATCH(req: NextRequest) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();

    if (!id || (status !== "new" && status !== "replied")) {
      return NextResponse.json(
        { success: false, message: "Invalid payload. 'id' and valid 'status' are required." },
        { status: 400 }
      );
    }

    const updated = await updateInquiryStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Inquiry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Status updated successfully." });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update inquiry." },
      { status: 500 }
    );
  }
}
