'use server'

export async function generatePrepPlan({
  company,
  role,
  round,
  notes,
  interviewDate,
}: {
  company: string
  role: string
  round: string
  notes: string
  interviewDate?: string
}) {
  const daysLeft = interviewDate
    ? Math.max(
        1,
        Math.ceil(
          (new Date(interviewDate).getTime() - Date.now()) / 86400000
        )
      )
    : 7

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
Generate a complete interview preparation roadmap.

Days Available: ${daysLeft}
Company: ${company}
Role: ${role}
Round: ${round}
Notes: ${notes}

IMPORTANT RULES:
- Never ask follow-up questions
- Always directly generate roadmap
- Use all available days
- If 30+ days, divide week-wise
- If <=7 days, divide day-wise
- Student-friendly
- Return only clean roadmap
          `,
        },
      ],
    }),
  })

  const data = await response.json()

  return data.choices[0].message.content
}

export async function sendReminderEmail({
  entryId,
  company,
  role,
  interviewDate,
  round,
}: {
  entryId: string
  company: string
  role: string
  interviewDate: string
  round: string
}) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-interview-reminder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entryId,
        company,
        role,
        date: interviewDate,
        round,
      }),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error sending reminder email:', error)
    return { success: false, error }
  }
}