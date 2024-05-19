import { getPost } from "@/lib/postService";
import CommentList from "../_components/commentList";

export default async function Post(req: {
  params: { postId: string; searchParams: {} };
}) {
  const post = await getPost(req.params.postId);

  const getCommentsByParentId = () => {
    const groups: { [key: string]: any[] } = {};

    post?.comments.forEach((comment) => {
      const parentIdString = comment.parentId?.toString() ?? "null";
      groups[parentIdString] ||= [];
      groups[parentIdString].push(comment);
    });

    return groups;
  };

  return (
    <main className="container">
      <h1>{post?.title}</h1>
      <article>{post?.body}</article>

      <h3 className="comments-title">Comments</h3>
      <section>
        <div className="mt-4">
          <CommentList commentsGroup={getCommentsByParentId()} />
        </div>
      </section>
    </main>
  );
}
