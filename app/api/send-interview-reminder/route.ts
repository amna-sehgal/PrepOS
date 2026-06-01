import { resend } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { entryId, email, company, role, date, round } = body;

    // If entryId is provided, fetch the entry details from database
    if (entryId) {
      const supabase = await createClient();
      const { data: entry, error } = await supabase
        .from("tracker_entries")
        .select("*")
        .eq("id", entryId)
        .single();

      if (error || !entry) {
        return Response.json({ success: false, error: "Entry not found" }, { status: 404 });
      }

      // Use entry data if manual data not provided
      const finalEmail = email || entry.user_email;
      const finalCompany = company || entry.company;
      const finalRole = role || entry.role;
      const finalDate = date || entry.interview_date;
      const finalRound = round || entry.round;

      const emailResponse = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: finalEmail,
        subject: `Interview Reminder - ${finalCompany} · ${finalRole}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1a1035; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #534ab7 0%, #8b5cf6 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 20px; }
                .content { background: #f9f8fd; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
                .detail { margin: 12px 0; display: flex; }
                .label { font-weight: 600; width: 100px; }
                .value { color: #534ab7; font-weight: 500; }
                .cta { display: inline-block; background: #534ab7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px; }
                .footer { text-align: center; color: #999; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>🚀 Interview Reminder</h2>
                  <p>Your interview is coming up!</p>
                </div>
                
                <div class="content">
                  <p>Hi there,</p>
                  <p>Just a friendly reminder about your upcoming interview:</p>
                  
                  <div class="detail">
                    <span class="label">Company:</span>
                    <span class="value">${finalCompany}</span>
                  </div>
                  <div class="detail">
                    <span class="label">Role:</span>
                    <span class="value">${finalRole}</span>
                  </div>
                  ${finalRound ? `
                  <div class="detail">
                    <span class="label">Round:</span>
                    <span class="value">${finalRound}</span>
                  </div>
                  ` : ''}
                  <div class="detail">
                    <span class="label">Date:</span>
                    <span class="value">${new Date(finalDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  
                  <p style="margin-top: 20px; color: #666;">Make sure to:</p>
                  <ul style="color: #666; line-height: 1.8;">
                    <li>Review the prep plan you've created</li>
                    <li>Check the company's latest news</li>
                    <li>Prepare your questions</li>
                    <li>Test your audio/video setup</li>
                  </ul>
                  
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://prepos.app'}/tracker" class="cta">View in Tracker</a>
                </div>
                
                <div class="footer">
                  <p>Good luck with your interview! 💪</p>
                  <p>PrepOS • Interview Preparation Platform</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      if (emailResponse.error) {
        return Response.json({ success: false, error: emailResponse.error }, { status: 500 });
      }

      return Response.json({ success: true, data: emailResponse.data });
    }

    // Manual email sending (legacy support)
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: `Interview Reminder - ${company}`,
      html: `
        <h2>Upcoming Interview</h2>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Date:</strong> ${date}</p>
        <br/>
        <p>Good luck with your preparation 🚀</p>
      `,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Error in send-interview-reminder:", error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}