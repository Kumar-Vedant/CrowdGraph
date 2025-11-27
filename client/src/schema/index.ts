interface User  {
  id: string;
  username: string;
  createdAt: string;
  reputation?: number;
}

interface Community {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  createdAt: Date;
  role?: "Member" | "Owner";
}

interface Comment {
  id: string;
  postId: string;
  userId: string;
  username?: string;
  content: string;
  createdAt: Date;
  parentCommentId: string;
  voteCount: number;
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName?: string;
  communityId: string;
  createdAt: Date;
}

interface Node {
  id: string;
  labels: string[];
  name: string;
  properties: { [key: string]: any };
}


interface Edge {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  properties: { [key: string]: any };
}

interface NodeProposal {
  id: string;
  userId: string;
  username?: string;
  communityId?: string;
  communityName?: string;
  name: string;
  labels: string[];
  properties: { [key: string]: any };
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  proposalType: "CREATE" | "UPDATE" | "DELETE";
}

interface EdgeProposal {
  id: string;
  userId: string;
  username?: string;
  communityId?: string;
  communityName?: string;
  type: string;
  properties: { [key: string]: any };
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  sourceId: string;
  targetId: string;
  proposalType: "CREATE" | "UPDATE" | "DELETE";
}

interface GraphProposals {
  nodeProposals: NodeProposal[];
  edgeProposals: EdgeProposal[];
}

interface QueryResponse {
  answer: string;
  nodes: Node[];
  edges: Edge[];
}

interface RouteResponse<T> {
  success: boolean;
  data?: T;
  error?: string | null;
}

export type { User, Community, Post, Comment, Node, Edge, NodeProposal, EdgeProposal, RouteResponse, GraphProposals, QueryResponse };