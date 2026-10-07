import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations/contact";
import { sanitizeText } from "@/lib/sanitize";
import { sendLeadNotificationEmail, sendAutoReplyEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { verifyCaptchaToken } from "@/lib/captcha";
import { saveInquiry, markEmailSent } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    // 1. CORS & Origin validation
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    if (origin) {
      try {
        const originUrl = new URL(origin);
        // Allow same-host origin or local development
        if (host && originUrl.host !== host && !originUrl.host.includes("localhost") && !originUrl.host.includes("127.0.0.1")) {
          return NextResponse.json(
            { success: false, message: "Cross-origin requests forbidden." },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { success: false, message: "Invalid Origin header." },
          { status: 400 }
        );
      }
    }

    // 2. Rate Limiting (3 submissions per IP per 10 minutes)
    const rateLimit = await checkRateLimit(request);
    if (!rateLimit.success) {
      const retryAfterSeconds = Math.max(1, Math.ceil((rateLimit.reset - Date.now()) / 1000));
      return NextResponse.json(
        {
          success: false,
          message: "Too many inquiries sent from your IP. Please wait a few minutes before trying again.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfterSeconds.toString(),
            "X-RateLimit-Limit": rateLimit.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.reset.toString(),
          },
        }
      );
    }

    // 3. Parse JSON body safely
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request payload. Please send valid JSON.",
        },
        { status: 400 }
      );
    }

    // 4. Validate with Zod
    const validationResult = contactFormSchema.safeParse(body);
    if (!validationResult.success) {
      const issues = validationResult.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return NextResponse.json(
        {
          success: false,
          message: "Please check the form fields and try again.",
          errors: issues,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 5. Honeypot check (silent rejection)
    if (data.honeypot && data.honeypot.trim().length > 0) {
      console.warn("[Spam Protection] Honeypot field filled. Discarding silently.");
      return NextResponse.json(
        {
          success: true,
          message: "Your message has been sent successfully.",
        },
        { status: 200 }
      );
    }

    // 6. Optional CAPTCHA (Turnstile) verification
    const clientIp = getClientIp(request);
    const captchaCheck = await verifyCaptchaToken(data.captchaToken, clientIp);
    if (!captchaCheck.success) {
      return NextResponse.json(
        {
          success: false,
          message: captchaCheck.message || "CAPTCHA verification failed. Please try again.",
        },
        { status: 400 }
      );
    }

    // 7. Sanitize inputs
    const sanitizedData = {
      name: sanitizeText(data.name),
      email: sanitizeText(data.email).toLowerCase(),
      service: sanitizeText(data.service),
      budget: data.budget ? sanitizeText(data.budget) : undefined,
      message: sanitizeText(data.message),
    };

    // 8. Failure-Safe Lead Storage
    // Always persist inquiry first so the lead is never lost if SMTP fails!
    const savedInquiry = await saveInquiry({
      name: sanitizedData.name,
      email: sanitizedData.email,
      service: sanitizedData.service,
      budget: sanitizedData.budget,
      message: sanitizedData.message,
    });

    // 9. Send emails via Nodemailer
    let emailSentSuccessfully = false;
    try {
      await sendLeadNotificationEmail({
        ...sanitizedData,
        submittedAt: new Date(savedInquiry.createdAt),
      });

      emailSentSuccessfully = true;
      await markEmailSent(savedInquiry.id, true);

      // Send confirmation auto-reply to client
      sendAutoReplyEmail({
        name: sanitizedData.name,
        email: sanitizedData.email,
        service: sanitizedData.service,
      }).catch((autoReplyErr) => {
        console.error("[Email Service] Auto-reply failed:", autoReplyErr?.message || autoReplyErr);
      });
    } catch (emailError: any) {
      console.error("[Email Service Error]", {
        message: emailError?.message,
        code: emailError?.code,
      });

      // If database is enabled, we saved the lead! Let the user know we received it
      if (process.env.DATABASE_ENABLED === "true") {
        return NextResponse.json(
          {
            success: true,
            message: "Your message has been received! We will follow up with you shortly.",
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "Unable to send your inquiry at this moment. Please try again or reach out directly via email.",
        },
        { status: 500 }
      );
    }

    // 10. Success Response
    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully.",
        inquiryId: savedInquiry.id,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": rateLimit.limit.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      }
    );
  } catch (err: any) {
    console.error("[Unhandled Contact Route Error]", err?.message || err);

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
