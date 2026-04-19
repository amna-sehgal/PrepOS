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
    parsed = JSON.parse(aiResponse)
  } catch {
    throw new Error('AI returned invalid roadmap JSON')
  }

  const { data, error } = await supabase
    .from('prep_roadmaps')
    .insert({
      user_id: user.id,
      role: input.role,
      companies: input.companies,
      weeks: input.weeks,
      roadmap: parsed.weeks,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}