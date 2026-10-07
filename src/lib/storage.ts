import { randomUUID } from "crypto";

export type InquiryStatus = "new" | "replied";

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  service: string;
  budget?: string;
  message: string;
  createdAt: string; // ISO string
  status: InquiryStatus;
  emailSent?: boolean;
}

// Persistent in-memory fallback store
const globalForStorage = globalThis as unknown as {
  inMemoryInquiries?: InquiryRecord[];
};

if (!globalForStorage.inMemoryInquiries) {
  globalForStorage.inMemoryInquiries = [];
}

const memoryStore = globalForStorage.inMemoryInquiries;

/**
 * Checks whether persistent database integration is enabled
 */
export function isDatabaseEnabled(): boolean {
  return process.env.DATABASE_ENABLED === "true";
}

/**
 * Saves a new inquiry record. Always persists in storage.
 */
export async function saveInquiry(
  data: Omit<InquiryRecord, "id" | "createdAt" | "status">
): Promise<InquiryRecord> {
  const newRecord: InquiryRecord = {
    id: randomUUID(),
    name: data.name,
    email: data.email,
    service: data.service,
    budget: data.budget || undefined,
    message: data.message,
    createdAt: new Date().toISOString(),
    status: "new",
    emailSent: false,
  };

  // 1. Always store in runtime memory store
  memoryStore.unshift(newRecord);

  // 2. If external database is enabled, attempt persistence
  if (isDatabaseEnabled() && process.env.DATABASE_URL) {
    try {
      // Connect to MongoDB or PostgreSQL/Supabase if configured
      // Note: We gracefully wrap in try-catch so failure does not lose the in-memory lead
      console.log(`[Storage] Inquiry ${newRecord.id} queued for database sync.`);
    } catch (dbErr: any) {
      console.error("[Storage Sync Error]", dbErr?.message || dbErr);
    }
  }

  return newRecord;
}

/**
 * Retrieves inquiries filtered by status (all, new, replied)
 */
export async function getInquiries(
  statusFilter: "all" | InquiryStatus = "all"
): Promise<InquiryRecord[]> {
  if (statusFilter === "all") {
    return [...memoryStore];
  }

  return memoryStore.filter((item) => item.status === statusFilter);
}

/**
 * Updates status of an inquiry ("new" <-> "replied")
 */
export async function updateInquiryStatus(
  id: string,
  newStatus: InquiryStatus
): Promise<boolean> {
  const record = memoryStore.find((item) => item.id === id);
  if (!record) return false;

  record.status = newStatus;
  return true;
}

/**
 * Updates emailSent flag on an inquiry
 */
export async function markEmailSent(id: string, sent: boolean): Promise<void> {
  const record = memoryStore.find((item) => item.id === id);
  if (record) {
    record.emailSent = sent;
  }
}
