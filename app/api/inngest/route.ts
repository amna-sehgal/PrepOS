import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/inngest";
import { helloWorld, sendInterviewReminder } from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld, sendInterviewReminder],
});