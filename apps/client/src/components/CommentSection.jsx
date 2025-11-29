import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { getInitials, getAvatarColor } from "../utils/getInitials";
import "../styles/CommentSection.css";

// Helper functions for recursive updates
const addReplyRecursively = (comments, targetId, newReply) => {
  return comments.map((comment) => {
    if (comment.id === targetId) {
      return { ...comment, replies: [...(comment.replies || []), newReply] };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: addReplyRecursively(comment.replies, targetId, newReply),
      };
    }
    return comment;
  });
};

const editCommentRecursively = (comments, targetId, newText) => {
  return comments.map((comment) => {
    if (comment.id === targetId) {
      return { ...comment, text: newText };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: editCommentRecursively(comment.replies, targetId, newText),
      };
    }
    return comment;
  });
};

const deleteCommentRecursively = (comments, targetId) => {
  return comments
    .filter((c) => c.id !== targetId)
    .map((comment) => {
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: deleteCommentRecursively(comment.replies, targetId),
        };
      }
      return comment;
    });
};

export default function CommentSection({ comicId }) {
  const { user, isLoggedIn } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // State for editing and replying
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Load comments from localStorage
  useEffect(() => {
    const storedComments = localStorage.getItem(`comments-${comicId}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, [comicId]);

  const updateLocalStorage = (newComments) => {
    setComments(newComments);
    localStorage.setItem(`comments-${comicId}`, JSON.stringify(newComments));
  };

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
      replies: [],
    };

    const updatedComments = [comment, ...comments];
    updateLocalStorage(updatedComments);
    setNewComment("");
  };

  const handleDelete = (commentId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus komentar ini?"))
      return;

    const updatedComments = deleteCommentRecursively(comments, commentId);
    updateLocalStorage(updatedComments);
  };

  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
    setReplyingId(null);
  };

  const saveEdit = (commentId) => {
    if (!editText.trim()) return;

    const updatedComments = editCommentRecursively(
      comments,
      commentId,
      editText
    );
    updateLocalStorage(updatedComments);
    setEditingId(null);
    setEditText("");
  };

  const startReply = (commentId) => {
    setReplyingId(commentId);
    setReplyText("");
    setEditingId(null);
  };

  const submitReply = (parentId) => {
    if (!replyText.trim()) return;

    const reply = {
      id: Date.now(),
      userId: user?.email || "guest",
      username: user?.username || "Guest",
      avatar: user?.avatar,
      text: replyText,
      date: new Date().toISOString(),
      replies: [],
    };

    const updatedComments = addReplyRecursively(comments, parentId, reply);
    updateLocalStorage(updatedComments);
    setReplyingId(null);
    setReplyText("");
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderCommentItem = (comment) => {
    const isEditing = editingId === comment.id;
    const isReplying = replyingId === comment.id;
    const isOwner = user && user.email === comment.userId;

    return (
      <div key={comment.id} className="comment-item-wrapper">
        <div className="comment-item">
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
              <span className="comment-item__username">{comment.username}</span>
              <span className="comment-item__date">
                {formatDate(comment.date)}
              </span>
            </div>

            {isEditing ? (
              <div className="comment-item__edit-form">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="comment-section__input p-2 text-sm"
                  rows="2"
                />
                <div className="comment-item__edit-actions">
                  <button
                    onClick={() => setEditingId(null)}
                    className="comment-item__cancel-btn"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => saveEdit(comment.id)}
                    className="comment-item__save-btn"
                  >
                    Simpan
                  </button>
                </div>
              </div>
            ) : (
              <p className="comment-item__text">{comment.text}</p>
            )}

            {/* Actions: Reply, Edit, Delete */}
            {!isEditing && (
              <div className="comment-item__actions">
                {isLoggedIn && (
                  <button
                    onClick={() => startReply(comment.id)}
                    className="comment-item__action-btn"
                  >
                    Balas
                  </button>
                )}
                {isOwner && (
                  <>
                    <button
                      onClick={() => startEdit(comment)}
                      className="comment-item__action-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="comment-item__action-btn comment-item__action-btn--delete"
                    >
                      Hapus
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Reply Form */}
            {isReplying && (
              <div className="comment-item__reply-form">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Balas ${comment.username}...`}
                  className="comment-section__input p-2 text-sm"
                  rows="2"
                />
                <div className="comment-item__edit-actions">
                  <button
                    onClick={() => setReplyingId(null)}
                    className="comment-item__cancel-btn"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => submitReply(comment.id)}
                    className="comment-item__save-btn"
                  >
                    Kirim Balasan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Render Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="comment-item__replies">
            {comment.replies.map((reply) => renderCommentItem(reply))}
          </div>
        )}
      </div>
    );
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
          comments.map((comment) => renderCommentItem(comment))
        ) : (
          <p className="comment-section__empty">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        )}
      </div>
    </div>
  );
}
