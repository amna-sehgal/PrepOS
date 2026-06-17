'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Trophy, Clock, ArrowRight } from 'lucide-react'

export default function HistoryPage() {
  const supabase = createClient()

  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from('mock_interviews')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })

      if (!error && data) {
        setReports(data)
      }

      setLoading(false)
    }

    fetchReports()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div
      className="min-h-screen px-6 py-10"
      style={{ background: 'var(--ghost)' }}
    >
      <div className="max-w-4xl mx-auto">

        <h1
          className="text-4xl font-black mb-2"
          style={{
            fontFamily: 'var(--font-archivo)',
            color: 'var(--void)',
          }}
        >
          Interview History
        </h1>

        <p
          className="mb-8"
          style={{ color: 'rgba(26,16,53,0.5)' }}
        >
          All completed mock interview reports
        </p>

        {reports.length === 0 && (
          <div
            className="bg-white rounded-3xl p-10 text-center"
          >
            No completed interviews yet.
          </div>
        )}

        <div className="space-y-4">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={`/mock-interview/report/${report.id}`}
            >
              <div
                className="bg-white rounded-3xl p-5 border hover:shadow-lg transition-all cursor-pointer"
                style={{
                  borderColor: 'rgba(26,16,53,0.08)',
                }}
              >
                <div className="flex justify-between items-center">

                  <div>
                    <h3
                      className="font-bold text-lg"
                      style={{
                        fontFamily: 'var(--font-archivo)',
                      }}
                    >
                      {report.role}
                    </h3>

                    <p
                      className="text-sm"
                      style={{
                        color: 'rgba(26,16,53,0.5)',
                      }}
                    >
                      {report.interview_type}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <Clock size={14} />
                      <span className="text-xs">
                        {new Date(
                          report.completed_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">

                    <div className="text-center">
                      <Trophy
                        size={20}
                        style={{
                          color: 'var(--prep-teal)',
                        }}
                      />

                      <p
                        className="font-black text-2xl"
                        style={{
                          fontFamily:
                            'var(--font-archivo)',
                        }}
                      >
                        {report.report?.score || 0}
                      </p>
                    </div>

                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}