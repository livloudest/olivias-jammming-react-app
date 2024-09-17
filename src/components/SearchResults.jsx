import React from "react";

import styles from "../css/SearchResults.module.css";

// TODO: Update the props that are passed here, currently they don't match
const SearchResults = ({ tracks, searched, setSelectedTracks, selectedTracks }) => {
  
  const addTrackToPlaylist = (track) => {
    if (!selectedTracks.find((t) => t.id === track.id)) {
      setSelectedTracks((prev) => [...prev, track]);
    }
  };
  
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
            <button
                onClick={() => addTrackToPlaylist(track)}
                className={styles.addButton}
                >
                    +
                    </button>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResults;
