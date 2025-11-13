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

interface CommunityFeedProps {
  communityId: string;
  isMember: boolean;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ communityId, isMember }) => {
  const { user } = useAuth();

  const { data: postsData, loading: postsLoading, callApi: callPostsApi } =
    useApi(getPostsInCommunity);

  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [replies, setReplies] = useState<Record<string, Comment[]>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [showReplyBox, setShowReplyBox] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
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
        const commentsList = fetchedComments?.data || fetchedComments || [];
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
        const repliesList = fetchedReplies?.data || fetchedReplies || [];
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
          [parentId]: [...(prev[parentId] || []), newComment as Comment],
        }));
        // Hide the reply box after successful submission
        setShowReplyBox((prev) => ({ ...prev, [parentId]: false }));
      } else {
        // This is a top-level comment - add it directly to the post's comments
        setComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newComment as Comment],
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
      const newPost = createdPost as Post;
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

  const renderCommentTree = (comment: Comment, depth = 0) => {
    const hasReplies = expandedReplies[comment.id];
    const isReplyBoxVisible = showReplyBox[comment.id];
    
    return (
      <div
        key={comment.id}
        className={`ml-${depth * 4} mt-3 border-l border-border pl-3`}
      >
        <div className="bg-muted rounded-md p-3 hover:bg-muted/80 transition">
          <p className="font-semibold text-sm text-foreground">{comment.username || "Unknown User"}</p>
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
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-0">
      {/* Create Post */}
      {isMember ? (
        <Card className="p-3 sm:p-5 rounded-xl bg-card shadow-md border border-border">
          <CardHeader className="pb-3 px-2 sm:px-4">
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
              Create a Post
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-4">
            <input
              type="text"
              placeholder="Title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="w-full mb-3 p-2 border border-border rounded-md text-sm sm:text-base"
            />
            <Textarea
              placeholder="Content"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full min-h-[100px] text-sm sm:text-base"
            />
            <Button onClick={handleCreatePost} disabled={posting} className="mt-2 text-sm sm:text-base">
              {posting ? "Posting..." : "Post"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="p-3 sm:p-5 rounded-xl bg-muted shadow-md border-2 border-dashed border-border">
          <CardContent className="text-center py-6 sm:py-8 px-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground/60 mb-3"
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
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Members Only</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 px-4">
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
        <div className="text-center text-muted-foreground py-10 text-sm sm:text-base">No posts yet</div>
      ) : (
        posts.map((post) => (
          <Card
            key={post.id}
            className="p-3 sm:p-5 rounded-xl bg-card shadow-md border border-border"
          >
            <CardHeader className="pb-3 px-2 sm:px-4">
              <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
                {post.title}
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Posted by <span className="font-medium">{post.authorName || "Unknown"}</span> •{" "}
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </CardHeader>

            <CardContent className="px-2 sm:px-4">
              <p className="text-foreground mb-4 text-sm sm:text-base">{post.content}</p>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 sm:space-x-2 text-muted-foreground text-xs sm:text-sm"
                onClick={() => toggleComments(post.id)}
              >
                {expandedComments[post.id] ? <ChevronDown size={14} className="sm:w-4 sm:h-4" /> : <ChevronRight size={14} className="sm:w-4 sm:h-4" />}
                <MessageSquare size={14} className="sm:w-4 sm:h-4" />
                <span>Comments</span>
              </Button>

              {expandedComments[post.id] && (
                <div className="mt-4">
                  {comments[post.id]?.length ? (
                    comments[post.id].map((c) => renderCommentTree(c))
                  ) : (
                    <p className="text-xs sm:text-sm text-muted-foreground">No comments yet.</p>
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
                        className="min-h-[70px] text-sm sm:text-base"
                      />
                      <Button className="mt-2 text-xs sm:text-sm" onClick={() => handleAddComment(post.id)}>
                        Comment
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 sm:p-4 bg-muted border border-border rounded-lg text-center">
                      <p className="text-xs sm:text-sm text-muted-foreground">
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





