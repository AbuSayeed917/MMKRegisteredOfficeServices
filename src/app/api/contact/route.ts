import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  sendContactFormEmail,
  sendContactConfirmationEmail,
} from "@/lib/email";

const contactSchema = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  email: z.string().email(),
  subject: z.string().min(2).max(255),
  message: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    // Send notification email to admin (with reply-to set to sender)
    await sendContactFormEmail(
      data.firstName,
      data.lastName,
      data.email,
      data.subject,
      data.message
    );

    // Send confirmation email to the sender
    await sendContactConfirmationEmail(
      data.email,
      data.firstName,
      data.subject
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
