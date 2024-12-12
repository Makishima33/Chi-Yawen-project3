import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { isLoggedIn, username, userId, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      {isLoggedIn ? (
        <div className="navbar-user">
          <span className="navbar-username">
            <Link to={`/profile/${userId}`}>{username}</Link>
          </span>
          <button onClick={handleLogout} className="navbar-button">
            Logout
          </button>
        </div>
      ) : (
        <div className="navbar-auth">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
