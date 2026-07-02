import { createClient } from '@/lib/supabase/server'
import { askOpenRouter } from '@/lib/gemini/client'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json().catch(() => ({}))

    const { data: session, error } = await supabase
      .from('mock_interviews')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    const transcript = session.transcript || []
    const aiFeedbacks = transcript.filter(
      (t: any) => t.role === 'ai' && t.feedback
    )

    let score = 0
    let correct = 0
    let partial = 0
    let wrong = 0

    if (aiFeedbacks.length > 0) {
      let totalScore = 0

      aiFeedbacks.forEach((t: any) => {
        totalScore += Number(t.feedback.score) || 0

        if (t.feedback.status === 'correct') correct++
        else if (t.feedback.status === 'partial') partial++
        else wrong++
      })

      score = Math.round(totalScore / aiFeedbacks.length)
    }

    let reportInfo = null

    const reportPrompt = `
Analyze this interview transcript and provide exactly:
- 2 weak areas
- 3 topics to revise

Return ONLY valid JSON:

{
  "weakAreas": ["area1", "area2"],
  "reviseTopics": ["topic1", "topic2", "topic3"]
}

Transcript:
${JSON.stringify(
  transcript.map((t: any) => ({
    role: t.role,
    text: t.text,
  }))
)}
`

    try {
      const reportAi = await askOpenRouter(reportPrompt)

      const cleanJson = reportAi
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim()

      reportInfo = JSON.parse(cleanJson)
    } catch (err) {
      console.error('Failed to generate report schema:', err)
    }

    const updatedTranscript = [
      ...transcript,
      {
        role: 'system',
        isSummary: true,
        score,
        correct,
        partial,
        wrong,
        weakAreas: reportInfo?.weakAreas || [],
        reviseTopics: reportInfo?.reviseTopics || [],
        completedAt: new Date().toISOString(),
      },
    ]

    const startedAt = session.created_at ? new Date(session.created_at).getTime() : Date.now()
    const endedAt = Date.now()
    const elapsedSeconds = Math.floor((endedAt - startedAt) / 1000)

    const updatePayload: any = {
      transcript: updatedTranscript,
      elapsed: elapsedSeconds,
      status: 'completed',
      completed_at: new Date().toISOString(),
      weak_areas: reportInfo?.weakAreas || [],
      revise_topics: reportInfo?.reviseTopics || [],
      report: {
        overall: score,
        dsa: Math.round(score * 0.6),
        system_design: Math.round(score * 0.2),
        behavioral: Math.round(score * 0.2),
        correct,
        partial,
        wrong,
        weakAreas: reportInfo?.weakAreas || [],
        reviseTopics: reportInfo?.reviseTopics || [],
      },
    }

    const { error: updateError } = await supabase
      .from('mock_interviews')
      .update(updatePayload)
      .eq('id', id)

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      finished: true,
      score,
      correct,
      partial,
      wrong,
      reportInfo,
      reason: body.reason || 'timeout',
    })
  } catch (err: any) {
    console.error('COMPLETE ROUTE ERROR:', err)
    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}
