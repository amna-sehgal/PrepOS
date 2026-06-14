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
      const today = new Date();

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: entries, error: entriesError } = await supabase
        .from("prep_roadmaps")
        .select("*")
        .eq("is_active", true)
        .lt("last_updated_at", sevenDaysAgo.toISOString());

      console.log("CHECKING ROADMAPS LAST UPDATED BEFORE:");
      console.log(sevenDaysAgo.toISOString());
      console.log("ENTRIES =", entries);
      console.log("COUNT =", entries?.length);

      if (entriesError) {
        console.error("Error fetching tracker entries:", entriesError);
        return { success: false, error: entriesError };
      }

      if (!entries || entries.length === 0) {
        console.log("No inactive roadmaps found");
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
          .eq("type", "roadmap-reminder")
          .gte("created_at", today.toISOString());

        if (existingNotification && existingNotification.length > 0) {
          console.log(`Notification already exists for ${entry.id}`);
          continue;
        }
        const daysInactive = Math.floor(
          (Date.now() - new Date(entry.last_updated_at).getTime()) /
          (1000 * 60 * 60 * 24)
        );

        const { error: notificationError } = await supabase
          .from("notifications")
          .insert({
            user_id: userId,
            text: `🚀 Your ${entry.role} roadmap has been waiting for ${daysInactive} days. Ready to continue?`,
            type: "roadmap-reminder",
          });

        if (notificationError) {
          console.error("Error creating notification:", notificationError);
          continue;
        }

        console.log(
          `Roadmap reminder created for ${entry.role}`
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