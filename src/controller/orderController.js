import * as dbModel from '../model/dbModel.js'
import * as testingData from '../../store/testing';

export const getOrderList = async () => {
	try {
		var orderArray = await dbModel.selectOrders()
		var resultArray = []
		for await (const orderData of orderArray) {
			var tmpObject = orderData
			var orderDetail = await dbModel.selectOrderDetail(orderData.id)
			var amount = 0;
			for await (const productData of orderDetail) {
				amount += productData.qty * productData.unit_price
			}
			tmpObject.amount = amount
			resultArray.push(tmpObject)
		}
		return resultArray;
	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

export const getOrderDetail = async (order_id) => {
	try {
		var orderDetailArray = await dbModel.selectOrderDetail(order_id)
		var resultArray = []
		for await (const productData of orderDetailArray) {
			var productDetail = await dbModel.selectProducts(false, -1, [productData.item_id])

			var tmpObject = productDetail[0]
			tmpObject.qty = productData.qty
			tmpObject.price = productData.unit_price
			tmpObject.itemPrice = productData.unit_price*productData.qty
			resultArray.push(tmpObject)
		}
		return resultArray;
	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}
export const updateOrderDetail = async () => {
	try {

	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

export const createOrder = async (productArray) => {
	try {
		var orderId = await dbModel.insertOrder()
		if(orderId)
		{
			var orderDetailResult = await dbModel.insertOrderDetail(orderId, productArray)
			if(orderDetailResult)
			{
				for await (const productData of productArray) {
					var productDetail = await dbModel.deductInventory(productData.id, productData.qty)
				}
				return true
			}else{
				return({state: 'fail'});
			}
		}else{
			return({state: 'fail'});
		}

	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}