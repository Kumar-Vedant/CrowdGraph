import Navbar from '../components/shared/Navbar'
import { Outlet } from 'react-router-dom'

function RootLayout() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f9f8fc] group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
        <div className="layout-container flex h-full grow flex-col">
            <Navbar />
            <section>
                <Outlet />
            </section>
        </div>
    </div>
  )
}

export default RootLayout