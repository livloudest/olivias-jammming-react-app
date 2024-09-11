import React from "react";

import styles from "../css/SearchResults.module.css";

// TODO: Update the props that are passed here, currently they don't match
const SearchResults = ({ tracks, searched, addTrackToPlaylist }) => {
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
                // TODO clicking should add / append the track object to the selected tracks
                // in the App (parent component)
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
