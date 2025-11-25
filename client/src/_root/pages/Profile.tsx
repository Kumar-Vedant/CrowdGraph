import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/apiHook";
import { getCommunitiesOfUser } from "@/services/api";
import type { Community } from "@/schema";
import { themes } from "@/theme/themes";

function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "contributions" | "settings">("overview");
  const { logout } = useAuth();

  // Redirect to login only once (no infinite loop)
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const { data: communities, callApi: fetchCommunities } = useApi(getCommunitiesOfUser);

  useEffect(() => {
    if (user) {
      fetchCommunities(user.id);
    }
  }, [user, fetchCommunities]);

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "contributions", label: "Contributions" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <div className="flex justify-center px-6 py-8 sm:px-10 lg:px-40">
      <div className="flex flex-col w-full max-w-[960px] gap-6">
        {/* Profile Header */}
        <div className="flex items-center p-4 @container">
          <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
            <div className="flex gap-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                style={{
                  backgroundImage: 'url("https://i.pinimg.com/236x/b6/2f/dc/b62fdc1469056818b6f6aa017afc3134.jpg")'
                }}
              ></div>
              <div className="flex flex-col justify-center">
                <p className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em]">{user.username}</p>
                {/* <p className="text-muted-foreground text-base font-normal leading-normal">AI Enthusiast | Knowledge Graph Contributor</p> */}
                <p className="text-muted-foreground text-base font-normal leading-normal">Joined {user?.createdAt}</p>
              </div>
            </div>
            <button 
              onClick={() => logout()}
              className="flex items-center justify-center gap-2 bg-destructive hover:bg-destructive/90 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md h-fit self-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border gap-6 px-2 sm:px-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`pb-3 pt-4 font-bold text-sm border-b-[3px] transition ${
                activeTab === tab.key
                  ? "border-b-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-2">
          {activeTab === "overview" && <Overview communities={communities || []} />}
          {activeTab === "contributions" && <Contributions />}
          {activeTab === "settings" && <Settings user={user} />}
        </div>
      </div>
    </div>
  );
}

