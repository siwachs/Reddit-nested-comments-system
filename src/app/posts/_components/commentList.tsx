"use client";

import { FaEdit, FaHeart, FaReply, FaTrash } from "react-icons/fa";
import IconButton from "./iconbutton";

// Intl offers APIs for formatting and parsing strings according to the language and cultural conventions of a specified locale
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

type Comment = {
  id: string;
  user: { name: string };
  createdAt: string;
  message: string;
};

const CommentList: React.FC<{
  commentsGroup: {
    [key: string]: Comment[];
  };
}> = ({ commentsGroup }) => {
  const getReplies = (parentId: string = "null") => {
    return commentsGroup[parentId];
  };

  return getReplies().map((comment) => (
    <div key={comment.id} className="comment-stack">
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
    </div>
  ));
};

export default CommentList;
