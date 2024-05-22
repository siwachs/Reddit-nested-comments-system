import {
  createContext,
  useState,
  useMemo,
  useEffect,
  useContext,
  useCallback,
} from "react";

type ContextType = {
  id: string;
  makeComment: (message: string, parentId: string | null) => void;
  makeCommentLoading: boolean;
  makeCommentError: string | undefined;
  postLoading: boolean;
  postError: string | undefined;
  post: PostObj | null;
  rootComments: CommentObj[];
  getReplies: (parentId?: string) => CommentObj[];
  comments: CommentObj[];
};

const PostContext = createContext<ContextType | undefined>(undefined);

export function usePost() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within a PostProvider");
  }

  return context;
}

export function PostProvider({
  id,
  children,
}: Readonly<{
  id: string;
  children: React.ReactNode;
}>) {
  const [makeCommentLoading, setMakeCommentLoading] = useState(false);
  const [makeCommentError, setMakeCommentError] = useState<string | undefined>(
    undefined
  );

  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState<string | undefined>(undefined);
  const [post, setPost] = useState<PostObj | null>(null);
  const [comments, setComments] = useState<CommentObj[]>([]);

  // Run onMount and on post id change
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const getPost = async () => {
      try {
        setPostLoading(true);
        const postResponse = await fetch(`/api/posts/${id}`, {
          signal,
        });
        if (!postResponse.ok) {
          throw new Error("Network response failed.");
        }

        const { post } = await postResponse.json();
        setPost({ title: post.title, body: post.body });
        setComments(post.comments);
        setPostError(undefined);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          setPostError(error.message);
        }
      } finally {
        if (!signal.aborted) {
          setPostLoading(false);
        }
      }
    };

    getPost();

    return () => {
      abortController.abort();
    };
  }, [id]);

  const getCommentsByParentId = useMemo(() => {
    const groups: Record<string, CommentObj[]> = {};

    comments.forEach((comment) => {
      const parentIdString = comment.parentId?.toString() ?? "root";
      groups[parentIdString] ||= [];
      groups[parentIdString].push(comment);
    });

    return groups;
  }, [comments]);

  const getReplies = useCallback(
    (parentId = "root") => {
      return getCommentsByParentId[parentId] || [];
    },
    [getCommentsByParentId]
  );

  const makeComment = useCallback(
    async (message: string, parentId: string | null) => {
      if (makeCommentLoading || !message.trim()) return;

      try {
        setMakeCommentLoading(true);
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
        setComments((prev) => [parsedCommentResponse.comment, ...prev]);
      } catch (error: any) {
        setMakeCommentError(error.message);
      } finally {
        setMakeCommentLoading(false);
      }
    },
    [id, makeCommentLoading]
  );

  const contextValue = useMemo(
    () => ({
      id,
      postLoading,
      postError,
      post,
      rootComments: getReplies(),
      getReplies,
      makeCommentLoading,
      makeCommentError,
      makeComment,
      comments,
    }),
    [
      id,
      post,
      postLoading,
      postError,
      getReplies,
      makeCommentLoading,
      makeCommentError,
      makeComment,
      comments,
    ]
  );

  return (
    <PostContext.Provider value={contextValue}>{children}</PostContext.Provider>
  );
}
