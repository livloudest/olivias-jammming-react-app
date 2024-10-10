import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "../css/PlaylistForm.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlaylistForm = ({
  tracks,
  token,
  userId,
  setSelectedPlaylist,
  setTracks,
  selectedPlaylistTracks,
  setSelectedPlaylistTracks
}) => {
  const [playlistName, setPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylistState] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const dropdownRef = useRef(null);

  // implemented pagination handling to ensure all playlists are loaded from user
  const fetchUserPlaylists = async () => {
    try {
      let allPlaylists = [];
      let url = "https://api.spotify.com/v1/me/playlists";

      while (url) {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        allPlaylists = allPlaylists.concat(response.data.items);
        url = response.data.next;
      }

      const userPlaylists = allPlaylists.filter(
        (playlist) => playlist.owner.id === userId
      );

      if (userPlaylists.length === 0) {
        toast.info("No playlists found");
      }

      setPlaylists(userPlaylists);
      setFilteredPlaylists(userPlaylists); //Initialize filtered Playlists
    } catch (error) {
      // console.error("Error fetching playlists", error);
      toast.error("Error fetching playlists");
    }
  };

  const fetchPlaylistTracks = async (playlistId) => {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedPlaylistTracks(response.data.items.map((item) => item.track));
    } catch (error) {
      toast.error("Error fetching playlist tracks");
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchUserPlaylists();
    }
  }, [token, userId]);

  useEffect(() => {
    //Filter playlists based on the search term
    if (playlists && Array.isArray(playlists))
      setFilteredPlaylists(
        playlists.filter((playlist) =>
          playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
  }, [searchTerm, playlists]);

  const handleCreatePlaylist = async () => {
    if (tracks.length === 0) {
      toast.info("Please add tracks to the playlist before creating it.");
      return;
    }

    setIsCreating(true);
    setTracks([]);
    if (!playlistName.trim()) {
      toast.info("Please enter a playlist name");
      return;
    }

    try {
      // Create a new playlist
      const createPlaylistResponse = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          name: playlistName,
          description: "New playlist created via Jammming App",
          public: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const playlistId = createPlaylistResponse.data.id;

      //Add tracks to the newly created playlist
      const trackUris = tracks.map((track) => track.uri);

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

      toast.success("Playlist created and tracks added!");
      setPlaylistName("");
      setSelectedPlaylistState("");
      setDropdownVisible(false);

      await fetchUserPlaylists();
    } catch (error) {
      // console.error(
      //   "Error creating playlist or adding tracks:",
      //   error.response ? error.response.data : error
      // );
      toast.error("an error occurred while creating playlist");
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddTracksToSelectedPlaylist = async () => {
    if (!selectedPlaylist) {
      toast.info("Please select a playlist");
      return;
    }
    // fetch existing tracks in playlist
    try {
      const existingTracksResponse = await axios.get(
        `https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const existingTrackUris = existingTracksResponse.data.items.map(
        (item) => item.track.uri
      );

      const selectedTrackUris = tracks.map((track) => track.uri);

      const tracksToAdd = selectedTrackUris.filter(
        (uri) => !existingTrackUris.includes(uri)
      );

      const tracksToRemove = existingTrackUris.filter(
        (uri) => !selectedTrackUris.includes(uri)
      );

      if (tracksToAdd.length > 0) {
        await axios.post(
          `https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`,
          { uris: tracksToAdd },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        // console.log("Tracks added:", tracksToAdd);
        toast.success("New Tracks added to the playlist!");
      }

      if (tracksToRemove.length > 0) {
        await axios.request({
          url: `https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            tracks: tracksToRemove.map((uri) => ({ uri })),
          },
        });
        // console.log("tracks removed:", tracksToRemove);
        toast.success("Tracks removed from the playlist!");
      }

      if (tracksToAdd.length === 0 && tracksToRemove.length === 0) {
        toast.info("No changes made. Playlist is up to date.");
      }

      setSelectedPlaylistState("");
      setSearchTerm("");
      setDropdownVisible(false);
      setTracks([]);
    } catch (error) {
      // console.error(error.respone ? error.response.data : error);
      toast.error("Error updating the playlist. Please try again.");
    }
  };

  const handlePlaylistSelection = (playlistId) => {
    setSelectedPlaylistState(playlistId);
    setSelectedPlaylist(playlistId);
    fetchPlaylistTracks(playlistId);
    setDropdownVisible(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setDropdownVisible(true);
  };

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleRemoveTrack = async (trackUri) => {
    if (!selectedPlaylist) {
      toast.info("Please select a playlist");
      return;
    }

    try {
      //remove track from selected playlist
      await axios.request({
        url: `https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          tracks: [{ uri: trackUri }],
        },
      });

      setSelectedPlaylistTracks((prevTracks) =>
        prevTracks.filter((track) => track.uri !== trackUri)
      );

      toast.success('Track removed from the playlist!');
    } catch (error) {
      // console.error(error.response ? error.response.data : error);
      toast.error("Error removing track from the playlist.");
    }
  };

  return (
    <>
      {/* Playlist creation form */}
      <div className={styles.playlistForm}>
        <form id="playlistform" onSubmit={(e) => e.preventDefault()}>
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

      {/* Search for existing playlists */}
      <div className={styles.searchHeader}>
        <h1>Search for a Playlist</h1>
      </div>
      <div className={styles.playlistSearch}>
        <input
          type="text"
          placeholder="Search for a playlist"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {/* Display the user's existing playlists */}
        <div className={styles.playlistList} ref={dropdownRef}>
          {searchTerm && filteredPlaylists.length > 0 && dropdownVisible && (
            <ul className={styles.playlistDropdown}>
              {filteredPlaylists.map((playlist) => (
                <li
                  key={playlist.id}
                  className={`${styles.playlistItem} ${
                    selectedPlaylist === playlist.id ? styles.selected : ""
                  }`}
                  onClick={() => {
                    handlePlaylistSelection(playlist.id);
                  }}
                >
                  {playlist.name}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
      {/* new box to load selected playlist */}
      <div className={styles.selectedPlaylistBox}>
        {selectedPlaylist ? (
          <div>
            {selectedPlaylistTracks.length > 0 ? (
              selectedPlaylistTracks.map((track) => (
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
                    <h5>
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </h5>
                  </div>
                  <div className={styles.trackButtons}>
                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemoveTrack(track.uri)}
                    >
                      -
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No tracks found in this playlist</p>
            )}
          </div>
        ) : (
          <p>No playlist selected</p>
        )}
      </div>
    </>
  );
};

export default PlaylistForm;
