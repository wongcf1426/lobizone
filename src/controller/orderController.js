import * as dbModel from '../model/dbModel.js'
import * as testingData from '../../store/testing';

export const getOrderList = async () => {
	try {
		if(testingData.mode == 'testing') var orderArray = testingData.orders 
		else var orderArray = await dbModel.selectOrders()
		
		var resultArray = []
		for await (const orderData of orderArray) {
			var tmpObject = orderData
			if(testingData.mode == 'testing') var orderDetail = testingData.order_detail.slice(0, 4)
			else var orderDetail = await dbModel.selectOrderDetail(orderData.id)
			
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
		if(testingData.mode == 'testing') var orderDetailArray = testingData.order_detail.slice(0, 4)
		else var orderDetailArray = await dbModel.selectOrderDetail(order_id)
	
		let resultArray = []
		for await (const productData of orderDetailArray) {
			if(testingData.mode == 'testing') var productDetail = [testingData.items[0]]
			else var productDetail = await dbModel.selectProducts(false, -1, [productData.item_id])

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
					await dbModel.deductInventory(productData.id, productData.qty)
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