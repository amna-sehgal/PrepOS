'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Map, Clock } from 'lucide-react'

type Topic = {
  id: string
  label: string
  done: boolean
}

type Week = {
  week: number
  title: string
  focus: string
  topics: Topic[]
  problems: string[]
  mockInterview: {
    type: string
    role: string
  } | null
  color: string
  bg: string
  border: string
}

type RoadmapConfig = {
  role: string
  companies: string[]
  weeks: number
  roadmap?: Week[]
}

type SavedRoadmap = {
  id: string
  role: string
  companies: string[] | null
  weeks: number
  roadmap: Week[]
  created_at: string
}

type Props = {
  onSelectRoadmap: (roadmap: RoadmapConfig) => void
}

export default function RoadmapHistory({ onSelectRoadmap }: Props) {
  const [roadmaps, setRoadmaps] = useState<SavedRoadmap[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchRoadmaps = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('prep_roadmaps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setRoadmaps(data as SavedRoadmap[])
      }

      setLoading(false)
    }

    fetchRoadmaps()
  }, [supabase])

  if (loading) {
    return (
      <div className="mb-8 rounded-2xl border p-4">
        <p className="text-sm opacity-60">Loading roadmap history...</p>
      </div>
    )
  }

  if (roadmaps.length === 0) {
    return null
  }

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">Previous Roadmaps</h2>

      <div className="grid gap-4">
        {roadmaps.map((roadmap) => (
          <div
            key={roadmap.id}
            onClick={() =>
              onSelectRoadmap({
                role: roadmap.role,
                companies: roadmap.companies || [],
                weeks: roadmap.weeks,
                roadmap: roadmap.roadmap,
              })
            }
            className="rounded-2xl border p-4 cursor-pointer hover:shadow-md transition-all bg-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <Map size={16} />
              <p className="font-bold">{roadmap.role}</p>
            </div>

            <p className="text-sm opacity-70">
              {roadmap.weeks}-week prep roadmap
            </p>

            <div className="flex items-center gap-2 mt-3 text-xs opacity-60">
              <Clock size={12} />
              {new Date(roadmap.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}