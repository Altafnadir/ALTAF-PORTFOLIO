import { NextRequest } from "next/server";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in ms
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (per-IP)
const inMemoryStore = new Map<string, RateLimitRecord>();

// Clean expired records periodically
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
let lastCleanup = Date.now();

function cleanupExpired() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  for (const [ip, record] of inMemoryStore.entries()) {
    if (record.resetTime <= now) {
      inMemoryStore.delete(ip);
    }
  }
  lastCleanup = now;
}

/**
 * Extracts client IP from standard reverse-proxy headers or defaults to localhost.
 */
export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // First IP in list is client IP
    const firstIp = forwardedFor.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  return "127.0.0.1";
}

/**
 * Enforces rate limit: 3 submissions per IP per 10 minutes.
 * Can be disabled via RATE_LIMIT_ENABLED=false.
 */
export async function checkRateLimit(req: NextRequest): Promise<RateLimitResult> {
  const isEnabled = process.env.RATE_LIMIT_ENABLED !== "false";
  const limit = 3;
  const windowMs = 10 * 60 * 1000; // 10 minutes

  if (!isEnabled) {
    return {
      success: true,
      limit,
      remaining: limit,
      reset: Date.now() + windowMs,
    };
  }

  cleanupExpired();

  const ip = getClientIp(req);
  const now = Date.now();
  const record = inMemoryStore.get(ip);

  if (!record || record.resetTime <= now) {
    // New window
    inMemoryStore.set(ip, {
      count: 1,
      resetTime: now + windowMs,
    });

    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  // Existing active window
  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetTime,
  };
}
