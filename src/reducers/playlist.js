const playlist = (state = {}, action) => {
  switch (action.type) {
    case 'PLAYLIST_LOADING':
      return {
        ...state,
        playlist: {
            isExporting: true
        }
      }
    default:
      return state
  }
}

export default playlist