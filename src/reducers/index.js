import { combineReducers } from 'redux'
import spotify from './spotify'
import header from './header' 

export const rootReducer = combineReducers({
    header,
    spotify
})
