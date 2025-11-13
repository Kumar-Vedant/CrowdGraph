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
  role?: "Admin" | "Member" | "Owner";
}

interface Comment {
  id: string;
  postId: string;
  userId: string;
  username?: string;
  content: string;
  createdAt: Date;
  parentCommentId: string;
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
  id?: string;
  labels: string[];
  name: string;
  properties: { key: string; value: any }[];
}

interface Edge {
  id?: string;
  sourceId: string;
  targetId: string;
  type: string;
  properties: { key: string; value: any }[];
}

interface NodeProposal {
  id: string;
  labels: string[];
  name: string;
  properties: { key: string; value: any }[]
  userId: string;
  userName?: string;
  communityId?: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface EdgeProposal {
  id: string;
  type: string;
  properties: { key: string; value: any }[];
  userId: string;
  userName?: string;
  communityId?: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface GraphProposals {
  nodeProposals: NodeProposal[];
  edgeProposals: EdgeProposal[];
}

interface RouteResponse<T> {
  success: boolean;
  data?: T;
  error?: string | null;
}

export type { User, Community, Post, Comment, Node, Edge, NodeProposal, EdgeProposal, RouteResponse, GraphProposals };