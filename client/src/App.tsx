import RootLayout from './_root/RootLayout'
import { Route, Routes } from 'react-router-dom'
import Landing from './_root/pages/Landing'
import Explore from './_root/pages/Explore'
import Profile from './_root/pages/Profile'
import AuthLayout from './_auth/AuthLayout'
import Signup from './_auth/pages/Signup'
import Login from './_auth/pages/Login'
import NotFound from './_root/pages/NotFound'
import CommunityDashboard from './_root/pages/CommunityDashboard'

function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Landing />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/community/:communityId" element={<CommunityDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </main>
  )
}

export default App