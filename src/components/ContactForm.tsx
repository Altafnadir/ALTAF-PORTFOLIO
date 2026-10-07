"use client";

import React, { useState, useEffect } from "react";
import { Send, Loader2, AlertCircle, CheckCircle2, X } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { SERVICES, ServiceType } from "@/data/portfolioData";
import { contactFormSchema } from "@/lib/validations/contact";
import { GlowButton } from "./GlowButton";
import { motion, AnimatePresence } from "framer-motion";

interface FormState {
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  honeypot: string; // Anti-bot honeypot
}

interface FormErrors {
  name?: string;
  email?: string;
  service?: string;
  budget?: string;
  message?: string;
}

interface ToastState {
  type: "success" | "error";
  title: string;
  message: string;
}

const initialFormState: FormState = {
  name: "",
  email: "",
  service: "",
  budget: "",
  message: "",
  honeypot: "",
};

export function ContactForm() {
  const { t } = usePortfolio();

  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Listen to external service selection (e.g. from navbar dropdown or services section)
  useEffect(() => {
    const handleSelectService = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail && SERVICES.includes(customEvent.detail as ServiceType)) {
        setFormData((prev) => ({ ...prev, service: customEvent.detail }));
        setErrors((prev) => ({ ...prev, service: undefined }));
      }
    };

    window.addEventListener("select-service", handleSelectService);
    return () => {
      window.removeEventListener("select-service", handleSelectService);
    };
  }, []);

  // Validate a single field
  const validateField = (field: keyof FormState, value: string): string | undefined => {
    switch (field) {
      case "name":
        if (!value.trim()) return t("contact.form.errors.nameRequired");
        if (value.trim().length > 100) return t("contact.form.errors.nameTooLong");
        return undefined;
      case "email":
        if (!value.trim()) return t("contact.form.errors.emailRequired");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return t("contact.form.errors.emailInvalid");
        return undefined;
      case "service":
        if (!value || !SERVICES.includes(value as ServiceType)) {
          return t("contact.form.errors.serviceRequired");
        }
        return undefined;
      case "message":
        if (!value.trim()) return t("contact.form.errors.messageRequired");
        if (value.trim().length < 20) return t("contact.form.errors.messageMinLength");
        if (value.trim().length > 5000) return t("contact.form.errors.messageTooLong");
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Revalidate if touched
    if (touched[name]) {
      const error = validateField(name as keyof FormState, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof FormState, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    const nameErr = validateField("name", formData.name);
    if (nameErr) newErrors.name = nameErr;

    const emailErr = validateField("email", formData.email);
    if (emailErr) newErrors.email = emailErr;

    const serviceErr = validateField("service", formData.service);
    if (serviceErr) newErrors.service = serviceErr;

    const msgErr = validateField("message", formData.message);
    if (msgErr) newErrors.message = msgErr;

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      service: true,
      budget: true,
      message: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Check honeypot first (silent rejection)
    if (formData.honeypot) {
      setToast({
        type: "success",
        title: t("contact.form.successTitle"),
        message: t("contact.form.successDesc"),
      });
      setFormData(initialFormState);
      return;
    }

    if (!validateAll()) {
      return;
    }

    // Client-side schema verification with Zod
    const zodValidation = contactFormSchema.safeParse({
      name: formData.name,
      email: formData.email,
      service: formData.service,
      budget: formData.budget,
      message: formData.message,
      honeypot: formData.honeypot,
    });

    if (!zodValidation.success) {
      const fieldErrors: FormErrors = {};
      zodValidation.error.issues.forEach((err) => {
        const path = err.path[0] as keyof FormErrors;
        if (path) fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        setToast({
          type: "success",
          title: t("contact.form.successTitle"),
          message: data.message || t("contact.form.successDesc"),
        });
        setFormData(initialFormState);
        setErrors({});
        setTouched({});
      } else {
        setToast({
          type: "error",
          title: t("contact.form.errorTitle"),
          message: data?.message || t("contact.form.errorDesc"),
        });
      }
    } catch {
      setToast({
        type: "error",
        title: t("contact.form.errorTitle"),
        message: t("contact.form.errorDesc"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`mb-6 p-4 rounded-xl border flex items-start gap-3 shadow-md ${
              toast.type === "success"
                ? "bg-emerald-50 dark:bg-[#142E28] border-emerald-300 dark:border-[#1F453B] text-emerald-900 dark:text-emerald-100"
                : "bg-red-50 dark:bg-[#2D1616] border-red-300 dark:border-[#4D2424] text-red-900 dark:text-red-100"
            }`}
            role="alert"
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            )}

            <div className="flex-1">
              <h4 className="font-semibold text-sm leading-tight">{toast.title}</h4>
              <p className="text-xs sm:text-sm mt-1 opacity-90 leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Close message"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Hidden Honeypot Field */}
        <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
          <label htmlFor="company_honeypot">Company</label>
          <input
            id="company_honeypot"
            type="text"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              {t("contact.form.nameLabel")} <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              placeholder={t("contact.form.namePlaceholder")}
              maxLength={100}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-slate-50/70 dark:bg-[#162320]/70 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-60 disabled:cursor-not-allowed ${
                errors.name
                  ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                  : "border-slate-200 dark:border-[#1F302D] focus:border-[#0F5B4A] dark:focus:border-[#24C097] focus:ring-[#0F5B4A]/20 dark:focus:ring-[#24C097]/20"
              }`}
            />
            {errors.name && (
              <p
                id="name-error"
                className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.name}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              {t("contact.form.emailLabel")} <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              placeholder={t("contact.form.emailPlaceholder")}
              maxLength={254}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-slate-50/70 dark:bg-[#162320]/70 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-60 disabled:cursor-not-allowed ${
                errors.email
                  ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                  : "border-slate-200 dark:border-[#1F302D] focus:border-[#0F5B4A] dark:focus:border-[#24C097] focus:ring-[#0F5B4A]/20 dark:focus:ring-[#24C097]/20"
              }`}
            />
            {errors.email && (
              <p
                id="email-error"
                className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Service & Optional Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Service Dropdown */}
          <div>
            <label
              htmlFor="service"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              {t("contact.form.serviceLabel")} <span className="text-red-500">*</span>
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.service)}
              aria-describedby={errors.service ? "service-error" : undefined}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-slate-50/70 dark:bg-[#162320]/70 text-slate-900 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed ${
                errors.service
                  ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                  : "border-slate-200 dark:border-[#1F302D] focus:border-[#0F5B4A] dark:focus:border-[#24C097] focus:ring-[#0F5B4A]/20 dark:focus:ring-[#24C097]/20"
              }`}
            >
              <option value="" disabled className="text-slate-400">
                {t("contact.form.servicePlaceholder")}
              </option>
              {SERVICES.map((srv) => (
                <option
                  key={srv}
                  value={srv}
                  className="bg-white dark:bg-[#131E1C] text-slate-900 dark:text-white"
                >
                  {srv}
                </option>
              ))}
            </select>
            {errors.service && (
              <p
                id="service-error"
                className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.service}</span>
              </p>
            )}
          </div>

          {/* Budget (Optional) */}
          <div>
            <label
              htmlFor="budget"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              {t("contact.form.budgetLabel")}
            </label>
            <input
              id="budget"
              name="budget"
              type="text"
              value={formData.budget}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              placeholder={t("contact.form.budgetPlaceholder")}
              maxLength={100}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-[#1F302D] text-sm transition-all focus:outline-none focus:border-[#0F5B4A] dark:focus:border-[#24C097] focus:ring-2 focus:ring-[#0F5B4A]/20 dark:focus:ring-[#24C097]/20 bg-slate-50/70 dark:bg-[#162320]/70 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="message"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              {t("contact.form.messageLabel")} <span className="text-red-500">*</span>
            </label>
            <span
              className={`text-[11px] font-mono ${
                formData.message.length >= 20
                  ? "text-slate-400 dark:text-slate-500"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {formData.message.length}/5000 ({t("contact.form.messageMinHint")})
            </span>
          </div>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            placeholder={t("contact.form.messagePlaceholder")}
            maxLength={5000}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 bg-slate-50/70 dark:bg-[#162320]/70 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-60 disabled:cursor-not-allowed resize-y ${
              errors.message
                ? "border-red-400 dark:border-red-500 focus:ring-red-400"
                : "border-slate-200 dark:border-[#1F302D] focus:border-[#0F5B4A] dark:focus:border-[#24C097] focus:ring-[#0F5B4A]/20 dark:focus:ring-[#24C097]/20"
            }`}
          />
          {errors.message && (
            <p
              id="message-error"
              className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.message}</span>
            </p>
          )}
        </div>

        {/* Submit Button with Click Glow Effect */}
        <div>
          <GlowButton
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#0F5B4A] hover:bg-[#0c473a] text-white font-medium text-sm transition-all duration-200 shadow-md shadow-[#0F5B4A]/20 hover:shadow-lg hover:shadow-[#0F5B4A]/30 transform active:translate-y-0 disabled:opacity-65 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-[#0F5B4A] focus:ring-offset-2 dark:focus:ring-offset-[#131E1C]"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{t("contact.form.submittingButton")}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>{t("contact.form.submitButton")}</span>
              </span>
            )}
          </GlowButton>
        </div>
      </form>
    </div>
  );
}
