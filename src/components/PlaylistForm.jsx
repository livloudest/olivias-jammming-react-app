import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "../css/PlaylistForm.module.css";

const PlaylistForm = ({
  tracks,
  token,
  userId,
  setSelectedPlaylist,
  setTracks,
}) => {
  const [playlistName, setPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylistState] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const dropdownRef = useRef(null);

  const fetchUserPlaylists = async () => {
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/playlists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userPlaylists = response.data.items.filter(
        (playlist) => playlist.owner.id === userId
      );

      if (userPlaylists.length === 0) {
        alert("No playlists found");
      }

      setPlaylists(userPlaylists);
      setFilteredPlaylists(userPlaylists); //Initialize filtered Playlists
    } catch (error) {
      console.error("Error fetching playlists", error);
      alert("error fetching playlists", error);
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

      setTracks(response.data.items.map((item) => item.track));
    } catch (error) {
      alert("Error fetching playlist tracks", error);
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
      alert("Please add tracks to the playlist before creating it.");
      return;
    }

    setIsCreating(true);
    setTracks([]);
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

      alert("Playlist created and tracks added!");
      setPlaylistName("");
      setSelectedPlaylistState("");
      setDropdownVisible(false);

      await fetchUserPlaylists();
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

  const handleAddTracksToSelectedPlaylist = async () => {
    if (!selectedPlaylist) {
      alert("Please select a playlist");
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
      console.log("Existing track uris:", existingTrackUris); //debugging

      // get URIs of selected tracks wanted in the playlist
      const selectedTrackUris = tracks.map((track) => track.uri);
      console.log("selected track uris:", selectedTrackUris); //debugging

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
        console.log("Tracks added:", tracksToAdd);
        alert("New Tracks added to the playlist!");
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
        console.log("tracks removed:", tracksToRemove);
        alert("Tracks removed from the playlist!");
      }

      if (tracksToAdd.length === 0 && tracksToRemove.length === 0) {
        alert("No changes made. Playlist is up to date.");
      }

      setSelectedPlaylistState("");
      setSearchTerm("");
      setDropdownVisible(false);
      setTracks([]);
    } catch (error) {
      console.error(error.respone ? error.response.data : error);
      alert("Error updating the playlist. Please try again.");
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

  return (
    <div className={styles.parentContainer}>
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
      {/* Search bar for filtering playlists */}
      <div className={styles.playlistSearch}>
        <input
          type="text"
          placeholder="Search for a playlist"
          value={searchTerm}
          onChange={handleSearchChange}
          // onChange={(e) => setSearchTerm(e.target.value)}
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
        <button
          onClick={handleAddTracksToSelectedPlaylist}
          disabled={!selectedPlaylist}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default PlaylistForm;
