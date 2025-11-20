import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronRight, MessageSquare, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Post, Comment } from "@/schema/index";
import { 
  getCommentsInPost, 
  getPostsInCommunity, 
  getRepliesToComment,
  createComment,
  createPost,
  getPostByTitleInCommunity,
  updatePost,
  deletePost,
  updateComment,
  deleteComment
} from "@/services/api";
import { useApi } from "@/hooks/apiHook";
import SearchBar from "./SearchBar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  
  // Edit/Delete states
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editPostTitle, setEditPostTitle] = useState("");
  const [editPostContent, setEditPostContent] = useState("");
  const [editCommentContent, setEditCommentContent] = useState("");
  const [deleteConfirmPost, setDeleteConfirmPost] = useState<Post | null>(null);
  const [deleteConfirmComment, setDeleteConfirmComment] = useState<Comment | null>(null);

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
        toast.success("Reply posted successfully!");
      } else {
        // This is a top-level comment - add it directly to the post's comments
        setComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newComment as Comment],
        }));
        toast.success("Comment posted successfully!");
      }
      
      // Clear the text input
      setCommentText((prev) => ({ ...prev, [postId + (parentId ?? "")]: "" }));
    } catch (err) {
      console.error("Failed to add comment:", err);
      toast.error("Failed to add comment. Please try again.");
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
      toast.success("Post created successfully!");
    } catch (err) {
      console.error("Failed to create post:", err);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
  };

  const handleUpdatePost = async () => {
    if (!editingPost || !editPostTitle.trim() || !editPostContent.trim()) return;
    try {
      await updatePost(editingPost.id, editPostTitle.trim(), editPostContent.trim());
      
      // Update in both posts and allPosts
      const updatedPost = { ...editingPost, title: editPostTitle.trim(), content: editPostContent.trim() };
      setPosts((prev) => prev.map(p => p.id === editingPost.id ? updatedPost : p));
      setAllPosts((prev) => prev.map(p => p.id === editingPost.id ? updatedPost : p));
      
      setEditingPost(null);
      setEditPostTitle("");
      setEditPostContent("");
      toast.success("Post updated successfully!");
    } catch (err) {
      console.error("Failed to update post:", err);
      toast.error("Failed to update post. Please try again.");
    }
  };

  const handleDeletePost = async (post: Post) => {
    try {
      await deletePost(post.id);
      setPosts((prev) => prev.filter(p => p.id !== post.id));
      setAllPosts((prev) => prev.filter(p => p.id !== post.id));
      setDeleteConfirmPost(null);
      toast.success("Post deleted successfully!");
    } catch (err) {
      console.error("Failed to delete post:", err);
      toast.error("Failed to delete post. Please try again.");
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setEditCommentContent(comment.content);
  };

  const handleUpdateComment = async () => {
    if (!editingComment || !editCommentContent.trim()) return;
    try {
      await updateComment(editingComment.id, editCommentContent.trim());
      
      const updatedComment = { ...editingComment, content: editCommentContent.trim() };
      
      // Update in comments or replies based on parentCommentId
      if (editingComment.parentCommentId) {
        // It's a reply
        setReplies((prev) => ({
          ...prev,
          [editingComment.parentCommentId]: prev[editingComment.parentCommentId]?.map(r => 
            r.id === editingComment.id ? updatedComment : r
          ) || []
        }));
      } else {
        // It's a top-level comment
        setComments((prev) => ({
          ...prev,
          [editingComment.postId]: prev[editingComment.postId]?.map(c => 
            c.id === editingComment.id ? updatedComment : c
          ) || []
        }));
      }
      
      setEditingComment(null);
      setEditCommentContent("");
      toast.success("Comment updated successfully!");
    } catch (err) {
      console.error("Failed to update comment:", err);
      toast.error("Failed to update comment. Please try again.");
    }
  };

  const handleDeleteComment = async (comment: Comment) => {
    try {
      await deleteComment(comment.id);
      
      // Remove from comments or replies based on parentCommentId
      if (comment.parentCommentId) {
        // It's a reply
        setReplies((prev) => ({
          ...prev,
          [comment.parentCommentId]: prev[comment.parentCommentId]?.filter(r => r.id !== comment.id) || []
        }));
      } else {
        // It's a top-level comment
        setComments((prev) => ({
          ...prev,
          [comment.postId]: prev[comment.postId]?.filter(c => c.id !== comment.id) || []
        }));
      }
      
      setDeleteConfirmComment(null);
      toast.success("Comment deleted successfully!");
    } catch (err) {
      console.error("Failed to delete comment:", err);
      toast.error("Failed to delete comment. Please try again.");
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
      setPosts(Array.isArray(searchResults.data) ? searchResults.data : []);
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
    const isAuthor = user?.id === comment.userId;
    
    return (
      <div
        key={comment.id}
        className={`ml-${depth * 4} mt-3 border-l border-border pl-3`}
      >
        <div className="bg-muted rounded-md p-3 hover:bg-muted/80 transition">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground">{comment.username || "Unknown User"}</p>
              <p className="text-foreground text-sm mt-1">{comment.content}</p>
            </div>
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditComment(comment)} className="cursor-pointer">
                    <Pencil size={14} className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setDeleteConfirmComment(comment)} 
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
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
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base sm:text-lg font-semibold text-foreground">
                    {post.title}
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Posted by <span className="font-medium">{post.authorName || "Unknown"}</span> •{" "}
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
                {user?.id === post.authorId && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditPost(post)} className="cursor-pointer">
                        <Pencil size={14} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteConfirmPost(post)} 
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
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

      {/* Edit Post Modal */}
      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent className="w-[95vw] sm:max-w-[600px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>Make changes to your post below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <input
                type="text"
                value={editPostTitle}
                onChange={(e) => setEditPostTitle(e.target.value)}
                className="w-full p-2 border border-border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Content</label>
              <Textarea
                value={editPostContent}
                onChange={(e) => setEditPostContent(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditingPost(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePost}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Post Confirmation Modal */}
      <Dialog open={!!deleteConfirmPost} onOpenChange={(open) => !open && setDeleteConfirmPost(null)}>
        <DialogContent className="w-[95vw] sm:max-w-[450px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setDeleteConfirmPost(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirmPost && handleDeletePost(deleteConfirmPost)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Comment Modal */}
      <Dialog open={!!editingComment} onOpenChange={(open) => !open && setEditingComment(null)}>
        <DialogContent className="w-[95vw] sm:max-w-[500px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
            <DialogDescription>Make changes to your comment below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Textarea
              value={editCommentContent}
              onChange={(e) => setEditCommentContent(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditingComment(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateComment}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Comment Confirmation Modal */}
      <Dialog open={!!deleteConfirmComment} onOpenChange={(open) => !open && setDeleteConfirmComment(null)}>
        <DialogContent className="w-[95vw] sm:max-w-[450px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setDeleteConfirmComment(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirmComment && handleDeleteComment(deleteConfirmComment)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};





