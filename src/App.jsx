import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./css/App.module.css";
import Login from './components/login';
import SearchForm from "./components/SearchForm";

function App() {
  const CLIENT_ID = "ffef7cd625344c70ba42775465c170e7";
  const REDIRECT_URI = "http://localhost:5173/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [tracks, setTracks] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };
  const searchTracks = async (e) => {
    e.preventDefault();
    setSearched(true);
    try {
      const response = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: searchKey,
          type: "track",
        },
      });

      setTracks(response.data.tracks.items);
      console.log(response.data.tracks.items); // Log the updated artists right after setting state
    } catch (error) {
      console.error("Error fetching artists:", error);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.gridContainer}>
        <header className={styles.header}>Jammming Spotify App</header>
        <div className={styles.searchForTrack}>
          <h1>Search for a track</h1>
        </div>

        {/* Search form component */}
        <SearchForm 
         token={token}
         setSearchKey={setSearchKey}
         searchTracks={searchTracks}
         />
         
        {/* Login component */}
        <Login 
                  token={token}
                  CLIENT_ID={CLIENT_ID}
                  REDIRECT_URI={REDIRECT_URI}
                  AUTH_ENDPOINT={AUTH_ENDPOINT}
                  RESPONSE_TYPE={RESPONSE_TYPE}
                  logout={logout}
        />

        <div className={styles.resultsContainer}>
          {searched && tracks.length === 0 ? (
            <p>No tracks found</p>
          ) : (
            tracks.map((track) => (
              <div key={track.id} className={styles.trackCard}>
                {/* Display track name */}
                <h3>{track.name}</h3>

                <h5>{track.artists.map((artist) => artist.name).join(", ")}</h5>
              </div>
            ))
          )}
        </div>

        <footer className={styles.footer}>This is a footer</footer>
      </div>
    </main>
  );
}

export default App;
