import * as dbModel from '../model/dbModel.js'
import * as testingData from '../../store/testing';

export const getOrderList = async () => {
	try {
		var orderArray = await testingData.orders;
		var resultArray = []
		orderArray.forEach(async (orderData) => {
			var tmpObject = orderData
			var orderDetail = await testingData.order_detail.filter(function (el) {
				return (orderData.id == el.order_id);
			});
			var amount = 0;
			orderDetail.forEach(async (productData) => {
				amount += productData.qty * productData.unit_price
			})
			tmpObject.amount = amount
			resultArray.push(tmpObject)
		});
		return resultArray;
	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

export const getOrderDetail = async (order_id) => {
	try {
		var orderDetailArray = await testingData.order_detail.filter(function (el) {
			return (order_id == el.order_id);
		});
		var resultArray = []
		orderDetailArray.forEach(async (productData) => {
			var productDetail = await testingData.items.filter(function (el) {
				return (productData.item_id == el.id);
			});
			var tmpObject = productDetail[0]
			tmpObject.qty = productData.qty
			tmpObject.price = productData.unit_price
			tmpObject.itemPrice = productData.unit_price*productData.qty
			resultArray.push(tmpObject)
		});
		return resultArray;
	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}
export const updateOrderDetail = async (productData) => {
	try {

	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

export const createOrder = async (productData) => {
	try {

	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}