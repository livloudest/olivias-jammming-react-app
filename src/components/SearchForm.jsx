import React from "react";
import styles from '../css/SearchForm.module.css';

const SearchForm = ({ token, setSearchKey, searchTracks }) => {
    return (
        <div className={styles.searchForm}>
            {token ? (
                <form id='search' onSubmit={searchTracks}>
                    <input
                        id='input'
                        name='input'
                        type="text"
                        onChange={(e) => setSearchKey(e.target.value)}
                        placeholder="Enter a track name"
                        />
                        <button type="submit">Search</button>
                </form>
            ):(
                <h2>Please login to search</h2>
            )}
        </div>
    );
};

export default SearchForm;