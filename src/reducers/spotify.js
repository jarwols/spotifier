const emptyTerm = { isLoading: false, trackList: [], artistList: [], featureList: [] }

const spotify = (state = {}, action) => {
  switch (action.type) {
    case 'TRACKS_LOADED':
      return {
        ...state,
        [action.term]: {
            isLoading: false,
            trackList: action.items,
            artistList: state[action.term].artistList,
            featureList: state[action.term].featureList
        }
      }
    case 'TRACKS_LOADING':
        return {
            ...state,
            [action.term]: {
                isLoading: true,
                trackList: [],
                artistList: state[action.term].artistList,
                featureList: state[action.term].featureList
            }
        }
    case 'ARTISTS_LOADED':
        return {
            ...state,
            [action.term]: {
                isLoading: false,
                trackList: state[action.term].trackList,
                featureList: state[action.term].featureList,
                artistList: action.items
            }
        }
    case 'ARTISTS_LOADING':
        return {
            ...state,
            [action.term]: {
                isLoading: true,
                trackList: state[action.term].trackList,
                artistList: [],
                featureList: state[action.term].featureList
            }
        }
    case 'FEATURES_LOADING':
        return {
            ...state,
            [action.term]: {
                isLoading: true,
                trackList: state[action.term].trackList,
                artistList: state[action.term].artistList,
                featureList: []
            }
        }
    case 'FEATURES_LOADED':
        return {
            ...state,
            [action.term]: {
                isLoading: true,
                trackList: state[action.term].trackList,
                artistList: state[action.term].artistList,
                featureList: action.items
            }
        }
    case 'SPOTIFY_TERM': 
        return {
            ...state,
            term: action.term 
        }
    default:
        return {
            short_term: emptyTerm,
            medium_term: emptyTerm,
            long_term: emptyTerm,
            term: 'long_term'
        }
    }
}

export default spotify