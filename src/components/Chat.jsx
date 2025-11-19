import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function Chat() {
  const { otherId } = useParams()
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [me, setMe] = useState('')
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  const load = async () => {
    if (!me || !otherId) return
    const res = await fetch(`${baseUrl}/chat/${me}/${otherId}`)
    const data = await res.json()
    setMessages(data)
  }

  useEffect(() => { load() }, [me, otherId])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim() || !me) return
    await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from_team_id: me, to_team_id: otherId, text })
    })
    setText('')
    load()
  }

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="max-w-md mx-auto p-4">
        <header className="py-4 text-center">
          <h2 className="text-2xl font-bold">Chat</h2>
          <div className="text-xs text-slate-500">with {otherId}</div>
        </header>

        <div className="p-3 rounded-xl border">
          <div className="text-xs text-slate-500 mb-2">Your Team ID</div>
          <input className="w-full border rounded-lg p-3" placeholder="Enter your Team ID" value={me} onChange={e => setMe(e.target.value)} />
        </div>

        <div className="mt-3 h-[50vh] overflow-auto border rounded-xl p-3 space-y-2">
          {messages.map(m => (
            <div key={m.id} className={`max-w-[85%] p-2 rounded-lg text-sm ${m.from_team_id===me ? 'ml-auto bg-slate-800 text-white' : 'bg-slate-100'}`}>
              {m.text}
            </div>
          ))}
          {messages.length===0 && <div className="text-center text-slate-400 text-sm">No messages yet</div>}
        </div>

        <form onSubmit={send} className="mt-3 flex gap-2">
          <input className="flex-1 border rounded-lg p-3" value={text} onChange={e => setText(e.target.value)} placeholder="Type message" />
          <button className="px-4 rounded-lg bg-emerald-600 text-white">Send</button>
        </form>

        <div className="mt-6 text-center">
          <a href={`/team/${otherId}`} className="text-slate-600">Back</a>
        </div>
      </div>
    </div>
  )
}
