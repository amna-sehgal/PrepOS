import { createClient } from '@/lib/supabase/server'

export default async function MyRoadmapsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: roadmaps } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Roadmaps</h1>

      <div className="grid gap-4">
        {roadmaps?.map((roadmap) => (
          <div
            key={roadmap.id}
            className="border rounded-xl p-4 bg-white shadow-sm"
          >
            <h2 className="font-semibold">
              {roadmap.role} · {roadmap.weeks} weeks
            </h2>
            <p className="text-sm text-gray-500">
              Created on {new Date(roadmap.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}