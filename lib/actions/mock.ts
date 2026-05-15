'use server'

import { createClient } from '@/lib/supabase/server'
import { askOpenRouter } from '@/lib/gemini/client'
import { generateFirstQuestionPrompt } from '@/lib/gemini/prompts'

type StartMockInput = {
  role: string
  difficulty: string
  type: string
  company?: string
  hints: boolean
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

  const firstQuestion = await askOpenRouter(
    generateFirstQuestionPrompt({
      role: input.role,
      difficulty: input.difficulty,
      type: input.type,
      company: input.company,
    })
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
      date: new Date().toISOString(), 
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return {
    sessionId: data.id,
    firstQuestion,
    totalQuestions,
  }
}