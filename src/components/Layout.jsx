import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TrendingSidebar from './TrendingSidebar'

function Layout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex justify-center max-w-7xl mx-auto">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 max-w-xl border-r border-gray-800">
          <Outlet />
        </main>

        {/* Right Sidebar */}
        <TrendingSidebar />
      </div>
    </div>
  )
}

export default Layout
