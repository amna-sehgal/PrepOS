'use server'

import { createClient } from '@/lib/supabase/server'

export async function getBrainstormCards() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('brainstorm_cards')
    .select('*')
    .eq('user_id', user.id)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return data
}

export async function expandBrainstormIdea(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data: idea, error: fetchError } = await supabase
    .from('brainstorm_cards')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',

        messages: [
          {
            role: 'system',
            content: `
You are an expert startup and hackathon mentor.

Return ONLY valid JSON.

No markdown.
No code blocks.
No explanations.

Generate realistic and detailed content.
`,
          },
          {
            role: 'user',
            content: `
Convert this project idea into a detailed proposal.

Title: ${idea.title}

Description:
${idea.description}

Return EXACTLY this structure:

{
  "problem": "",
  "solution": "",
  "features": [],
  "techStack": [
    {
      "name": "",
      "reason": ""
    }
  ],
  "timeline": {
    "solo": "",
    "team": ""
  },
  "resumeScore": 8,
  "resumeReason": "",
  "similarProjects": []
}

Requirements:
- minimum 5 features
- minimum 4 tech stack items
- realistic output
- resumeScore between 1 and 10
- JSON ONLY
`,
          },
        ],
      }),
    }
  )

  const aiData = await response.json()

  console.log('AI DATA:', aiData)

  const raw = aiData?.choices?.[0]?.message?.content

  if (!raw) {
    throw new Error('AI response missing')
  }

  const cleaned = raw
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  let expanded

  try {
    expanded = JSON.parse(cleaned)
  } catch (err) {
    console.error('JSON PARSE FAILED')
    console.error(cleaned)

    expanded = {
      problem: 'AI generation failed',
      solution: 'Could not generate proposal',
      features: ['Try again'],
      techStack: [
        {
          name: 'Next.js',
          reason: 'Frontend framework',
        },
      ],
      timeline: {
        solo: 'Unknown',
        team: 'Unknown',
      },
      resumeScore: 5,
      resumeReason: 'Fallback response',
      similarProjects: [],
    }
  }

  if (
    !expanded.problem ||
    !expanded.solution ||
    !Array.isArray(expanded.features) ||
    !Array.isArray(expanded.techStack)
  ) {
    expanded = {
      problem: 'AI returned incomplete response',
      solution: 'Please try again',
      features: ['Retry generation'],
      techStack: [
        {
          name: 'Next.js',
          reason: 'Frontend framework',
        },
      ],
      timeline: {
        solo: 'Unknown',
        team: 'Unknown',
      },
      resumeScore: 5,
      resumeReason: 'Fallback response',
      similarProjects: [],
    }
  }

  const { data, error } = await supabase
    .from('brainstorm_cards')
    .update({ expanded, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data
}