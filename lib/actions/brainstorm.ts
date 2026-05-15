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
        model: 'mistralai/mistral-7b-instruct:free',

        response_format: {
          type: 'json_object',
        },

        messages: [
          {
            role: 'system',
            content: `
You are an expert startup and hackathon mentor.

You MUST return STRICT VALID JSON ONLY.

Never return markdown.
Never return explanations.
Never leave fields empty.

Generate realistic, detailed content.
`,
          },
          {
            role: 'user',
            content: `
Convert this project idea into a detailed project proposal.

Title: ${idea.title}

Description:
${idea.description}

Return EXACTLY this JSON structure:

{
  "problem": "string",
  "solution": "string",
  "features": ["string"],
  "techStack": [
    {
      "name": "string",
      "reason": "string"
    }
  ],
  "timeline": {
    "solo": "string",
    "team": "string"
  },
  "resumeScore": 8.5,
  "resumeReason": "string",
  "similarProjects": ["string"]
}

Requirements:
- At least 5 features
- At least 4 tech stack items
- resumeScore must be between 1 and 10
- Make everything realistic
- Do not use placeholders
- JSON only
`,
          },
        ],
      }),
    }
  )

  const aiData = await response.json()

  if (!aiData.choices?.[0]?.message?.content) {
    throw new Error('AI response missing')
  }

  const raw = aiData.choices[0].message.content

  const cleaned = raw
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  let expanded

  try {
    expanded = JSON.parse(cleaned)
  } catch (err) {
    console.error('Invalid AI JSON:', cleaned)
    throw new Error('AI returned invalid JSON')
  }

  // extra validation
  if (
    !expanded.problem ||
    !expanded.solution ||
    !Array.isArray(expanded.features) ||
    !Array.isArray(expanded.techStack)
  ) {
    throw new Error('Incomplete AI response')
  }

  const { data, error } = await supabase
    .from('brainstorm_cards')
    .update({ expanded })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data
}