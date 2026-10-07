import { describe, it } from "node:test";
import assert from "node:assert";
import { contactFormSchema } from "../src/lib/validations/contact";
import { sanitizeText, escapeHtml, formatMultilineForHtml } from "../src/lib/sanitize";

describe("Contact Form Validation Tests", () => {
  const validData = {
    name: "Alex Johnson",
    email: "alex@example.com",
    service: "Website Development" as const,
    budget: "$500 - $1,000",
    message: "I need a high-performance Next.js web application for my company.",
  };

  it("should validate a completely valid submission", () => {
    const result = contactFormSchema.safeParse(validData);
    assert.strictEqual(result.success, true);
  });

  it("should fail when name is missing or empty", () => {
    const result = contactFormSchema.safeParse({ ...validData, name: "" });
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].path[0], "name");
    }
  });

  it("should fail when name exceeds 100 characters", () => {
    const longName = "A".repeat(101);
    const result = contactFormSchema.safeParse({ ...validData, name: longName });
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].path[0], "name");
    }
  });

  it("should fail when email is missing or empty", () => {
    const result = contactFormSchema.safeParse({ ...validData, email: "" });
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].path[0], "email");
    }
  });

  it("should fail when email format is invalid", () => {
    const invalidEmails = ["notanemail", "user@", "@domain.com", "user@domain", "user space@domain.com"];
    for (const email of invalidEmails) {
      const result = contactFormSchema.safeParse({ ...validData, email });
      assert.strictEqual(result.success, false, `Expected ${email} to be invalid`);
    }
  });

  it("should fail when email exceeds 254 characters", () => {
    const longEmail = "a".repeat(250) + "@domain.com";
    const result = contactFormSchema.safeParse({ ...validData, email: longEmail });
    assert.strictEqual(result.success, false);
  });

  it("should fail when service is missing", () => {
    const result = contactFormSchema.safeParse({ ...validData, service: "" });
    assert.strictEqual(result.success, false);
  });

  it("should fail when service is not in predefined SERVICES list", () => {
    const result = contactFormSchema.safeParse({ ...validData, service: "Hacking Service" });
    assert.strictEqual(result.success, false);
  });

  it("should fail when message is shorter than 20 characters", () => {
    const result = contactFormSchema.safeParse({ ...validData, message: "Short msg" });
    assert.strictEqual(result.success, false);
    if (!result.success) {
      assert.strictEqual(result.error.issues[0].path[0], "message");
    }
  });

  it("should fail when message exceeds 5,000 characters", () => {
    const hugeMessage = "M".repeat(5001);
    const result = contactFormSchema.safeParse({ ...validData, message: hugeMessage });
    assert.strictEqual(result.success, false);
  });

  it("should fail when budget exceeds 100 characters", () => {
    const hugeBudget = "B".repeat(101);
    const result = contactFormSchema.safeParse({ ...validData, budget: hugeBudget });
    assert.strictEqual(result.success, false);
  });

  it("should allow empty or omitted optional budget", () => {
    const result1 = contactFormSchema.safeParse({ ...validData, budget: "" });
    assert.strictEqual(result1.success, true);

    const { budget, ...withoutBudget } = validData;
    const result2 = contactFormSchema.safeParse(withoutBudget);
    assert.strictEqual(result2.success, true);
  });
});

describe("Sanitization & HTML Injection Prevention Tests", () => {
  it("should strip HTML and script tags from input", () => {
    const dirty = "<script>alert('xss')</script>Hello <b>World</b>";
    const clean = sanitizeText(dirty);
    assert.strictEqual(clean, "alert('xss')Hello World");
    assert.strictEqual(clean.includes("<script>"), false);
  });

  it("should strip null bytes and invisible control characters", () => {
    const withNull = "Hello\x00World\x1F!";
    const clean = sanitizeText(withNull);
    assert.strictEqual(clean, "HelloWorld!");
  });

  it("should safely escape special HTML characters", () => {
    const raw = `Tom & Jerry <"cats" & 'dogs'> / test = \``;
    const escaped = escapeHtml(raw);
    assert.strictEqual(escaped.includes("&amp;"), true);
    assert.strictEqual(escaped.includes("&lt;"), true);
    assert.strictEqual(escaped.includes("&gt;"), true);
    assert.strictEqual(escaped.includes("&quot;"), true);
    assert.strictEqual(escaped.includes("&#39;"), true);
  });

  it("should format multiline text with safe <br /> tags", () => {
    const multiline = "Line 1\nLine 2\r\nLine 3 <script>";
    const formatted = formatMultilineForHtml(multiline);
    assert.strictEqual(formatted.includes("<br />"), true);
    assert.strictEqual(formatted.includes("<script>"), false);
  });
});
