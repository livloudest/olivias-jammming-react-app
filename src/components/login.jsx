import React from "react";

import styles from "../css/Login.module.css";

const Login = ({
  token,
  CLIENT_ID,
  REDIRECT_URI,
  AUTH_ENDPOINT,
  RESPONSE_TYPE,
  setToken,
  setUserId,
}) => {
  const SCOPES = "playlist-modify-public playlist-modify-private";
  const loginURL = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(
    SCOPES
  )}&show_dialog=true`;
  // console.log(loginURL);

  const logout = () => {
    setToken("");
    setUserId("");
    window.localStorage.removeItem("token");
  };

  return (
    <div className={styles.loginContainer}>
      {!token ? (
        <a href={loginURL} className={styles.loginButton}>
          Login to Spotify
        </a>
      ) : (
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      )}
    </div>
  );
};

export default Login;
