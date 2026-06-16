'use server'

import { createClient } from '@/lib/supabase/server'
import { askOpenRouter } from '@/lib/gemini/client'
import { generateRoadmapPrompt } from '@/lib/gemini/prompts'

type GenerateRoadmapInput = {
  role: string
  companies: string[]
  weeks: number
}

export async function generateAIRoadmap(input: GenerateRoadmapInput) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const prompt = generateRoadmapPrompt(input)

  const aiResponse = await askOpenRouter(prompt)

  let parsed

  try {
    const cleanedResponse = aiResponse
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    parsed = JSON.parse(cleanedResponse)
    if (
      !parsed.weeks ||
      !Array.isArray(parsed.weeks)
    ) {
      throw new Error('Invalid roadmap structure')
    }
    parsed.weeks = parsed.weeks.map((week: any, weekIndex: number) => ({
      ...week,

      topics: (week.topics || []).map(
        (topic: any, topicIndex: number) => ({
          id:
            typeof topic === 'object' && topic.id
              ? topic.id
              : `w${weekIndex + 1}t${topicIndex + 1}`,

          label:
            typeof topic === 'object'
              ? topic.label || 'Untitled Topic'
              : topic,

          done:
            typeof topic === 'object'
              ? topic.done ?? false
              : false,
        })
      ),

      problems: Array.isArray(week.problems)
        ? week.problems
        : [],

      mockInterview: week.mockInterview || null,
    }))
  } catch {
    throw new Error('AI returned invalid roadmap JSON')
  }

  await supabase
    .from('prep_roadmaps')
    .update({ is_active: false })
    .eq('user_id', user.id)

  const { data, error } = await supabase
    .from('prep_roadmaps')
    .insert({
      user_id: user.id,
      role: input.role,
      companies: input.companies,
      weeks: input.weeks,
      roadmap: parsed.weeks,
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updateRoadmapProgress(
  roadmapId: string,
  updatedWeeks: any[]
) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('prep_roadmaps')
    .update({
      roadmap: updatedWeeks,
      updated_at: new Date().toISOString(),
    })
    .eq('id', roadmapId)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}