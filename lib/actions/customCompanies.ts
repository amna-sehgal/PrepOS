import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export async function getCustomCompanies() {
  const user = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('user_custom_companies')
    .select('name')
    .eq('user_id', user.data.user?.id)

  if (error) throw error

  return data.map((c) => c.name)
}

export async function addCustomCompany(name: string) {
  const user = await supabase.auth.getUser()

  const { error } = await supabase
    .from('user_custom_companies')
    .upsert(
      {
        name,
        user_id: user.data.user?.id,
      },
      {
        onConflict: 'user_id,name',
      }
    )

  if (error) throw error
}