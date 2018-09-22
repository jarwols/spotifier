import React, { Component } from 'react';
import LoginDetails from './LoginDetails.jsx';
import './Login.css';

class Login extends Component { 
    constructor(props) {
        super(props); 
        this.__handleLogin = this.__handleLogin.bind(this)
    }
    
    __getLoginURL(scopes = []) {
        return 'https://accounts.spotify.com/authorize?client_id=' + encodeURIComponent(process.env.REACT_APP_SPOTIFY_CLIENT_ID) +
          '&redirect_uri=' + encodeURIComponent(process.env.REACT_APP_CALLBACK_URI) +
          '&scope=' + encodeURIComponent(scopes.join(' ')) +
          '&response_type=token';
    }

    __handleLogin() {
        let loginURL = this.__getLoginURL(['user-library-read', 'user-top-read', 'playlist-modify-public'])
        window.location.href = loginURL;
    }

    render() {
        return (
            <LoginDetails
                handleLogin={this.__handleLogin}/>
        );
    }
}

export default Login;