"use client";

import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";

export interface Comment {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

interface CommentsProps {
  blogId: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function Comments({ blogId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  async function fetchComments() {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/comments/${blogId}`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data.comments || []);
    } catch {
      setError("Could not load comments");
    } finally {
      setIsLoading(false);
    }
  }

  const handleCommentAdded = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const handleReplyAdded = (parentId: string, reply: Comment) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === parentId
          ? { ...comment, replies: [...(comment.replies || []), reply] }
          : comment
      )
    );
    setReplyingTo(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return diffMins <= 1 ? "Just now" : `${diffMins} minutes ago`;
      }
      return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    }
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <section className="py-12 md:py-16 border-t border-[var(--border)]">
      <div className="wide-width max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-serif mb-8">
          Comments {comments.length > 0 && <span className="text-[var(--muted)]">({comments.length})</span>}
        </h2>

        {/* Comment Form */}
        <div className="mb-10">
          <CommentForm blogId={blogId} onCommentAdded={handleCommentAdded} />
        </div>

        {/* Comments List */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="skeleton w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-32 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-[var(--muted)] mb-4">{error}</p>
            <button onClick={fetchComments} className="btn btn-secondary text-sm">
              Try Again
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 bg-[var(--background-alt)] rounded-xl">
            <svg className="w-12 h-12 mx-auto mb-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-[var(--muted)] font-serif italic">
              Be the first to share your thoughts...
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {comments.map((comment) => (
              <div key={comment.id} className="group">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-serif text-sm flex-shrink-0">
                    {comment.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{comment.name}</span>
                      <span className="text-xs text-[var(--muted)]">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-[var(--foreground-soft)] leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    <button
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="text-sm text-[var(--accent)] mt-2 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Reply
                    </button>

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <div className="mt-4 pl-4 border-l-2 border-[var(--border)]">
                        <CommentForm
                          blogId={blogId}
                          parentId={comment.id}
                          onCommentAdded={(reply) => handleReplyAdded(comment.id, reply)}
                          onCancel={() => setReplyingTo(null)}
                          isReply
                        />
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-6 space-y-6 pl-4 border-l-2 border-[var(--border)]">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--background-alt)] flex items-center justify-center text-[var(--muted)] font-serif text-xs flex-shrink-0">
                              {reply.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{reply.name}</span>
                                <span className="text-xs text-[var(--muted)]">{formatDate(reply.createdAt)}</span>
                              </div>
                              <p className="text-sm text-[var(--foreground-soft)] leading-relaxed whitespace-pre-wrap">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
