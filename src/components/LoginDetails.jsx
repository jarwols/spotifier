import React from 'react';

const LoginDetails = (props) => (
    <div className="Login">
        <div>
            <h1>Spotifier</h1>
            <h5>Analytics of your top listened tracks and artists</h5>
            <div>
                <button onClick={() => props.handleLogin()}><h3>Spotify Login</h3></button>
            </div>
        </div>
    </div>
);

export default LoginDetails;