import React, { useEffect, useState } from "react";
import styles from "../css/TrackList.module.css";

const TrackList = ({ tracks, setTracks, searchResults, setSearchResults, selectedPlaylist, token }) => {

  const [playlistTracks, setPlaylistTracks] = useState([]);

  useEffect(() => {
    const fetchPlaylistTracks = async () => {
      if (!selectedPlaylist) return;

      try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlaylistTracks(response.data.items);
      } catch (error) {
        alert('Error fetching playlist tracks', error);
      }
    };

    fetchPlaylistTracks();
  }, [selectedPlaylist, token])


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
