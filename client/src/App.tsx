import RootLayout from './_root/RootLayout'
import { Route, Routes } from 'react-router-dom'
import Landing from './_root/pages/Landing'
import Explore from './_root/pages/Explore'
import Profile from './_root/pages/Profile'
import UserProfile from './_root/pages/UserProfile'
import AuthLayout from './_auth/AuthLayout'
import Signup from './_auth/pages/Signup'
import Login from './_auth/pages/Login'
import NotFound from './_root/pages/NotFound'
import CommunityDashboard from './_root/pages/CommunityDashboard'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <main className="flex h-screen bg-background text-foreground">
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<Landing />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/community/:communityId" element={<CommunityDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Routes>
      </main>
    </ThemeProvider>
  )
}

export default App




