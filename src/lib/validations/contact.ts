import { z } from "zod";
import { SERVICES } from "@/data/portfolioData";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must not exceed 100 characters" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .max(254, { message: "Email must not exceed 254 characters" })
    .email({ message: "Invalid email address format" }),
  service: z.enum(SERVICES, {
    message: "Please select a valid service",
  }),
  budget: z
    .string()
    .trim()
    .max(100, { message: "Budget must not exceed 100 characters" })
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, { message: "Message must contain at least 20 characters" })
    .max(5000, { message: "Message must not exceed 5000 characters" }),
  honeypot: z.string().optional().or(z.literal("")),
  captchaToken: z.string().optional().or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
