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
    latitude: '',
    longitude: '',
    contact_preference: 'call',
    contact_number: '',
    availability: [],
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

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

  const useLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition((pos) => {
      updateField('latitude', pos.coords.latitude.toFixed(6))
      updateField('longitude', pos.coords.longitude.toFixed(6))
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const payload = {
        ...form,
        players: form.players.filter(p => p.trim() !== ''),
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null,
      }
      const res = await fetch(`${baseUrl}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to register')
      setResult(data)
    } catch (err) {
      setError(err.message)
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
            <div className="flex gap-2">
              <input className="flex-1 border rounded-lg p-3" placeholder="Latitude" value={form.latitude} onChange={e => updateField('latitude', e.target.value)} />
              <input className="flex-1 border rounded-lg p-3" placeholder="Longitude" value={form.longitude} onChange={e => updateField('longitude', e.target.value)} />
            </div>
            <button type="button" onClick={useLocation} className="mt-2 w-full py-2 rounded-lg border">Use my location</button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact preference</label>
            <div className="flex gap-3">
              {['call','text'].map(v => (
                <label key={v} className={`flex-1 p-3 border rounded-lg text-center ${form.contact_preference===v ? 'bg-slate-100' : ''}`}>
                  <input type="radio" name="cp" className="mr-2" checked={form.contact_preference===v} onChange={() => updateField('contact_preference', v)} />
                  {v}
                </label>
              ))}
            </div>
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
