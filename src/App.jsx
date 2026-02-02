import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ExplorePage from './pages/ExplorePage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ExplorePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}

export default App
