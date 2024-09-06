import React, { useState, useEffect } from "react";
import axios from "axios";

import "./css/App.module.css";

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
    <div className="App, grid-container">
      <header className="header">Jammming Spotify App</header>
      <main>
      <h1>Search for a Track</h1>
      {token ? (
        <form id="search" onSubmit={searchTracks}>
          <input
            id="input"
            name="input"
            type="text"
            onChange={(e) => setSearchKey(e.target.value)}
          />

          <button type="submit">Search</button>
        </form>
      ) : (
        <h2>Please login to search</h2>
      )}

      {!token ? (
        <a
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
        >
          Login to Spotify
        </a>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
      <div className="track-list">
        {searched && tracks.length === 0 ? (
          <p>No tracks found</p>
        ) : (
          tracks.map((track) => (
            <div key={track.id} className="track-card">
              {/* Display track name */}
              <h3>{track.name}</h3>

              <h5>{track.artists.map(artist => artist.name).join(', ')}</h5>
            </div>
          ))
        )}
      </div>
      </main>
      <footer>
        This is a footer
      </footer>
    </div>
  );
}

export default App;
