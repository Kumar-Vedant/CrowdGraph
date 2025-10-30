import { useEffect, useState } from "react";
import CommunityGrid from "../../components/shared/CommunityGrid";
import SearchBar from "../../components/shared/SearchBar";
import { communities } from "../../services/data";
import type { Community } from "@/schema";
import { searchCommunities } from "@/services/api";
import { useApi } from "@/hooks/apiHook";

function Explore() {
  const [communitiesToShow, setCommunitiesToShow] = useState<Community[]>(communities);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: searchResults,
    loading,
    error,
    callApi: callSearchCommunities,
  } = useApi<Community[]>(searchCommunities);

  // Call API when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setCommunitiesToShow(communities);
    } else {
      callSearchCommunities(searchQuery);
    }
  }, [searchQuery, callSearchCommunities]);

  // Update results when API data changes
  useEffect(() => {
    if (searchResults && searchQuery.trim() !== "") {
      setCommunitiesToShow(searchResults);
    }
  }, [searchResults, searchQuery]);

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#110d1b] tracking-light text-[32px] font-bold leading-tight">
              Explore Communities
            </p>
            <p className="text-[#5f4c9a] text-sm font-normal leading-normal">
              Discover and join communities that align with your interests and expertise.
            </p>
          </div>
        </div>

        <SearchBar
          placeholder="Search for communities"
          onSearch={(query) => setSearchQuery(query)}
        />

        {loading && (
          <p className="text-center text-gray-500 py-6">Loading communities...</p>
        )}

        {error && (
          <p className="text-center text-red-500 py-6">
            Failed to load communities. Please try again.
          </p>
        )}

        {!loading && !error && (
          <CommunityGrid communities={communitiesToShow} />
        )}
      </div>
    </div>
  );
}

export default Explore;
