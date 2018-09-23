import { combineReducers } from 'redux'
import spotify from './spotify'
import header from './header'
import user from './user' 
import playlist from './playlist'

export const rootReducer = combineReducers({
    header,
    spotify,
    user,
    playlist
})
