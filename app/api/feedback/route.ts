import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
      console.log("API HIT");

  try {
    const supabase = await createClient()

    const body = await req.json()

    const {
      rating,
      category,
      message,
      page,
      browser,
    } = body

    // Get logged-in user (if any)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('beta_feedback')
      .insert({
        user_id: user?.id ?? null,
        name: user?.user_metadata?.full_name ?? null,
        email: user?.email ?? null,
        rating,
        category,
        message,
        page,
        browser,
      })

    if (error) {
      console.error(error)

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch (err: any) {
    console.error(err)

    return NextResponse.json(
      {
        error: err.message || 'Something went wrong',
      },
      { status: 500 }
    )
  }
}