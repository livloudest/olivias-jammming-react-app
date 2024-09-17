import React from "react";
import styles from "../css/TrackList.module.css";

const TrackList = ({ tracks, setTracks, searchResults, setSearchResults }) => {
  const handleRemoveTrack = (track) => {
    setTracks(tracks.filter((t) => t.id !== track.id));
    setSearchResults([...searchResults, track]);
  };

  return (
    <div className={styles.tracklistContainer}>
      {tracks.length === 0 ? (
        <p>No tracks added yet</p>
      ) : (
        <div>
          {tracks.map((track) => (
            <div key={track.id} className={styles.playlistCard}>
              {track.album?.images?.length > 0 && (
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
                className={styles.removeButton}
                onClick={() => handleRemoveTrack(track)}
              >
                -
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackList;
