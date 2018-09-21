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

function fetchFeatures(items, term) {
  var ids = []
  items.map(item => { ids.push(item.id) })
  ids = ids.join(',')
  console.log(ids) 
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