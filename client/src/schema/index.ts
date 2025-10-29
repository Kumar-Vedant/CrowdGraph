interface User  {
  id: string;
  username: string;
  createdAt: Date;
}

// interface Community {
//   id: string;
//   title: string;
//   description: string;
//   createdAt: Date;
// }

interface Community {
  id: string;
  title: string;
  description: string | null;
  ownerId: string;
  createdAt: Date;

  // relations
  owner: User;
  members: User[];
  posts: Post[];
  reputation: number;
}


interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
  parentCommentId?: string | null;
  user: User;
  replies?: Comment[];
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  communityId: string;
  createdAt: Date;
  updatedAt: Date;
  author: User;
  comments: Comment[];
}

export type { User, Community, Post, Comment };