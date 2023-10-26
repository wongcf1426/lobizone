import { createSlice } from '@reduxjs/toolkit'
import { getProductList, checkIsValidProduct } from '../src/controller/productController';

const slice = createSlice({
  name: 'cart',
  initialState: {cart: [], totalqty:0},
  reducers: {
    addTo: (state, action) => {
      const itemData = action.payload.itemData
      const updateQty = action.payload.updateQty
      var tmp = {
        id: itemData.id,
        name: itemData.name,
        price: itemData.price,
        thumbnail: itemData.thumbnail,
        qty: updateQty,
      }
      var tmpCart = state.cart;
      tmpCart.push(tmp)
      state.cart = tmpCart
      state.totalqty = tmpCart.reduce(function (sum, item) {
        return sum + item.qty;
      }, 0);
    },
    update: (state, action) => {
      const itemData = action.payload.itemData
      const updateQty = action.payload.updateQty
      var tmp = {
        id: itemData.id,
        name: itemData.name,
        price: itemData.price,
        thumbnail: itemData.thumbnail,
        qty: updateQty,
      }
      var tmpCart = []
      var tmpCnt = 0
      state.cart.map(function(el, i){
        if(el.id != itemData.id){
          tmpCart.push(el)
          tmpCnt += el.qty
        }else {
          tmpCart.push(tmp)
          tmpCnt += updateQty
        }
      })
      state.cart = tmpCart
      state.totalqty = tmpCnt;
    },
    reset: (state, action) =>  {
      state.cart = []
      state.totalqty = 0
    }
  },
});
export default slice.reducer

// Actions
const { addTo, update, reset } = slice.actions

export const addtoCart = ({ itemId, updateQty }) => async dispatch => {
  try {
    if (verifyItem(itemId)) {
      var itemData = await getProductList(true, 1, [itemId])
      if(itemData.length == 1) {
        itemData = itemData[0];
        dispatch(addTo({itemData, updateQty}));
      }
      return itemId
    }
    return false
  } catch (e) {
    return console.error(e.message);
  }
}

export const updateCart = ({ itemId, updateQty }) => async dispatch => {
  try {
    if (verifyItem(itemId)) {
      var itemData = await getProductList(true, 1, [itemId])
      if(itemData.length == 1) {
        itemData = itemData[0];
        dispatch(update({itemData, updateQty}));
      }
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

const verifyItem = async(itemId) => {
  return await checkIsValidProduct(itemId);
}
