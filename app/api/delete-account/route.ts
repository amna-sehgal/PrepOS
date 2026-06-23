import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  const admin = createAdminClient()

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const userId = user.id

  try {
    // STEP 1: Delete all user-owned data safely (parallel but validated)
    const [brainstorm, interviews, tracker, settings] = await Promise.all([
      supabase.from('brainstorm_cards').delete().eq('user_id', userId),
      supabase.from('mock_interviews').delete().eq('user_id', userId),
      supabase.from('interview_tracker').delete().eq('user_id', userId),
      supabase.from('user_settings').delete().eq('user_id', userId),
    ])

    // STEP 2: Validate deletion results
    const errors = [brainstorm, interviews, tracker, settings]
      .filter(r => r.error)
      .map(r => r.error?.message)

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: 'Data deletion failed',
          details: errors
        },
        { status: 500 }
      )
    }

    // STEP 3: Delete auth user (critical final step)
    const { error: authError } = await admin.auth.admin.deleteUser(userId)

    if (authError) {
      return NextResponse.json(
        {
          error: 'Auth deletion failed',
          details: authError.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Account permanently deleted'
    })

  } catch (err: any) {
    return NextResponse.json(
      {
        error: 'Unexpected server error',
        details: err.message
      },
      { status: 500 }
    )
  }
}