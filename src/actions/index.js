import fetch from 'cross-fetch'
import { parse } from 'qs'
import { dispatch, getState } from '../store'
import { isEmpty } from '../utils/helper'

export const TRACKS_LOADING = 'TRACKS_LOADING'
export const ARTISTS_LOADING = 'ARTISTS_LOADING'
export const TRACKS_LOADED = 'TRACKS_LOADED'
export const ARTISTS_LOADED = 'ARTISTS_LOADED'
export const HEADER_SET = 'HEADER_SET' 
export const SPOTIFY_TERM = 'SPOTIFY_TERM'
export const FEATURES_LOADED = 'FEATURES_LOADED'
export const FEATURES_LOADING = 'FEATURES_LOADING'
export const USER_LOADING = 'USER_LOADING'
export const USER_LOADED = 'USER_LOADED'
export const PLAYLIST_LOADING = 'PLAYLIST_LOADING'
export const PLAYLIST_LOADED = 'PLAYLIST_LOADED'
export const SPOTIFY_HOST = 'https://api.spotify.com/v1'
export function constructHeader(query) {
  query = parse(query)
  var token = query['#access_token'];
  var header = { headers: { 'Authorization': 'Bearer ' + token } };
  dispatch({
    type: HEADER_SET,
    header
  });
}

export function setSpotifyTerm(term) {
  dispatch({
    type: SPOTIFY_TERM,
    term
  });
}

function requestSpotify(term, type) {
  return {
    type: type == 'tracks' ? TRACKS_LOADING : ARTISTS_LOADING,
    term
  }
}

function receiveSpotify(term, type, json) {
  if (type == 'tracks') dispatch(fetchFeatures(json.items, term))
  return {
    type: type == 'tracks' ? TRACKS_LOADED : ARTISTS_LOADED,
    term,
    items: json.items,
    receivedAt: Date.now()
  }
}

function requestFeatures(term) {
  return {
    type: FEATURES_LOADING,
    term
  }
}

function receiveFeatures(items, term) {
  return {
    type: FEATURES_LOADED, 
    items: items.audio_features,
    term,
    receivedAt: Date.now() 
  }
}

function requestUser() {
  return {
    type: USER_LOADING
  }
}

function receiveUser(items) {
  return {
    type: USER_LOADED, 
    id: items.id,
    receivedAt: Date.now() 
  }
}

function requestPlaylist(term) {
  return {
    type: PLAYLIST_LOADING,
    term: term 
  }
}

function __idHelper(items) {
  var ids = [];
  items.map(item => { ids.push(item.id) });
  ids = ids.join(',');
  return ids; 
}

function fetchUserProfile() {
  var state = getState(); 
  if (state.user && state.user.id) return state.user.id; 
  return dispatch => {
    dispatch(requestUser())
    return fetch(SPOTIFY_HOST + '/me', getState().header)
      .then(response => response.json())
      .then(json => dispatch(receiveUser(json)))
  }
}

export function createPlaylist(items, term) {
  // var ids = __idHelper(items)
  return dispatch => {
    dispatch(requestPlaylist(term))
    var userId = fetchUserProfile();
    console.log(userId);  
    return fetch(SPOTIFY_HOST + '/users/' +  + '/playlists', getState().header)
      .then(response => response.json())
      .then(json => dispatch(receiveFeatures(json, term)))
  }
}

function fetchFeatures(items, term) {
  var ids = []
  items.map(item => { ids.push(item.id) })
  ids = ids.join(',')
  return dispatch => {
    dispatch(requestFeatures(term))
    return fetch(SPOTIFY_HOST + '/audio-features/?ids=' + ids, getState().header)
      .then(response => response.json())
      .then(json => dispatch(receiveFeatures(json, term)))
  }
}

function fetchSpotify(state, term, type) {
  return dispatch => {
    dispatch(requestSpotify(term, type))
    return fetch(SPOTIFY_HOST + '/me/top/' + type + '?limit=50&time_range=' + term, state.header)
      .then(response => response.json())
      .then(json => dispatch(receiveSpotify(term, type, json)))
  }
}

function shouldFetch(state, term, type) {
  const listType = type == 'tracks' ? 'trackList' : 'artistList'
  const spotify = state.spotify
  if (isEmpty(spotify[term][listType])) {
    return true
  } else if (spotify[term][listType].isLoading) {
    return false
  } 
}

export function fetchSpotifyIfNeeded(term, type) {
  if (shouldFetch(getState(), term, type)) {
    return dispatch(fetchSpotify(getState(), term, type))
  }
}