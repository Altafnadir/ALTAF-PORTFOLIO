/**
 * Utility for sanitizing user inputs and escaping HTML
 * to prevent XSS and HTML injection in emails, databases, and logs.
 */

export function sanitizeText(input: string): string {
  if (typeof input !== "string") return "";

  return input
    // Remove null bytes and invisible control characters (preserve \r, \n, \t)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Strip HTML tags
    .replace(/<[^>]*>?/gm, "")
    .trim();
}

export function escapeHtml(input: string): string {
  if (typeof input !== "string") return "";

  const entityMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };

  return input.replace(/[&<>"'`=\/]/g, (char) => entityMap[char] || char);
}

/**
 * Format multiline user text safely for HTML emails with <br/> line breaks
 */
export function formatMultilineForHtml(input: string): string {
  const sanitized = sanitizeText(input);
  const escaped = escapeHtml(sanitized);
  return escaped.replace(/\r?\n/g, "<br />");
}
