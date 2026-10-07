# Altaf — Full Stack & Mobile Developer Portfolio

A modern, responsive portfolio website built with **Next.js (App Router)**, **Tailwind CSS**, **Framer Motion**, and a secure, spam-protected client inquiry system.

---

## 🛠️ Tech Stack & Services

### Technology Stack
- **Framework:** Next.js (App Router + Turbopack)
- **Styling:** Tailwind CSS (with bespoke mint/emerald palette `#0F5B4A` & dark mode support)
- **Animation:** Framer Motion
- **Internationalization:** Bilingual context (English `EN` & Spanish `ES`)
- **Backend & Email:** Next.js Route Handlers + Nodemailer + Gmail SMTP
- **Validation & Security:** Zod, Input Sanitization, Honeypot Bot Trap, In-Memory Sliding-Window Rate Limiting, Cloudflare Turnstile support
- **Testing:** `node:test` + TypeScript test runner (`npm test`)

### Services Offered
The portfolio provides inquiries for the following services:
1. **Website Development**
2. **Mobile Application Development**
3. **Presentation Design**
4. **Programming Tutoring & Mentoring**
5. **Assignment Writer**
6. **AI-to-Humanize**
7. **Other**

---

## 🖼️ Featured Projects & Interactive Screenshot Gallery

