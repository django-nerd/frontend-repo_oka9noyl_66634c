import { useEffect, useState } from 'react'

export default function Feed() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [items, setItems] = useState([])
  const [sport, setSport] = useState('')

  useEffect(() => { fetchFeed() }, [sport])

  const fetchFeed = async () => {
    const url = new URL(`${baseUrl}/feed`)
    if (sport) url.searchParams.set('sport', sport)
    const res = await fetch(url)
    const data = await res.json()
    setItems(data)
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="max-w-md mx-auto p-4">
        <header className="py-4 text-center">
          <h2 className="text-2xl font-bold">Match Feed</h2>
        </header>

        <div className="flex gap-2 overflow-auto pb-2">
          {['','cricket','football','kabaddi','shuttle','tennis'].map(s => (
            <button key={s || 'all'} onClick={() => setSport(s)} className={`px-3 py-2 rounded-full border whitespace-nowrap ${sport===s ? 'bg-slate-800 text-white' : ''}`}>{s || 'all'}</button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {items.map((it) => (
            <div key={it.id} className="p-3 rounded-xl border">
              <div className="flex justify-between text-sm text-slate-500"><span>{it.sport}</span><span>{it.time_pref}</span></div>
              <div className="text-lg font-semibold mt-1">{it.num_players} players</div>
              <div className="text-sm text-slate-600">{it.location_name || 'Unknown location'}</div>
              <div className="flex gap-2 mt-3">
                <a className="flex-1 py-2 rounded-lg bg-slate-800 text-white text-center" href={`/chat/${it.team_id}`}>Message</a>
                <a className="flex-1 py-2 rounded-lg border text-center" href={`/team/${it.team_id}`}>Call</a>
              </div>
            </div>
          ))}
          {items.length===0 && <div className="text-center text-slate-500 py-10">No posts yet.</div>}
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-slate-600">Back</a>
        </div>
      </div>
    </div>
  )
}
