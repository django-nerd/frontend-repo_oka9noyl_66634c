import { Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import RegisterTeam from './components/RegisterTeam'
import CreateMatch from './components/CreateMatch'
import Feed from './components/Feed'
import Nearby from './components/Nearby'
import TeamProfile from './components/TeamProfile'
import Chat from './components/Chat'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<RegisterTeam />} />
      <Route path="/create" element={<CreateMatch />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/nearby" element={<Nearby />} />
      <Route path="/team/:teamId" element={<TeamProfile />} />
      <Route path="/chat/:otherId" element={<Chat />} />
    </Routes>
  )
}

export default App
