import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [],
});