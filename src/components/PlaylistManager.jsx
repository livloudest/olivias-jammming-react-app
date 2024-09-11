import React, { useState } from "react";
import axios from "axios";
import styles from "../css/PlaylistManager.module.css";

const PlaylistManager = ({ tracks, setTracks, token, searchResults, setSearchResults }) => {
  const [playlistName, setPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [userId, setUserId] = useState("");

  // For testing purposes:
  // function printToken() {
  //   console.log(token);
  // }

  const fetchUserId = async () => {
    // TODO: delete then when not needed anymore
    // To get the token from local storage
    // const localToken = localStorage.getItem("token");
    // console.log("token:" + localToken);

    try {
      const response = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      setUserId(response.data.id);
    } catch (error) {
      console.error("error fetching user ID:", error);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) {
      alert("please enter a playlist name");
      return;
    }

    setIsCreating(true);

    if (!userId) {
      await fetchUserId();
    }

    try {
      // For testing:
      // console.log("userID: ", userId);

      // Create a new playlist
      const createPlaylistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: playlistName,
          description: "New playlist created via Jammming App",
          public: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const playlistId = createPlaylistResponse.data.id;

      // for testing only
      // This is what tracks/selectedTracks should look like when it is passed through
      // const fakeTracks = [
      //   {
      //     id: 23,
      //     uri: "spotify:track:2k6dU3c2IBotzynOyevHJx",
      //   },
      //   {
      //     id: 24,
      //     uri: "spotify:track:1301WleyT98MSxVHPZCA6M",
      //   },
      //   {
      //     id: 25,
      //     uri: "spotify:episode:512ojhOuo1ktJprKbVcKyQ",
      //   },
      // ];

      //Add tracks to the newly created playlist
      const trackUris = tracks.map((track) => track.uri);
      //   const trackUris = tracks.map((track) => track.uri);
      
      //for testing purposes only
      // console.log("playlist id: ", playlistId);
      // console.log("trackUris: ", trackUris);

      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          // uris: trackUris,
          uris: trackUris,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Playlist created and tracks added!");
      setPlaylistName("");
      setUserId("");
    } catch (error) {
      console.error("Error creating playlist or adding tracks:", error);
      alert("an error occurred while creating playlist");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRemoveTrack = (track) => {
    setTracks(tracks.filter(t => t.id !== track.id));
    setSearchResults([...searchResults, track]);
  };

  return (
    <div className={styles.parentContainer}>
    <div className={styles.playlistForm}>
      <form onSubmit={handleCreatePlaylist}>
      <input
        type="text"
        placeholder="Playlist Name"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
      />
      <button onClick={handleCreatePlaylist} disabled={isCreating}>
        {isCreating ? "Creating..." : "Create Playlist"}
      </button>
      </form>
      </div>
      <div className={styles.playlistContainer}>
        {tracks.length === 0 ? (
          <p>No tracks added yet.</p>
        ) : (
          <div className={styles.tracksContainer}>
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
                  <h5>{track.artists.map((artist) => artist.name).join(', ')}</h5>
              </div>
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveTrack(track)}>
                  -
                </button>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistManager;