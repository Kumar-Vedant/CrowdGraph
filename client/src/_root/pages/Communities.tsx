import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommunityGrid from "../../components/shared/CommunityGrid";
import SearchBar from "../../components/shared/SearchBar";
import type { Community } from "@/schema";
import { getFeaturedCommunities, searchCommunities, createCommunity } from "@/services/api";
import { useApi } from "@/hooks/apiHook";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function Communities() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: featuredCommunities, loading: loadingFeatured, callApi: callFeaturedCommunities } = useApi(getFeaturedCommunities);
  const { data: searchResults, loading: searchLoading, error: searchError, callApi: callSearchCommunities } = useApi(searchCommunities);

  const [communitiesToShow, setCommunitiesToShow] = useState<Community[]>(featuredCommunities || []);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communityTitle, setCommunityTitle] = useState<string>("");
  const [communityDescription, setCommunityDescription] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  

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

  // Handle create community
  const handleCreateCommunity = async () => {
    if (!user) {
      toast.error("You must be logged in to create a community!");
      return;
    }

    if (!communityTitle.trim()) {
      toast.error("Community title is required!");
      return;
    }

    if (!communityDescription.trim()) {
      toast.error("Community description is required!");
      return;
    }

    setIsCreating(true);
    try {
      const response = await createCommunity(
        communityTitle.trim(),
        communityDescription.trim(),
        user.id
      );

      if (response?.success) {
        toast.success("Community created successfully!");
        setIsModalOpen(false);
        setCommunityTitle("");
        setCommunityDescription("");
        // Refresh communities list
        await callFeaturedCommunities();
        // Navigate to the new community
        if (response.data?.id) {
          navigate(`/CommunityDashboard/${response.data.id}`);
        }
      } else {
        toast.error(response?.error || "Failed to create community!");
      }
    } catch (error) {
      toast.error("Error creating community!");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-foreground tracking-light text-2xl sm:text-[28px] md:text-[32px] font-bold leading-tight">
              Explore Communities
            </p>
            <p className="text-muted-foreground text-xs sm:text-sm font-normal leading-normal">
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

      {/* Floating Add Community Button */}
      {user && (
        <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-40">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-110"
                onClick={() => setIsModalOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="48px"
                  viewBox="0 -960 960 960"
                  width="48px"
                  fill="#fefefe"
                >
                  <path d="M450-450H200v-60h250v-250h60v250h250v60H510v250h-60v-250Z" />
                </svg>
              </Button>
            </DialogTrigger>

            <DialogContent className="w-[95vw] sm:max-w-[450px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Create New Community
                </DialogTitle>
                <DialogDescription>
                  Start a new community to share knowledge and collaborate with others.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <Input
                  placeholder="Community Title (required)"
                  value={communityTitle}
                  onChange={(e) => setCommunityTitle(e.target.value)}
                  disabled={isCreating}
                />

                <Textarea
                  placeholder="Community Description (required)"
                  value={communityDescription}
                  onChange={(e) => setCommunityDescription(e.target.value)}
                  disabled={isCreating}
                  className="min-h-[100px]"
                />

                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleCreateCommunity}
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create Community"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default Communities;

