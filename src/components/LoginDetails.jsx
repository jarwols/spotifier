import React from 'react';

const LoginDetails = (props) => (
    <div className="Login">
        <div>
            <h1>Genrifier.</h1>
            <h4>No one really knows what the f#%k they're listening to.</h4>
            <h5>Analytics of your top listened artists, tracks, and genres.</h5>
            <div>
                <button onClick={() => props.handleLogin()}><h3>Spotify Login</h3></button>
            </div>
        </div>
    </div>
);

export default LoginDetails;