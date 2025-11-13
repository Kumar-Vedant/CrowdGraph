import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { getAllUsers } from '@/services/api';
import { useApi } from '@/hooks/apiHook';
import type { User } from '@/schema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function Navbar() {
  const { user } = useAuth();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: usersData, loading: usersLoading, callApi: fetchAllUsers } = useApi(getAllUsers);

  useEffect(() => {
    if (isLeaderboardOpen && !usersData) {
      fetchAllUsers();
    }
  }, [isLeaderboardOpen]);

  const sortedUsers = usersData 
    ? [...usersData].sort((a: User, b: User) => (b.reputation || 0) - (a.reputation || 0))
    : [];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 px-4 md:px-10 py-3 md:py-4 shadow-sm">
      <Link to="/" className="flex items-center gap-2 md:gap-3 text-foreground hover:opacity-80 transition-opacity">
        <div className="size-7 md:size-8 flex items-center justify-center bg-linear-to-br from-primary to-accent rounded-lg p-1.5 shadow-md">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white">
            <path
              d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <h2 className="text-foreground text-lg md:text-xl font-bold tracking-tight">CrowdGraph</h2>
      </Link>
      
      <div className="flex flex-1 justify-end items-center gap-3 md:gap-8">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link 
            className="text-foreground/80 hover:text-foreground text-sm font-medium transition-colors relative group" 
            to="/explore"
          >
            Explore
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
          
          <Dialog open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
            <DialogTrigger asChild>
              <button className="text-foreground/80 hover:text-foreground text-sm font-medium transition-colors relative group">
                Leaderboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <svg className="w-6 h-6 text-warning" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Global Leaderboard
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto pr-2">
                {usersLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : sortedUsers.length > 0 ? (
                  <div className="space-y-2 mt-4">
                    {sortedUsers.map((u: User, index: number) => (
                      <Link
                        key={u.id}
                        to={`/user/${u.id}`}
                        onClick={() => setIsLeaderboardOpen(false)}
                        className={`flex items-center gap-4 p-4 rounded-lg transition-all hover:shadow-md cursor-pointer ${
                          index === 0 ? 'bg-warning/10 border-2 border-warning/30' :
                          index === 1 ? 'bg-muted/50 border-2 border-border' :
                          index === 2 ? 'bg-accent/10 border-2 border-accent/30' :
                          'bg-card border border-border hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-center justify-center w-8">
                          {index === 0 ? (
                            <div className="text-2xl">🥇</div>
                          ) : index === 1 ? (
                            <div className="text-2xl">🥈</div>
                          ) : index === 2 ? (
                            <div className="text-2xl">🥉</div>
                          ) : (
                            <span className="text-muted-foreground font-semibold text-sm">#{index + 1}</span>
                          )}
                        </div>
                        
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm shadow-md shrink-0">
                          {u.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground font-semibold truncate">{u.username}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(u.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                          <svg className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-primary font-bold text-sm">{u.reputation || 0}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <Link 
            className="text-foreground/80 hover:text-foreground text-sm font-medium transition-colors relative group" 
            to="https://github.com/Kumar-Vedant/CrowdGraph" 
            target="_blank"
          >
            Contribute
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
        </div>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link to={`/profile`} className="group">
              <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm shadow-md ring-2 ring-background group-hover:ring-primary/50 transition-all">
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden lg:inline text-sm font-medium text-foreground">{user.username}</span>
              </div>
            </Link>
          ) : (
            <>
              <Link to="/signup">
                <button className="flex items-center justify-center rounded-lg h-9 px-5 bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md">
                  Sign Up
                </button>
              </Link>
              <Link to="/login">
                <button className="flex items-center justify-center rounded-lg h-9 px-5 bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-all border border-border">
                  Log In
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <button 
          className="md:hidden flex items-center justify-center w-10 h-10 text-foreground hover:bg-muted rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/98 backdrop-blur-md border-b border-border shadow-lg md:hidden">
          <div className="flex flex-col p-4 space-y-3">
            <Link 
              to="/explore"
              className="text-foreground/80 hover:text-foreground text-base font-medium py-2 px-3 rounded-lg hover:bg-muted transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Explore
            </Link>
            
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsLeaderboardOpen(true);
              }}
              className="text-foreground/80 hover:text-foreground text-base font-medium py-2 px-3 rounded-lg hover:bg-muted transition-all text-left"
            >
              Leaderboard
            </button>
            
            <Link 
              to="https://github.com/Kumar-Vedant/CrowdGraph"
              target="_blank"
              className="text-foreground/80 hover:text-foreground text-base font-medium py-2 px-3 rounded-lg hover:bg-muted transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contribute
            </Link>

            <div className="border-t border-border pt-3 mt-2 space-y-2">
              {user ? (
                <Link 
                  to={`/profile`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-base font-medium text-foreground">{user.username}</span>
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-base font-semibold hover:bg-primary/90 transition-all shadow-sm">
                      Sign Up
                    </button>
                  </Link>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-muted text-foreground text-base font-medium hover:bg-muted/80 transition-all border border-border">
                      Log In
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar



