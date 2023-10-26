import { createSlice } from '@reduxjs/toolkit'
import { getProductList, checkIsValidProduct } from '../src/controller/productController';

const slice = createSlice({
  name: 'cart',
  initialState: {cart: [], totalqty:0, totalprice: 0, itemIds:[]},
  reducers: {
    addTo: (state, action) => {
      const itemData = action.payload.itemData
      const updateQty = action.payload.updateQty
      const itemprice = parseInt(updateQty)*parseFloat(itemData.price)
      var tmp = {
        id: itemData.id,
        name: itemData.name,
        price: itemData.price,
        thumbnail: itemData.thumbnail,
        qty: updateQty,
        itemprice: parseFloat(itemprice)
      }

      var tmpCart = []
      var tmpItemIds = []
      var tmpCnt = 0
      var tmpPrice = 0
      state.cart.map(function(el, i){
          tmpCart.push(el)
          tmpItemIds.push(el.id)
          tmpCnt += el.qty
          tmpPrice += parseFloat(el.itemprice)
      })

      tmpCart.push(tmp)
      tmpItemIds.push(tmp.id)
      tmpCnt += tmp.qty
      tmpPrice += parseFloat(tmp.itemprice)

      state.cart = tmpCart
      state.totalqty = tmpCnt;
      state.totalprice = tmpPrice;
      state.itemIds = tmpItemIds;
    },
    update: (state, action) => {
      const itemData = action.payload.itemData
      const updateQty = action.payload.updateQty
      const itemprice = parseInt(updateQty)*parseFloat(itemData.price)
      var tmp = {
        id: itemData.id,
        name: itemData.name,
        price: itemData.price,
        thumbnail: itemData.thumbnail,
        qty: updateQty,
        itemprice: parseFloat(itemprice)
      }

      var tmpCart = []
      var tmpItemIds = []
      var tmpCnt = 0
      var tmpPrice = 0
      state.cart.map(function(el, i){
        if(el.id != itemData.id){
          tmpCart.push(el)
          tmpItemIds.push(el.id)
          tmpCnt += el.qty
          tmpPrice += parseFloat(el.itemprice)
        }else {
          tmpCart.push(tmp)
          tmpItemIds.push(tmp.id)
          tmpCnt += updateQty
          tmpPrice += parseFloat(tmp.itemprice)
        }
      })
      state.cart = tmpCart
      state.totalqty = tmpCnt;
      state.totalprice = tmpPrice;
      state.itemIds = tmpItemIds;
    },
    reset: (state, action) =>  {
      state.cart = []
      state.totalqty = 0
      state.totalprice = 0;
      state.itemIds = [];
    }
  },
});
export default slice.reducer

// Actions
const { addTo, update, reset } = slice.actions

export const addtoCart = ({ itemId, updateQty }) => async dispatch => {
  try {
    if (await verifyItem(itemId, updateQty)) {
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
    if (await verifyItem(itemId, updateQty)) {
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

const verifyItem = async(itemId, qty) => {
  return await checkIsValidProduct(itemId, qty);
}
