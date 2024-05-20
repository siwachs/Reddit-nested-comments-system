import Link from "next/link";

type ParsedPosts = {
  error: boolean;
  postsLinks: {
    id: string;
    title: string;
  }[];
};

export default async function Home() {
  const baseUrl = process.env.BASE_URL;
  const postsEndpoint = process.env.POSTS_ENDPOINT;
  const postsResponse = await fetch(
    `${baseUrl}${postsEndpoint}?getPostsLinks=true`
  );
  const parsedPosts: ParsedPosts = await postsResponse.json();
  const { error, postsLinks } = parsedPosts;

  return (
    <main className="container">
      {error || postsLinks.length === 0 ? (
        <h1 className="error-msg">No Posts found.</h1>
      ) : (
        postsLinks.map((post, index) => (
          <h1 key={index}>
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </h1>
        ))
      )}
    </main>
  );
}
