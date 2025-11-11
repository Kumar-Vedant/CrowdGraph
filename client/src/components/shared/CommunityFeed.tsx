import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronRight, MessageSquare } from "lucide-react";
import type { Post, Comment } from "@/schema/index";
import { getCommentsInPost, getPostsInCommunity, getRepliesToComment } from "@/services/api";
import { useApi } from "@/hooks/apiHook";

interface CommunityFeedProps {
  communityId: string;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ communityId }) => {
  const { user } = useAuth();

  const { data: postsData, loading: postsLoading, callApi: callPostsApi } =
    useApi(getPostsInCommunity);
  const { callApi: callCommentsApi } = useApi(getCommentsInPost);
  const { callApi: callRepliesApi } = useApi(getRepliesToComment);

  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [replies, setReplies] = useState<Record<string, Comment[]>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    callPostsApi(communityId).then((res) => {
      if (res) setPosts(postsData);
    });
  }, [communityId]);

  const toggleComments = async (postId: string) => {
    if (!expandedComments[postId]) {
      const res = await callCommentsApi(postId);
      if (res) setComments((prev) => ({ ...prev, [postId]: res }));
    }
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleReplies = async (commentId: string) => {
    if (!expandedReplies[commentId]) {
      const res = await callRepliesApi(commentId);
      if (res) setReplies((prev) => ({ ...prev, [commentId]: res }));
    }
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

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
        if (parentId) {
          setReplies((prev) => ({
            ...prev,
            [parentId]: [...(prev[parentId] || []), newComment],
          }));
        } else {
          setComments((prev) => ({
            ...prev,
            [postId]: [...(prev[postId] || []), newComment],
          }));
        }
        setCommentText((prev) => ({ ...prev, [postId + (parentId ?? "")]: "" }));
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

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

  const renderCommentTree = (comment: Comment, depth = 0) => {
    const hasReplies = expandedReplies[comment.id];
    return (
      <div
        key={comment.id}
        className={`ml-${depth * 4} mt-3 border-l border-gray-200 pl-3`}
      >
        <div className="bg-gray-50 rounded-md p-3 hover:bg-gray-100 transition">
          <p className="font-semibold text-sm text-gray-800">{comment.user.username}</p>
          <p className="text-gray-700 text-sm">{comment.content}</p>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>{new Date(comment.createdAt).toLocaleString()}</span>
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

        {hasReplies && (
          <div className="ml-6">
            {replies[comment.id]?.map((reply) => renderCommentTree(reply, depth + 1))}
            <div className="mt-2">
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
              <Button
                size="sm"
                variant="secondary"
                className="mt-1"
                onClick={() => handleAddComment(comment.postId, comment.id)}
              >
                Reply
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (postsLoading)
    return (
      <div className="text-center py-6 text-gray-500">Loading community feed...</div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Create Post */}
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
            className="w-full mb-3 p-2 border border-gray-300 rounded-md"
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

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No posts yet</div>
      ) : (
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
              <p className="text-gray-800 mb-4">{post.content}</p>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-gray-600"
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
                      className="min-h-[70px]"
                    />
                    <Button className="mt-2" onClick={() => handleAddComment(post.id)}>
                      Comment
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
