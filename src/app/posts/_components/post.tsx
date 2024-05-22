import { useState } from "react";
import { usePost } from "@/context/postContext";
import { FaEdit, FaHeart, FaReply, FaTrash } from "react-icons/fa";
import IconButton from "./iconbutton";
import CommentForm from "./commentForm";

const Post = () => {
  const { post, rootComments, addCommentLoading, addCommentError, addComment } =
    usePost();

  return (
    <>
      <h1>{post?.title}</h1>
      <article>{post?.body}</article>
      <h3 className="comments-title">Comments</h3>
      <section>
        <CommentForm
          autoFocus
          loading={addCommentLoading}
          error={addCommentError}
          onSubmit={addComment}
        />
        {rootComments.length && (
          <div className="mt-4">
            <CommentList comments={rootComments} />
          </div>
        )}
      </section>
    </>
  );
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
  const { getReplies } = usePost();
  const [areChildrenHidden, setAreChildrenHidden] = useState(true);
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

        <div className="message">{comment.message}</div>

        <div className="footer">
          <IconButton Icon={<FaHeart />} aria-label="Like">
            2
          </IconButton>
          <IconButton Icon={<FaReply />} aria-label="Reply" />
          <IconButton Icon={<FaEdit />} aria-label="Edit" />
          <IconButton Icon={<FaTrash />} aria-label="Delete" color="danger" />
        </div>
      </div>

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
