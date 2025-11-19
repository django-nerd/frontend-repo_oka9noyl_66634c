import { useEffect, useState } from 'react'

export default function Feed() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [sport, setSport] = useState('')
  const [timePref, setTimePref] = useState('')
  const [numMin, setNumMin] = useState('')
  const [numMax, setNumMax] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => { fetchFeed() }, [])

  const fetchFeed = async () => {
    setLoading(true)
    setError('')
    try {
      const url = new URL(`${baseUrl}/feed`)
      if (sport) url.searchParams.set('sport', sport)
      if (timePref) url.searchParams.set('time_pref', timePref)
      if (numMin) url.searchParams.set('num_players_min', numMin)
      if (numMax) url.searchParams.set('num_players_max', numMax)
      if (note) url.searchParams.set('note_contains', note)
      const res = await fetch(url)
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to load feed')
      setItems(data)
    } catch (e) {
      setError(e.message)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setSport('')
    setTimePref('')
    setNumMin('')
    setNumMax('')
    setNote('')
  }

  const canCall = (it) => (it.contact_methods || []).includes('call') && it.contact_number
  const canText = (it) => (it.contact_methods || []).includes('text') && it.contact_number

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="max-w-md mx-auto p-4">
        <header className="py-4 text-center">
          <h2 className="text-2xl font-bold">Match Feed</h2>
        </header>

        <div className="space-y-3">
          <div className="flex gap-2 overflow-auto pb-2">
            {['','cricket','football','kabaddi','shuttle','tennis'].map(s => (
              <button key={s || 'all'} onClick={() => setSport(s)} className={`px-3 py-2 rounded-full border whitespace-nowrap ${sport===s ? 'bg-slate-800 text-white' : ''}`}>{s || 'all'}</button>
            ))}
          </div>

          <div className="flex gap-2">
            {['','morning','afternoon','evening'].map(t => (
              <button key={t || 'any'} onClick={() => setTimePref(t)} className={`flex-1 py-2 rounded-lg border ${timePref===t ? 'bg-slate-800 text-white' : ''}`}>{t || 'any time'}</button>
            ))}
          </div>

          <div className="flex gap-2">
            <input className="w-1/2 border rounded-lg p-3" inputMode="numeric" placeholder="Min players" value={numMin} onChange={(e) => setNumMin(e.target.value)} />
            <input className="w-1/2 border rounded-lg p-3" inputMode="numeric" placeholder="Max players" value={numMax} onChange={(e) => setNumMax(e.target.value)} />
          </div>

          <input className="w-full border rounded-lg p-3" placeholder="Search note (keywords)" value={note} onChange={(e) => setNote(e.target.value)} />

          <div className="flex gap-2">
            <button onClick={resetFilters} className="flex-1 py-3 rounded-lg border">Reset</button>
            <button onClick={fetchFeed} className="flex-1 py-3 rounded-lg bg-emerald-600 text-white">Apply</button>
          </div>
        </div>

        {error && <div className="mt-4 p-3 text-red-700 bg-red-50 rounded-lg text-sm">{error}</div>}

        <div className="mt-4 space-y-3">
          {loading && <div className="text-center text-slate-500 py-6">Loading…</div>}
          {!loading && items.map((it) => (
            <div key={it.id} className="p-3 rounded-xl border">
              <div className="text-xs text-slate-500 flex justify-between"><span>{it.sport}</span><span>{it.time_pref}</span></div>
              <div className="text-lg font-semibold mt-1">{it.num_players} players</div>
              <div className="text-sm text-slate-600">{it.location_name || 'Unknown location'}</div>
              <div className="text-sm text-slate-700 mt-1">Posted by: <span className="font-medium">{it.team_name || it.team_id}</span></div>
              {it.note && <div className="text-sm text-slate-500 mt-1">“{it.note}”</div>}
              <div className="flex gap-2 mt-3">
                <a className="flex-1 py-2 rounded-lg bg-slate-800 text-white text-center" href={`/chat/${it.team_id}`}>Message</a>
                {canCall(it) && <a className="flex-1 py-2 rounded-lg border text-center" href={`tel:${it.contact_number}`}>Call</a>}
                {canText(it) && <a className="flex-1 py-2 rounded-lg border text-center" href={`sms:${it.contact_number}`}>Text</a>}
                {!canCall(it) && !canText(it) && <a className="flex-1 py-2 rounded-lg border text-center" href={`/team/${it.team_id}`}>View team</a>}
              </div>
            </div>
          ))}
          {!loading && items.length===0 && !error && <div className="text-center text-slate-500 py-10">No posts yet.</div>}
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-slate-600">Back</a>
        </div>
      </div>
    </div>
  )
}
