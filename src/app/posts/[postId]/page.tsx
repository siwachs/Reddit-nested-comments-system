"use client";

import { PostProvider } from "@/context/postContext";
import Post from "../_components/post";

export default function PostPage(
  req: Readonly<{
    params: { postId: string; searchParams: {} };
  }>
) {
  return (
    <PostProvider id={req.params.postId}>
      <Post />
    </PostProvider>
  );
}
