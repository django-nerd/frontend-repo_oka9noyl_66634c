import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="max-w-md mx-auto p-4">
        <header className="py-6 text-center">
          <h1 className="text-3xl font-bold">FindRivals</h1>
          <p className="text-sm text-slate-500 mt-1">Find local teams. Set up matches fast.</p>
        </header>

        <div className="space-y-3 mt-8">
          <Link to="/register" className="block w-full py-4 rounded-xl text-white bg-blue-600 text-center font-semibold active:scale-[0.99]">Register Team</Link>
          <Link to="/nearby" className="block w-full py-4 rounded-xl text-white bg-emerald-600 text-center font-semibold active:scale-[0.99]">Find Opponent</Link>
          <Link to="/feed" className="block w-full py-4 rounded-xl text-white bg-slate-800 text-center font-semibold active:scale-[0.99]">Match Feed</Link>
        </div>

        <div className="mt-10 text-center text-xs text-slate-500">
          Optimized for mobile • No media • Text chat only
        </div>
      </div>
    </div>
  )
}
