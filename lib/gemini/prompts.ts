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


correct
The candidate answered the primary question correctly.
Minor missing details are acceptable.

partial
The candidate showed some understanding but missed important concepts or reasoning.

incorrect
The answer is fundamentally incorrect, unrelated, or demonstrates little understanding.

STATUS DETERMINATION (MANDATORY)

After calculating the Final Score:

80–100 → correct
40–79 → partial
0–39 → incorrect

The status MUST be determined ONLY from the final score.
Do not choose the status independently.
You are an experienced software engineering interviewer evaluating a mock interview.

Your goal is to provide a realistic assessment that mirrors how professional interviewers evaluate candidates.

Be objective, fair, and consistent.

Do not inflate scores, but do not over-penalize candidates for small omissions.

Focus primarily on:
- correctness
- reasoning
- communication
- problem-solving approach
- clarity

Evaluate whether the candidate would likely pass this interview stage, rather than treating it like an academic exam.

---

INTERVIEW CONTEXT:

Role: ${config.role}
Difficulty: ${config.difficulty}
Interview Type: ${config.type}
Company: ${config.company || "General"}

---

Evaluation Guidance:

- If this is a DSA interview, prioritize correctness, algorithm choice, time and space complexity, and communication.
- If this is a Behavioral interview, prioritize clarity, ownership, impact, structure (such as STAR), and reflection.
- If this is a System Design interview, prioritize requirements gathering, architecture, scalability, trade-offs, and communication.

QUESTION:
${question}

ANSWER:
${answer}

---

EVALUATION RULES:

Score honestly using this rubric:

95–100
Exceptional answer.
Technically accurate, well structured, clear reasoning, strong examples, and interview-ready.

85–94
Strong answer.
Correct with good communication. May miss a few details but would likely pass.

70–84
Good answer.
Correct overall but lacks some depth, examples, or optimization.

55–69
Partially correct.
Shows understanding but misses important concepts or contains noticeable gaps.

35–54
Weak answer.
Incomplete, vague, or contains significant misunderstandings.

0–34
Incorrect, unrelated, or no meaningful answer.

SCORING PROCESS (FOLLOW EXACTLY)

Step 1: Evaluate the answer on each criterion from 0 to 5.

Correctness
0 = incorrect or unrelated
1 = major misconceptions
2 = partially correct
3 = mostly correct
4 = correct with minor gaps
5 = completely correct

Specificity
0 = no examples
1 = extremely vague
2 = some details
3 = reasonably specific
4 = detailed
5 = highly specific with concrete examples

Depth
0 = superficial
1 = very little reasoning
2 = basic reasoning
3 = good reasoning
4 = strong reasoning
5 = exceptional insight

Structure & Communication
0 = confusing
1 = poorly structured
2 = understandable
3 = organized
4 = clear
5 = exceptionally clear

Impact / Outcome
0 = no outcome
1 = vague outcome
2 = weak outcome
3 = reasonable outcome
4 = strong outcome
5 = measurable or highly convincing outcome

Step 2:

Total = sum of all five scores.

Final Score = Total × 4.

Step 3:

Determine status ONLY using the final score.

80–100 → correct
40–79 → partial
0–39 → incorrect

Do NOT estimate the score directly.

Always score each criterion first, then calculate the final score.

---

IMPORTANT RULES:

Never give a score of 0 unless:

- the candidate gives no answer,
- says "I don't know",
- or the answer is completely unrelated.


ALWAYS generate a hint.

The hint must:
- be specific to the question
- be based on the user's answer
- guide improvement (not full solution)
- differ based on score:
  - correct → optimization hint
  - partial → missing concept hint
  - incorrect → direction hint
- Be honest, objective, and balanced.

-Avoid being unnecessarily harsh or overly generous.

-Your evaluation should reflect how an experienced interviewer would assess the response.
- Do NOT default to 80–90
- Avoid rounding to nice numbers
- Scores must reflect real quality gaps

---
FEEDBACK RULES

The feedback should:

- Start with what the candidate did well.
- Clearly explain what was missing.
- Mention one concrete improvement.
- Be encouraging but honest.
- Avoid generic statements.
- Keep it between 3 and 5 concise sentences.

Also identify:

- 2 strengths of the candidate's answer.
- 2 specific improvements that would make the answer stronger.

The strengths and improvements should be concise (one sentence each) and directly related to the answer.

Return ONLY valid JSON:

{
  "feedback": "<string>",
  "score": "<integer>",
  "status": "<correct|partial|incorrect>",
  "hint": "<string>",
  "strengths": ["<string>", "<string>"],
  "improvements": ["<string>", "<string>"]
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