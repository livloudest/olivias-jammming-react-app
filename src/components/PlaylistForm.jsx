import React, { useState } from "react";
import axios from "axios";
import styles from "../css/PlaylistForm.module.css";

const PlaylistForm = ({
  tracks,
  token,
  userId,
}) => {
  const [playlistName, setPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePlaylist = async () => {
    setIsCreating(true);

    if (!playlistName.trim()) {
      alert("Please enter a playlist name");
      return;
    }

    try {
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
    } catch (error) {
      console.error(
        "Error creating playlist or adding tracks:",
        error.response ? error.response.data : error
      );
      alert("an error occurred while creating playlist");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className={styles.parentContainer}>
      <div className={styles.playlistForm}>
        <form onSubmit={(e) => e.preventDefault()}>
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
    </div>
  );
};

export default PlaylistForm;
