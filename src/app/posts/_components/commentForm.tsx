import { useState } from "react";

const CommentForm: React.FC<{
  initialMessage?: string;
  loading: boolean;
  error: string | undefined;
  autoFocus?: boolean;
  onSubmit: any;
  parentId?: string | null;
  closeForm?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  initialMessage = "",
  loading,
  error,
  autoFocus = false,
  onSubmit,
  parentId,
  closeForm,
}) => {
  const [message, setMessage] = useState(initialMessage);

  const makeComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(message, parentId).then(() => {
      setMessage("");
      closeForm && closeForm(false);
    });
  };

  return (
    <form onSubmit={makeComment}>
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
