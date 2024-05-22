import { useState } from "react";

const CommentForm: React.FC<{
  initialMessage?: string;
  loading: boolean;
  error: string | undefined;
  autoFocus?: boolean;
  onSubmit: any;
}> = ({ initialMessage = "", loading, error, autoFocus = false, onSubmit }) => {
  const [message, setMessage] = useState(initialMessage);

  const addComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(message, null).then(() => setMessage(""));
  };

  return (
    <form onSubmit={addComment}>
      <div className="comment-form-row">
        <textarea
          autoFocus={autoFocus}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input"
        />
        <button disabled={loading || !message} type="submit" className="btn">
          {loading ? "Loading..." : "Post"}
        </button>
      </div>
      <div className="error-msg">{error}</div>
    </form>
  );
};

export default CommentForm;
