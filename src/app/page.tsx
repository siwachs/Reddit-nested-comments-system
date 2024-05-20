import Link from "next/link";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function Home() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  return (
    <main className="container">
      {!posts ? (
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
