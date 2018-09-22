import React, { Component } from 'react';
import { connect } from 'react-redux'
import './App.css'
import Genres from './Genres'
import Tracks from './Tracks'
import Artist from './Artist'
import Graph from './Graph'
import _ from 'lodash' 
import { constructHeader, fetchSpotifyIfNeeded, setSpotifyTerm, createPlaylist } from '../actions';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artists: [],
      artistsGenres: [],
      audioFeatures: [],
      feature: null, 
      genres: [],
      tracks: [],
      track: {},
      mouseOver: false,
      displayGenres: [],
      query: 'artists',
      header: null,
      term: 'long_term'
    }
    this.__toggleMouse = this.__toggleMouse.bind(this); 
    this.__setFeature = this.__setFeature.bind(this); 
  }

  componentDidUpdate(prevProps) {
    if(this.props != prevProps && (this.props.artists && this.props.artists.length > 0)) {
        this.__initGenres(); 
    }
  }

  componentWillMount() {
    constructHeader(this.props.location.hash)
    // window.history.replaceState(null, null, `${window.location.pathname}`);
    setSpotifyTerm(this.state.term);
    fetchSpotifyIfNeeded(this.state.term, this.state.query)
  }

  __initGenres() {
    let artistsGenres = []
    let allGenres = []
    this.props.artists.map(artist => {
      let genres = []
      artist.genres.map(genre => {
        genres.push(genre)
      })
      let artistObj = {
        name: artist.name, 
        genres: genres,
        popularity: artist.popularity,
        image: artist.images[0],
        id: artist.id
      }
      artistsGenres.push(artistObj)
      allGenres.concat(genres)
    })
    artistsGenres = artistsGenres.sort(function(a, b) {
      return b.popularity - a.popularity
    })
    this.setState({genres: _.uniq(allGenres), artistsGenres: artistsGenres})
  }

  __toggleMouse(genre) {
    this.setState({mouseOver: !this.state.mouseOver, displayGenres: genre.genres})
  }

  __toggleOptions() {
    let query = 'artists'
    if(this.state.query == 'artists') {
      query = 'tracks'
    }
    fetchSpotifyIfNeeded(this.state.term, query)
    this.setState({query: query})
  }

  __changeTerm(term) {
    setSpotifyTerm(term);
    fetchSpotifyIfNeeded(term, this.state.query)
    this.setState({term: term})
  }

  __setFeature(feature) {
    this.setState({feature: feature})
  }
  
  renderArtists() {
    let artists = this.state.artistsGenres.map((genre, index) => 
      <Artist
        __toggleMouse={this.__toggleMouse}
        key={index}
        genre={genre}/>
    ); 
    return artists; 
  }

  renderTracks() {
    return (
      <Tracks
        audioFeatures={this.props.audioFeatures} 
        tracks={this.props.tracks}
        setFeature={this.__setFeature}
      />);
  }

  render() {
    let content = null; 
    if(this.state.query === 'artists') {
      content = this.renderArtists(); 
    } else {
      content = this.renderTracks();
    }
    return (
      <div className="Holder">
        <div className="App"> 
          <div className="artists">
            <h3 onClick = {() => this.__toggleOptions()}>
              Your Top {this.state.query}
            </h3>
            <div className="term">
              <button className={this.state.term === 'long_term' ? 'active_term': null} onClick={() => this.__changeTerm('long_term')}>Long Term</button>
              <button className={this.state.term === 'medium_term' ? 'active_term' : null} onClick={() => this.__changeTerm('medium_term')}>Medium Term</button>
              <button className={this.state.term === 'short_term' ? 'active_term' : null} onClick={() => this.__changeTerm('short_term')}>Short Term</button>
              <button onClick={() => createPlaylist('short_term')}>Playlist</button>

            </div>
            { content } 
          </div>
          <div className="info">
            { this.state.query === 'artists' ? 
                <Genres 
                  mouseOver = {this.state.mouseOver}
                  displayGenres = {this.state.displayGenres}/>
              : <Graph
                  track = {this.state.track}
                  audio_feature = {this.state.feature}/>}
          </div> 
        </div>
      </div> 
    );
  }
}

function mapStateToProps(state) {
  const spotify = state.spotify
  return {
    artists: spotify[spotify.term].artistList,
    tracks: spotify[spotify.term].trackList,
    audioFeatures: spotify[spotify.term].featureList,
    term: spotify.term
  }
}

export default connect(mapStateToProps)(App)