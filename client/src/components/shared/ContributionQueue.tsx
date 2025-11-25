import { useState } from "react";
import type { GraphProposals, NodeProposal, EdgeProposal } from "@/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ContributionCard } from "./ContributionCard";

// Proposal Detail Modal Component
function ProposalDetailModal({
  isOpen,
  onClose,
  proposal,
}: {
  isOpen: boolean;
  onClose: () => void;
  proposal: NodeProposal | EdgeProposal | null;
}) {
  if (!proposal) return null;

  const isNode = 'name' in proposal;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[85vh] rounded-xl sm:rounded-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isNode ? (proposal as NodeProposal).name : (proposal as EdgeProposal).type} - Full Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this contribution
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-foreground">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">ID</p>
                <p className="text-foreground font-medium break-all">{proposal.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Proposal Type</p>
                <p className="text-foreground font-medium">{proposal.proposalType}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Status</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  proposal.status === 'PENDING' ? 'bg-warning/20 text-warning-foreground' :
                  proposal.status === 'APPROVED' ? 'bg-success/20 text-success' :
                  'bg-destructive/20 text-destructive'
                }`}>
                  {proposal.status}
                </span>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Created At</p>
                <p className="text-foreground font-medium">
                  {new Date(proposal.createdAt).toLocaleDateString()} {new Date(proposal.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Username</p>
                <p className="text-foreground font-medium">{proposal.username || "Unknown"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">User ID</p>
                <p className="text-foreground font-medium break-all text-xs">{proposal.userId}</p>
              </div>
            </div>
          </div>

          {/* Node Specific */}
          {isNode && (
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-foreground">Node Details</h3>
              
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Name</p>
                  <p className="text-foreground font-medium">{(proposal as NodeProposal).name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Labels</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(proposal as NodeProposal).labels.map((label, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edge Specific */}
          {!isNode && (
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-foreground">Edge Details</h3>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Type</p>
                  <p className="text-foreground font-medium">{(proposal as EdgeProposal).type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Source ID</p>
                  <p className="text-foreground font-medium break-all text-xs">{(proposal as EdgeProposal).sourceId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Target ID</p>
                  <p className="text-foreground font-medium break-all text-xs">{(proposal as EdgeProposal).targetId}</p>
                </div>
              </div>
            </div>
          )}

          {/* Properties */}
          {proposal.properties && proposal.properties.length > 0 && (
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-foreground">Properties</h3>
              
              <div className="space-y-2">
                {proposal.properties.map((prop, idx) => (
                  <div key={idx} className="flex justify-between items-start text-sm border-b border-border pb-2 last:border-0">
                    <p className="text-muted-foreground font-medium">{prop.key}:</p>
                    <p className="text-foreground text-right break-all">{String(prop.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Voting Info */}
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-foreground">Voting Information</h3>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-muted-foreground text-xs">Upvotes</p>
                  <p className="text-foreground font-semibold">{proposal.upvotes}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-muted-foreground text-xs">Downvotes</p>
                  <p className="text-foreground font-semibold">{proposal.downvotes}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Community Info */}
          {(proposal.communityId || proposal.communityName) && (
            <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
              <h3 className="font-semibold text-foreground">Community</h3>
              {proposal.communityId && (
                <div>
                  <p className="text-muted-foreground text-xs">Community ID</p>
                  <p className="text-foreground font-medium break-all text-xs">{proposal.communityId}</p>
                </div>
              )}
              {proposal.communityName && (
                <div>
                  <p className="text-muted-foreground text-xs">Community Name</p>
                  <p className="text-foreground font-medium">{proposal.communityName}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Contribution Queue Section Component
export function ContributionQueueSection({
  proposalsData,
  proposalsLoading,
  onViewMore,
  onVote,
}: {
  proposalsData: GraphProposals | null;
  proposalsLoading: boolean;
  onViewMore: () => void;
  onVote: (proposalId: string, proposalType: 'node' | 'edge', voteValue: number) => Promise<void>;
}) {
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Combine and sort all proposals by date
  const getAllProposalsSortedByDate = () => {
    if (!proposalsData) return [];
    
    const allProposals = [
      ...(proposalsData.nodeProposals || []).map(p => ({ ...p, kind: 'node' as const })),
      ...(proposalsData.edgeProposals || []).map(p => ({ ...p, kind: 'edge' as const }))
    ];
    
    return allProposals.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 5); // Only top 5
  };

  const topProposals = getAllProposalsSortedByDate();

  return (
    <>
      <div className="w-full lg:w-[360px] lg:min-w-[360px]">
        <div className="flex items-center justify-between px-4 pb-3 pt-5">
          <h2 className="text-foreground text-lg sm:text-xl md:text-[22px] font-bold leading-tight tracking-[-0.015em]">
            Contribution Queue
          </h2>
          {topProposals.length > 0 && (
            <button
              onClick={onViewMore}
              className="text-xs sm:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View More →
            </button>
          )}
        </div>

        {proposalsLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : topProposals.length > 0 ? (
          <div className="flex flex-col gap-3 px-4 pb-4">
            {topProposals.map((proposal: any) => (
              <ContributionCard
                key={`${proposal.kind}-${proposal.id}`}
                proposal={proposal}
                onVote={onVote}
                onReview={(p) => {
                  setSelectedProposal(p);
                  setIsDetailOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground text-sm text-center">
              No contributions yet
            </p>
            <p className="text-muted-foreground text-xs text-center mt-1">
              Contributions will appear here for review
            </p>
          </div>
        )}
      </div>

      {/* Proposal Detail Modal */}
      <ProposalDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        proposal={selectedProposal}
      />
    </>
  );
}

// Contribution Queue Modal Component
export function ContributionQueueModal({
  isOpen,
  onClose,
  proposalsData,
  proposalsLoading,
  onVote,
}: {
  isOpen: boolean;
  onClose: () => void;
  proposalsData: GraphProposals | null;
  proposalsLoading: boolean;
  onVote: (proposalId: string, proposalType: 'node' | 'edge', voteValue: number) => Promise<void>;
}) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'APPROVED' | 'REJECTED'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'node' | 'edge'>('all');
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Get all proposals sorted by date
  const getFilteredProposals = () => {
    if (!proposalsData) return [];
    
    let allProposals = [
      ...(proposalsData.nodeProposals || []).map(p => ({ ...p, kind: 'node' as const })),
      ...(proposalsData.edgeProposals || []).map(p => ({ ...p, kind: 'edge' as const }))
    ];

    // Apply type filter
    if (typeFilter !== 'all') {
      allProposals = allProposals.filter(p => p.kind === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      allProposals = allProposals.filter(p => p.status === statusFilter);
    }

    // Sort by date (most recent first)
    return allProposals.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const filteredProposals = getFilteredProposals();

  const renderProposal = (proposal: any) => {
    return (
      <ContributionCard
        proposal={proposal}
        onVote={onVote}
        onReview={(p) => {
          setSelectedProposal(p);
          setIsDetailOpen(true);
        }}
      />
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-[900px] max-h-[85vh] rounded-xl sm:rounded-2xl overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              All Contributions
            </DialogTitle>
            <DialogDescription>Browse and filter all node and edge contributions in this community.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 overflow-hidden flex-1">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 px-1">
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Type Filter
                </label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={typeFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setTypeFilter('all')}
                    className="flex-1"
                  >
                    All
                  </Button>
                  <Button
                    size="sm"
                    variant={typeFilter === 'node' ? 'default' : 'outline'}
                    onClick={() => setTypeFilter('node')}
                    className="flex-1"
                  >
                    Nodes
                  </Button>
                  <Button
                    size="sm"
                    variant={typeFilter === 'edge' ? 'default' : 'outline'}
                    onClick={() => setTypeFilter('edge')}
                    className="flex-1"
                  >
                    Edges
                  </Button>
                </div>
              </div>
            </div>

            {/* Status Tabs */}
            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)} className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="PENDING">Pending</TabsTrigger>
                <TabsTrigger value="APPROVED">Approved</TabsTrigger>
                <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
              </TabsList>

              <TabsContent value={statusFilter} className="flex-1 overflow-y-auto mt-4">
                {proposalsLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : filteredProposals.length > 0 ? (
                  <div className="flex flex-col gap-3 pr-2">
                    {filteredProposals.map(renderProposal)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-muted-foreground text-sm text-center">
                      No contributions found
                    </p>
                    <p className="text-muted-foreground text-xs text-center mt-1">
                      Try adjusting your filters
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Proposal Detail Modal */}
      <ProposalDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        proposal={selectedProposal}
      />
    </>
  );
}
