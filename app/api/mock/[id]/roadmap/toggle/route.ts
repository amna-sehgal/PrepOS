import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.json()

  const { week, topicId } = body

  // toggle logic (simple version)
  const { data, error } = await supabase
    .from("roadmap_progress")
    .upsert({
      week,
      topic_id: topicId,
      done: true,
    })

  if (error) return NextResponse.json({ error }, { status: 500 })

  return NextResponse.json({ success: true })
}