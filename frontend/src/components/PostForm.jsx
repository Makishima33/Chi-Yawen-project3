import { useState } from "react";
import PropTypes from "prop-types";
import "../styles/PostForm.css";

const PostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    fetch("https://chi-yawen-project3-backend.onrender.com/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    })
      .then((res) => res.json())
      .then((newPost) => {
        onPostCreated(newPost);
        setContent("");
      })
      .catch((error) => console.error("Error creating post:", error));
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={280}
      />
      <div>
        <button type="submit">Post</button>
      </div>
    </form>
  );
};

// PropTypes for validation
PostForm.propTypes = {
  onPostCreated: PropTypes.func.isRequired,
};

export default PostForm;
