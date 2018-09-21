import React from 'react';

const Artist = (props) => (
    <div className="artist" onMouseOver={() => props.__toggleMouse(props.genre)} 
        onMouseOut={() => props.__toggleMouse([])}>
        <p>{props.genre.name} <span>{props.genre.popularity}</span></p>
    </div> 
);

export default Artist;