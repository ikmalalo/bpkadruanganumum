import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/DashboardComponents/Sidebar"
import { Menu } from "lucide-react"

export default function ConditionalPreviewLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check login status on mount
  useEffect(() => {
    const user = localStorage.getItem('user')
    setIsLoggedIn(!!user)
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  // If NOT logged in, return just the content (full screen, no sidebar)
  if (!isLoggedIn) {
    return <Outlet />
  }

  // If LOGGED IN, wrap the content with the Sidebar layout
  return (
    <div className="flex min-h-screen relative bg-gray-100">
      
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 relative overflow-hidden h-screen">
        
        {/* Mobile Sidebar Toggle Button - Only visible on small screens when logged in */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 right-4 z-[60] bg-white p-2.5 rounded-full shadow-lg border border-gray-200 text-gray-700 hover:text-orange-500 hover:border-orange-200 transition-all active:scale-95"
        >
          <Menu size={20} />
        </button>

        {/* The Actual Preview Page Content */}
        <main className="flex-1 h-full w-full overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  )
}
