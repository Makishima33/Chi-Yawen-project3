import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUser({ id: decodedToken.id, username: decodedToken.username });
    }
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("jwtToken")
  );
  // Login Function
  const login = (token) => {
    localStorage.setItem("jwtToken", token);
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    setUser({ id: decodedToken.id, username: decodedToken.username });
    setIsLoggedIn(true);
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem("jwtToken");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        username: user?.username,
        userId: user?.id,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// PropTypes Validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
