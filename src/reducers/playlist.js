const playlist = (state = {}, action) => {
  switch (action.type) {
    case 'PLAYLIST_LOADING':
      return {
        ...state,
        playlist: {
            isExporting: true,
            term: action.term
        }
      }
    case 'PLAYLIST_LOADED': 
      return {
        ...state,
        playlist: {
          isExporting: false,
          term: action.term
        }
      }
    default:
      return state
  }
}

export default playlist