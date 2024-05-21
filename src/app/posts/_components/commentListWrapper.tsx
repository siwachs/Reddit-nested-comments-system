import { useState } from "react";
import { FaEdit, FaHeart, FaReply, FaTrash } from "react-icons/fa";
import IconButton from "./iconbutton";

const CommentListWrapper: React.FC<{ comments: CommentObj[] }> = ({
  comments,
}) => {
  const getCommentsByParentId = () => {
    const groups: { [key: string]: CommentObj[] } = {};

    comments.forEach((comment) => {
      const parentIdString = comment.parentId?.toString() || "root";
      groups[parentIdString] ||= [];
      groups[parentIdString].push(comment);
    });

    return groups;
  };

  const getReplies = (parentId = "root") => {
    return getCommentsByParentId()[parentId];
  };
  const rootComments = getReplies();

  return (
    <section>
      {rootComments && rootComments.length && (
        <div className="mt-4">
          <CommentList comments={rootComments} getReplies={getReplies} />
        </div>
      )}
    </section>
  );
};

const CommentList: React.FC<{
  comments: CommentObj[];
  getReplies: (parentId: string) => CommentObj[] | undefined;
}> = ({ comments, getReplies }) => {
  return comments.map((comment) => (
    <div key={comment.id} className="comment-stack">
      <Comment comment={comment} getReplies={getReplies} />
    </div>
  ));
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const Comment: React.FC<{
  comment: CommentObj;
  getReplies: (parentId: string) => CommentObj[] | undefined;
}> = ({ comment, getReplies }) => {
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

      {childComments && childComments.length && (
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
              <CommentList comments={childComments} getReplies={getReplies} />
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

export default CommentListWrapper;
