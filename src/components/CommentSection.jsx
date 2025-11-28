import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getInitials, getAvatarColor } from "../utils/getInitials";
import "../styles/CommentSection.css";

export default function CommentSection({ comicId }) {
  const { user, isLoggedIn } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Load comments from localStorage
  useEffect(() => {
    const storedComments = localStorage.getItem(`comments-${comicId}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, [comicId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      userId: user?.email || "guest",
      username: user?.username || "Guest",
      avatar: user?.avatar,
      text: newComment,
      date: new Date().toISOString(),
    };

    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(
      `comments-${comicId}`,
      JSON.stringify(updatedComments)
    );
    setNewComment("");
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="comment-section">
      <h3 className="comment-section__title">Komentar ({comments.length})</h3>

      {/* Input Form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="comment-section__form">
          <div className="comment-section__input-wrapper">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tulis komentar Anda..."
              className="comment-section__input"
              rows="3"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="comment-section__submit"
            >
              Kirim
            </button>
          </div>
        </form>
      ) : (
        <div className="comment-section__auth-message">
          Silakan{" "}
          <a href="/login" className="text-primary hover:underline">
            login
          </a>{" "}
          untuk menulis komentar.
        </div>
      )}

      {/* Comments List */}
      <div className="comment-section__list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-item__avatar">
                {comment.avatar ? (
                  <img src={comment.avatar} alt={comment.username} />
                ) : (
                  <div
                    className="comment-item__initials"
                    style={{
                      backgroundColor: getAvatarColor(comment.username),
                    }}
                  >
                    {getInitials(comment.username)}
                  </div>
                )}
              </div>
              <div className="comment-item__content">
                <div className="comment-item__header">
                  <span className="comment-item__username">
                    {comment.username}
                  </span>
                  <span className="comment-item__date">
                    {formatDate(comment.date)}
                  </span>
                </div>
                <p className="comment-item__text">{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="comment-section__empty">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        )}
      </div>
    </div>
  );
}
