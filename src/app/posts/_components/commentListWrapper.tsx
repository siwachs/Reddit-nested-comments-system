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
          <CommentList comments={rootComments} />
        </div>
      )}
    </section>
  );
};

const CommentList: React.FC<{ comments: CommentObj[] }> = ({ comments }) => {
  return comments.map((comment) => (
    <div key={comment.id} className="comment-stack">
      <Comment comment={comment} />
    </div>
  ));
};

const Comment: React.FC<{ comment: CommentObj }> = ({ comment }) => {
  return <div>{comment.message}</div>;
};

export default CommentListWrapper;
