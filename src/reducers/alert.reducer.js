export default (state, action) => {
  switch(action.type){
    case 'SHOW_ALERT':
      return { show: true, message: action.payload.message };
    case 'CLEAR_ALERT':
      return { show: false, message: '' };
    default: 
      return state;
  }
}