const Overview = ({ communities }: { communities: Community[] }) => {
  const [filter, setFilter] = useState<"Owner" | "Admin" | "Member" | "All">("All");

  const roles = ["All", "Owner", "Admin", "Member"] as const;
  const filtered = filter === "All" ? communities : communities.filter(c => c.role === filter.toUpperCase());
  
  return (
    <div>
      <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        My Communities
      </h2>

      {/* Filter Pills */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {roles.map(role => (
          <button
            key={role}
            className={`px-4 py-1 rounded-full text-sm font-medium transition
              ${filter === role
                ? "bg-primary text-white shadow-[0_2px_6px_rgba(147,51,234,0.3)]"
                : "bg-muted text-muted-foreground hover:bg-muted/80"}
            `}
            onClick={() => setFilter(role)}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Communities List */}
      <div className="px-4 py-3 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-muted-foreground italic px-2 py-3 rounded-lg bg-muted text-center">
            No {filter.toLowerCase()} communities found.
          </div>
        ) : (
          filtered.map((community, idx) => (
            <Link to={`/community/${community.id}`} key={idx}>
              <div
                className="flex justify-between items-center p-4 bg-card rounded-lg shadow-sm border border-border hover:shadow-md transition"
              >
                <div className="flex flex-col">
                <span className="text-foreground font-semibold text-base">{community.title}</span>
                <span className="text-muted-foreground text-sm mt-1">Role: {community.role || 'Member'}</span>
              </div>
              <span
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  community.role === "Owner"
                    ? "bg-primary/10 text-primary"
                    : community.role === "Admin"
                    ? "bg-secondary/10 text-secondary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {community.role}
              </span>
            </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};


const Contributions = () => {
  const [filter, setFilter] = useState<"Approved" | "Pending">("Approved");

  const contributions = [
    { title: "Added new AI concept: Neural Networks", date: "2023-08-15", status: "Approved" },
    { title: "Updated existing concept: Machine Learning Algorithms", date: "2023-07-22", status: "Approved" },
    { title: "Reviewed contribution: Natural Language Processing", date: "2023-06-10", status: "Approved" },
    { title: "Suggested new concept: Generative AI Ethics", date: "2023-10-12", status: "Pending" },
  ];

  const filtered = contributions.filter((c) => c.status === filter);

  return (
    <div>
      <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Contribution History
      </h2>

      {/* Filter Tabs */}
      <div className="flex px-4 py-3">
        <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-muted p-1">
          {["Approved", "Pending"].map((status) => (
            <label
              key={status}
              className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-all
                ${
                  filter === status
                    ? "bg-background shadow-[0_0_4px_rgba(0,0,0,0.1)] text-foreground"
                    : "text-muted-foreground"
                }`}
            >
              <span className="truncate">{status}</span>
              <input
                type="radio"
                name="filter-status"
                className="invisible w-0"
                value={status}
                checked={filter === status}
                onChange={() => setFilter(status as "Approved" | "Pending")}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="px-4 py-3 @container">
        <div className="flex overflow-hidden rounded-lg border border-border bg-card">
          <table className="flex-1">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-3 text-left text-foreground w-[400px] text-sm font-medium leading-normal">
                  Contribution
                </th>
                <th className="px-4 py-3 text-left text-foreground w-[400px] text-sm font-medium leading-normal">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-foreground w-60 text-sm font-medium leading-normal">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={i} className="border-t border-t-border">
                  <td className="h-[72px] px-4 py-2 w-[400px] text-foreground text-sm font-normal leading-normal">
                    {item.title}
                  </td>
                  <td className="h-[72px] px-4 py-2 w-[400px] text-muted-foreground text-sm font-normal leading-normal">
                    {item.date}
                  </td>
                  <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                    <button
                      className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 w-full
                        ${
                          item.status === "Approved"
                            ? "bg-muted text-foreground"
                            : "bg-warning/20 text-warning-foreground"
                        } text-sm font-medium leading-normal`}
                    >
                      <span className="truncate">{item.status}</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground text-sm italic">
                    No {filter.toLowerCase()} contributions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Settings = ({ user }: { user: any }) => {
  const { currentTheme, setTheme, colorFamily, mode } = useTheme();
  
  const colorThemes = [
    { color: 'purple', label: 'Purple', primary: '#9333ea', secondary: '#c084fc', accent: '#a855f7' },
    { color: 'blue', label: 'Blue', primary: '#0ea5e9', secondary: '#0c4a6e', accent: '#06b6d4' },
    { color: 'gray', label: 'Gray Stone', primary: '#4B5563', secondary: '#6B7280', accent: '#7F8287' },
    { color: 'pink', label: 'Pink', primary: '#ec4899', secondary: '#be185d', accent: '#f472b6' },
  ];
  
  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-foreground text-xl sm:text-2xl font-bold pb-3">Settings</h2>
      <p className="text-muted-foreground text-sm pb-4">Manage your account settings and preferences.</p>

      <div className="space-y-6">
        {/* Account Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Account</h3>
          <div>
            <label className="block text-sm font-medium text-foreground">Username</label>
            <input
              type="text"
              defaultValue={user.username}
              className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              defaultValue={user.password}
              className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Theme Settings */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
          <p className="text-sm text-muted-foreground">Choose your preferred color theme. You can toggle between light and dark mode using the button in the navbar.</p>
          
          {/* Color Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Color Theme</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {colorThemes.map((theme) => {
                const isActive = colorFamily === theme.color;
                
                return (
                  <button
                    key={theme.color}
                    onClick={() => setTheme(`${theme.color}-${mode}`)}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      isActive
                        ? 'border-primary shadow-lg scale-105 bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:shadow-md'
                    }`}
                  >
                    {/* Theme Preview */}
                    <div className="flex gap-1 mb-3 justify-center">
                      <div
                        className="w-6 h-6 rounded-full shadow-sm"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full shadow-sm"
                        style={{ backgroundColor: theme.secondary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full shadow-sm"
                        style={{ backgroundColor: theme.accent }}
                      />
                    </div>
                    
                    {/* Theme Icon & Name */}
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-sm font-semibold text-foreground">
                        {theme.label}
                      </p>
                    </div>
                    
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute top-2 right-2">
                        <svg
                          className="w-5 h-5 text-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Current Mode Display */}
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Current mode:</span>
            <span className="text-sm font-semibold text-foreground flex items-center gap-1">
              {mode === 'light' ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                  Light
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  Dark
                </>
              )}
            </span>
            <span className="text-xs text-muted-foreground ml-auto">Use the navbar toggle to switch</span>
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <button className="bg-primary hover:bg-primary/90 text-white text-sm px-4 py-2 rounded-lg transition">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;