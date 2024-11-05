import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./css/App.module.css";
import Login from "./components/Login.jsx";
import SearchForm from "./components/SearchForm.jsx";
import SearchResults from "./components/SearchResults.jsx";
import PlaylistForm from "./components/PlaylistForm.jsx";
import TrackList from "./components/TrackList.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Background from "./components/Background.jsx";
import './css/index.module.css'

function App() {
  const CLIENT_ID = "ffef7cd625344c70ba42775465c170e7";
  // const REDIRECT_URI = "http://localhost:5173/";
  const REDIRECT_URI = "https://olivias-jammming-spotify-project.netlify.app/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [tracks, setTracks] = useState([]);
  const [searched, setSearched] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState([]);

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
      // console.log("userId:", userId);
    } catch (error) {
      console.error("error fetching user ID:", error.response?.data || error);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.gridContainer}>
        <Background />
        <header className={styles.header}>Jammming Spotify App</header>

        {/* Render login/logout button */}
        <Login
          token={token}
          CLIENT_ID={CLIENT_ID}
          REDIRECT_URI={REDIRECT_URI}
          AUTH_ENDPOINT={AUTH_ENDPOINT}
          RESPONSE_TYPE={RESPONSE_TYPE}
          setToken={setToken}
          setUserId={setUserId}
        />

        {!token && (
          <div className={styles.centeredMessage}>
            <h2>Please Login to Spotify to continue</h2>
          </div>
        )}

        {/* Only display the search and playlist components if the user is logged in */}
        {token && (
          <>
            <div className={styles.searchHeader}>
              <h1>Search for a track</h1>
            </div>
            <div className={styles.playlistHeader}>
              <h1>Create a Playlist</h1>
            </div>

            {/* Search form component */}
            <SearchForm
              token={token}
              searchKey={searchKey}
              setSearchKey={setSearchKey}
              setTracks={setTracks}
              setSearched={setSearched}
            />

            {/* Passes tracks and addTrackToPlaylist to SearchResults */}
            <SearchResults
              tracks={tracks}
              token={token}
              searched={searched}
              selectedPlaylist={selectedPlaylist}
              setSelectedTracks={setSelectedTracks}
              selectedTracks={selectedTracks}
              selectedPlaylistTracks={selectedPlaylistTracks}
              setSelectedPlaylistTracks={setSelectedPlaylistTracks}
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
              setSelectedPlaylist={setSelectedPlaylist}
              selectedPlaylistTracks={selectedPlaylistTracks}
              setSelectedPlaylistTracks={setSelectedPlaylistTracks}
            />

            {/* TrackList component */}
            <TrackList
              tracks={selectedTracks}
              setTracks={setSelectedTracks}
              searchResults={tracks}
              setSearchResults={setTracks}
              token={token}
              selectedPlaylist={selectedPlaylist}
            />
          </>
        )}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition:Bounce
        />
      </div>
    </main>
  );
}

export default App;
