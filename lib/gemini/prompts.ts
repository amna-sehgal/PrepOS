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

  roadmapMode?: boolean
  roadmapWeek?: number
  roadmapTopics?: string[]
}
export function generateFirstQuestionPrompt(
  config: InterviewConfig,
  previousQuestions: string[],
  levelCompleted: boolean
) {
  return `
You are acting as a senior FAANG interviewer.

Generate the FIRST interview question.

Role: ${config.role}
Difficulty: ${config.difficulty}
Interview Type: ${config.type}
Company: ${config.company || "General"}
${config.roadmapMode
      ? `
THIS IS A ROADMAP MOCK INTERVIEW.

Current Week:
${config.roadmapWeek}

Current Topics:

${config.roadmapTopics?.join("\n")}

Generate questions ONLY from these topics.

Difficulty progression:

Week 1
70% Beginner
30% Intermediate

Week 2
40% Beginner
60% Intermediate

Week 3
30% Intermediate
70% Advanced

Week 4+
Mostly Advanced

Do NOT ask questions from future roadmap topics.
`
      : ""
    }

Previously asked questions:

${previousQuestions.length
      ? previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")
      : "None"
    }

${levelCompleted
      ? `
IMPORTANT:
The candidate has already completed the curated ${config.difficulty} question bank.

Continue asking ORIGINAL interview questions at the SAME difficulty level.

Do NOT repeat any previous problem.
Do NOT recycle the same coding pattern unless it is genuinely different.
`
      : ""
    }
IMPORTANT:

If CURRENT ROADMAP TOPICS are provided, your FIRST interview question MUST be based ONLY on those topics.

Do NOT ask questions from topics that belong to future roadmap weeks.

Example:

Topics:
- Arrays
- Strings
- Two Pointers

Allowed:
✓ Two Sum
✓ Valid Anagram
✓ Longest Substring Without Repeating Characters

Not Allowed:
✗ Graphs
✗ Dynamic Programming
✗ System Design
✗ Tries

If multiple topics are provided, choose one naturally.
Rules:
- Ask EXACTLY ONE question.
- Keep it realistic.
- Return ONLY the question.
`
}

export function evaluateAnswerPrompt(
  question: string,
  answer: string,
  config: InterviewConfig
) {
  return `
  STATUS RULES:

correct:
score >= 75

partial:
score between 40 and 74

incorrect:
score below 40

Status MUST match the score.
Never contradict the score.
You are a STRICT FAANG interview evaluator.

Your grading standard must remain consistent across all interviews.

The same quality of answer should receive approximately the same score regardless of the company or interview.

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

0–20
No answer, "I don't know", or completely unrelated response.

21–39
Major misconceptions or mostly incorrect answer.

---

IMPORTANT RULES:

Never give a score of 0 unless:

- the candidate gives no answer,
- says "I don't know",
- or the answer is completely unrelated.

Weak answers should normally score between 20 and 45.
Average answers should score between 50 and 70.
Good answers should score between 75 and 90.
Outstanding answers should score between 90 and 100.
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
  previousQuestions: string[],
) {
  return `
You are acting as a senior FAANG interviewer.

Generate the NEXT interview question for this mock interview.

Role: ${config.role}
Difficulty: ${config.difficulty}
Interview Type: ${config.type}
Company: ${config.company || 'General'}

The candidate has ALREADY been asked these questions across all previous interviews:

${previousQuestions.length
      ? previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')
      : 'None'
    }

IMPORTANT RULES:

- Ask EXACTLY ONE interview question.
- NEVER repeat any question listed above.
- NEVER ask the same underlying interview problem even if the wording is different.
- Avoid testing identical coding patterns unless you create a genuinely different problem.
- If a common question has already been asked, choose another equally relevant interview question instead.
- Increase the difficulty gradually within this interview.
- Keep the question concise.
- Return ONLY the question text.
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

IMPORTANT:

The roadmap MUST be heavily personalized for the selected role.

Do NOT generate the same roadmap for every software role.

Role-specific expectations:

Frontend Developer:
- HTML
- CSS
- JavaScript
- TypeScript
- React
- Next.js
- Tailwind CSS
- State Management
- Browser APIs
- Accessibility
- Performance Optimization
- Responsive Design
- Frontend System Design
- Include only light DSA practice (arrays, strings, basic problem solving)

Backend Developer:
- Node.js
- Express
- REST APIs
- Authentication
- SQL
- MongoDB
- Redis
- Caching
- Queues
- Microservices
- Backend System Design
- Moderate DSA

SDE Intern / SDE-1:
- DSA (major focus)
- OOP
- DBMS
- Operating Systems
- Computer Networks
- Behavioural
- Basic System Design

ML Engineer:
- Python
- NumPy
- Pandas
- Scikit-learn
- Deep Learning
- PyTorch/TensorFlow
- Model Deployment
- ML System Design
- Basic DSA

Data Analyst:
- SQL
- Excel
- Statistics
- Python
- Pandas
- Power BI/Tableau
- Data Cleaning
- Business Case Studies
- Visualization

Product Manager:
- Product Sense
- Product Metrics
- Execution
- Product Design
- Market Research
- A/B Testing
- Behavioural
- Product Case Studies

The roadmap should progressively increase in difficulty.
Only include topics that are genuinely relevant to the selected role.
`
}