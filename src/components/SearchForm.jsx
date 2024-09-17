import React from "react";
import styles from "../css/SearchForm.module.css";
import axios from "axios";

const SearchForm = ({
  token,
  searchKey,
  setSearchKey,
  setTracks,
  setSearched,
}) => {
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
      console.log(response.data.tracks.items); // Log the updated tracks after setting state
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  return (
    <div className={styles.searchForm}>
      {token ? (
        <form id="search" onSubmit={searchTracks}>
          <input
            id="input"
            name="input"
            type="text"
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder="Enter a track name"
          />
          <button type="submit">Search</button>
        </form>
      ) : (
        <h2>Please login to search</h2>
      )}
    </div>
  );
};

export default SearchForm;
