import React from "react";

import styles from "../css/Login.module.css";

const Login = ({ token, CLIENT_ID, REDIRECT_URI, AUTH_ENDPOINT, RESPONSE_TYPE, logout }) => {
    return (
        <div className={styles.loginContainer}>
            {!token ? (
        <a
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
          className={styles.loginButton}
        >
          Login to Spotify
        </a>
      ) : (
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      )}
        </div>
    )
}

export default Login;