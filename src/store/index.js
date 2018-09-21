import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux' 
import { rootReducer } from '../reducers'

const loggerMiddleware = createLogger()

export const store = createStore(rootReducer, applyMiddleware(
  thunkMiddleware, // lets us dispatch() functions
  loggerMiddleware // neat middleware that logs actions
))

export function dispatch(action) {
  store.dispatch(action)
}

export function getState() {
  return store.getState() 
}