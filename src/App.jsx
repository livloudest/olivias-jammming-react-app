import React, { useState, useEffect } from "react";
import axios from "axios";

import "./css/App.module.css";


function App() {
  const CLIENT_ID = "ffef7cd625344c70ba42775465c170e7";
  const REDIRECT_URI = "http://localhost:5173/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState('');
  const [artists, setArtists] = useState([]);

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

  const searchArtists = async (e) => {
    e.preventDefault();
    const {data} = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: searchKey,
        type: 'artist'
      }
    })

    setArtists(data.artists.items)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Jammming Spotify App</h1>

        {token ? (
          <form id='search' onSubmit={searchArtists}>
            <input id="input" name="input" type="text" onChange={e => setSearchKey(e.target.value)} />
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
      </header>
    </div>
  );
}

export default App;
