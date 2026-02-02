import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ExplorePage from './pages/ExplorePage'
import SettingsPage from './pages/SettingsPage'
import LikedPage from './pages/LikedPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ExplorePage />} />
        <Route path="liked" element={<LikedPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

export default App
