"use client";

import { useState, useEffect } from "react";
import CommentListWrapper from "../_components/commentListWrapper";

export default function Post(
  req: Readonly<{
    params: { postId: string; searchParams: {} };
  }>
) {
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<PostObj | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getPost = async () => {
      try {
        const postResponse = await fetch(`/api/posts/${req.params.postId}`, {
          signal,
        });
        if (!postResponse.ok) {
          throw new Error("Network response failed.");
        }

        const { post } = await postResponse.json();
        setPost(post);
        setError(undefined);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getPost();

    () => abortController.abort();
  }, [req.params.postId]);

  return (
    <main className="container">
      {loading ? (
        <h3 className="comments-title">Loading ...</h3>
      ) : error ? (
        <h1 className="error-msg">{error}</h1>
      ) : (
        <>
          <h1>{post?.title}</h1>
          <article>{post?.body}</article>
          <h3 className="comments-title">Comments</h3>
          <CommentListWrapper comments={post?.comments!} />
        </>
      )}
    </main>
  );
}
