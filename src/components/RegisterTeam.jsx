import { useState } from 'react'

const sports = [
  { label: 'Cricket', value: 'cricket' },
  { label: 'Football', value: 'football' },
  { label: 'Kabaddi', value: 'kabaddi' },
  { label: 'Shuttle', value: 'shuttle' },
  { label: 'Tennis', value: 'tennis' },
]

const timeSlots = ['morning', 'afternoon', 'evening']

export default function RegisterTeam() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [form, setForm] = useState({
    team_name: '',
    sport: 'cricket',
    players: [''],
    location_name: '',
    // coords kept internally (hidden) to support "Use my location"
    latitude: '',
    longitude: '',
    contact_methods: ['call', 'text'],
    contact_number: '',
    availability: [],
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [geoBusy, setGeoBusy] = useState(false)
  const [geoError, setGeoError] = useState('')

  const updateField = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const updatePlayer = (i, v) => {
    const next = [...form.players]
    next[i] = v
    updateField('players', next)
  }

  const addPlayer = () => updateField('players', [...form.players, ''])
  const removePlayer = (i) => updateField('players', form.players.filter((_, idx) => idx !== i))

  const toggleAvailability = (slot) => {
    const set = new Set(form.availability)
    set.has(slot) ? set.delete(slot) : set.add(slot)
    updateField('availability', Array.from(set))
  }

  const toggleContact = (method) => {
    const set = new Set(form.contact_methods)
    set.has(method) ? set.delete(method) : set.add(method)
    const next = Array.from(set)
    // Ensure at least one method is selected
    updateField('contact_methods', next.length ? next : ['call'])
  }

  const useLocation = () => {
    setGeoError('')
    if (!('geolocation' in navigator)) {
      setGeoError('Location is not supported on this device/browser.')
      return
    }
    // Some browsers block geolocation on insecure contexts
    if (window.isSecureContext === false) {
      setGeoError('Location requires HTTPS. Please open the secure link and try again.')
      return
    }
    setGeoBusy(true)
    navigator.geolocation.getCurrentPosition((pos) => {
      updateField('latitude', pos.coords.latitude.toFixed(6))
      updateField('longitude', pos.coords.longitude.toFixed(6))
      setGeoBusy(false)
    }, (err) => {
      setGeoBusy(false)
      if (err.code === 1) setGeoError('Permission denied. Please allow location access and try again.')
      else if (err.code === 2) setGeoError('Location position unavailable. Try again later.')
      else setGeoError('Could not get your location. Please try again.')
    }, { enableHighAccuracy: true, timeout: 10000 })
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const payload = {
        team_name: form.team_name,
        sport: form.sport,
        players: form.players.filter(p => p.trim() !== ''),
        location_name: form.location_name || null,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
        contact_methods: form.contact_methods,
        contact_number: form.contact_number,
        availability: form.availability,
      }
      const res = await fetch(`${baseUrl}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      let data
      try { data = await res.json() } catch { data = {} }
      if (!res.ok) throw new Error(data.detail || 'Cannot reach server. Please try again later.')
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="max-w-md mx-auto p-4">
        <header className="py-4 text-center">
          <h2 className="text-2xl font-bold">Register Team</h2>
        </header>

        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium mb-1">Team name</label>
            <input className="w-full border rounded-lg p-3" value={form.team_name} onChange={e => updateField('team_name', e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sport</label>
            <select className="w-full border rounded-lg p-3" value={form.sport} onChange={e => updateField('sport', e.target.value)}>
              {sports.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Players</label>
            <div className="space-y-2">
              {form.players.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <input className="flex-1 border rounded-lg p-3" value={p} onChange={e => updatePlayer(i, e.target.value)} placeholder={`Player ${i+1}`} />
                  {form.players.length > 1 && (
                    <button type="button" onClick={() => removePlayer(i)} className="px-3 rounded-lg border">-</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addPlayer} className="w-full py-2 rounded-lg border">Add player</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input className="w-full border rounded-lg p-3 mb-2" placeholder="Area name" value={form.location_name} onChange={e => updateField('location_name', e.target.value)} />
            <button type="button" onClick={useLocation} disabled={geoBusy} className="mt-1 w-full py-2 rounded-lg border disabled:opacity-60">{geoBusy ? 'Getting location…' : 'Use my location'}</button>
            {geoError && <div className="mt-2 text-sm text-red-600">{geoError}</div>}
            {(form.latitude && form.longitude) && (
              <div className="mt-2 text-xs text-slate-500">Lat {form.latitude}, Lon {form.longitude}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact methods</label>
            <div className="grid grid-cols-2 gap-2">
              {['call','text'].map(v => (
                <label key={v} className={`flex items-center gap-2 p-3 border rounded-lg ${form.contact_methods.includes(v) ? 'bg-slate-100' : ''}`}>
                  <input type="checkbox" checked={form.contact_methods.includes(v)} onChange={() => toggleContact(v)} />
                  <span className="capitalize">{v}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-1">You can enable both options.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact number</label>
            <input className="w-full border rounded-lg p-3" inputMode="tel" placeholder="Phone" value={form.contact_number} onChange={e => updateField('contact_number', e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Availability</label>
            <div className="flex gap-2">
              {timeSlots.map(t => (
                <button type="button" key={t} className={`flex-1 py-2 rounded-lg border ${form.availability.includes(t) ? 'bg-slate-800 text-white' : ''}`} onClick={() => toggleAvailability(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button disabled={loading} className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold">
            {loading ? 'Saving...' : 'Create Team'}
          </button>
        </form>

        {error && <div className="mt-4 p-3 text-red-700 bg-red-50 rounded-lg text-sm">{error}</div>}
        {result && (
          <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
            Team created. Your Team ID is <span className="font-semibold">{result.team_id}</span>
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/" className="text-slate-600">Back</a>
        </div>
      </div>
    </div>
  )
}
