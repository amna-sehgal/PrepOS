import { inngest } from "@/lib/inngest/inngest";
import { createAdminClient } from "@/lib/supabase/server";

//
// ------------------------------------------------------
// 1. HELLO WORLD (keep for testing)
// ------------------------------------------------------
//
export const helloWorld = inngest.createFunction(
  {
    id: "hello-world",
    triggers: [{ event: "test/hello" }],
  },
  async ({ event }) => {
    console.log("Hello Inngest!");
    console.log(event.data);

    return { success: true };
  }
);

//
// ------------------------------------------------------
// 2. STALE ROADMAP DETECTION (CORE FEATURE #1)
// ------------------------------------------------------
//
export const detectStaleRoadmaps = inngest.createFunction(
  {
    id: "detect-stale-roadmaps",
    triggers: [
      // runs once daily at 9 AM
      { cron: "0 9 * * *" },
    ],
  },
  async () => {
    const supabase = createAdminClient();

    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 7);

    // Step 1: fetch stale roadmaps
    const { data: roadmaps, error } = await supabase
      .from("prep_roadmaps")
      .select("*")
      .eq("is_active", true)
      .lt("last_updated_at", thresholdDate.toISOString());

    if (error) {
      console.error("Error fetching roadmaps:", error);
      return { success: false, error };
    }

    if (!roadmaps || roadmaps.length === 0) {
      console.log("No stale roadmaps found");
      return { success: true, notified: 0 };
    }

    let notifiedCount = 0;

    // Step 2: process each roadmap
    for (const roadmap of roadmaps) {
      const userId = roadmap.user_id;

      if (!userId) continue;

      // Step 3: prevent duplicate notifications (same day)
      const today = new Date().toISOString().split("T")[0];

      const { data: existing } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", userId)
        .eq("type", "roadmap-stale")
        .gte("created_at", today);

      if (existing && existing.length > 0) {
        console.log(`Skipping duplicate for user ${userId}`);
        continue;
      }

      // Step 4: compute inactivity
      const daysInactive = Math.floor(
        (Date.now() - new Date(roadmap.last_updated_at).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // Step 5: insert notification
      const { error: notifyError } = await supabase
        .from("notifications")
        .insert({
          user_id: userId,
          type: "roadmap-stale",
          text: `🚀 Your ${roadmap.role} roadmap has been inactive for ${daysInactive} days. Small progress today > big stress tomorrow.`,
        });

      if (notifyError) {
        console.error("Notification insert failed:", notifyError);
        continue;
      }

      console.log(`Notified user ${userId}`);
      notifiedCount++;
    }

    return {
      success: true,
      notified: notifiedCount,
    };
  }
);

export const detectStaleBrainstormCards = inngest.createFunction(
  {
    id: "detect-stale-brainstorm-cards",
    triggers: [
      { cron: "0 10 * * *" }, // daily at 10 AM (after roadmap)
    ],
  },
  async () => {
    const supabase = createAdminClient();

    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 14);

    // Step 1: fetch stale ideas
    const { data: cards, error } = await supabase
      .from("brainstorm_cards")
      .select("*")
      .lt("updated_at", thresholdDate.toISOString());

    if (error) {
      console.error("Error fetching brainstorm cards:", error);
      return { success: false, error };
    }

    if (!cards || cards.length === 0) {
      return { success: true, notified: 0 };
    }

    let notified = 0;

    // Step 2: process each card
    for (const card of cards) {
      const userId = card.user_id;

      if (!userId) continue;

      // Step 3: prevent spam (once per day per card)
      const today = new Date().toISOString().split("T")[0];

      const { data: existing } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", userId)
        .eq("type", "brainstorm-stale")
        .eq("entity_id", card.id)
        .gte("created_at", today);

      if (existing?.length) continue;

      // Step 4: calculate inactivity
      const daysInactive = Math.floor(
        (Date.now() - new Date(card.updated_at).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // Step 5: create emotional nudge notification
      const { error: notifyError } = await supabase
        .from("notifications")
        .insert({
          user_id: userId,
          type: "brainstorm-stale",
          entity_id: card.id,
          text: `💡 Your idea "${card.title}" has been untouched for ${daysInactive} days. It might be your next big project.`,
        });

      if (notifyError) {
        console.error("Notification error:", notifyError);
        continue;
      }

      notified++;
    }

    return {
      success: true,
      notified,
    };
  }
);

export const sendInterviewGoodLuck = inngest.createFunction(
  {
    id: "send-interview-good-luck",
    triggers: [
      { cron: "0 9 * * *" }, // daily at 9 AM
    ],
  },
  async () => {
    const supabase = createAdminClient();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tomorrowDateString = tomorrow.toISOString().split("T")[0];

    // 1. fetch interviews happening tomorrow
    const { data: interviews, error } = await supabase
      .from("interview_tracker")
      .select("*")
      .eq("interview_date", tomorrowDateString);

    if (error) {
      console.error("Interview fetch error:", error);
      return { success: false, error };
    }

    if (!interviews || interviews.length === 0) {
      return { success: true, notified: 0 };
    }

    let notified = 0;

    // 2. process each interview
    for (const interview of interviews) {
      const userId = interview.user_id;
      if (!userId) continue;

      // 3. prevent duplicate notification
      const today = new Date().toISOString().split("T")[0];

      const { data: existing } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", userId)
        .eq("type", "interview-good-luck")
        .eq("entity_id", interview.id)
        .gte("created_at", today);

      if (existing?.length) continue;

      // 4. create emotional notification
      const { error: notifyError } = await supabase
        .from("notifications")
        .insert({
          user_id: userId,
          type: "interview-good-luck",
          entity_id: interview.id,
          text: `🍀 ${interview.company} interview tomorrow for ${interview.role}. You've prepared for this — trust yourself and stay calm.`,
        });

      if (notifyError) {
        console.error("Notification error:", notifyError);
        continue;
      }

      notified++;
    }

    return {
      success: true,
      notified,
    };
  }
);