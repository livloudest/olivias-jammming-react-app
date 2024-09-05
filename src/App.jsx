import React, { useState, useEffect } from 'react'
import './css/App.module.css'

function App() {
  const CLIENT_ID = 'ffef7cd625344c70ba42775465c170e7'
  const REDIRECT_URI = 'http://localhost:5173/'
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const RESPONSE_TYPE = 'token'

  const [token, setToken] = useState('')

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem('token')

    if (!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1]

      window.location.hash = ''
      window.localStorage.setItem('token', token)      
    }

    setToken(token);

  }, []);

  const logout = () => {
    setToken('')
    window.localStorage.removeItem('token');
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Jammming Spotify App</h1>
        {!token ?
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
        :<button onClick={logout}>Logout</button>}
      </header>
    </div>
  )
}

export default App
