import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronRight, MessageSquare } from "lucide-react";
import type { Post, Comment } from "@/schema/index";
import { 
  getCommentsInPost, 
  getPostsInCommunity, 
  getRepliesToComment,
  createComment,
  createPost,
  getPostByTitleInCommunity 
} from "@/services/api";
import { useApi } from "@/hooks/apiHook";
import SearchBar from "./SearchBar";

interface CommentWithUser extends Comment {
  user: {
    id: string;
    username: string;
  };
}

interface PostWithAuthor extends Post {
  author: {
    id: string;
    username: string;
  };
}

interface CommunityFeedProps {
  communityId: string;
  isMember: boolean;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ communityId, isMember }) => {
  const { user } = useAuth();

  const { data: postsData, loading: postsLoading, callApi: callPostsApi } =
    useApi(getPostsInCommunity);

  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [comments, setComments] = useState<Record<string, CommentWithUser[]>>({});
  const [replies, setReplies] = useState<Record<string, CommentWithUser[]>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [showReplyBox, setShowReplyBox] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [allPosts, setAllPosts] = useState<PostWithAuthor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});

  // Fetch posts when component mounts or communityId changes
  useEffect(() => {
    if (communityId) {
      callPostsApi(communityId);
    }
  }, [communityId]);

  // Update posts when data is received
  useEffect(() => {
    if (postsData) {
      const postsList = Array.isArray(postsData) ? postsData : [];
      setPosts(postsList);
      setAllPosts(postsList);
    }
  }, [postsData]);

  const toggleComments = async (postId: string) => {
    // Toggle the expanded state
    const willExpand = !expandedComments[postId];
    setExpandedComments((prev) => ({ ...prev, [postId]: willExpand }));
    
    // Only fetch if expanding and we don't already have the comments
    if (willExpand && !comments[postId]) {
      setLoadingComments((prev) => ({ ...prev, [postId]: true }));
      try {
        const fetchedComments = await getCommentsInPost(postId);
        const commentsList = fetchedComments?.comments || fetchedComments || [];
        setComments((prev) => ({ 
          ...prev, 
          [postId]: Array.isArray(commentsList) ? commentsList : [] 
        }));
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setLoadingComments((prev) => ({ ...prev, [postId]: false }));
      }
    }
  };

  const toggleReplies = async (commentId: string) => {
    // Toggle the expanded state
    const willExpand = !expandedReplies[commentId];
    setExpandedReplies((prev) => ({ ...prev, [commentId]: willExpand }));
    
    // Only fetch if expanding and we don't already have the replies
    if (willExpand && !replies[commentId]) {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
      try {
        const fetchedReplies = await getRepliesToComment(commentId);
        const repliesList = fetchedReplies?.replies || fetchedReplies || [];
        setReplies((prev) => ({ 
          ...prev, 
          [commentId]: Array.isArray(repliesList) ? repliesList : [] 
        }));
      } catch (error) {
        console.error("Failed to load replies:", error);
      } finally {
        setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
      }
    }
  };

  const handleAddComment = async (postId: string, parentId?: string) => {
    const text = commentText[postId + (parentId ?? "")];
    if (!text?.trim() || !user) return;

    try {
      // Pass parentId to createComment - this makes it a nested reply
      const newComment = await createComment(postId, user.id, text.trim(), parentId);
      
      if (parentId) {
        // This is a reply to a comment - add it to the replies for that parent comment
        setReplies((prev) => ({
          ...prev,
          [parentId]: [...(prev[parentId] || []), newComment as CommentWithUser],
        }));
        // Hide the reply box after successful submission
        setShowReplyBox((prev) => ({ ...prev, [parentId]: false }));
      } else {
        // This is a top-level comment - add it directly to the post's comments
        setComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newComment as CommentWithUser],
        }));
      }
      
      // Clear the text input
      setCommentText((prev) => ({ ...prev, [postId + (parentId ?? "")]: "" }));
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !user) return;
    setPosting(true);
    try {
      const createdPost = await createPost(communityId, user.id, newPostTitle.trim(), newPostContent.trim());
      const newPost = createdPost as PostWithAuthor;
      setPosts((prev) => [newPost, ...prev]);
      setAllPosts((prev) => [newPost, ...prev]);
      setNewPostTitle("");
      setNewPostContent("");
    } catch (err) {
      console.error("Failed to create post:", err);
      alert("Failed to create post. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setPosts(allPosts);
      return;
    }

    try {
      const searchResults = await getPostByTitleInCommunity(communityId, query.trim());
      setPosts(Array.isArray(searchResults) ? searchResults : []);
    } catch (err) {
      console.error("Failed to search posts:", err);
      // Fallback to client-side filtering
      const filtered = allPosts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
      );
      setPosts(filtered);
    }
  };

  const renderCommentTree = (comment: CommentWithUser, depth = 0) => {
    const hasReplies = expandedReplies[comment.id];
    const isReplyBoxVisible = showReplyBox[comment.id];
    
    return (
      <div
        key={comment.id}
        className={`ml-${depth * 4} mt-3 border-l border-border pl-3`}
      >
        <div className="bg-muted rounded-md p-3 hover:bg-muted/80 transition">
          <p className="font-semibold text-sm text-foreground">{comment.user?.username || "Unknown User"}</p>
          <p className="text-foreground text-sm">{comment.content}</p>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>{new Date(comment.createdAt).toLocaleString()}</span>
            <div className="flex gap-2">
              {isMember && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyBox((prev) => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                  className="text-xs flex items-center space-x-1"
                >
                  <MessageSquare size={14} />
                  <span>Reply</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleReplies(comment.id)}
                className="text-xs flex items-center space-x-1"
              >
                {hasReplies ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <span>Replies</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Reply Input Box - Always under the comment when visible */}
        {isReplyBoxVisible && (
          <div className="mt-2 ml-6">
            <Textarea
              placeholder="Write a reply..."
              value={commentText[comment.postId + comment.id] || ""}
              onChange={(e) =>
                setCommentText((prev) => ({
                  ...prev,
                  [comment.postId + comment.id]: e.target.value,
                }))
              }
              className="min-h-[50px]"
            />
            <div className="flex gap-2 mt-1">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleAddComment(comment.postId, comment.id)}
              >
                Submit Reply
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowReplyBox((prev) => ({ ...prev, [comment.id]: false }));
                  setCommentText((prev) => ({ ...prev, [comment.postId + comment.id]: "" }));
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {hasReplies && (
          <div className="ml-6 mt-2">
            {replies[comment.id]?.map((reply) => renderCommentTree(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (postsLoading)
    return (
      <div className="text-center py-6 text-muted-foreground">Loading community feed...</div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Create Post */}
      {isMember ? (
        <Card className="p-5 rounded-xl bg-card shadow-md border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Create a Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              placeholder="Title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="w-full mb-3 p-2 border border-border rounded-md"
            />
            <Textarea
              placeholder="Content"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full min-h-[100px]"
            />
            <Button onClick={handleCreatePost} disabled={posting} className="mt-2">
              {posting ? "Posting..." : "Post"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="p-5 rounded-xl bg-muted shadow-md border-2 border-dashed border-border">
          <CardContent className="text-center py-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-muted-foreground/60 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-foreground mb-2">Members Only</h3>
            <p className="text-muted-foreground mb-4">
              Join this community to create posts and participate in discussions.
            </p>
          </CardContent>
        </Card>
      )}

      {/* search bar for posts */}
      {isMember && (
        <SearchBar 
          placeholder="Search posts by title or content..."
          onSearch={handleSearch} 
        />
      )}

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">No posts yet</div>
      ) : (
        posts.map((post) => (
          <Card
            key={post.id}
            className="p-5 rounded-xl bg-card shadow-md border border-border"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-foreground">
                {post.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Posted by <span className="font-medium">{post.author?.username || "Unknown"}</span> •{" "}
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </CardHeader>

            <CardContent>
              <p className="text-foreground mb-4">{post.content}</p>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-muted-foreground"
                onClick={() => toggleComments(post.id)}
              >
                {expandedComments[post.id] ? <ChevronDown /> : <ChevronRight />}
                <MessageSquare size={16} />
                <span>Comments</span>
              </Button>

              {expandedComments[post.id] && (
                <div className="mt-4">
                  {comments[post.id]?.length ? (
                    comments[post.id].map((c) => renderCommentTree(c))
                  ) : (
                    <p className="text-sm text-muted-foreground">No comments yet.</p>
                  )}

                  {isMember ? (
                    <div className="mt-4">
                      <Textarea
                        placeholder="Add a comment..."
                        value={commentText[post.id] || ""}
                        onChange={(e) =>
                          setCommentText((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        className="min-h-[70px]"
                      />
                      <Button className="mt-2" onClick={() => handleAddComment(post.id)}>
                        Comment
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-4 p-4 bg-muted border border-border rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Join this community</span> to comment on posts.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};





