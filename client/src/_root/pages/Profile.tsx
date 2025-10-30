import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "contributions" | "settings">("overview");

  // Redirect to login only once (no infinite loop)
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "contributions", label: "Contributions" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <div className="flex justify-center px-6 py-8 sm:px-10 lg:px-40">
      <div className="flex flex-col w-full max-w-[960px] gap-6">
        {/* Profile Header */}
        <div className="flex p-4 @container">
          <div className="flex w-full flex-col gap-4 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
            <div className="flex gap-4">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAtXSN3t85yBLBq5hrfrVAbpLrlLfqPZo2qF32zH8nycJvV6kBcZ9qMFUXr23p7cJwRTFSKJjaF14iu4b7C39RXZ5wK6NotGccRWZWkmg06n9cpUITJE60LalBGxPKDrf14fDYnTyLVYA9PBwXzbPmEOGvY3uXs91Ip6fRGw_yzk_N4OdpN-yq8UdWsgLmFFSWmsMr9iP91A6_YbAcVPh6Na6Sdc3VQFnUecK0AS_S3_8Mi9Voh0mDPdUY5A9wgs0nRefq5fV1SoaQ")'
                }}
              ></div>
              <div className="flex flex-col justify-center">
                <p className="text-[#110d1b] text-[22px] font-bold leading-tight tracking-[-0.015em]">{user.username}</p>
                {/* <p className="text-[#5f4c9a] text-base font-normal leading-normal">AI Enthusiast | Knowledge Graph Contributor</p> */}
                <p className="text-[#5f4c9a] text-base font-normal leading-normal">Joined {user?.createdAt.toDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#d5cfe7] gap-6 px-2 sm:px-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`pb-3 pt-4 font-bold text-sm border-b-[3px] transition ${
                activeTab === tab.key
                  ? "border-b-[#4913ec] text-[#110d1b]"
                  : "border-transparent text-[#5f4c9a] hover:text-[#110d1b]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-2">
          {activeTab === "overview" && <Overview />}
          {activeTab === "contributions" && <Contributions />}
          {activeTab === "settings" && <Settings user={user} />}
        </div>
      </div>
    </div>
  );
}

const Overview = () => {
  const [filter, setFilter] = useState<"Owner" | "Admin" | "Member" | "All">("All");

  const communities = [
    { id: 1, name: "AI Innovators", role: "Owner", reputation: 1200 },
    { id: 2, name: "Machine Learning Enthusiasts", role: "Admin", reputation: 870 },
    { id: 3, name: "Data Science Forum", role: "Member", reputation: 340 },
    { id: 4, name: "Deep Learning Hub", role: "Member", reputation: 450 },
  ];

  const roles = ["All", "Owner", "Admin", "Member"] as const;
  const filtered = filter === "All" ? communities : communities.filter(c => c.role === filter);

  return (
    <div>
      <h2 className="text-[#110d1b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        My Communities
      </h2>

      {/* Filter Pills */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {roles.map(role => (
          <button
            key={role}
            className={`px-4 py-1 rounded-full text-sm font-medium transition
              ${filter === role
                ? "bg-[#4913ec] text-white shadow-[0_2px_6px_rgba(73,19,236,0.3)]"
                : "bg-[#eae7f3] text-[#5f4c9a] hover:bg-[#d5cfe7]"}
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
          <div className="text-[#5f4c9a] italic px-2 py-3 rounded-lg bg-[#f9f8fc] text-center">
            No {filter.toLowerCase()} communities found.
          </div>
        ) : (
          filtered.map((community, idx) => (
            <Link to={`/community/${community.id}`} key={idx}>
              <div
                className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-[#d5cfe7] hover:shadow-md transition"
              >
                <div className="flex flex-col">
                <span className="text-[#110d1b] font-semibold text-base">{community.name}</span>
                <span className="text-[#5f4c9a] text-sm mt-1">Reputation: {community.reputation}</span>
              </div>
              <span
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  community.role === "Owner"
                    ? "bg-[#eae7f3] text-[#110d1b]"
                    : community.role === "Admin"
                    ? "bg-[#f2edf9] text-[#3f2b78]"
                    : "bg-[#f9f8fc] text-[#5f4c9a]"
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
      <h2 className="text-[#110d1b] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Contribution History
      </h2>

      {/* Filter Tabs */}
      <div className="flex px-4 py-3">
        <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#eae7f3] p-1">
          {["Approved", "Pending"].map((status) => (
            <label
              key={status}
              className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-medium leading-normal transition-all
                ${
                  filter === status
                    ? "bg-[#f9f8fc] shadow-[0_0_4px_rgba(0,0,0,0.1)] text-[#110d1b]"
                    : "text-[#5f4c9a]"
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
        <div className="flex overflow-hidden rounded-lg border border-[#d5cfe7] bg-[#f9f8fc]">
          <table className="flex-1">
            <thead>
              <tr className="bg-[#f9f8fc]">
                <th className="px-4 py-3 text-left text-[#110d1b] w-[400px] text-sm font-medium leading-normal">
                  Contribution
                </th>
                <th className="px-4 py-3 text-left text-[#110d1b] w-[400px] text-sm font-medium leading-normal">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-[#110d1b] w-60 text-sm font-medium leading-normal">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr key={i} className="border-t border-t-[#d5cfe7]">
                  <td className="h-[72px] px-4 py-2 w-[400px] text-[#110d1b] text-sm font-normal leading-normal">
                    {item.title}
                  </td>
                  <td className="h-[72px] px-4 py-2 w-[400px] text-[#5f4c9a] text-sm font-normal leading-normal">
                    {item.date}
                  </td>
                  <td className="h-[72px] px-4 py-2 w-60 text-sm font-normal leading-normal">
                    <button
                      className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 w-full
                        ${
                          item.status === "Approved"
                            ? "bg-[#eae7f3] text-[#110d1b]"
                            : "bg-[#fff2cc] text-[#7a5d00]"
                        } text-sm font-medium leading-normal`}
                    >
                      <span className="truncate">{item.status}</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-[#5f4c9a] text-sm italic">
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
  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-[#110d1b] text-xl sm:text-2xl font-bold pb-3">Settings</h2>
      <p className="text-[#5f4c9a] text-sm pb-4">Manage your account settings and preferences.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#110d1b]">Username</label>
          <input
            type="text"
            defaultValue={user.username}
            className="mt-1 block w-full rounded-lg border border-[#d5cfe7] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#110d1b]">Email</label>
          <input
            type="email"
            defaultValue={user.email}
            disabled
            className="mt-1 block w-full rounded-lg border border-[#d5cfe7] bg-gray-50 px-3 py-2 text-sm"
          />
        </div>

        <button className="mt-3 bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-2 rounded-lg transition">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;
