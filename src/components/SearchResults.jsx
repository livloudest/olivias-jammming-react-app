import React from "react";
import styles from "../css/SearchResults.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SearchResults = ({
  tracks,
  searched,
  setSelectedTracks,
  selectedTracks,
  selectedPlaylistTracks,
  setSelectedPlaylistTracks,
  selectedPlaylist,
  token,
}) => {
  const addTrackToPlaylist = (track) => {
    if (!selectedTracks.find((t) => t.id === track.id)) {
      setSelectedTracks((prev) => [...prev, track]);
    }
  };

  const addTrackToSelectedPlaylist = async (track) => {
    if (!selectedPlaylistTracks.find((t) => t.id === track.id)) {
      setSelectedPlaylistTracks((prev) => [...prev, track]);

      try {
        await axios.post(
          `https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`,
          { uris: [track.uri] },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("New track added to the playlist!", {
          position: "top-center",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error("Failed to add track to playlist.", {
          autoClose: 3000,
        });
      }
    } else {
      toast.warn("Track is already in the playlist", {
        position: "top-center",
        autoClose: 3000,
      });
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
            <div className={styles.buttonContainer}>
              <button
                onClick={() => addTrackToPlaylist(track)}
                className={styles.newButton}
              >
                New
              </button>
              <button
                className={styles.addButton}
                onClick={() => addTrackToSelectedPlaylist(track)}
              >
                Add
              </button>
            </div>
          </div>
        ))
      )}
      <ToastContainer />
    </div>
  );
};

export default SearchResults;
