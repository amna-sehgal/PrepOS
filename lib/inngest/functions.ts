import { inngest } from "@/lib/inngest/inngest";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";

export const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: [{ event: "test/hello" }] },
  async ({ event }) => {
    console.log("Hello Inngest!");
    console.log(event.data);

    return { success: true };
  }
);

export const sendInterviewReminder = inngest.createFunction(
  {
    id: "send-interview-reminder",
    triggers: [
      { event: "interview/reminder-needed" },
      // Run every hour to check for interviews
      { cron: "* * * * *" }
    ]
  },
  async ({ event }) => {
    try {
      const supabase = createAdminClient();

      // Get all tracker entries with interviews in the next 24 hours
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const today = new Date();

      const { data: entries, error: entriesError } = await supabase
        .from("tracker_entries")
        .select("*")
        .eq("status", "Interview")
        .gte("interview_date", today.toISOString().split("T")[0])
        .lte("interview_date", tomorrow.toISOString().split("T")[0]);

      console.log("TODAY =", today.toISOString().split("T")[0]);
      console.log("TOMORROW =", tomorrow.toISOString().split("T")[0]);
      console.log("ENTRIES =", entries);
      console.log("COUNT =", entries?.length);

      if (entriesError) {
        console.error("Error fetching tracker entries:", entriesError);
        return { success: false, error: entriesError };
      }

      if (!entries || entries.length === 0) {
        console.log("No upcoming interviews to remind about");
        return { success: true, reminded: 0 };
      }

      let remindedCount = 0;

      // Send reminders for each interview
      for (const entry of entries) {
        // Use user_id from the entry
        const userId = entry.user_id;

        if (!userId) {
          console.error("No user_id for entry:", entry.id);
          continue;
        }

        // Get user email from auth.users table using admin client
        const adminClient = createAdminClient();

        const { data: userData, error: userError } =
          await adminClient.auth.admin.getUserById(userId);

        if (userError || !userData?.user?.email) {
          console.error("Error fetching user email:", userError);
          continue;
        }

        const userEmail = userData.user.email;
        console.log("Sending email to:", userEmail);

        // Check if reminder was already sent today
        const { data: reminderRecord } = await supabase
          .from("reminder_logs")
          .select("id")
          .eq("entry_id", entry.id)
          .eq("user_id", userId)
          .gte("created_at", today.toISOString())
          .single();

        if (reminderRecord) {
          console.log(`Reminder already sent for entry ${entry.id}`);
          continue;
        }

        // Send email
        const emailResponse = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: userEmail,
          subject: `Interview Reminder - ${entry.company} · ${entry.role}`,
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
                      <span class="value">${entry.company}</span>
                    </div>
                    <div class="detail">
                      <span class="label">Role:</span>
                      <span class="value">${entry.role}</span>
                    </div>
                    <div class="detail">
                      <span class="label">Round:</span>
                      <span class="value">${entry.round}</span>
                    </div>
                    <div class="detail">
                      <span class="label">Date:</span>
                      <span class="value">${new Date(entry.interview_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    
                    <p style="margin-top: 20px; color: #666;">Make sure to:</p>
                    <ul style="color: #666; line-height: 1.8;">
                      <li>Review the prep plan you've created</li>
                      <li>Check the company's latest news</li>
                      <li>Prepare your questions</li>
                      <li>Test your audio/video setup</li>
                    </ul>
                    
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/tracker" class="cta">View in Tracker</a>
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
          console.error("Error sending email:", emailResponse.error);
          continue;
        }

        // Log the reminder
        await supabase.from("reminder_logs").insert({
          user_id: userId,
          entry_id: entry.id,
          email_sent_to: userEmail,
          created_at: new Date().toISOString(),
        });

        remindedCount++;
        console.log(`Reminder sent for ${entry.company} - ${entry.role}`);
      }

      return { success: true, reminded: remindedCount };
    } catch (error) {
      console.error("Error in sendInterviewReminder:", error);
      return { success: false, error };
    }
  }
);