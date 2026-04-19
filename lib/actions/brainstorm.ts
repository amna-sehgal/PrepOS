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

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openrouter/free',
      messages: [
        {
          role: 'user',
          content: `
Convert this idea into STRICT valid JSON only.

IMPORTANT RULES:
- Return only raw JSON
- No markdown
- No code blocks
- resumeScore must be a number between 1 and 10 only
- decimals allowed like 8.5
- NEVER use percentage or values above 10

JSON format:
{
  "problem": "",
  "solution": "",
  "features": [],
  "techStack": [
    { "name": "", "reason": "" }
  ],
  "timeline": {
    "solo": "",
    "team": ""
  },
  "resumeScore": 0,
  "resumeReason": "",
  "similarProjects": []
}

Title: ${idea.title}
Description: ${idea.description}
          `,
        },
      ],
    }),
  })

  const aiData = await response.json()
  const raw = aiData.choices[0].message.content

  const cleaned = raw
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  const expanded = JSON.parse(cleaned)

  const { data, error } = await supabase
    .from('brainstorm_cards')
    .update({ expanded })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data
}