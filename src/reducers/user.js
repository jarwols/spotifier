const user = (state = {}, action) => {
  switch (action.type) {
    case 'USER_LOADING':
      return {
        ...state,
        user: {
            id: null,
            isLoading: true
        }
      }
    case 'USER_LOADED':
      return {
        ...state,
        user: {
            id: action.id,
            isLoading: false
        }
      }
    default:
      return state
  }
}

export default user