import nodemailer from "nodemailer";
import { escapeHtml, formatMultilineForHtml } from "./sanitize";

export interface EmailInquiryPayload {
  name: string;
  email: string;
  service: string;
  budget?: string;
  message: string;
  submittedAt?: Date;
}

/**
 * Creates and returns the Gmail SMTP transporter using environment variables.
 */
export function getMailTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("SMTP credentials missing. Please set GMAIL_USER and GMAIL_APP_PASSWORD in environment.");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Sends inquiry email to the portfolio owner (Altaf).
 */
export async function sendLeadNotificationEmail(payload: EmailInquiryPayload) {
  const transporter = getMailTransporter();
  const toEmail = process.env.CONTACT_TO_EMAIL || "Altafnadir33@gmail.com";
  const fromEmail = process.env.GMAIL_USER || "Altafnadir33@gmail.com";

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeService = escapeHtml(payload.service);
  const safeBudget = payload.budget ? escapeHtml(payload.budget) : "Not specified";
  const safeMessageHtml = formatMultilineForHtml(payload.message);
  const timestamp = (payload.submittedAt || new Date()).toUTCString();

  const subject = `New inquiry: ${payload.service} from ${payload.name}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${escapeHtml(subject)}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; line-height: 1.6; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { background: #0F5B4A; color: #ffffff; padding: 24px; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
        .header p { margin: 6px 0 0 0; opacity: 0.85; font-size: 13px; }
        .content { padding: 24px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
        .table td.label { width: 35%; font-weight: 600; color: #64748b; background-color: #f8fafc; }
        .table td.value { color: #0f172a; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; background: #E8F5F1; color: #0F5B4A; }
        .message-box { background: #f8fafc; border-left: 4px solid #0F5B4A; padding: 16px; border-radius: 0 8px 8px 0; margin-top: 8px; font-size: 14px; color: #334155; }
        .footer { padding: 16px 24px; background: #f1f5f9; font-size: 12px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>New Client Inquiry</h1>
          <p>Received via portfolio contact form</p>
        </div>
        <div class="content">
          <table class="table">
            <tr>
              <td class="label">Client Name</td>
              <td class="value"><strong>${safeName}</strong></td>
            </tr>
            <tr>
              <td class="label">Client Email</td>
              <td class="value"><a href="mailto:${safeEmail}" style="color: #0F5B4A; text-decoration: none;">${safeEmail}</a></td>
            </tr>
            <tr>
              <td class="label">Selected Service</td>
              <td class="value"><strong>${safeService}</strong></td>
            </tr>
            <tr>
              <td class="label">Budget</td>
              <td class="value">${safeBudget}</td>
            </tr>
            <tr>
              <td class="label">Status</td>
              <td class="value"><span class="badge">New</span></td>
            </tr>
            <tr>
              <td class="label">Submission Time</td>
              <td class="value">${escapeHtml(timestamp)}</td>
            </tr>
          </table>

          <div style="margin-top: 16px;">
            <strong style="font-size: 14px; color: #475569;">Message:</strong>
            <div class="message-box">
              ${safeMessageHtml}
            </div>
          </div>
        </div>
        <div class="footer">
          Click <strong>Reply</strong> to directly respond to ${safeName} (${safeEmail}).
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
New Client Inquiry
------------------
Client Name: ${payload.name}
Client Email: ${payload.email}
Selected Service: ${payload.service}
Budget: ${payload.budget || "Not specified"}
Status: New
Submission Time: ${timestamp}

Message:
${payload.message}

--
Respond directly by replying to this email.
  `.trim();

  return transporter.sendMail({
    from: `"Portfolio Inquiries" <${fromEmail}>`,
    to: toEmail,
    replyTo: payload.email,
    subject,
    text,
    html,
  });
}

/**
 * Sends a confirmation auto-reply email to the client.
 */
export async function sendAutoReplyEmail(payload: { name: string; email: string; service: string }) {
  const transporter = getMailTransporter();
  const fromEmail = process.env.GMAIL_USER || "Altafnadir33@gmail.com";
  const myEmail = process.env.CONTACT_TO_EMAIL || "Altafnadir33@gmail.com";

  const safeName = escapeHtml(payload.name);
  const safeService = escapeHtml(payload.service);

  const subject = `Inquiry confirmation: ${payload.service} | Altaf`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${escapeHtml(subject)}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; line-height: 1.6; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { background: #0F5B4A; color: #ffffff; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
        .content { padding: 24px 28px; }
        .contact-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0; }
        .contact-item { margin: 6px 0; font-size: 14px; }
        .footer { padding: 16px 24px; background: #f1f5f9; font-size: 12px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>Thanks for reaching out!</h1>
        </div>
        <div class="content">
          <p>Hi <strong>${safeName}</strong>,</p>
          <p>
            Thanks for contacting me regarding <strong>${safeService}</strong>.
            I have received your message and will review the details and reply within <strong>24 hours</strong>.
          </p>

          <div class="contact-box">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px; color: #0F5B4A;">
              Direct Contact Details:
            </div>
            <div class="contact-item">📧 Email: <a href="mailto:${myEmail}" style="color: #0F5B4A;">${myEmail}</a></div>
          </div>

          <p style="font-size: 14px; color: #64748b; margin-top: 24px;">
            Best regards,<br />
            <strong>Altaf</strong><br />
            Full Stack & Mobile Developer
          </p>
        </div>
        <div class="footer">
          This is an automated confirmation of your inquiry.
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Hi ${payload.name},

Thanks for reaching out regarding ${payload.service}.
I have received your message and will review the details and reply within 24 hours.

Direct Contact:
Email: ${myEmail}

Best regards,
Altaf
Full Stack & Mobile Developer
  `.trim();

  return transporter.sendMail({
    from: `"Altaf" <${fromEmail}>`,
    to: payload.email,
    replyTo: myEmail,
    subject,
    text,
    html,
  });
}
