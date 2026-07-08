'use server'

import { createClient } from '@/lib/supabase/server'
import { askOpenRouter } from '@/lib/gemini/client'
import { generateFirstQuestionPrompt } from '@/lib/gemini/prompts'
import { getQuestionLimit } from "@/lib/mock/questionBank";

type StartMockInput = {
  role: string
  difficulty: string
  type: string
  company?: string
  hints: boolean

  roadmapMode?: boolean
  roadmapWeek?: number
  roadmapTopics?: string[]
}

function getQCount(difficulty: string) {
  if (difficulty === 'Beginner') return 3
  if (difficulty === 'Advanced') return 5
  return 4
}

export async function startMockInterview(input: StartMockInput) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const totalQuestions = getQCount(input.difficulty)
  const { data: history } = await supabase
    .from('question_history')
    .select('question_text')
    .eq('user_id', user.id)
    .eq('role', input.role)
    .eq('interview_type', input.type)
    .eq('difficulty', input.difficulty)
    .eq('company', input.company || null)
    .order('created_at', { ascending: false })
    .limit(50)

  const previousQuestions =
    (history ?? [])
      .reverse()
      .map((q) => q.question_text)

  const attemptedQuestions = history?.length ?? 0;

  const questionLimit = getQuestionLimit(
    input.company,
    input.difficulty
  );

  const levelCompleted =
    attemptedQuestions >= questionLimit;

  const firstQuestion = await askOpenRouter(
    generateFirstQuestionPrompt(
      {
        role: input.role,
        difficulty: input.difficulty,
        type: input.type,
        company: input.company,
        

        roadmapTopics: input.roadmapTopics,
        roadmapWeek: input.roadmapWeek,
        roadmapMode: input.roadmapMode
      },
      previousQuestions,
      levelCompleted
    )
  )

  const transcript = [
    {
      role: 'ai',
      text: firstQuestion,
      questionIndex: 0,
    },
  ]

  const { data, error } = await supabase
    .from('mock_interviews')
    .insert({
      user_id: user.id,
      role: input.role,
      difficulty: input.difficulty,
      interview_type: input.type,
      company: input.company || null,
      hints: input.hints,
      total_questions: totalQuestions,
      transcript,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }
  await supabase.from('question_history').insert({
    user_id: user.id,
    session_id: data.id,
    company: input.company || null,
    role: input.role,
    interview_type: input.type,
    difficulty: input.difficulty,
    question_text: firstQuestion,
    question_hash: firstQuestion.trim().toLowerCase(),
  })

  return {
    sessionId: data.id,
    firstQuestion,
    totalQuestions,
  }
}