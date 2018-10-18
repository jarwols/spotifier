import React, { Component } from 'react';
import ReactPlayer from 'react-player'

class Tracks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mouseOver: false,
            indexPlaying: null 
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.tracks !== prevProps.tracks) {
            this.setState({indexPlaying: null})
        }
    }

    __queryAudioFeatures(track) {
        let feature = this.props.audioFeatures.filter(feature => feature !== null && feature.id === track.id); 
        this.props.setFeature(feature); 
    }

    __activatePlayer(index, track) {
        this.__queryAudioFeatures(track); 
        this.props.setTrack(track); 
        this.setState({mouseOver: true, indexPlaying: index})
    }

    __deactivatePlayer() {
        this.setState({mouseOver: false, indexPlaying: null})
    }

    render() {
        return(
            <div>
                {this.props.tracks.map((track, index) => 
                    <div key={index} onMouseOver={() => this.__activatePlayer(index, track)} onMouseDown={() => window.open(track.external_urls.spotify)}>
                        <p>{index+1}. {track.name}</p>
                        { (this.state.indexPlaying == index) ? <ReactPlayer style={{display: 'none'}} url={track.preview_url} playing /> : null } 
                    </div> 
                )}
            </div> 
        );
    }
}

export default Tracks;