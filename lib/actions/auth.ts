'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Server logout error:', error)
      return { success: false, error: error.message }
    }

    console.log('Server logout successful')
    return { success: true }
  } catch (err) {
    console.error('Unexpected server logout error:', err)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
