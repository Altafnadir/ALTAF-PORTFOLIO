"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Lock,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  LogOut,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  EyeOff,
  User,
  Tag,
  DollarSign,
  MessageSquare,
} from "lucide-react";
import { InquiryRecord, InquiryStatus } from "@/lib/storage";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [filter, setFilter] = useState<"all" | InquiryStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Check existing session
  const fetchInquiries = useCallback(async (currentFilter: "all" | InquiryStatus = filter) => {
    setIsLoadingInquiries(true);
    try {
      const res = await fetch(`/api/admin/inquiries?status=${currentFilter}`);
      if (res.status === 401) {
        setIsAuthenticated(false);
        setInquiries([]);
      } else if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
        setIsAuthenticated(true);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoadingInquiries(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchInquiries("all");
  }, [fetchInquiries]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPassword("");
        fetchInquiries("all");
      } else {
        setLoginError(data.message || "Invalid admin password.");
      }
    } catch {
      setLoginError("Failed to authenticate. Please check your connection.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setInquiries([]);
  };

  const handleToggleStatus = async (id: string, currentStatus: InquiryStatus) => {
    const nextStatus: InquiryStatus = currentStatus === "new" ? "replied" : "new";
    setUpdatingId(id);

    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
        );
      }
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Compute counts
  const totalCount = inquiries.length;
  const newCount = inquiries.filter((i) => i.status === "new").length;
  const repliedCount = inquiries.filter((i) => i.status === "replied").length;

  // Filtered & Searched inquiries
  const displayedInquiries = inquiries.filter((item) => {
    const matchesFilter = filter === "all" ? true : item.status === filter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.service.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  // Loading initial session check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFB] dark:bg-[#0C1211]">
        <div className="w-8 h-8 rounded-full border-2 border-[#0F5B4A] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Login view
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-[#FBFBFB] dark:bg-[#0C1211] text-slate-900 dark:text-white">
        <div className="w-full max-w-md bg-white dark:bg-[#131E1C] rounded-2xl border border-slate-200 dark:border-[#1F302D] p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F5F1] dark:bg-[#142E28] text-[#0F5B4A] dark:text-[#24C097] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter your password to access portfolio inquiries
            </p>
          </div>

          {loginError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-[#2D1616] border border-red-300 dark:border-[#4D2424] text-red-900 dark:text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 dark:border-[#1F302D] bg-slate-50 dark:bg-[#162320] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0F5B4A] dark:focus:border-[#24C097] focus:ring-2 focus:ring-[#0F5B4A]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0F5B4A] hover:bg-[#0c473a] text-white font-medium text-sm transition-all shadow-md shadow-[#0F5B4A]/20 disabled:opacity-60"
            >
              {isLoggingIn ? "Verifying..." : "Sign In to Admin"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#0F5B4A] dark:hover:text-[#24C097] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-[#0C1211] text-slate-900 dark:text-white transition-colors duration-300">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0C1211]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#1F302D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-8 h-8 rounded-xl bg-[#0F5B4A] dark:bg-[#199573] flex items-center justify-center text-white font-bold text-sm"
              title="View Public Portfolio"
            >
              A
            </Link>
            <div>
              <h1 className="text-base font-bold tracking-tight">Admin Inquiries</h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Client lead management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchInquiries(filter)}
              disabled={isLoadingInquiries}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-[#1F302D] bg-white dark:bg-[#131E1C] hover:text-[#0F5B4A] dark:hover:text-[#24C097] transition-colors"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoadingInquiries ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-[#1F302D] bg-white dark:bg-[#131E1C] hover:text-[#0F5B4A] dark:hover:text-[#24C097] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portfolio</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 dark:bg-[#2D1616] text-red-700 dark:text-red-300 hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#131E1C] border border-slate-200 dark:border-[#1F302D] shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Inquiries
            </span>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalCount}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#131E1C] border border-slate-200 dark:border-[#1F302D] shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              New Leads
            </span>
            <div className="mt-2 text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {newCount}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#131E1C] border border-slate-200 dark:border-[#1F302D] shadow-xs">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0F5B4A] dark:text-[#24C097]">
              Replied
            </span>
            <div className="mt-2 text-3xl font-extrabold text-[#0F5B4A] dark:text-[#24C097]">
              {repliedCount}
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#131E1C] border border-slate-200 dark:border-[#1F302D] shadow-xs">
          {/* Status Filter Buttons */}
          <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-[#162320] border border-slate-200/60 dark:border-[#1F302D]">
            {(
              [
                { id: "all", label: "All", count: totalCount },
                { id: "new", label: "New", count: newCount },
                { id: "replied", label: "Replied", count: repliedCount },
              ] as const
            ).map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setFilter(tab.id);
                    fetchInquiries(tab.id);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? "bg-white dark:bg-[#1F302D] text-[#0F5B4A] dark:text-[#24C097] shadow-xs font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      active
                        ? "bg-[#E8F5F1] dark:bg-[#142E28] text-[#0F5B4A] dark:text-[#24C097]"
                        : "bg-slate-200 dark:bg-[#2A3E39] text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, service..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-[#1F302D] bg-slate-50 dark:bg-[#162320] text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F5B4A]/20"
            />
          </div>
        </div>

        {/* Inquiries Cards Grid */}
        {displayedInquiries.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-[#131E1C] rounded-2xl border border-dashed border-slate-300 dark:border-[#1F302D] space-y-3">
            <Filter className="w-10 h-10 mx-auto text-slate-400" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">
              No inquiries found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? `No inquiries matching "${searchQuery}". Try clearing your search.`
                : "There are currently no inquiries in this category."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedInquiries.map((inquiry) => {
              const formattedDate = new Date(inquiry.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              });

              return (
                <div
                  key={inquiry.id}
                  className="bg-white dark:bg-[#131E1C] rounded-2xl p-6 border border-slate-200/90 dark:border-[#1F302D] shadow-xs hover:shadow-md transition-shadow duration-200 space-y-4"
                >
                  {/* Top Bar: Name, Date, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#1C2C28]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E8F5F1] dark:bg-[#142E28] text-[#0F5B4A] dark:text-[#24C097] flex items-center justify-center font-bold text-sm shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                          {inquiry.name}
                        </h2>
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="text-xs text-[#0F5B4A] dark:text-[#24C097] hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{inquiry.email}</span>
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          inquiry.status === "new"
                            ? "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                            : "bg-[#E8F5F1] dark:bg-[#142E28] text-[#0F5B4A] dark:text-[#24C097] border border-[#C2E4D9] dark:border-[#1F453B]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            inquiry.status === "new" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                          }`}
                        />
                        <span className="capitalize">{inquiry.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Metadata Row: Service & Budget */}
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#162320] text-slate-700 dark:text-slate-300">
                      <Tag className="w-3 h-3 text-[#0F5B4A] dark:text-[#24C097]" />
                      <span className="font-medium">Service:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {inquiry.service}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#162320] text-slate-700 dark:text-slate-300">
                      <DollarSign className="w-3 h-3 text-slate-500" />
                      <span className="font-medium">Budget:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {inquiry.budget || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#162320] border border-slate-200/70 dark:border-[#1F302D]">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Inquiry Message</span>
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {inquiry.message}
                    </p>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-2">
                    <a
                      href={`mailto:${inquiry.email}?subject=Re: Inquiry regarding ${encodeURIComponent(
                        inquiry.service
                      )}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-[#0F5B4A] hover:bg-[#0c473a] text-white shadow-xs transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>

                    <button
                      onClick={() => handleToggleStatus(inquiry.id, inquiry.status)}
                      disabled={updatingId === inquiry.id}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-[#1F302D] hover:border-[#0F5B4A] dark:hover:border-[#24C097] text-slate-700 dark:text-slate-300 hover:text-[#0F5B4A] dark:hover:text-[#24C097] bg-white dark:bg-[#131E1C] transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>
                        {inquiry.status === "new" ? "Mark as Replied" : "Mark as New"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
