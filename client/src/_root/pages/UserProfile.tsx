import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/apiHook";
import { getUserById, getCommunitiesOfUser } from "@/services/api";
import type { Community, User } from "@/schema";

function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "contributions">("overview");

  const { data: profileUser, loading: userLoading, error: userError, callApi: fetchUser } = useApi<User>(getUserById);
  const { data: communities, loading: communitiesLoading, callApi: fetchCommunities } = useApi(getCommunitiesOfUser);

  useEffect(() => {
    if (userId) {
      fetchUser(userId);
      fetchCommunities(userId);
    }
  }, [userId]);

  // If viewing own profile, redirect to /profile
  useEffect(() => {
    if (currentUser && userId === currentUser.id) {
      navigate("/profile");
    }
  }, [currentUser, userId, navigate]);

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "contributions", label: "Contributions" },
  ];

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (userError || !profileUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The user you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
          >
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4 sm:px-6 md:px-10 lg:px-40 py-8">
      <div className="flex flex-col w-full max-w-[960px] gap-6">
        {/* Profile Header */}
        <div className="flex items-center p-4 @container">
          <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
            <div className="flex gap-4">
              <div className="bg-linear-to-br from-primary to-accent rounded-full min-h-24 w-24 sm:min-h-32 sm:w-32 flex items-center justify-center text-white font-bold text-3xl sm:text-4xl shadow-lg">
                {profileUser.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-foreground text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em]">
                  {profileUser.username}
                </p>
                <p className="text-muted-foreground text-sm sm:text-base font-normal leading-normal">
                  Joined {new Date(profileUser.createdAt).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <svg className="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-foreground font-bold text-lg">
                    {profileUser.reputation || 0}
                  </span>
                  <span className="text-muted-foreground text-sm">Reputation</span>
                </div>
              </div>
            </div>
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
          {activeTab === "overview" && (
            <Overview 
              communities={communities || []} 
              loading={communitiesLoading}
              username={profileUser.username}
            />
          )}
          {activeTab === "contributions" && (
            <Contributions username={profileUser.username} />
          )}
        </div>
      </div>
    </div>
  );
}

const Overview = ({ 
  communities, 
  loading,
  username 
}: { 
  communities: Community[];
  loading: boolean;
  username: string;
}) => {
  const [filter, setFilter] = useState<"Owner" | "Admin" | "Member" | "All">("All");

  const roles = ["All", "Owner", "Admin", "Member"] as const;
  const filtered = filter === "All" ? communities : communities.filter(c => c.role === filter.toUpperCase());

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 sm:p-6">
          <p className="text-muted-foreground text-sm font-medium">Communities Joined</p>
          <p className="text-foreground text-2xl sm:text-3xl font-bold">{communities.length}</p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 sm:p-6">
          <p className="text-muted-foreground text-sm font-medium">Total Contributions</p>
          <p className="text-foreground text-2xl sm:text-3xl font-bold">0</p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 sm:p-6">
          <p className="text-muted-foreground text-sm font-medium">Validated Proposals</p>
          <p className="text-foreground text-2xl sm:text-3xl font-bold">0</p>
        </div>
      </div>

      {/* Communities Section */}
      <div className="px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-foreground text-xl sm:text-[22px] font-bold">Communities</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => setFilter(role)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                  filter === role
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-muted rounded-lg border-2 border-dashed border-border">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/60 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-muted-foreground text-sm sm:text-base font-medium">
              {username} hasn't joined any communities yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((community) => (
              <Link 
                key={community.id} 
                to={`/community/${community.id}`}
                className="block"
              >
                <div className="flex flex-col gap-3 p-4 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-foreground font-semibold text-base sm:text-lg flex-1">{community.title}</h3>
                    <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${
                      community.role === "Owner"
                        ? "bg-primary/20 text-primary"
                        : community.role === "Admin"
                        ? "bg-accent/20 text-accent"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {community.role || "Member"}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">{community.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(community.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Contributions = ({ username }: { username: string }) => {
  return (
    <div className="px-4">
      <div className="flex flex-col items-center justify-center py-16 bg-muted rounded-lg border-2 border-dashed border-border">
        <svg className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground/60 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No Contributions Yet</h3>
        <p className="text-muted-foreground text-sm sm:text-base text-center max-w-md px-4">
          {username}'s contributions to knowledge graphs will appear here
        </p>
      </div>
    </div>
  );
};

export default UserProfile;