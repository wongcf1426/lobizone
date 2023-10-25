import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'user',
  initialState: {cart: []},
  reducers: {
    addTo: (state, action) => {
      const itemId = action.payload.itemId
      var tmpCart = state.cart;
      tmpCart.push(itemId)
      state.cart = tmpCart
      
    },
    reset: (state, action) =>  {
      state.cart = tmpCart=[]
    }
  },
});
export default slice.reducer

// Actions
const { addTo, reset } = slice.actions

export const addCart = ({ itemId }) => async dispatch => {
  try {
    if (verifyItem(itemId)) {
      dispatch(addTo({itemId}));
      return itemId
    }
    return false
  } catch (e) {
    return console.error(e.message);
  }
}

export const resetCart = () => async dispatch => {
  try {
    return dispatch(reset())
  } catch (e) {
    return console.error(e.message);
  }
}

const verifyItem = () => {
  // Implement your hashing and salting algorithm here, like bcrypt
  // Return true if the password matches the hashed password, false otherwise
  return true;
}
