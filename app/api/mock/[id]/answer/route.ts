import { createClient } from '@/lib/supabase/server'
import { askOpenRouter } from '@/lib/gemini/client'
import {
  evaluateAnswerPrompt,
  generateNextQuestionPrompt,
} from '@/lib/gemini/prompts'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    const answer = body.answer
    const questionIndex = Number(body.questionIndex)

    // 1. Get session
    const { data: session, error } = await supabase
      .from('mock_interviews')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    const transcript = session.transcript || []

    // ✅ FIXED HERE
    const currentQuestion = [...transcript]
      .reverse()
      .find(
        (t: any) =>
          t.role === 'ai' &&
          Number(t.questionIndex) === questionIndex &&
          !t.feedback
      )?.text

    if (!currentQuestion) {
      return NextResponse.json(
        {
          error: 'Question not found',
          transcript,
          questionIndex,
        },
        { status: 400 }
      )
    }

    // 2. Evaluate answer
    const evaluationPrompt = evaluateAnswerPrompt(
      currentQuestion,
      answer,
      {
        role: session.role,
        difficulty: session.difficulty,
        type: session.interview_type,
        company: session.company,
      }
    )

    const aiResponse = await askOpenRouter(evaluationPrompt)

    let parsed

    try {
      const cleanJson = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim()
      parsed = JSON.parse(cleanJson)
    } catch {
      console.log('RAW AI RESPONSE:', aiResponse)

      parsed = {
        feedback:
          'Your answer was received, but feedback parsing failed. Please continue.',
        score: 50,
        status: 'incorrect',
        hint: '',
      }
    }

    const feedbackEntry = {
      role: 'user',
      text: answer,
      questionIndex,
    }

    const aiFeedbackEntry = {
      role: 'ai',
      text: parsed.feedback,
      questionIndex,
      feedback: {
        text: parsed.feedback,
        score: parsed.score,
        status: parsed.status,
        hint: parsed.hint || '',
      },
    }

    let finished = false
    let nextQuestion = null

    // 3. Next question
    if (questionIndex + 1 >= session.total_questions) {
      finished = true
    } else {
      const previousQuestions = transcript
        .filter((t: any) => t.role === 'ai' && !t.feedback)
        .map((t: any) => t.text)

      const nextPrompt = generateNextQuestionPrompt(
        {
          role: session.role,
          difficulty: session.difficulty,
          type: session.interview_type,
          company: session.company,
        },
        previousQuestions
      )

      try {
        nextQuestion = await askOpenRouter(nextPrompt)
      } catch (err: any) {
        console.error('Failed fetching next question:', err)
        nextQuestion = "Let's move on to the next topic. Could you share more about your experience?"
      }
    }

    const updatedTranscript = [
      ...transcript,
      feedbackEntry,
      aiFeedbackEntry,
      ...(nextQuestion
        ? [
          {
            role: 'ai',
            text: nextQuestion,
            questionIndex: questionIndex + 1,
          },
        ]
        : []),
    ]

    const updatePayload: any = {
      transcript: updatedTranscript,
    }

    let reportInfo = null;

    if (finished) {
      let score = 0;
      let correct = 0;
      let partial = 0;
      let wrong = 0;

      const aiFeedbacks = updatedTranscript.filter((t: any) => t.role === 'ai' && t.feedback);
      if (aiFeedbacks.length > 0) {
        let totalScore = 0;
        aiFeedbacks.forEach((t: any) => {
          totalScore += Number(t.feedback.score) || 0;
          if (t.feedback.status === 'correct') correct++;
          else if (t.feedback.status === 'partial') partial++;
          else wrong++;
        });
        score = Math.round(totalScore / aiFeedbacks.length);
      }

      const reportPrompt = `Analyze this interview transcript and provide exactly 2 weak areas and 3 topics to revise next. Return ONLY valid JSON: { "weakAreas": ["area1", "area2"], "reviseTopics": ["topic1", "topic2", "topic3"] }. Transcript: ${JSON.stringify(updatedTranscript.map((t: any) => ({ role: t.role, text: t.text })))}`;
      try {
        const reportAi = await askOpenRouter(reportPrompt);
        const cleanJson = reportAi.replace(/```json/gi, '').replace(/```/g, '').trim();
        reportInfo = JSON.parse(cleanJson);
      } catch (err) {
        console.error('Failed to generate report schema:', err);
      }

      updatedTranscript.push({
        role: 'system',
        isSummary: true,
        score,
        correct,
        partial,
        wrong,
        weakAreas: reportInfo?.weakAreas || [],
        reviseTopics: reportInfo?.reviseTopics || [],
        completedAt: new Date().toISOString()
      });
    }

    const { error: updateError } = await supabase
      .from('mock_interviews')
      .update(updatePayload)
      .eq('id', id)

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      feedback: parsed.feedback,
      score: parsed.score,
      status: parsed.status,
      hint: parsed.hint,
      finished,
      nextQuestion,
      reportInfo,
    })
  } catch (err: any) {
    console.error('ANSWER ROUTE ERROR:', err)

    return NextResponse.json(
      { error: err.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}