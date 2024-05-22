import { createContext, useState, useMemo, useEffect, useContext } from "react";

type ContextType = {
  addComment: (message: string, parentId: string | null) => void;
  addCommentLoading: boolean;
  addCommentError: string | undefined;
  id: string;
  post: PostObj | null;
  rootComments: CommentObj[];
  getReplies: (parentId?: string) => CommentObj[];
};

const PostContext = createContext<ContextType>({
  addComment: (message, parentId) => {},
  addCommentLoading: false,
  addCommentError: undefined,
  id: "0",
  post: null,
  rootComments: [],
  getReplies: (parentId = "root") => [],
});

export function usePost() {
  return useContext(PostContext);
}

export function PostProvider({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const [addCommentLoading, setAddCommentLoading] = useState(false);
  const [addCommentError, setAddCommentError] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<PostObj | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getPost = async () => {
      try {
        const postResponse = await fetch(`/api/posts/${id}`, {
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
  }, [id]);

  const getCommentsByParentId = useMemo(() => {
    const groups: { [key: string]: CommentObj[] } = {};

    post?.comments.forEach((comment) => {
      const parentIdString = comment.parentId?.toString() || "root";
      groups[parentIdString] ||= [];
      groups[parentIdString].push(comment);
    });

    return groups;
  }, [post?.comments]);

  const getReplies = (parentId = "root") => {
    return getCommentsByParentId[parentId] || [];
  };
  const rootComments = getReplies();

  const addComment = async (message: string, parentId: string | null) => {
    if (addCommentLoading || !message.trim()) return;

    try {
      setAddCommentLoading(true);
      const commentResponse = await fetch(`/api/comments/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, parentId }),
      });

      if (commentResponse.status === 400) {
        throw new Error("Message is required.");
      } else if (!commentResponse.ok) {
        throw new Error("Network response failed.");
      }

      const parsedCommentResponse = await commentResponse.json();
    } catch (error: any) {
      setAddCommentError(error.message);
    } finally {
      setAddCommentLoading(false);
    }
  };

  return (
    <PostContext.Provider
      value={{
        id,
        post,
        rootComments,
        getReplies,
        addCommentLoading,
        addCommentError,
        addComment,
      }}
    >
      <main className="container">
        {loading ? (
          <h1 className="comments-title">Loading...</h1>
        ) : error ? (
          <h1 className="error-msg">{error}</h1>
        ) : (
          children
        )}
      </main>
    </PostContext.Provider>
  );
}
