const userReducer = (state, action) => {
  const { userId, token } = action.payload || {};
  switch(action.type){
    case 'ADD_USER':
      return {  userId, token };
    case 'REMOVE_USER': 
      return { userId: null, token: null};
    default: 
      return state;
  }
}

export default userReducer;