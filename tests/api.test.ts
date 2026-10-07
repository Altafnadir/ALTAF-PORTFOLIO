import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { POST } from "../src/app/api/contact/route";
import { checkRateLimit } from "../src/lib/rateLimit";

describe("Contact API Route Tests", () => {
  // Valid payload template
  const validPayload = {
    name: "Jane Smith",
    email: "jane@company.com",
    service: "Mobile Application Development",
    budget: "$2000",
    message: "We need an iOS and Android MVP built in Flutter or React Native.",
    honeypot: "",
  };

  beforeEach(() => {
    // Mock nodemailer createTransport so real emails are NEVER sent during tests
    nodemailer.createTransport = (() => {
      return {
        sendMail: async () => ({
          messageId: "mock-test-message-id-12345",
          response: "250 OK: Message accepted",
        }),
      } as any;
    }) as any;

    process.env.GMAIL_USER = "test@example.com";
    process.env.GMAIL_APP_PASSWORD = "mock-app-password";
    process.env.CONTACT_TO_EMAIL = "Altafnadir33@gmail.com";
    process.env.RATE_LIMIT_ENABLED = "false"; // disabled by default in unit tests to avoid cross-test interference
    process.env.TURNSTILE_ENABLED = "false";
    process.env.DATABASE_ENABLED = "false";
  });

  it("should return 200 on a successful valid POST submission", async () => {
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.message, "Your message has been sent successfully.");
    assert.ok(json.inquiryId, "Expected response to include inquiryId");
  });

  it("should return 400 with errors when required fields are missing", async () => {
    const invalidPayload = {
      name: "",
      email: "invalid-email",
      service: "Nonexistent Service",
      message: "Too short",
    };

    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidPayload),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 400);

    const json = await res.json();
    assert.strictEqual(json.success, false);
    assert.ok(Array.isArray(json.errors), "Expected json.errors array");
    assert.ok(json.errors.length >= 3);
  });

  it("should return 400 on invalid non-JSON body", async () => {
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "this is not json",
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 400);
    const json = await res.json();
    assert.strictEqual(json.success, false);
  });

  it("should silently return 200 without sending emails on honeypot submission", async () => {
    let emailWasSent = false;
    nodemailer.createTransport = (() => {
      return {
        sendMail: async () => {
          emailWasSent = true;
          return { messageId: "123" };
        },
      } as any;
    }) as any;

    const botPayload = {
      ...validPayload,
      honeypot: "http://spam-link.ru", // Bot trapped!
    };

    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(botPayload),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 200);

    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(emailWasSent, false, "Emails must NEVER be sent for honeypot bot submissions");
  });

  it("should return 403 on forbidden cross-origin requests", async () => {
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "https://malicious-external-site.com",
        host: "myportfolio.com",
      },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 403);
    const json = await res.json();
    assert.strictEqual(json.success, false);
  });

  it("should return 429 when rate limit is exceeded", async () => {
    process.env.RATE_LIMIT_ENABLED = "true";

    const testIp = "192.168.1.105";

    // Perform 3 calls that should succeed
    for (let i = 0; i < 3; i++) {
      const check = await checkRateLimit(
        new NextRequest("http://localhost:3000/api/contact", {
          headers: { "x-forwarded-for": testIp },
        })
      );
      assert.strictEqual(check.success, true);
    }

    // 4th call must be blocked
    const fourthCheck = await checkRateLimit(
      new NextRequest("http://localhost:3000/api/contact", {
        headers: { "x-forwarded-for": testIp },
      })
    );
    assert.strictEqual(fourthCheck.success, false);
    assert.strictEqual(fourthCheck.remaining, 0);

    // Call route with rate limit enabled
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": testIp,
      },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 429);
    assert.ok(res.headers.get("Retry-After"), "Expected Retry-After header");
  });

  it("should handle email failure gracefully without leaking credentials or stack traces", async () => {
    // Mock nodemailer to simulate failure
    nodemailer.createTransport = (() => {
      return {
        sendMail: async () => {
          throw new Error("Invalid login: 535-5.7.8 Username and Password not accepted.");
        },
      } as any;
    }) as any;

    process.env.RATE_LIMIT_ENABLED = "false";
    process.env.DATABASE_ENABLED = "false";

    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 500);

    const json = await res.json();
    assert.strictEqual(json.success, false);
    // Ensure no sensitive SMTP or stack trace details leaked to client
    assert.strictEqual(json.message.includes("535-5.7.8"), false);
    assert.strictEqual(json.message.includes("Password"), false);
    assert.strictEqual(json.message.includes("stack"), false);
  });
});
