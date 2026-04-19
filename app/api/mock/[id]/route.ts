import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("PARAM ID:", id)
    console.log("USER:", user?.id)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('mock_interviews')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    const summary = (data.transcript || []).length > 0 && data.transcript[data.transcript.length - 1].isSummary 
      ? data.transcript[data.transcript.length - 1] 
      : null;

    return NextResponse.json({
      id: data.id,
      role: data.role,
      difficulty: data.difficulty,
      interview_type: data.interview_type,
      company: data.company,
      hints: data.hints,
      totalQuestions: data.total_questions,
      firstQuestion: data.transcript?.[0]?.text || null,

      // NEW: full interview data
      transcript: data.transcript || [],
      score: summary?.score || 0,
      correct: summary?.correct || 0,
      partial: summary?.partial || 0,
      wrong: summary?.wrong || 0,

      weakAreas: summary?.weakAreas || [],
      reviseTopics: summary?.reviseTopics || [],
      completedAt: summary?.completedAt || null,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    )
  }
}