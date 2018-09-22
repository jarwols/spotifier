import { combineReducers } from 'redux'
import spotify from './spotify'
import header from './header'
import user from './user' 

export const rootReducer = combineReducers({
    header,
    spotify,
    user
})
