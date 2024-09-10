import React from "react";

import styles from "../css/SearchResults.module.css";

const SearchResults = ({ tracks, searched }) => {
  return (
    <div className={styles.resultsContainer}>
      {searched && tracks.length === 0 ? (
        <p>No results found</p>
      ) : (
        tracks.map((track) => (
          <div key={track.id} className={styles.trackCard}>
            {track.album.images.length > 0 && (
                <img
                src={track.album.images[0].url}
                alt={track.name}
                className={styles.albumImage}
                />
            )}
            <div className={styles.trackInfo}>
            <h3>{track.name}</h3>
            <h5>{track.artists.map((artist) => artist.name).join(", ")}</h5>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResults;
