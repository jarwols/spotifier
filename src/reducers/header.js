const header = (state = {}, action) => {
  switch (action.type) {
    case 'HEADER_SET':
      return {
        ...state,
        headers: action.header.headers
      }
    default:
      return state
  }
}

export default header