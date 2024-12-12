import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import "../styles/Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsLoggedIn(!!token);
    fetch("http://localhost:8001/api/posts")
      .then((res) => res.json())
      .then((data) => {
        const normalizedPosts = data.map((post) => ({
          ...post,
          user:
            typeof post.user === "string"
              ? { _id: post.user, username: "Unknown" }
              : post.user,
        }));
        setPosts(normalizedPosts);
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  // Handle post creation
  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  // Handle post updates
  const handlePostUpdated = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  // Handle post deletion
  const handlePostDeleted = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  return (
    <div className="home-container">
      <h1>All Posts</h1>
      {isLoggedIn ? (
        <PostForm onPostCreated={handlePostCreated} />
      ) : (
        <p className="no-posts-message">
          You must be logged in to create a post.
        </p>
      )}

      {posts.length > 0 ? (
        <div className="posts-list">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          ))}
        </div>
      ) : (
        <p className="no-posts-message">
          No posts available. Be the first to post!
        </p>
      )}
    </div>
  );
};

// PropTypes validation
Home.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
      }).isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ),
  handlePostCreated: PropTypes.func,
  handlePostUpdated: PropTypes.func,
  handlePostDeleted: PropTypes.func,
};

export default Home;
