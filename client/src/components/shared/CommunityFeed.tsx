import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import type { Post, Comment } from "@/schema/index";
import { posts } from "@/services/data";

interface CommunityFeedProps {
  communityId: string;
}

export async function getPostsByCommunity(communityId: string) {
  return posts.filter((p) => p.communityId === communityId);
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ communityId }) => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const res = await fetch(`/api/communities/${communityId}/posts`);
  //       const data = await res.json();
  //       setPosts(data);
  //     } catch (err) {
  //       console.error("Failed to fetch posts:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchPosts();
  // }, [communityId]);

  useEffect(() => {
    const load = async () => {
      const data = await getPostsByCommunity(communityId);
      setPosts(data);
      setLoading(false);
    };
    load();
  }, [communityId]);

  const handleAddComment = async (postId: string, parentId?: string) => {
    const text = commentText[postId + (parentId ?? "")];
    if (!text.trim()) return;

    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          parentCommentId: parentId ?? null,
          content: text,
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

  const renderComments = (comments: Comment[], postId: string, depth = 0) => {
    return (
      <div className="space-y-3 ml-4 border-l pl-4">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <div>
              <p className="text-sm font-semibold">{comment.user.username}</p>
              <p className="text-sm text-gray-700">{comment.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Reply form */}
            <div className="ml-2">
              <Textarea
                placeholder="Write a reply..."
                value={commentText[postId + comment.id] || ""}
                onChange={(e) =>
                  setCommentText((prev) => ({
                    ...prev,
                    [postId + comment.id]: e.target.value,
                  }))
                }
              />
              <Button
                size="sm"
                className="mt-1"
                onClick={() => handleAddComment(postId, comment.id)}
              >
                Reply
              </Button>
            </div>

            {/* Render nested replies recursively */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-4">
                {renderComments(comment.replies, postId, depth + 1)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <p>Loading community feed...</p>;

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="p-4 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <p className="text-sm text-gray-500">
              by {post.author.username} •{" "}
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </CardHeader>
          <CardContent>
            <p className="mb-3">{post.content}</p>

            <Separator className="my-3" />

            <h4 className="text-sm font-semibold mb-2">Comments</h4>
            {post.comments.length > 0 ? (
              renderComments(post.comments, post.id)
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}

            <div className="mt-3">
              <Textarea
                placeholder="Write a comment..."
                value={commentText[post.id] || ""}
                onChange={(e) =>
                  setCommentText((prev) => ({
                    ...prev,
                    [post.id]: e.target.value,
                  }))
                }
              />
              <Button
                className="mt-2"
                onClick={() => handleAddComment(post.id)}
              >
                Add Comment
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
