/**
 * Optional Cloudflare Turnstile CAPTCHA verification module.
 * Can be turned on or off via TURNSTILE_ENABLED="true" / "false".
 */

export interface CaptchaVerificationResult {
  success: boolean;
  message?: string;
}

export async function verifyCaptchaToken(
  token?: string,
  clientIp?: string
): Promise<CaptchaVerificationResult> {
  const isEnabled = process.env.TURNSTILE_ENABLED === "true";

  // If CAPTCHA is disabled, bypass check
  if (!isEnabled) {
    return { success: true };
  }

  // When enabled, a valid token is required
  if (!token || token.trim().length === 0) {
    return {
      success: false,
      message: "CAPTCHA verification is required. Please complete the verification challenge.",
    };
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.error("[Turnstile Error] TURNSTILE_ENABLED is true but TURNSTILE_SECRET_KEY is missing.");
    // Fail safely or warn in dev
    return { success: true };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (clientIp) {
      formData.append("remoteip", clientIp);
    }

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await res.json();

    if (data.success) {
      return { success: true };
    }

    return {
      success: false,
      message: "CAPTCHA verification failed. Please refresh and try again.",
    };
  } catch (err: any) {
    console.error("[Turnstile Verification Network Error]", err?.message || err);
    return {
      success: false,
      message: "Failed to connect to verification server. Please try again.",
    };
  }
}
