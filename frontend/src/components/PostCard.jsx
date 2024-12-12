import PropTypes from "prop-types";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import "../styles/PostCard.css";

const PostCard = ({ post, onPostUpdated, onPostDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(post.content);

  // Get logged-in user ID from JWT
  const token = localStorage.getItem("jwtToken");
  const loggedInUserId = token ? jwtDecode(token).id : null;

  // Handle edit
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle save
  const handleSave = () => {
    fetch(
      `https://chi-yawen-project3-backend.onrender.com/api/posts/${post._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newContent }),
      }
    )
      .then((res) => res.json())
      .then((updatedPost) => {
        setIsEditing(false);
        onPostUpdated({
          ...updatedPost,
          user: post.user,
        });
      })
      .catch((error) => console.error("Error updating post:", error));
  };

  // Handle delete
  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    fetch(
      `https://chi-yawen-project3-backend.onrender.com/api/posts/${post._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          onPostDeleted(post._id);
        } else {
          return res.json().then((data) => {
            throw new Error(data.message || "Failed to delete post");
          });
        }
      })
      .catch((error) => console.error("Error deleting post:", error));
  };

  return (
    <div className="post-card">
      <Link to={`/profile/${post.user._id}`} className="post-card-content">
        <div>
          <strong>{post.user.username}</strong>
          <p>{post.content}</p>
        </div>
        <small>{new Date(post.createdAt).toLocaleString()}</small>
      </Link>
      {loggedInUserId === post.user._id && (
        <div className="post-card-buttons">
          {isEditing ? (
            <div className="post-card-edit">
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                maxLength={280}
              />
              <button onClick={handleSave}>Save</button>
              <button
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button onClick={handleEdit}>Edit</button>
              <button className="delete-btn" onClick={handleDelete}>
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// PropTypes validation
PostCard.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onPostUpdated: PropTypes.func.isRequired,
  onPostDeleted: PropTypes.func.isRequired,
};

export default PostCard;
