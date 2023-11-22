import * as dbModel from '../model/dbModel.js'
import * as testingData from '../../store/testing';

export const getOrderList = async (page = 1) => {
	try {
		const offset = (page - 1) * 10;
		if(testingData.layout_dev) var orderArray = testingData.orders
		else var orderArray = await dbModel.selectOrders(offset)
		var resultArray = []
		for await (const orderData of orderArray) {
			var tmpObject = orderData
			if(testingData.layout_dev) var orderDetail = testingData.order_detail.slice(0, 4)
			else var orderDetail = await dbModel.selectOrderDetail(orderData.id)

			var amount = 0;
			for await (const productData of orderDetail) {
				amount += productData.qty * productData.unit_price
			}
			tmpObject.amount = amount
			resultArray.push(tmpObject)
		}
		var countRow = await dbModel.countTableRow('orders')
		return ({state: 'success', data: resultArray, countRow: countRow});
	}catch (error) {
		console.log(error)
		await dbModel.insertEventLog('orderERR', error)
		return({state: 'fail', errMsg: error});
	}
}

export const getOrderDetail = async (order_id) => {
	try {
		if(testingData.layout_dev) var orderDetailArray = testingData.order_detail.slice(0, 4)
		else var orderDetailArray = await dbModel.selectOrderDetail(order_id)

		let resultArray = []
		for await (const productData of orderDetailArray) {
			if(testingData.layout_dev) var productDetail = [testingData.items[0]]
			else var productDetail = await dbModel.selectProducts(false, -1, [productData.item_id])

			var tmpObject = productDetail[0]
			tmpObject.qty = productData.qty
			tmpObject.price = productData.unit_price
			tmpObject.itemPrice = productData.unit_price*productData.qty
			resultArray.push(tmpObject)
		}
		return ({state: 'success', data: resultArray});
	}catch (error) {
		console.log(error)
		await dbModel.insertEventLog('orderERR', error)
		return({state: 'fail', errMsg: error});
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
				return ({state: 'success'});
			}else{
				await dbModel.insertEventLog('orderERR', 'failed, code 65')
				return({state: 'fail', errMsg:'failed, code 65'});
			}
		}else{
			await dbModel.insertEventLog('orderERR', 'failed, code 68')
			return({state: 'fail', errMsg:'failed, code 68'});
		}

	}catch (error) {
		console.log(error)
		await dbModel.insertEventLog('orderERR', error)
		return({state: 'fail', errMsg: error});
	}
}