import { combineReducers } from 'redux'
import spotify from './spotify'
import header from './header'
import user from './user' 
import playlists from './playlists'

export const rootReducer = combineReducers({
    header,
    spotify,
    user,
    playlists
})
