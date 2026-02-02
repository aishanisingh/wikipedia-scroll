import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TrendingSidebar from './TrendingSidebar'
import MobileNav from './MobileNav'
import MobileHeader from './MobileHeader'

function Layout() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Header */}
      <MobileHeader />

      <div className="flex justify-center max-w-7xl mx-auto">
        {/* Left Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 max-w-xl border-x border-gray-800 min-h-screen pb-16 md:pb-0">
          <Outlet />
        </main>

        {/* Right Sidebar - hidden on mobile and tablet */}
        <TrendingSidebar />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}

export default Layout
