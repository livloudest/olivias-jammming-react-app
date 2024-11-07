import React, { useEffect, useState } from "react";
import styles from "../css/TrackList.module.css";
import axios from "axios";
import { toast } from "react-toastify";

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
        setPlaylistTracks(response.data.items.map(item => ({
          ...item.track,
          isFromSearch: false
        })));
      } catch (error) {
        toast.error('Error fetching playlist tracks', error);
      }
    };

    fetchPlaylistTracks();
  }, [selectedPlaylist, token])


  const handleRemoveTrack = (track) => {
    if (track.isFromSearch) {
      setTracks(tracks.filter((t) => t.id !== track.id));
      setSearchResults([...searchResults, track]);
    } else {
      setTracks(tracks.filter((t) => t.id !== track.id));
    }
  };

  const handleDeleteTrack = async (track) => {
    try {
      await axios.request({
        url: `https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          tracks: [{ uri: track.uri }],
        },
      });
      setTracks((prev) => prev.filter((t) => t.id !== track.id));
      toast.success('Tracks removed from playlist!');
    } catch (error) {
      // console.error('Error removing track from playlist', error);
      toast.error('Error removing track from playlist.');
    }
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
                <a 
                href={`https://open.spotify.com/track/${track.id}`}
                target="_blank"
                rel="noopener noreferrer"
                >
                <img
                  src={track.album.images[0].url}
                  alt={track.name}
                  className={styles.albumImage}
                />
                </a>
              )}
              <div className={styles.trackInfo}>
                <h3>{track.name}</h3>
                <h5>{track.artists.map((artist) => artist.name).join(", ")}</h5>
              </div>
              <div className={styles.trackButtons}>
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveTrack(track)}
              >
                -
              </button>
            </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackList;
