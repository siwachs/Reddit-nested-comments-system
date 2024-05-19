import Link from "next/link";

import { getPostsLinks } from "@/lib/postService";

export default async function Home() {
  const posts = await getPostsLinks();

  return (
    <main className="container">
      {posts.length === 0 ? (
        <h1 className="error-msg">No Posts found.</h1>
      ) : (
        posts.map((post, index) => (
          <h1 key={index}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </h1>
        ))
      )}
    </main>
  );
}
