import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function TeamProfile() {
  const { teamId } = useParams()
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [team, setTeam] = useState(null)

  useEffect(() => { fetchTeam() }, [teamId])

  const fetchTeam = async () => {
    const res = await fetch(`${baseUrl}/teams/${teamId}`)
    if (!res.ok) return
    const data = await res.json()
    setTeam(data)
  }

  if (!team) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="max-w-md mx-auto p-4">
        <header className="py-4 text-center">
          <h2 className="text-2xl font-bold">{team.team_name}</h2>
          <div className="text-xs text-slate-500">{team.team_id}</div>
        </header>

        <div className="space-y-3">
          <div className="p-3 rounded-xl border">
            <div className="text-sm text-slate-500">Sport</div>
            <div className="font-semibold">{team.sport}</div>
          </div>
          <div className="p-3 rounded-xl border">
            <div className="text-sm text-slate-500">Players</div>
            <div className="text-sm">{team.players?.join(', ') || '—'}</div>
          </div>
          <div className="p-3 rounded-xl border">
            <div className="text-sm text-slate-500">Location</div>
            <div className="text-sm">{team.location_name || '—'}</div>
          </div>
          <div className="p-3 rounded-xl border">
            <div className="text-sm text-slate-500">Availability</div>
            <div className="text-sm">{team.availability?.join(', ') || '—'}</div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <a href={`/chat/${team.team_id}`} className="flex-1 py-3 rounded-lg bg-slate-800 text-white text-center">Message</a>
          <a href={`tel:${team.contact_number}`} className="flex-1 py-3 rounded-lg border text-center">Call</a>
        </div>

        <div className="mt-6 text-center">
          <a href="/nearby" className="text-slate-600">Back</a>
        </div>
      </div>
    </div>
  )
}
