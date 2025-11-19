import { useEffect, useState } from 'react'

export default function Nearby() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [sport, setSport] = useState('')
  const [rangeKm, setRangeKm] = useState(10)
  const [center, setCenter] = useState({ lat: '', lon: '' })
  const [query, setQuery] = useState('')
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [geoBusy, setGeoBusy] = useState(false)
  const [geoError, setGeoError] = useState('')

  const getMyLocation = () => {
    setGeoError('')
    if (!('geolocation' in navigator)) {
      setGeoError('Location is not supported on this device/browser.')
      return
    }
    if (window.isSecureContext === false) {
      setGeoError('Location requires HTTPS. Please open the secure link and try again.')
      return
    }
    setGeoBusy(true)
    navigator.geolocation.getCurrentPosition((pos) => {
      setCenter({ lat: pos.coords.latitude.toFixed(6), lon: pos.coords.longitude.toFixed(6) })
      setGeoBusy(false)
    }, (err) => {
      setGeoBusy(false)
      if (err.code === 1) setGeoError('Permission denied. Please allow location access and try again.')
      else if (err.code === 2) setGeoError('Location position unavailable. Try again later.')
      else setGeoError('Could not get your location. Please try again.')
    }, { enableHighAccuracy: true, timeout: 10000 })
  }

  // Simple client-side location search: matches team.location_name
  const search = async () => {
    setLoading(true)
    setError('')
    try {
      const url = new URL(`${baseUrl}/nearby`)
      if (sport) url.searchParams.set('sport', sport)
      if (center.lat && center.lon) {
        url.searchParams.set('center_lat', center.lat)
        url.searchParams.set('center_lon', center.lon)
      }
      url.searchParams.set('range_km', rangeKm)
      const res = await fetch(url)
      let data
      try { data = await res.json() } catch { data = [] }
      if (!res.ok) throw new Error(data.detail || 'Cannot reach server. Please try again later.')
      const filtered = query ? data.filter((t) => (t.location_name || '').toLowerCase().includes(query.toLowerCase())) : data
      setTeams(filtered)
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.')
      setTeams([])
    } finally {
      setLoading(false)
    }
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

          <input className="w-full border rounded-lg p-3" placeholder="Search location (area, place)" value={query} onChange={(e) => setQuery(e.target.value)} />

          <div className="flex gap-2">
            <button onClick={getMyLocation} disabled={geoBusy} className="flex-1 py-3 rounded-lg border disabled:opacity-60">{geoBusy ? 'Getting location…' : 'Use my location'}</button>
            <button onClick={search} className="flex-1 py-3 rounded-lg bg-emerald-600 text-white">Search</button>
          </div>
          {geoError && <div className="text-sm text-red-600">{geoError}</div>}
        </div>

        {error && <div className="mt-4 p-3 text-red-700 bg-red-50 rounded-lg text-sm">{error}</div>}

        <div className="mt-4 space-y-3">
          {loading && <div className="text-center text-slate-500 py-6">Loading…</div>}
          {!loading && teams.map(t => (
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
          {!loading && teams.length===0 && !error && <div className="text-center text-slate-500 py-10">No teams found.</div>}
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-slate-600">Back</a>
        </div>
      </div>
    </div>
  )
}
