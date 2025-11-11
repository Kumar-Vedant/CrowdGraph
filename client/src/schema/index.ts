interface User  {
  id: string;
  username: string;
  createdAt: string;
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
  content: string;
  createdAt: Date;
  parentCommentId: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  communityId: string;
  createdAt: Date;
}

interface Node {
  id?: string;
  labels: string[];
  properties: [
    { key: "name"; value: string },   // mandatory first element
    ...{ key: string; value: any }[]  // allow additional key-value pairs
  ];
}

interface Edge {
  id?: string;
  sourceId: string;
  targetId: string;
  type: string;
  properties: { key: string; value: any }[];
}


export type { User, Community, Post, Comment, Node, Edge };