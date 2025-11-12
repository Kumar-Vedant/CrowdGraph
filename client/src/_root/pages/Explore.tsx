import { useEffect, useState } from "react";
import CommunityGrid from "../../components/shared/CommunityGrid";
import SearchBar from "../../components/shared/SearchBar";
import type { Community } from "@/schema";
import { getFeaturedCommunities, searchCommunities } from "@/services/api";
import { useApi } from "@/hooks/apiHook";

function Explore() {
  const { data: featuredCommunities, loading: loadingFeatured, callApi: callFeaturedCommunities } = useApi(getFeaturedCommunities);
  const { data: searchResults, loading: searchLoading, error: searchError, callApi: callSearchCommunities } = useApi(searchCommunities);

  const [communitiesToShow, setCommunitiesToShow] = useState<Community[]>(featuredCommunities || []);
  const [searchQuery, setSearchQuery] = useState<string>("");
  

  // Load featured communities on mount
  useEffect(() => {
    callFeaturedCommunities();
  }, []);

  // Call API when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setCommunitiesToShow(featuredCommunities || []);
    } else {
      callSearchCommunities(searchQuery);
    }
  }, [searchQuery, featuredCommunities]);

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
            <p className="text-foreground tracking-light text-[32px] font-bold leading-tight">
              Explore Communities
            </p>
            <p className="text-muted-foreground text-sm font-normal leading-normal">
              Discover and join communities that align with your interests and expertise.
            </p>
          </div>
        </div>

        <SearchBar
          placeholder="Search for communities"
          onSearch={(query) => setSearchQuery(query)}
        />

        {(searchLoading || loadingFeatured) && (
          <p className="text-center text-muted-foreground py-6">Loading communities...</p>
        )}

        {searchError && (
          <p className="text-center text-red-500 py-6">
            Failed to load communities. Please try again.
          </p>
        )}

        {!loadingFeatured && !searchError && (
          <CommunityGrid communities={communitiesToShow} />
        )}
      </div>
    </div>
  );
}

export default Explore;




