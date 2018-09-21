import React from 'react';

const Genres = (props) => (
    <div className="genres">
        <h2>Genres</h2> 
        {props.mouseOver ? props.displayGenres.map((genre, index) => 
            <div key={index}>{genre}</div> 
        ) : <small>Hover over an artist.</small>}
    </div> 
);

export default Genres;