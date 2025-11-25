import type { NodeProposal, EdgeProposal } from "@/schema";

interface ContributionCardProps {
  proposal: (NodeProposal | EdgeProposal) & { kind: 'node' | 'edge' };
  onVote: (proposalId: string, proposalType: 'node' | 'edge', voteValue: number) => Promise<void>;
  onReview: (proposal: NodeProposal | EdgeProposal) => void;
}

export function ContributionCard({ proposal, onVote, onReview }: ContributionCardProps) {
  const isNode = proposal.kind === 'node';
  const nodeProposal = proposal as NodeProposal & { kind: 'node' };
  const edgeProposal = proposal as EdgeProposal & { kind: 'edge' };

  return (
    <div
      key={`${proposal.kind}-${proposal.id}`}
      className="flex items-start gap-3 bg-card border border-border rounded-lg p-3 hover:shadow-md hover:border-primary/30 transition-all duration-200 group"
    >
      <div
        className={`flex items-center justify-center rounded-md ${
          isNode
            ? 'bg-linear-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20'
            : 'bg-linear-to-br from-accent/20 to-accent/10 group-hover:from-accent/30 group-hover:to-accent/20'
        } shrink-0 size-10 transition-colors`}
      >
        {isNode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            className="text-primary"
            viewBox="0 0 256 256"
          >
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a28,28,0,0,1-28,28h-4v8a8,8,0,0,1-16,0v-8H104a8,8,0,0,1,0-16h36a12,12,0,0,0,0-24H116a28,28,0,0,1,0-56h4V72a8,8,0,0,1,16,0v8h16a8,8,0,0,1,0,16H116a12,12,0,0,0,0,24h24A28,28,0,0,1,168,148Z"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            fill="currentColor"
            className="text-accent"
            viewBox="0 0 256 256"
          >
            <path d="M137.54,186.36a8,8,0,0,1,0,11.31l-9.94,10A56,56,0,0,1,48.38,128.4L72.5,104.28A56,56,0,0,1,149.31,102a8,8,0,1,1-10.64,12,40,40,0,0,0-54.85,1.63L59.7,139.72a40,40,0,0,0,56.58,56.58l9.94-9.94A8,8,0,0,1,137.54,186.36Zm70.08-138a56.08,56.08,0,0,0-79.22,0l-9.94,9.95a8,8,0,0,0,11.32,11.31l9.94-9.94a40,40,0,0,1,56.58,56.58L172.18,140.4A40,40,0,0,1,117.33,142,8,8,0,1,0,106.69,154a56,56,0,0,0,76.81-2.26l24.12-24.12A56.08,56.08,0,0,0,207.62,48.38Z"></path>
          </svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex-1 min-w-0">
            <p className="text-foreground text-xs font-bold truncate leading-tight">
              {isNode ? nodeProposal.name : edgeProposal.type}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 whitespace-nowrap ${
              proposal.status === 'PENDING'
                ? 'bg-warning/20 text-warning-foreground'
                : proposal.status === 'APPROVED'
                  ? 'bg-success/20 text-success'
                  : 'bg-destructive/20 text-destructive'
            }`}
          >
            {proposal.status}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1 mb-2">
          {isNode && nodeProposal.labels && nodeProposal.labels.length > 0 &&
            nodeProposal.labels.slice(0,2).map(label => (
              <span key={label} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/15 text-primary border border-primary/20">
                {label}
              </span>
            ))
          }
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border">
            {isNode ? 'Node' : 'Edge'}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700">
            {proposal.proposalType}
          </span>
        </div>

        {!isNode && (
          <div className="flex gap-5 mb-2 text-xs">
            <p className="text-muted-foreground">
              From:{' '}
              <span className="text-foreground font-medium text-xs">{edgeProposal.sourceId.slice(0, 8)}...</span>
            </p>
            <p className="text-muted-foreground">
              To: <span className="text-foreground font-medium text-xs">{edgeProposal.targetId.slice(0, 8)}...</span>
            </p>
          </div>
        )}

        <p className="text-muted-foreground text-xs mb-2">
          <span className="font-medium text-foreground text-xs">{proposal.username || 'Unknown'}</span> •{' '}
          {new Date(proposal.createdAt).toLocaleDateString()}
        </p>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onVote(proposal.id, proposal.kind, 1)}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-success bg-success/5 hover:bg-success/10 border border-success/20 rounded transition-colors"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            {proposal.upvotes}
          </button>
          <button
            onClick={() => onVote(proposal.id, proposal.kind, -1)}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-destructive bg-destructive/5 hover:bg-destructive/10 border border-destructive/20 rounded transition-colors"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            {proposal.downvotes}
          </button>
          <button
            onClick={() => onReview(proposal)}
            className="ml-auto px-2 py-1 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded transition-colors whitespace-nowrap"
          >
            Review →
          </button>
        </div>
      </div>
    </div>
  );
}
