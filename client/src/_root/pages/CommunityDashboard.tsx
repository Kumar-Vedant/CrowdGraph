import { useNavigate, useParams } from "react-router-dom";
import SearchBar from "../../components/shared/SearchBar";
import { CommunityFeed } from "@/components/shared/CommunityFeed";
import {
  getUserById,
  getUsersInCommunity,
  searchCommunityById,
  joinCommunity,
  leaveCommunity,
} from "@/services/api";
import { useApi } from "@/hooks/apiHook";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { User, Node, Edge } from "@/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import KnowledgeGraph from "@/components/shared/KnowledgeGraph";

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
    callApi: callMembersApi 
  } = useApi(getUsersInCommunity);
  const { 
    data: ownerData, 
    loading: ownerLoading,
    callApi: callOwnerApi 
  } = useApi(getUserById);
  const { loading: joinLoading, callApi: callJoinApi } = useApi(joinCommunity);
  const { loading: leaveLoading, callApi: callLeaveApi } =
    useApi(leaveCommunity);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isMemberOfCommunity, setIsMemberOfCommunity] = useState(false);

  // Check if user is a member
  useEffect(() => {
    if (communityMembers && user) {
      const isMember = Array.isArray(communityMembers) && 
        communityMembers.some((member: User) => member.id === user.id);
      setIsMemberOfCommunity(isMember);
    }
  }, [communityMembers, user]);

  // --- Join/Leave handlers ---
  const handleJoinCommunity = async () => {
    if (!user || !communityId) return;
    try {
      await callJoinApi(communityId, user.id);
      // Refresh community members list
      await callMembersApi(communityId);
    } catch (error) {
      console.error("Failed to join community:", error);
    }
  };

  const handleLeaveCommunity = async () => {
    if (!user || !communityId) return;
    try {
      await callLeaveApi(communityId, user.id);
      // Refresh community members list
      await callMembersApi(communityId);
    } catch (error) {
      console.error("Failed to leave community:", error);
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
  const [nodeProperties, setNodeProperties] = useState<
    { key: string; value: string }[]
  >([{ key: "name", value: "" }]); // always include name first

  // --- Edge state ---
  const [edgeData, setEdgeData] = useState<Partial<Edge>>({});
  const [edgeProperties, setEdgeProperties] = useState<
    { key: string; value: string }[]
  >([{ key: "", value: "" }]);

  // --- Node property handlers ---
  const addNodeProperty = () =>
    setNodeProperties([...nodeProperties, { key: "", value: "" }]);

  const removeNodeProperty = (index: number) => {
    // prevent removing the "name" property (index 0)
    if (index === 0) return;
    setNodeProperties(nodeProperties.filter((_, i) => i !== index));
  };

  const handleNodePropertyChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...nodeProperties];
    // prevent renaming the mandatory "name" key
    if (index === 0 && field === "key") return;
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
  const handleNodeSubmit = () => {
    // Ensure no property has a key but no value
    for (const prop of nodeProperties) {
      if (prop.key.trim() && !prop.value.trim()) {
        alert(`Property "${prop.key}" must have a value!`);
        return;
      }
    }
    // Ensure first property is always the 'name'
    const formattedProps: Array<{ key: string; value: any }> = nodeProperties
      .filter((p) => p.key.trim() && p.value.trim())
      .map((p) => ({ key: p.key.trim(), value: p.value }));

    const newNode: Partial<Node> = {
      labels: nodeLabels.filter((l) => l.trim()),
      properties: formattedProps as any, // Type assertion for tuple constraint
    };

    console.log("✅ Node added:", newNode);

    setIsModalOpen(false);
    setNodeLabels([]);
    setNodeProperties([{ key: "name", value: "" }]);
  };

  // --- Edge submit ---
  const handleEdgeSubmit = () => {
    if (!edgeData.sourceId || !edgeData.targetId || !edgeData.type) {
      alert("Edge source, target, and type are mandatory!");
      return;
    }

    // Ensure no property has a key but no value
    for (const prop of edgeProperties) {
      if (prop.key.trim() && !prop.value.trim()) {
        alert(`Property "${prop.key}" must have a value!`);
        return;
      }
    }

    const formattedProps = edgeProperties
      .filter((p) => p.key.trim() && p.value.trim())
      .map((p) => ({ key: p.key.trim(), value: p.value }));

    const newEdge: Partial<Edge> = {
      sourceId: edgeData.sourceId!,
      targetId: edgeData.targetId!,
      type: edgeData.type!,
      properties: formattedProps,
    };

    console.log("✅ Edge added:", newEdge);

    setIsModalOpen(false);
    setEdgeData({});
    setEdgeProperties([{ key: "", value: "" }]);
  };

  // --- API calls ---
  useEffect(() => {
    if (communityId) {
      callCommunityApi(communityId);
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
          <h2 className="text-2xl font-bold text-foreground mb-2">Community not found</h2>
          <p className="text-muted-foreground mb-4">{communityError || "This community doesn't exist or has been removed."}</p>
          <button 
            onClick={() => navigate("/explore")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );

  const memberCount = Array.isArray(communityMembers) ? communityMembers.length : 0;

  return (
    <div>
      <div className="gap-1 px-6 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[920px] flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
                <p className="text-foreground tracking-light text-[32px] font-bold leading-tight">
                  {communityData.title}
                </p>
                <p className="text-muted-foreground text-sm font-normal">
                  Owner: {ownerLoading ? "Loading..." : (ownerData?.username || "Unknown")} · Created at:{" "}
                  {new Date(communityData.createdAt).toLocaleDateString()}
                </p>
                <p className="text-muted-foreground text-sm font-normal leading-normal gap-5">
                  {membersLoading ? "Loading members..." : `${memberCount} member${memberCount !== 1 ? 's' : ''}`}
                  {!membersLoading && memberCount > 0 && (
                    <button 
                      className="ml-3 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full hover:bg-primary/90 transition-colors shadow-sm"
                      onClick={() => setIsMembersModalOpen(true)}
                    >
                      View Members
                    </button>
                  )}
                </p>
              </div>
              {isMemberOfCommunity ? (
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-muted text-foreground text-sm font-medium leading-normal"
                  onClick={handleLeaveCommunity}
                  disabled={leaveLoading}
                >
                  <span className="truncate">
                    {leaveLoading ? "Leaving..." : "Leave Community"}
                  </span>
                </button>
              ) : (
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-muted text-foreground text-sm font-medium leading-normal"
                  onClick={handleJoinCommunity}
                  disabled={joinLoading}
                >
                  <span className="truncate">
                    {joinLoading ? "Joining..." : "Join Community"}
                  </span>
                </button>
              )}
            </div>
            <div className="@container flex flex-col h-[400px]">
              <div className="flex flex-col h-full @[480px]:px-4 @[480px]:py-3">
                <div className="flex flex-col h-full justify-between relative">
                  {isMemberOfCommunity ? (
                    <SearchBar
                      placeholder="Search Query"
                      onSearch={(query) => {
                        console.log("Searching for:", query);
                      }}
                    />
                  ) : (
                    <div className="p-4 bg-muted border-2 border-dashed border-border rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Join this community</span> to search the knowledge graph.
                      </p>
                    </div>
                  )}
                  <div className="flex-1 min-h-0">
                    <KnowledgeGraph />
                  </div>
                  
                  {/* Expand Graph Button */}
                  <button
                    className="absolute bottom-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all"
                    onClick={() => setIsGraphModalOpen(true)}
                    title="Expand Knowledge Graph"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M224,48V96a8,8,0,0,1-16,0V67.31l-42.34,42.35a8,8,0,0,1-11.32-11.32L196.69,56H168a8,8,0,0,1,0-16h48A8,8,0,0,1,224,48ZM98.34,145.66,56,188v-28a8,8,0,0,0-16,0v48a8,8,0,0,0,8,8H96a8,8,0,0,0,0-16H68L109.66,157.66a8,8,0,0,0-11.32-11.32Z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Community Feed to show user posts */}
            <div>
              <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                Community Feed
              </h2>
              <CommunityFeed 
                communityId={communityId!} 
                isMember={isMemberOfCommunity}
              />
            </div>
          </div>

          <div className="layout-content-container flex flex-col w-[360px]">
            <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              AI Suggestions
            </h2>
            <div className="p-4">
              <div className="flex items-stretch justify-between gap-4 rounded-lg">
                <div className="flex flex-[2_2_0px] flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm font-normal leading-normal">
                      Suggested Link
                    </p>
                    <p className="text-foreground text-base font-bold leading-tight">
                      Node A to Node B
                    </p>
                    <p className="text-muted-foreground text-sm font-normal leading-normal">
                      AI suggests a link between Node A and Node B based on
                      recent community contributions.
                    </p>
                  </div>
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 flex-row-reverse bg-muted text-foreground text-sm font-medium leading-normal w-fit">
                    <span className="truncate">Add Link</span>
                  </button>
                </div>
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCPOwhDl4Ep7zGKthwqCHYe0EsEVhwBK9S2sS5RndYROMqMGoJQs7uTZSKfgJd8-euMEW5ameez90069ePXvQilUbiBjSFQiGzGRvmgXbNs3qR5ue_OlR7e8F2amvRQKeTU5hM8VWEtN07qn5VHF3V3S-x_qlhkS1sxDiFp9ZiOj8fNH-eEOBZuhfQEuxNt1JClR_CK7BTLnk7NxG24CfKSrouj7AsWBHOlSOvf_k9or3aabWN4WhPDm_wvEEcCr3493Nt_neF9APQ")',
                  }}
                ></div>
              </div>
            </div>
            <h2 className="text-foreground text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              Contribution Queue
            </h2>
            <div className="flex items-center gap-4 bg-muted px-4 min-h-[72px] py-2 justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="text-foreground flex items-center justify-center rounded-lg bg-muted shrink-0 size-12"
                  data-icon="Link"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M137.54,186.36a8,8,0,0,1,0,11.31l-9.94,10A56,56,0,0,1,48.38,128.4L72.5,104.28A56,56,0,0,1,149.31,102a8,8,0,1,1-10.64,12,40,40,0,0,0-54.85,1.63L59.7,139.72a40,40,0,0,0,56.58,56.58l9.94-9.94A8,8,0,0,1,137.54,186.36Zm70.08-138a56.08,56.08,0,0,0-79.22,0l-9.94,9.95a8,8,0,0,0,11.32,11.31l9.94-9.94a40,40,0,0,1,56.58,56.58L172.18,140.4A40,40,0,0,1,117.33,142,8,8,0,1,0,106.69,154a56,56,0,0,0,76.81-2.26l24.12-24.12A56.08,56.08,0,0,0,207.62,48.38Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-foreground text-base font-medium leading-normal line-clamp-1">
                    Add Link: Node C to Node D
                  </p>
                  <p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
                    Submitted by Alex
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-muted text-foreground text-sm font-medium leading-normal w-fit">
                  <span className="truncate">Review</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-muted px-4 min-h-[72px] py-2 justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="text-foreground flex items-center justify-center rounded-lg bg-muted shrink-0 size-12"
                  data-icon="PencilSimple"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
                  </svg>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-foreground text-base font-medium leading-normal line-clamp-1">
                    Edit Node E
                  </p>
                  <p className="text-muted-foreground text-sm font-normal leading-normal line-clamp-2">
                    Submitted by Sarah
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-muted text-foreground text-sm font-medium leading-normal w-fit">
                  <span className="truncate">Review</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Add Button & Modal - Members Only */}
        {isMemberOfCommunity && (
          <div className="fixed bottom-10 right-10">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all"
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

            <DialogContent className="sm:max-w-[450px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Add Node / Edge
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="node" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="node">Node</TabsTrigger>
                  <TabsTrigger value="edge">Edge</TabsTrigger>
                </TabsList>

                {/* ------------------ NODE TAB ------------------ */}
                <TabsContent value="node" className="space-y-3">
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

                    {nodeProperties.map((prop, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Key"
                          value={prop.key}
                          disabled={index === 0}
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
                    ))}

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
          <DialogContent className="max-w-[95vw]! w-[95vw]! h-[95vh] max-h-[95vh] rounded-2xl p-6 overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Knowledge Graph
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden w-full h-full">
              <KnowledgeGraph />
            </div>
          </DialogContent>
        </Dialog>

        {/* Community Members Modal */}
        <Dialog open={isMembersModalOpen} onOpenChange={setIsMembersModalOpen}>
          <DialogContent className="max-w-[600px] max-h-[80vh] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Community Members
              </DialogTitle>
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
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-primary font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {member.username}
                            {member.id === communityData?.ownerId && (
                              <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full">
                                Owner
                              </span>
                            )}
                            {member.id === user?.id && (
                              <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Member since {new Date(member.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-yellow-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-bold text-lg text-foreground">
                            {member.reputation || 0}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Reputation</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
}

export default CommunityDashboard;



