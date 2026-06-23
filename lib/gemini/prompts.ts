export function trackerPrepPrompt(
  company: string,
  role: string,
  round: string,
  notes: string,
  interviewDate?: string
) {
  const daysLeft = interviewDate
    ? Math.ceil(
      (new Date(interviewDate).getTime() - Date.now()) / 86400000
    )
    : 7

  const duration =
    daysLeft <= 7
      ? 7
      : daysLeft <= 21
        ? 14
        : daysLeft <= 45
          ? 30
          : 45

  return `
Create a professional ${duration}-day interview preparation roadmap.

Company: ${company}
Role: ${role}
Round: ${round}
Notes: ${notes}
Days left until interview: ${daysLeft}

Make the plan progressive:
- early days = fundamentals
- middle = advanced problems + mock rounds
- final days = revision + company-specific prep

Return concise day-wise plan.
Format:
Day 1:
Day 2:
...
Day ${duration}:
`
}

type InterviewConfig = {
  role: string
  difficulty: string
  type: string
  company?: string
}

export function generateFirstQuestionPrompt(config: InterviewConfig) {
  return `
Generate the FIRST interview question for this mock interview.

Role: ${config.role}
Difficulty: ${config.difficulty}
Interview Type: ${config.type}
Company: ${config.company || 'General'}

Rules:
- Ask exactly ONE interview question
- Make it realistic and internship-level
- Keep it concise
- No explanation
- Return only the question text
- Do NOT normalize scores. You are not averaging. You are judging.
`
}

export function evaluateAnswerPrompt(
  question: string,
  answer: string,
  config: InterviewConfig
) {
  return `
You are a STRICT FAANG interview evaluator.

You do NOT be friendly. You do NOT be lenient.
You grade like an Amazon/Google interviewer.

---

QUESTION:
${question}

ANSWER:
${answer}

---

EVALUATION RULES:

Score honestly using this rubric:

90–100:
- Excellent structure (STAR method or equivalent)
- Specific technical details
- Clear real-world impact or depth
- Strong communication

75–89:
- Good answer
- Some specificity missing OR weak depth
- Still correct and structured

60–74:
- Basic answer
- Generic explanations
- Missing technical depth

40–59:
- Weak understanding
- Vague or incomplete

0–39:
- Incorrect or irrelevant

---

IMPORTANT RULES:
ALWAYS generate a hint.

The hint must:
- be specific to the question
- be based on the user's answer
- guide improvement (not full solution)
- differ based on score:
  - correct → optimization hint
  - partial → missing concept hint
  - incorrect → direction hint
- Be strict, not generous
- Do NOT default to 80–90
- Avoid rounding to nice numbers
- Scores must reflect real quality gaps

---

Return ONLY valid JSON:

{
  "feedback": "2-4 lines of honest critique",
  "score": number,
  "status": "correct | partial | incorrect",
  "hint": "a short, specific hint that helps improve this exact answer"
}
`
}
export function generateNextQuestionPrompt(
  config: InterviewConfig,
  previousQuestions: string[]
) {
  return `
Generate the NEXT interview question for this mock interview.

Role: ${config.role}
Difficulty: ${config.difficulty}
Interview Type: ${config.type}
Company: ${config.company || 'General'}

Already asked questions:
${previousQuestions.join('\n')}

Rules:
- Ask exactly ONE NEW interview question
- Do NOT repeat any previous question
- Increase difficulty progressively
- Keep it realistic and internship-level
- Return only the question text
`
}
export function generateRoadmapPrompt({
  role,
  companies,
  weeks,
}: {
  role: string
  companies: string[]
  weeks: number
}) {
  return `
Create a ${weeks}-week interview preparation roadmap.

Role: ${role}
Target Companies: ${companies.join(', ') || 'General'}
Duration: ${weeks} weeks

Return ONLY valid JSON in this exact format:
{
  "weeks": [
    {
      "week": 1,
      "title": "Week title",
      "focus": "Focus area",
      "topics": [
  {
    "id": "w1t1",
    "label": "Arrays & Strings",
    "done": false
  }
],
      "problems": ["problem1", "problem2"],
      "mockInterview": {
        "type": "DSA",
        "role": "${role}"
      }
    }
  ]
}

Rules:
- personalize for role
- include company specific prep if companies exist
- roadmap should get harder each week
- include DSA + system design + behavioral where relevant
- keep practical and realistic
- no markdown
- JSON only
- every topic must contain:
  - id
  - label
  - done
- done should always default to false
- generate unique topic ids like w1t1, w1t2
- every week should contain at least:
  - 4 topics
  - 3 problems
`
}