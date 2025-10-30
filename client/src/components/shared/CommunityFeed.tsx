import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import type { Post, Comment } from "@/schema/index";

interface CommunityFeedProps {
  communityId: string;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ communityId }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [posting, setPosting] = useState(false);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/communities/${communityId}/posts`);
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [communityId]);

  // Add a new comment/reply
  const handleAddComment = async (postId: string, parentId?: string) => {
    const text = commentText[postId + (parentId ?? "")];
    if (!text?.trim()) return;

    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          parentCommentId: parentId ?? null,
          content: text,
          userId: user?.id,
        }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, comments: [...p.comments, newComment] }
              : p
          )
        );
        setCommentText((prev) => ({ ...prev, [postId + (parentId ?? "")]: "" }));
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  // Add a new post
  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/communities/${communityId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newPostTitle,
          content: newPostContent,
          authorId: user?.id,
        }),
      });
      if (res.ok) {
        const createdPost = await res.json();
        setPosts((prev) => [createdPost, ...prev]);
        setNewPostTitle("");
        setNewPostContent("");
      }
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setPosting(false);
    }
  };

  // Recursive render comments
  const renderComments = (comments: Comment[], postId: string, depth = 0) => (
    <div
      className={`mt-3 space-y-4 ${
        depth > 0 ? "border-l-2 border-gray-200 pl-4 ml-4" : ""
      }`}
    >
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-md bg-gray-50 p-3 shadow-sm hover:bg-gray-100 transition"
        >
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {comment.user.username}
            </p>
            <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>

          
          <div className="mt-2">
            <Textarea
              placeholder="Write a reply..."
              value={commentText[postId + comment.id] || ""}
              onChange={(e) =>
                setCommentText((prev) => ({
                  ...prev,
                  [postId + comment.id]: e.target.value,
                }))
              }
              className="min-h-[60px] bg-white"
            />
            <Button
              size="sm"
              variant="secondary"
              className="mt-1"
              onClick={() => handleAddComment(postId, comment.id)}
            >
              Reply
            </Button>
          </div>

          {comment.replies && comment.replies.length > 0 && (
            <div>{renderComments(comment.replies, postId, depth + 1)}</div>
          )}
        </div>
      ))}
    </div>
  );

  // Loading state
  if (loading)
    return (
      <div className="text-center py-6 text-gray-500">
        Loading community feed...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Create post form */}
      <Card className="p-5 rounded-xl bg-white shadow-md border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Create a Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            placeholder="Title"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            className="w-full mb-3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
          />
          <Textarea
            placeholder="Content"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="w-full mb-3 min-h-[100px] bg-white"
          />
          <Button
            onClick={handleCreatePost}
            disabled={posting}
            className="mt-2"
          >
            {posting ? "Posting..." : "Post"}
          </Button>
        </CardContent>
      </Card>

      {/* No posts message */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
          <p className="text-lg font-medium">No posts yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Be the first to start a discussion in this community.
          </p>
        </div>
      ) : (
        // Render posts
        posts.map((post) => (
          <Card
            key={post.id}
            className="p-5 rounded-xl bg-white shadow-md border border-gray-200"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900">
                {post.title}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Posted by <span className="font-medium">{post.author.username}</span> •{" "}
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </CardHeader>

            <CardContent>
              <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

              <Separator className="my-4" />

              <h4 className="text-sm font-semibold text-gray-700 mb-2">Comments</h4>
              {post.comments.length > 0 ? (
                renderComments(post.comments, post.id)
              ) : (
                <p className="text-sm text-gray-500">No comments yet.</p>
              )}

             
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
                  className="min-h-[70px] bg-white"
                />
                <Button
                  className="mt-2"
                  onClick={() => handleAddComment(post.id)}
                >
                  Comment
                </Button>
              </div>
              
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
