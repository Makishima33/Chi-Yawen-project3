import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import "../styles/Profile.css";

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState("No description provided.");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const { user: loggedInUser } = useContext(AuthContext);

  useEffect(() => {
    if (!userId) {
      console.error("User ID is missing from the URL");
      return;
    }

    fetch(`https://chi-yawen-project3-backend.onrender.com/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        const normalizedPosts = data.posts.map((post) => ({
          ...post,
          user: {
            _id: userId,
            username: data.user.username,
          },
        }));
        setPosts(normalizedPosts);
        setDescription(data.user.description || "No description provided.");
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [userId]);

  const handleSaveDescription = () => {
    const token = localStorage.getItem("jwtToken");

    fetch(
      `https://chi-yawen-project3-backend.onrender.com/api/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setDescription(data.description);
        setIsEditingDescription(false);
      })
      .catch((error) => console.error("Error updating description:", error));
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  const handlePostDeleted = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };
  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>{user.username}</h1>
      {loggedInUser?.id === userId && (
        <PostForm onPostCreated={handlePostCreated} />
      )}
      <p>Joined at: {new Date(user.createdAt).toLocaleString()}</p>
      <div className="description">
        {isEditingDescription && loggedInUser?.id === userId ? (
          <>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleSaveDescription}>Save</button>
            <button onClick={() => setIsEditingDescription(false)}>
              Cancel
            </button>
          </>
        ) : (
          <p>
            {description}
            {loggedInUser?.id === userId && (
              <button
                onClick={() => setIsEditingDescription(true)}
                className="edit-button"
              >
                Edit
              </button>
            )}
          </p>
        )}
      </div>

      <div className="posts-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          ))
        ) : (
          <p>No posts to display.</p>
        )}
      </div>
    </div>
  );
};

ProfilePage.propTypes = {
  userId: PropTypes.string,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    description: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
  }),
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ),
};

export default ProfilePage;
