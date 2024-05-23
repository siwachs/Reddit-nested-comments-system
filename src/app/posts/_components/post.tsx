import { useState } from "react";
import { usePost } from "@/context/postContext";
import { FaEdit, FaHeart, FaReply, FaTrash } from "react-icons/fa";
import IconButton from "./iconbutton";
import CommentForm from "./commentForm";

const Post = () => {
  const {
    post,
    postLoading,
    postError,
    rootComments,
    makeCommentLoading,
    makeCommentError,
    makeComment,
  } = usePost()!;

  function getMainContent() {
    if (postLoading) return <h1 className="comments-title">Loading...</h1>;
    if (postError) return <h1 className="error-msg">{postError}</h1>;

    return (
      <>
        <h1>{post?.title}</h1>
        <article>{post?.body}</article>
        <h3 className="comments-title">Comments</h3>
        <section>
          <CommentForm
            autoFocus
            loading={makeCommentLoading}
            error={makeCommentError}
            onSubmit={makeComment}
          />
          {rootComments.length > 0 && (
            <div className="mt-4">
              <CommentList comments={rootComments} />
            </div>
          )}
        </section>
      </>
    );
  }

  return <main className="container">{getMainContent()}</main>;
};

const CommentList: React.FC<{ comments: CommentObj[] }> = ({ comments }) => {
  return comments.map((comment) => (
    <div key={comment.id} className="comment-stack">
      <Comment comment={comment} />
    </div>
  ));
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const Comment: React.FC<{ comment: CommentObj }> = ({ comment }) => {
  const {
    makeCommentLoading,
    makeCommentError,
    makeComment,
    getReplies,
    editComment,
  } = usePost();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);
  const childComments = getReplies(comment.id);

  return (
    <>
      <div className="comment">
        <div className="header">
          <span className="name">{comment.user.name}</span>
          <span className="date">
            {dateFormatter.format(Date.parse(comment.createdAt))}
          </span>
        </div>

        {isEditing ? (
          <CommentForm
            autoFocus
            loading={makeCommentLoading}
            error={makeCommentError}
            onSubmit={editComment}
            initialMessage={comment.message}
            closeForm={setIsEditing}
            parentId={comment.id}
          />
        ) : (
          <div className="message">{comment.message}</div>
        )}

        <div className="footer">
          <IconButton Icon={<FaHeart />} aria-label="Like">
            2
          </IconButton>
          <IconButton
            onClick={() => setIsReplying((prev) => !prev)}
            isActive={isReplying}
            Icon={<FaReply />}
            aria-label={isReplying ? "Cancel Reply" : "Reply"}
          />
          <IconButton
            onClick={() => setIsEditing((prev) => !prev)}
            isActive={isEditing}
            Icon={<FaEdit />}
            aria-label={isEditing ? "Cancel Edit" : "Edit"}
          />
          <IconButton Icon={<FaTrash />} aria-label="Delete" color="danger" />
        </div>
      </div>

      {isReplying && (
        <div className="mt-1 ml-3">
          <CommentForm
            autoFocus
            loading={makeCommentLoading}
            error={makeCommentError}
            onSubmit={makeComment}
            parentId={comment.id}
            closeForm={setIsReplying}
          />
        </div>
      )}

      {childComments.length > 0 && (
        <>
          <div
            className={`nested-comments-stack ${
              areChildrenHidden ? "hide" : ""
            }`}
          >
            <button
              onClick={() => setAreChildrenHidden(true)}
              className="collapse-line"
              aria-label="Hide Replies"
            />

            {/* Child comments recursive */}
            <div className="nested-comments">
              <CommentList comments={childComments} />
            </div>
          </div>

          <button
            onClick={() => setAreChildrenHidden(false)}
            className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`}
          >
            Show Replies
          </button>
        </>
      )}
    </>
  );
};

export default Post;
