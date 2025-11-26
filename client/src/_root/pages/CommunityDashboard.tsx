import { useNavigate, useParams, Link } from "react-router-dom";
import SearchBar from "../../components/shared/SearchBar";
import { CommunityFeed } from "@/components/shared/CommunityFeed";
import { ContributionQueueSection, ContributionQueueModal } from "@/components/shared/ContributionQueue";
import { toast } from "sonner";
import {
  getUserById,
  getUsersInCommunity,
  searchCommunityById,
  joinCommunity,
  leaveCommunity,
  getGraphProposalsInCommunity,
  voteNodeProposal,
  voteEdgeProposal,
  getGraphInCommunity,
  createNodeProposal,
  createEdgeProposal,
  updateCommunity,
  deleteCommunity,
} from "@/services/api";
import { useApi } from "@/hooks/apiHook";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type {
  User,
  Node,
  Edge,
  GraphProposals,
} from "@/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import KnowledgeGraph from "@/components/shared/KnowledgeGraph";

// Community Feed Component
function CommunityFeedSection({
  communityId,
  isMember,
}: {
  communityId: string;
  isMember: boolean;
}) {
  return (
    <div className="flex-1 min-w-0">
      <h2 className="text-foreground text-lg sm:text-xl md:text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Community Feed
      </h2>
      <CommunityFeed communityId={communityId} isMember={isMember} />
    </div>
  );
}

function CommunityDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const { communityId } = useParams<{ communityId: string }>();
  const {
    data: communityData,
    loading: communityLoading,
    error: communityError,
    callApi: callCommunityApi,
  } = useApi(searchCommunityById);
  const {
    data: communityMembers,
    loading: membersLoading,
    callApi: callMembersApi,
  } = useApi(getUsersInCommunity);
  const {
    data: ownerData,
    loading: ownerLoading,
    callApi: callOwnerApi,
  } = useApi(getUserById);
  const { loading: joinLoading, callApi: callJoinApi } = useApi(joinCommunity);
  const { loading: leaveLoading, callApi: callLeaveApi } =
    useApi(leaveCommunity);
  const {
    data: proposalsResponse,
    loading: proposalsLoading,
    callApi: callProposalsApi,
  } = useApi(getGraphProposalsInCommunity);
  const { callApi: callVoteNodeApi } = useApi(voteNodeProposal);
  const { callApi: callVoteEdgeApi } = useApi(voteEdgeProposal);
  const {
    data: graphData,
    loading: graphLoading,
    callApi: callGraphApi,
  } = useApi(getGraphInCommunity);

  const proposalsData = proposalsResponse as GraphProposals | null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isContributionQueueModalOpen, setIsContributionQueueModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState<{ type: 'node' | 'edge'; data: any; properties: { key: string; value: string }[] } | null>(null);
  const [isMemberOfCommunity, setIsMemberOfCommunity] = useState(false);
  const [isOwnerSettingsModalOpen, setIsOwnerSettingsModalOpen] = useState(false);
  const [ownerSettingsTitle, setOwnerSettingsTitle] = useState<string>("");
  const [ownerSettingsDescription, setOwnerSettingsDescription] = useState<string>("");
  const [isUpdatingCommunity, setIsUpdatingCommunity] = useState(false);
  const [isDeletingCommunity, setIsDeletingCommunity] = useState(false);

  // Check if user is a member
  useEffect(() => {
    if (communityMembers && user) {
      const isMember =
        Array.isArray(communityMembers) &&
        communityMembers.some((member: User) => member.id === user.id);
      setIsMemberOfCommunity(isMember);
    }
  }, [communityMembers, user]);

  // Initialize owner settings modal values
  useEffect(() => {
    if (communityData) {
      setOwnerSettingsTitle(communityData.title);
      setOwnerSettingsDescription(communityData.description);
    }
  }, [communityData]);

  // --- Vote handler ---
  const handleVote = async (proposalId: string, proposalType: 'node' | 'edge', voteValue: number) => {
    if (!user) {
      toast.error("You must be logged in to vote.");
      return;
    }

    try {
      let response;
      if (proposalType === 'node') {
        response = await callVoteNodeApi(proposalId, voteValue, user.id);
      } else {
        response = await callVoteEdgeApi(proposalId, voteValue, user.id);
      }
      
      // Show success toast based on response
      if (!response.success) {
        toast.error(response.error || "Failed to vote. Please try again.");
      } else if (voteValue === 1) {
        toast.success("Upvoted!");
      } else if (voteValue === -1) {
        toast.success("Downvoted!");
      } else {
        toast.success("Vote cleared!");
      }
    
      // Refresh proposals after voting
      if (communityId) {
        await callProposalsApi(communityId);
      }
    } catch (error) {
      toast.error("Failed to vote. Please try again.");
    }
  };

  // --- Join/Leave handlers ---
  const handleJoinCommunity = async () => {
    if (!user || !communityId) return;
    try {
      await callJoinApi(communityId, user.id);
      // Refresh community members list
      await callMembersApi(communityId);
      toast.success("Successfully joined community!");
    } catch (error) {
      toast.error("Failed to join community. Please try again.");
    }
  };

  const handleLeaveCommunity = async () => {
    if (!user || !communityId) return;
    try {
      await callLeaveApi(communityId, user.id);
      // Refresh community members list
      await callMembersApi(communityId);
      toast.success("Successfully left community!");
    } catch (error) {
      toast.error("Failed to leave community. Please try again.");
    }
  };

  // --- Owner handlers ---
  const handleUpdateCommunity = async () => {
    if (!communityId) return;

    if (!ownerSettingsTitle.trim()) {
      toast.error("Community title is required!");
      return;
    }

    if (!ownerSettingsDescription.trim()) {
      toast.error("Community description is required!");
      return;
    }

    setIsUpdatingCommunity(true);
    try {
      const response = await updateCommunity(
        communityId,
        ownerSettingsTitle.trim(),
        ownerSettingsDescription.trim()
      );

      if (response?.success) {
        toast.success("Community updated successfully!");
        await callCommunityApi(communityId);
      } else {
        toast.error(response?.error || "Failed to update community!");
      }
    } catch (error) {
      toast.error("Error updating community!");
    } finally {
      setIsUpdatingCommunity(false);
    }
  };

  const handleDeleteCommunity = async () => {
    if (!communityId) return;

    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this community? This action cannot be undone.")) {
      return;
    }

    setIsDeletingCommunity(true);
    try {
      const response = await deleteCommunity(communityId);

      if (response?.success) {
        toast.success("Community deleted successfully!");
        setIsOwnerSettingsModalOpen(false);
        navigate("/Communities");
      } else {
        toast.error(response?.error || "Failed to delete community!");
      }
    } catch (error) {
      toast.error("Error deleting community!");
    } finally {
      setIsDeletingCommunity(false);
    }
  };

  // Get members sorted by reputation
  const getSortedMembers = () => {
    if (!Array.isArray(communityMembers)) return [];
    return [...communityMembers].sort((a, b) => {
      const repA = a.reputation || 0;
      const repB = b.reputation || 0;
      return repB - repA; // Descending order
    });
  };

  // --- Node state ---
  const [nodeLabels, setNodeLabels] = useState<string[]>([]);
  const [nodeName, setNodeName] = useState<string>("");
  const [nodeProperties, setNodeProperties] = useState<
    { key: string; value: string }[]
  >([{ key: "", value: "" }]);

  // --- Edge state ---
  const [edgeData, setEdgeData] = useState<Partial<Edge>>({});
  const [edgeProperties, setEdgeProperties] = useState<
    { key: string; value: string }[]
  >([{ key: "", value: "" }]);

  // --- Node property handlers ---
  const addNodeProperty = () =>
    setNodeProperties([...nodeProperties, { key: "", value: "" }]);

  const removeNodeProperty = (index: number) => {
    setNodeProperties(nodeProperties.filter((_, i) => i !== index));
  };

  const handleNodePropertyChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...nodeProperties];
    updated[index][field] = value;
    setNodeProperties(updated);
  };

  // --- Edge property handlers ---
  const addEdgeProperty = () =>
    setEdgeProperties([...edgeProperties, { key: "", value: "" }]);

  const removeEdgeProperty = (index: number) =>
    setEdgeProperties(edgeProperties.filter((_, i) => i !== index));

  const handleEdgePropertyChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...edgeProperties];
    updated[index][field] = value;
    setEdgeProperties(updated);
  };

  // --- Node submit ---
  const handleNodeSubmit = async () => {
    if (!nodeName.trim()) {
      toast.error("Node name is required!");
      return;
    }

    // Ensure no property has a key but no value
    for (const prop of nodeProperties) {
      if (prop.key.trim() && !prop.value.trim()) {
        toast.error(`Property "${prop.key}" must have a value!`);
        return;
      }
    }

    const formattedProps: { [key: string]: any } = {};
    nodeProperties
      .filter((p) => p.key.trim() && p.value.trim())
      .forEach((p) => {
        formattedProps[p.key.trim()] = p.value;
      });

    // Validate that at least 1 property is mandatory
    if (Object.keys(formattedProps).length === 0) {
      toast.error("At least one property is mandatory for a node!");
      return;
    }

    try {
      // Create node proposal with CREATE type
      const response = await createNodeProposal(
        communityId!,
        user?.id!,
        nodeName.trim(),
        nodeLabels.filter((l) => l.trim()),
        formattedProps,
        "CREATE"
      );

      if (response?.success) {
        toast.success("Node proposal created successfully!");
        setIsModalOpen(false);
        setNodeLabels([]);
        setNodeName("");
        setNodeProperties([{ key: "", value: "" }]);
        // Refresh proposals
        if (communityId) {
          callProposalsApi(communityId);
        }
      } else {
        toast.error(response?.error || "Failed to create node proposal!");
      }
    } catch (err) {
      toast.error("Error creating node proposal!");
    }
  };

  // --- Edge submit ---
  const handleEdgeSubmit = async () => {
    if (!edgeData.sourceId || !edgeData.targetId || !edgeData.type) {
      toast.error("Edge source, target, and type are mandatory!");
      return;
    }

    // Ensure no property has a key but no value
    for (const prop of edgeProperties) {
      if (prop.key.trim() && !prop.value.trim()) {
        toast.error(`Property "${prop.key}" must have a value!`);
        return;
      }
    }

    const formattedProps: { [key: string]: any } = {};
    edgeProperties
      .filter((p) => p.key.trim() && p.value.trim())
      .forEach((p) => {
        formattedProps[p.key.trim()] = p.value;
      });

    // Validate that at least 1 property is mandatory
    if (Object.keys(formattedProps).length === 0) {
      toast.error("At least one property is mandatory for an edge!");
      return;
    }

    try {
      // Create edge proposal with CREATE type
      const response = await createEdgeProposal(
        communityId!,
        user?.id!,
        edgeData.sourceId,
        edgeData.targetId,
        edgeData.type,
        formattedProps,
        "CREATE"
      );

      if (response?.success) {
        toast.success("Edge proposal created successfully!");
        setIsModalOpen(false);
        setEdgeData({});
        setEdgeProperties([{ key: "", value: "" }]);
        // Refresh proposals
        if (communityId) {
          callProposalsApi(communityId);
        }
      } else {
        toast.error(response?.error || "Failed to create edge proposal!");
      }
    } catch (err) {
      toast.error("Error creating edge proposal!");
    }
  };

  // --- Handle node/edge update ---
  const handleGraphUpdate = async (type: 'node' | 'edge', data: any) => {
    try {
      if (type === 'node') {
        const response = await createNodeProposal(
          communityId!,
          user?.id!,
          data.label,
          data.labels || [],
          data.details?.reduce((acc: any, d: any) => ({ ...acc, [d.key]: d.value }), {}) || {},
          "UPDATE",
          data.id
        );
        if (response?.success) {
          toast.success("Node update proposal created!");
          if (communityId) callProposalsApi(communityId);
        } else {
          toast.error(response?.error || "Failed to create update proposal");
        }
      } else {
        const response = await createEdgeProposal(
          communityId!,
          user?.id!,
          data.source?.id || data.sourceId,
          data.target?.id || data.targetId,
          data.label,
          data.details?.reduce((acc: any, d: any) => ({ ...acc, [d.key]: d.value }), {}) || {},
          "UPDATE",
          data.id
        );
        if (response?.success) {
          toast.success("Edge update proposal created!");
          if (communityId) callProposalsApi(communityId);
        } else {
          toast.error(response?.error || "Failed to create update proposal");
        }
      }
    } catch (err) {
      toast.error("Error creating update proposal");
    }
  };

  // --- Open edit modal from graph ---
  const handleOpenEditModal = (type: 'node' | 'edge', data: any) => {
    console.log("Edit modal opened with data:", { type, data });
    const properties = data.details || Object.entries(data.properties || {}).map(([key, value]) => ({ key, value }));
    setEditModalData({
      type,
      data,
      properties: Array.isArray(properties) ? properties : [],
    });
    setIsEditModalOpen(true);
  };

  // --- Handle node/edge delete ---
  const handleGraphDelete = async (type: 'node' | 'edge', nodeOrEdgeData: any) => {
    try {
      if (type === 'node') {
        const response = await createNodeProposal(
          communityId!,
          user?.id!,
          nodeOrEdgeData.label || "",
          [],
          {},
          "DELETE",
          nodeOrEdgeData.id
        );
        if (response?.success) {
          toast.success("Node delete proposal created!");
          if (communityId) callProposalsApi(communityId);
        } else {
          toast.error(response?.error || "Failed to create delete proposal");
        }
      } else {
        const response = await createEdgeProposal(
          communityId!,
          user?.id!,
          nodeOrEdgeData.source?.id || nodeOrEdgeData.sourceId || "",
          nodeOrEdgeData.target?.id || nodeOrEdgeData.targetId || "",
          nodeOrEdgeData.label || "",
          {},
          "DELETE",
          nodeOrEdgeData.id
        );
        if (response?.success) {
          toast.success("Edge delete proposal created!");
          if (communityId) callProposalsApi(communityId);
        } else {
          toast.error(response?.error || "Failed to create delete proposal");
        }
      }
    } catch (err) {
      toast.error("Error creating delete proposal");
    }
  };

  // --- API calls ---
  useEffect(() => {
    if (communityId) {
      callCommunityApi(communityId);
      callProposalsApi(communityId);
      callGraphApi(communityId);
    }
  }, [communityId]);

  useEffect(() => {
    if (communityData?.ownerId && communityId) {
      callMembersApi(communityId);
      callOwnerApi(communityData.ownerId);
    }
  }, [communityData?.ownerId, communityId]);

  // --- Loading states ---
  if (communityLoading)
    return (
      <div className="flex items-center justify-center h-full p-40">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );

  if (communityError || !communityData)
    return (
      <div className="flex items-center justify-center h-full p-40">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Community not found
          </h2>
          <p className="text-muted-foreground mb-4">
            {communityError ||
              "This community doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/Communities")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to Communities
          </button>
        </div>
      </div>
    );

  const memberCount = Array.isArray(communityMembers)
    ? communityMembers.length
    : 0;

  return (
    <div>
      <div className="gap-1 px-4 sm:px-6 md:px-8 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col lg:flex-row gap-6 max-w-[1400px] w-full">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4">
              <div className="flex flex-col gap-3 flex-1">
                <p className="text-foreground tracking-light text-xl sm:text-2xl md:text-[32px] font-bold leading-tight">
                  {communityData.title}
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm font-normal">
                  Owner:{" "}
                  {ownerLoading ? "Loading..." : ownerData?.username || "Unknown"}{" "}
                  · Created at:{" "}
                  {new Date(communityData.createdAt).toLocaleDateString()}
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm font-normal">
                  {communityData.description}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-muted-foreground text-xs sm:text-sm font-normal">
                    {membersLoading
                      ? "Loading members..."
                      : `${memberCount} member${memberCount !== 1 ? "s" : ""}`}
                  </p>
                  {!membersLoading && memberCount > 0 && (
                    <button
                      className="flex w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-7 px-4 bg-primary/50 text-white text-xs sm:text-sm font-medium leading-normal hover:bg-primary/20 transition-all"
                      onClick={() => setIsMembersModalOpen(true)}
                    >
                      View Members
                    </button>
                  )}
                  {user?.id === communityData?.ownerId ? (
                    // Owner options
                    <Dialog open={isOwnerSettingsModalOpen} onOpenChange={setIsOwnerSettingsModalOpen}>
                      <DialogTrigger asChild>
                        <button className="flex w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-7 px-4 bg-accent/50 text-accent-foreground text-xs sm:text-sm font-medium leading-normal hover:bg-accent/20 transition-all">
                          <span className="truncate">Community Settings</span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="w-[95vw] sm:max-w-[500px] rounded-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-semibold">
                            Community Settings
                          </DialogTitle>
                          <DialogDescription>
                            Update or delete your community.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-foreground block mb-2">
                              Community Title
                            </label>
                            <Input
                              placeholder="Community Title"
                              value={ownerSettingsTitle}
                              onChange={(e) => setOwnerSettingsTitle(e.target.value)}
                              disabled={isUpdatingCommunity || isDeletingCommunity}
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-foreground block mb-2">
                              Community Description
                            </label>
                            <Textarea
                              placeholder="Community Description"
                              value={ownerSettingsDescription}
                              onChange={(e) => setOwnerSettingsDescription(e.target.value)}
                              disabled={isUpdatingCommunity || isDeletingCommunity}
                              className="min-h-[100px]"
                            />
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setIsOwnerSettingsModalOpen(false)}
                              className="flex-1"
                              disabled={isUpdatingCommunity || isDeletingCommunity}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="flex-1 bg-primary hover:bg-primary/90"
                              onClick={handleUpdateCommunity}
                              disabled={isUpdatingCommunity || isDeletingCommunity}
                            >
                              {isUpdatingCommunity ? "Updating..." : "Update Community"}
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteCommunity}
                              disabled={isUpdatingCommunity || isDeletingCommunity}
                            >
                              {isDeletingCommunity ? "Deleting..." : "Delete"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : isMemberOfCommunity ? (
                    <button
                      className="flex w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-7 px-4 bg-muted text-foreground text-xs sm:text-sm font-medium leading-normal hover:bg-muted/50 transition-all"
                      onClick={handleLeaveCommunity}
                      disabled={leaveLoading}
                    >
                      <span className="truncate">
                        {leaveLoading ? "Leaving..." : "Leave Community"}
                      </span>
                    </button>
                  ) : (
                    <button
                      className="flex w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-xs sm:text-sm font-medium leading-normal hover:bg-primary/90 transition-all"
                      onClick={handleJoinCommunity}
                      disabled={joinLoading}
                    >
                      <span className="truncate">
                        {joinLoading ? "Joining..." : "Join Community"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            {isMemberOfCommunity ? (
                <SearchBar
                  placeholder="Search Query"
                  onSearch={(query) => {
                    console.log("Searching for:", query);
                  }}
                />
              ) : (
                <div className="p-3 sm:p-4 bg-muted border-2 border-dashed border-border rounded-lg text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <span className="font-semibold">Join this community</span> to search the knowledge graph.
                  </p>
                </div>
              )}
              {/* Knowledge Graph Section */}
            <div className="w-full lg:flex-1 lg:max-w-[500px]">
              <div className="bg-card rounded-lg shadow-sm p-4 relative">
                <h2 className="text-foreground text-lg sm:text-xl font-bold mb-4">
                  Knowledge Graph
                </h2>
                <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden rounded-lg">
                  <KnowledgeGraph 
                    onExpand={() => setIsGraphModalOpen(true)} 
                    isExpanded={false} 
                    graphData={graphData || { nodes: [], edges: [] }} 
                    onUpdate={handleGraphUpdate}
                    onDelete={handleGraphDelete}
                    onOpenEditModal={handleOpenEditModal}
                  />
                </div>
              </div>
            </div>
          </div>


          {/* Main Content - Feed and Contribution Queue */}
          {/* Tabbed layout for small screens */}
          <div className="lg:hidden w-full px-4">
            <Tabs defaultValue="feed" className="w-full">
              <TabsList className="grid w-full flex-1 grid-cols-2">
                <TabsTrigger value="feed" className="text-xs sm:text-sm truncate">
                  Feed
                </TabsTrigger>
                <TabsTrigger value="queue" className="text-xs sm:text-sm truncate">
                  Queue
                </TabsTrigger>
              </TabsList>
              <TabsContent value="feed" className="mt-4">
                <CommunityFeedSection
                  communityId={communityId!}
                  isMember={isMemberOfCommunity}
                />
              </TabsContent>
              <TabsContent value="queue" className="mt-4">
                <ContributionQueueSection
                  proposalsData={proposalsData}
                  proposalsLoading={proposalsLoading}
                  onViewMore={() => setIsContributionQueueModalOpen(true)}
                  onVote={handleVote}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Side-by-side layout for large screens */}
          <div className="hidden lg:flex flex-col lg:flex-row gap-6 w-full">
            <CommunityFeedSection
              communityId={communityId!}
              isMember={isMemberOfCommunity}
            />
            <ContributionQueueSection
              proposalsData={proposalsData}
              proposalsLoading={proposalsLoading}
              onViewMore={() => setIsContributionQueueModalOpen(true)}
              onVote={handleVote}
            />
          </div>
        </div>
      </div>

      {/* Floating Add Button & Modal - Members Only */}
      {isMemberOfCommunity && (
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

            <DialogContent className="w-[95vw] sm:max-w-[450px] rounded-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Add Node / Edge
                </DialogTitle>
                <DialogDescription>Propose a new node or edge to contribute to this knowledge graph.</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="node" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="node">Node</TabsTrigger>
                  <TabsTrigger value="edge">Edge</TabsTrigger>
                </TabsList>

                {/* ------------------ NODE TAB ------------------ */}
                <TabsContent value="node" className="space-y-3">
                  <Input
                    placeholder="Node Name (required)"
                    value={nodeName}
                    onChange={(e) => setNodeName(e.target.value)}
                  />

                  <Input
                    placeholder="Labels (comma separated)"
                    value={nodeLabels.join(",")}
                    onChange={(e) =>
                      setNodeLabels(
                        e.target.value.split(",").map((l) => l.trim())
                      )
                    }
                  />

                  {/* Properties */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">
                      Properties
                    </p>

                    {nodeProperties.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">
                        No properties yet. Click below to add.
                      </p>
                    ) : (
                      nodeProperties.map((prop, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Key"
                            value={prop.key}
                            onChange={(e) =>
                              handleNodePropertyChange(
                                index,
                                "key",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            placeholder="Value"
                            value={prop.value}
                            onChange={(e) =>
                              handleNodePropertyChange(
                                index,
                                "value",
                                e.target.value
                              )
                            }
                          />
                          {index > 0 && (
                          <Button
                            variant="ghost"
                            onClick={() => removeNodeProperty(index)}
                            className="text-red-500"
                          >
                            ✕
                          </Button>
                        )}
                        </div>
                      ))
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addNodeProperty}
                      className="text-primary border-purple-300 hover:bg-purple-50"
                    >
                      + Add Property
                    </Button>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={handleNodeSubmit}
                  >
                    Add Node
                  </Button>
                </TabsContent>

                {/* ------------------ EDGE TAB ------------------ */}
                <TabsContent value="edge" className="space-y-3">
                  <Input
                    placeholder="Source Node ID"
                    value={edgeData.sourceId || ""}
                    onChange={(e) =>
                      setEdgeData({ ...edgeData, sourceId: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Target Node ID"
                    value={edgeData.targetId || ""}
                    onChange={(e) =>
                      setEdgeData({ ...edgeData, targetId: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Edge Type"
                    value={edgeData.type || ""}
                    onChange={(e) =>
                      setEdgeData({ ...edgeData, type: e.target.value })
                    }
                  />

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">
                      Properties
                    </p>
                    {edgeProperties.map((prop, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Key"
                          value={prop.key}
                          onChange={(e) =>
                            handleEdgePropertyChange(
                              index,
                              "key",
                              e.target.value
                            )
                          }
                        />
                        <Input
                          placeholder="Value"
                          value={prop.value}
                          onChange={(e) =>
                            handleEdgePropertyChange(
                              index,
                              "value",
                              e.target.value
                            )
                          }
                        />
                        {index > 0 && (
                          <Button
                            variant="ghost"
                            onClick={() => removeEdgeProperty(index)}
                            className="text-red-500"
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addEdgeProperty}
                      className="text-primary border-purple-300 hover:bg-purple-50"
                    >
                      + Add Property
                    </Button>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={handleEdgeSubmit}
                  >
                    Add Edge
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Knowledge Graph Expanded Modal */}
      <Dialog open={isGraphModalOpen} onOpenChange={setIsGraphModalOpen}>
        <DialogContent className="w-[95vw] max-w-[95vw] h-[85vh] sm:h-[90vh] max-h-[90vh] rounded-xl sm:rounded-2xl p-3 sm:p-6 overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Knowledge Graph
            </DialogTitle>
            <DialogDescription>Explore the interactive knowledge graph visualization of this community.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden w-full h-full">
            <KnowledgeGraph 
              isExpanded={true} 
              graphData={graphData} 
              onUpdate={handleGraphUpdate}
              onDelete={handleGraphDelete}
              onOpenEditModal={handleOpenEditModal}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Contribution Queue Modal */}
      <ContributionQueueModal
        isOpen={isContributionQueueModalOpen}
        onClose={() => setIsContributionQueueModalOpen(false)}
        proposalsData={proposalsData}
        proposalsLoading={proposalsLoading}
        onVote={handleVote}
      />

      {/* Community Members Modal */}
      <Dialog open={isMembersModalOpen} onOpenChange={setIsMembersModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[600px] max-h-[80vh] rounded-xl sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Community Members
            </DialogTitle>
            <DialogDescription>View all members of this community sorted by reputation.</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh]">
            {membersLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : getSortedMembers().length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No members found
              </div>
            ) : (
              <div className="space-y-2">
                {getSortedMembers().map((member, index) => (
                  <Link
                    key={member.id}
                    to={`/user/${member.id}`}
                    onClick={() => setIsMembersModalOpen(false)}
                    className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg hover:bg-muted/80 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 text-primary font-semibold text-xs sm:text-base shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground text-sm sm:text-base truncate">
                          {member.username}
                          {member.id === communityData?.ownerId && (
                            <span className="ml-1 sm:ml-2 text-xs bg-primary text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                              Owner
                            </span>
                          )}
                          {member.id === user?.id && (
                            <span className="ml-1 sm:ml-2 text-xs bg-blue-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          Member since{" "}
                          {new Date(member.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-bold text-base sm:text-lg text-foreground">
                          {member.reputation || 0}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Rep</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Node/Edge Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[450px] rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Edit {editModalData?.type === 'node' ? 'Node' : 'Edge'}
            </DialogTitle>
            <DialogDescription>Update the information of this {editModalData?.type}.</DialogDescription>
          </DialogHeader>

          {editModalData && (
            <div className="space-y-3">
              {editModalData.type === 'node' ? (
                // NODE EDIT FORM
                <div className="space-y-3">
                  <Input
                    id="editNodeName"
                    placeholder="Node Name (required)"
                    value={editModalData.data.label || ''}
                    onChange={(e) => {
                      setEditModalData({
                        ...editModalData,
                        data: {
                          ...editModalData.data,
                          label: e.target.value,
                        },
                      });
                    }}
                  />
                  <Input
                    id="editNodeLabels"
                    placeholder="Labels (comma separated)"
                    value={(editModalData.data.labels || []).join(",")}
                    onChange={(e) => {
                      setEditModalData({
                        ...editModalData,
                        data: {
                          ...editModalData.data,
                          labels: e.target.value.split(",").map((l) => l.trim()).filter(l => l),
                        },
                      });
                    }}
                  />
                </div>
              ) : (
                // EDGE EDIT FORM
                <div>
                  <Input
                    id="editEdgeType"
                    placeholder="Edge Type (required)"
                    value={editModalData.data.label || ''}
                    onChange={(e) => {
                      setEditModalData({
                        ...editModalData,
                        data: {
                          ...editModalData.data,
                          label: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
              )}

              {/* Properties */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">
                  Properties
                </p>

                {editModalData.properties.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    No properties yet. Click below to add.
                  </p>
                ) : (
                  editModalData.properties.map((prop, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="Key"
                        value={prop.key}
                        onChange={(e) => {
                          const updated = [...editModalData.properties];
                          updated[index].key = e.target.value;
                          setEditModalData({
                            ...editModalData,
                            properties: updated,
                          });
                        }}
                      />
                      <Input
                        placeholder="Value"
                        value={prop.value}
                        onChange={(e) => {
                          const updated = [...editModalData.properties];
                          updated[index].value = e.target.value;
                          setEditModalData({
                            ...editModalData,
                            properties: updated,
                          });
                        }}
                      />
                      {index > 0 && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            const updated = editModalData.properties.filter(
                              (_, i) => i !== index
                            );
                            setEditModalData({
                              ...editModalData,
                              properties: updated,
                            });
                          }}
                          className="text-red-500"
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditModalData({
                      ...editModalData,
                      properties: [...editModalData.properties, { key: "", value: "" }],
                    });
                  }}
                  className="text-primary border-purple-300 hover:bg-purple-50"
                >
                  + Add Property
                </Button>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => {
                    const details: { key: string; value: string }[] = [];
                    editModalData.properties.forEach((prop) => {
                      if (prop.key.trim() && prop.value.trim()) {
                        details.push({ key: prop.key, value: prop.value });
                      }
                    });

                    const updatedData = {
                      ...editModalData.data,
                      details,
                    };

                    handleGraphUpdate(editModalData.type, updatedData);
                    setIsEditModalOpen(false);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CommunityDashboard;