import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./css/App.module.css";
import Login from "./components/Login";
import SearchForm from "./components/SearchForm";
import SearchResults from "./components/SearchResults";
import PlaylistForm from "./components/PlaylistForm";
import TrackList from "./components/TrackList";

function App() {
  const CLIENT_ID = "ffef7cd625344c70ba42775465c170e7";
  const REDIRECT_URI = "http://localhost:5173/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [tracks, setTracks] = useState([]);
  const [searched, setSearched] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [userId, setUserId] = useState("");

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

  useEffect(() => {
    if (token) {
      fetchUserId();
    }
  }, [token]);

  const fetchUserId = async () => {
    try {
      const response = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserId(response.data.id);
      console.log("userId:", userId);
    } catch (error) {
      console.error("error fetching user ID:", error.response?.data || error);
    }
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

  const addTrackToPlaylist = (track) => {
    if (!selectedTracks.find((t) => t.id === track.id)) {
      setSelectedTracks((prev) => [...prev, track]);
    }
  };

  return (
    <main className={styles.main}>
      {/* <div className={styles.debug}>
        userId: {userId} <br></br>
        token: {token.substring(0, 20)}
      </div> */}

      <div className={styles.gridContainer}>
        <header className={styles.header}>Jammming Spotify App</header>

        <div className={styles.searchHeader}>
          <h1>Search for a track</h1>
        </div>
        <div className={styles.playlistHeader}>
          <h1>Create a Playlist</h1>
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
          setToken={setToken}
          setUserId={setUserId}
        />

        {/* //Passes tracks and addTrackToPlaylist to SearchResults */}
        <SearchResults
          tracks={tracks}
          token={token}
          addTrackToPlaylist={addTrackToPlaylist}
        />

        {/* Pass selected tracks to PlaylistForm */}
        <PlaylistForm
          tracks={selectedTracks}
          setTracks={setSelectedTracks}
          token={token}
          searchResults={tracks}
          setSearchResults={setTracks}
          userId={userId}
          setUserId={setUserId}
        />

        <TrackList
          tracks={selectedTracks}
          setTracks={setSelectedTracks}
          searchResults={tracks}
          setSearchResults={setTracks}
        />

        <footer className={styles.footer}>This is a footer</footer>
      </div>
    </main>
  );
}

export default App;
