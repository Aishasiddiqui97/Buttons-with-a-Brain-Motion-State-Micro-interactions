import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 2000;

const resend = new Resend(process.env.RESEND_API_KEY);

function sanitize(input: string): string {
  return input.replace(/[<>]/g, "").trim();
}

export async function POST(request: NextRequest) {
  let name = "";
  let email = "";
  let message = "";

  try {
    const body = await request.json();
    name = typeof body?.name === "string" ? sanitize(body.name) : "";
    email = typeof body?.email === "string" ? sanitize(body.email) : "";
    message = typeof body?.message === "string" ? body.message.trim() : "";
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (!name) {
    return NextResponse.json(
      { success: false, error: "Name is required." },
      { status: 400 },
    );
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { success: false, error: "A valid email address is required." },
      { status: 400 },
    );
  }

  if (!message) {
    return NextResponse.json(
      { success: false, error: "Message is required." },
      { status: 400 },
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      {
        success: false,
        error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
      },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !contactEmail) {
    return NextResponse.json(
      { success: false, error: "Server configuration error." },
      { status: 500 },
    );
  }

  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: contactEmail,
      subject: `Portfolio Contact: ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#6d28d9;border-bottom:2px solid #6d28d9;padding-bottom:8px;">
            New Contact Form Submission
          </h2>
          <table style="width:100%;border-collapse:collapse;margin-top:16px;">
            <tr>
              <td style="padding:8px;font-weight:bold;color:#94a3b8;width:100px;">Name</td>
              <td style="padding:8px;color:#e2e8f0;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px;font-weight:bold;color:#94a3b8;">Email</td>
              <td style="padding:8px;color:#e2e8f0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#0f172a;border-radius:8px;border:1px solid #334155;">
            <p style="font-weight:bold;color:#94a3b8;margin:0 0 8px;">Message:</p>
            <p style="color:#e2e8f0;white-space:pre-wrap;margin:0;">${message}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again later." },
      { status: 500 },
    );
  }
}
