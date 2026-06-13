import { inngest } from "@/lib/inngest/inngest";
import { createAdminClient } from "@/lib/supabase/server";

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

        // Check if reminder was already sent today
        const { data: existingNotification } = await supabase
          .from("notifications")
          .select("id")
          .eq("user_id", userId)
          .eq("type", "interview-reminder")
          .gte("created_at", today.toISOString());

        if (existingNotification && existingNotification.length > 0) {
          console.log(`Notification already exists for ${entry.id}`);
          continue;
        }
        const { error: notificationError } = await supabase
          .from("notifications")
          .insert({
            user_id: userId,
            title: "Interview Tomorrow 🚀",
            message: `${entry.company} • ${entry.role} • ${entry.round}`,
            type: "interview-reminder",
          });

        if (notificationError) {
          console.error("Error creating notification:", notificationError);
          continue;
        }

        console.log(
          `Notification created for ${entry.company} - ${entry.role}`
        );

        remindedCount++;
      }

      // <-- end for loop

      return { success: true, reminded: remindedCount };

    } catch (error) {
      console.error("Error in sendInterviewReminder:", error);
      return { success: false, error };
    }
  }
);