The Featured Projects section includes automated screenshot synchronization and an animated full-screen lightbox modal:
- **Card Cover Images:** Fixed 16:10 aspect ratio, `next/image` lazy loading, blur placeholder, hover lift, zoom, and "View Screenshots" badge.
- **Lightbox Modal:** Framer Motion fade + scale animations, large image display, previous/next controls, thumbnail strip, image counter, project title, stack badges, and Live Demo/GitHub buttons.
- **Navigation Controls:** Left/Right arrow keys, `Esc` to close, mobile touch swipe, click backdrop to close, and click-to-zoom (1.8x).
- **Automated Sync Script:** Drop images into `My Projects/<project-slug>/` and run `npm run dev` or `npm run build`. The script automatically copies images to `public/projects/`, sorts naturally (`1.png`, `2.png` ... `10.png`), and generates `src/data/project-images.json`.
- 📖 **Full Guide:** See [PROJECTS_GUIDE.md](file:///D:/Portfolio/PROJECTS_GUIDE.md) for step-by-step instructions.

---

## 📬 Contact & Inquiry System Features

- **Direct Smooth Scroll**: Clicking "Contact" from Navbar, Hero ("Contact Me"), or Footer smoothly navigates directly to the `#contact` section.
- **Direct Communication Channel**:
  - Email: `Altafnadir33@gmail.com` with `mailto:` link and an instant "Copy" button with animated tooltip feedback.
- **Client Inquiry Form**:
  - Full Name, Email, Service dropdown, Budget (optional), Message (minimum 20 characters).
  - Real-time client-side validation + server-side Zod validation.
  - Friendly inline error messaging and character count feedback.
  - Submit button with normal, loading spinner, and disabled states to prevent double submissions.
  - Success and error toast notifications.
  - Full translation support for both English (EN) and Spanish (ES).
- **Spam & Security Protection**:
  - **Honeypot Trap**: Invisible field that silently discards automated spam bots without sending emails.
  - **Rate Limiting**: 3 submissions per IP per 10 minutes with HTTP `429 Too Many Requests` and `Retry-After` headers.
  - **Input Limits & Sanitization**: Strips dangerous HTML/scripts and truncates oversized payloads before email generation or storage.
  - **CORS Protection**: Enforces same-origin verification on the contact endpoint.
  - **Security Headers**: `nosniff`, `DENY` frame-options, referrer policy, and strict permissions policy.
- **Failure-Safe Lead Storage**:
  - Every inquiry is saved before email sending. If Gmail SMTP ever fails or hits quotas, the lead is never lost.
- **Admin Dashboard (`/admin`)**:
  - Password-protected with `ADMIN_PASSWORD` and signed HttpOnly session cookie.
  - Real-time metrics: Total Inquiries, New Leads, Replied Leads.
  - Status filters (`All`, `New`, `Replied`), search bar, and one-click "Mark as Replied" toggle.

---

## 🔑 Gmail App Password Setup Guide

To enable real email sending via Gmail SMTP, you must generate a **Google App Password**. Normal Google account passwords will not work.

### Step-by-Step Instructions:
1. Open your Google Account at [myaccount.google.com](https://myaccount.google.com/).
2. Navigate to **Security** on the left menu.
3. Under **How you sign in to Google**, ensure **2-Step Verification** is turned **ON**.
4. In the search bar at the top or under 2-Step Verification, search for **App passwords**.
5. Give your App Password a name (e.g., `Altaf Portfolio Website`).
6. Click **Create**. Google will display a 16-character password (e.g., `abcd efgh ijkl mnop`).
7. Copy this password and paste it into your `.env.local` file (without spaces):
   ```env
   GMAIL_APP_PASSWORD=abcdefghijklmnop
   ```
> [!CAUTION]
> **Never commit your App Password or any real secrets to GitHub or version control.** Ensure `.env.local` remains ignored in `.gitignore`.

---

## ⚙️ Environment Variables Reference

Copy `.env.example` to `.env.local` for local development:
```bash
cp .env.example .env.local
```

| Variable | Required | Default / Example | Description |
| :--- | :---: | :--- | :--- |
| `GMAIL_USER` | Yes | `Altafnadir33@gmail.com` | Gmail account used to authenticate with Gmail SMTP. |
| `GMAIL_APP_PASSWORD` | Yes | *(16-char App Password)* | Generated Google App Password for Gmail SMTP. |
| `CONTACT_TO_EMAIL` | Yes | `Altafnadir33@gmail.com` | Destination inbox where client inquiries will be delivered. |
| `ADMIN_PASSWORD` | Yes | *(Choose strong password)* | Password required to access `/admin` dashboard. |
| `DATABASE_ENABLED` | Optional | `false` | Set to `true` to enable persistent external database sync. |
| `DATABASE_URL` | Optional | `mongodb+srv://...` | Connection URI for MongoDB Atlas or Supabase PostgreSQL. |
| `RATE_LIMIT_ENABLED` | Optional | `true` | Enables 3 req / 10 min IP rate limiting (`true` or `false`). |
| `TURNSTILE_ENABLED` | Optional | `false` | Enables Cloudflare Turnstile CAPTCHA verification (`true`/`false`). |
| `TURNSTILE_SECRET_KEY`| Optional | *(Cloudflare Secret)* | Server-side Turnstile secret key if enabled. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional | *(Cloudflare Site Key)* | Client-side Turnstile site key if enabled. |

---

## 🚀 Vercel Deployment Guide

### Adding Environment Variables in Vercel:
1. Push your code to your GitHub repository (secrets in `.env.local` are automatically ignored).
2. Go to your [Vercel Dashboard](https://vercel.com/) and import the repository.
3. In your project settings, click **Settings** ➔ **Environment Variables**.
4. Add the required variables:
   - `GMAIL_USER` = `Altafnadir33@gmail.com`
   - `GMAIL_APP_PASSWORD` = *your 16-character Google App Password*
   - `CONTACT_TO_EMAIL` = `Altafnadir33@gmail.com`
   - `ADMIN_PASSWORD` = *your chosen secure password*
   - `RATE_LIMIT_ENABLED` = `true`
   - `DATABASE_ENABLED` = `false` *(or `true` if supplying `DATABASE_URL`)*
5. Ensure these variables are assigned to **Production**, **Preview**, and **Development** environments.
6. Click **Deploy**.

---

## 🧪 Automated Testing

The project includes unit tests for field validations, input sanitization, API route status codes, honeypot traps, and error resilience.

To run the automated test suite:
```bash
npm test
```

Tests run with mocked external services (Nodemailer, Database, CAPTCHA) so **no real emails are sent during tests**.

---

## 📋 Pre-Deployment Checklist

- [x] All 23 automated unit and API route tests pass (`npm test`).
- [x] Production build passes with zero TypeScript or Turbopack errors (`npm run build`).
- [x] `.env.local` and `.env` are listed in `.gitignore`.
- [x] `.env.example` contains only placeholders with no hardcoded credentials.
- [x] Validated that `/admin` requires `ADMIN_PASSWORD`.
- [x] Checked responsive mobile navigation and dark/light mode toggles.
- [x] Confirmed English (`EN`) and Spanish (`ES`) bilingual translations.
