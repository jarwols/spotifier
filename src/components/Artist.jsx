import React from 'react';

const Artist = (props) => (
    <div className="artist" onMouseOver={() => props.__toggleMouse(props.genre)} 
        onMouseOut={() => props.__toggleMouse([])}>
        <p>{props.index + 1}. {props.genre.name}</p>
    </div> 
);

export default Artist;