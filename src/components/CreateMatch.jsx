import { useState } from 'react'

const timeSlots = ['morning', 'afternoon', 'evening']

export default function CreateMatch() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [form, setForm] = useState({ team_id: '', sport: 'cricket', num_players: 11, time_pref: 'morning', note: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`${baseUrl}/matchposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to post')
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
          <h2 className="text-2xl font-bold">Create Match Request</h2>
        </header>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium mb-1">Team ID</label>
            <input className="w-full border rounded-lg p-3" value={form.team_id} onChange={e => setForm({ ...form, team_id: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sport</label>
            <select className="w-full border rounded-lg p-3" value={form.sport} onChange={e => setForm({ ...form, sport: e.target.value })}>
              {['cricket','football','kabaddi','shuttle','tennis'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Number of players</label>
            <input type="number" className="w-full border rounded-lg p-3" value={form.num_players} onChange={e => setForm({ ...form, num_players: Number(e.target.value) })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preferred time</label>
            <div className="flex gap-2">
              {timeSlots.map(t => (
                <button type="button" key={t} onClick={() => setForm({ ...form, time_pref: t })} className={`flex-1 py-2 rounded-lg border ${form.time_pref === t ? 'bg-slate-800 text-white' : ''}`}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Note (optional)</label>
            <textarea className="w-full border rounded-lg p-3" rows="3" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
          </div>
          <button disabled={loading} className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold">{loading ? 'Posting...' : 'Post to Feed'}</button>
        </form>

        {error && <div className="mt-4 p-3 text-red-700 bg-red-50 rounded-lg text-sm">{error}</div>}
        {result && <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm">Posted to feed.</div>}

        <div className="mt-6 text-center">
          <a href="/" className="text-slate-600">Back</a>
        </div>
      </div>
    </div>
  )
}
