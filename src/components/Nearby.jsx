import { useEffect, useState } from 'react'

export default function Nearby() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [sport, setSport] = useState('')
  const [rangeKm, setRangeKm] = useState(10)
  const [center, setCenter] = useState({ lat: '', lon: '' })
  const [teams, setTeams] = useState([])

  const getMyLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos) => {
      setCenter({ lat: pos.coords.latitude.toFixed(6), lon: pos.coords.longitude.toFixed(6) })
    })
  }

  const search = async () => {
    const url = new URL(`${baseUrl}/nearby`)
    if (sport) url.searchParams.set('sport', sport)
    if (center.lat && center.lon) {
      url.searchParams.set('center_lat', center.lat)
      url.searchParams.set('center_lon', center.lon)
    }
    url.searchParams.set('range_km', rangeKm)
    const res = await fetch(url)
    const data = await res.json()
    setTeams(data)
  }

  useEffect(() => { search() }, [])

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="max-w-md mx-auto p-4">
        <header className="py-4 text-center">
          <h2 className="text-2xl font-bold">Nearby Opponents</h2>
        </header>

        <div className="space-y-3">
          <div className="flex gap-2">
            <select className="flex-1 border rounded-lg p-3" value={sport} onChange={e => setSport(e.target.value)}>
              {['','cricket','football','kabaddi','shuttle','tennis'].map(s => <option key={s || 'all'} value={s}>{s || 'all sports'}</option>)}
            </select>
            <select className="w-28 border rounded-lg p-3" value={rangeKm} onChange={e => setRangeKm(Number(e.target.value))}>
              {[5,10,20,50].map(v => <option key={v} value={v}>{v} km</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <input className="flex-1 border rounded-lg p-3" placeholder="Lat" value={center.lat} onChange={e => setCenter({ ...center, lat: e.target.value })} />
            <input className="flex-1 border rounded-lg p-3" placeholder="Lon" value={center.lon} onChange={e => setCenter({ ...center, lon: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button onClick={getMyLocation} className="flex-1 py-3 rounded-lg border">Use my location</button>
            <button onClick={search} className="flex-1 py-3 rounded-lg bg-emerald-600 text-white">Search</button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {teams.map(t => (
            <div key={t.id} className="p-3 rounded-xl border">
              <div className="font-semibold">{t.team_name} <span className="text-xs text-slate-500">{t.team_id}</span></div>
              <div className="text-sm text-slate-600">{t.sport} • {t.players?.length || 0} players • {t.location_name || 'Unknown'}</div>
              {t.distance_km !== undefined && <div className="text-xs text-slate-500">{t.distance_km} km away</div>}
              <div className="flex gap-2 mt-3">
                <a className="flex-1 py-2 rounded-lg bg-slate-800 text-white text-center" href={`/team/${t.team_id}`}>View</a>
                <a className="flex-1 py-2 rounded-lg border text-center" href={`tel:${t.contact_number}`}>Call</a>
              </div>
            </div>
          ))}
          {teams.length===0 && <div className="text-center text-slate-500 py-10">No teams found.</div>}
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-slate-600">Back</a>
        </div>
      </div>
    </div>
  )
}
