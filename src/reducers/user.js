const user = (state = {}, action) => {
  switch (action.type) {
    case 'USER_LOADING':
      return {
        ...state,
        user: {
            ...action.user,
            isLoading: true
        }
      }
    case 'USER_LOADED':
      return {
        ...state,
        user: {
            ...action.user,
            isLoading: false
        }
      }
    default:
      return state
  }
}

export default user