import * as dbModel from '../model/dbModel.js'
import * as testingData from '../../store/testing';

export const testing = async () => {
	try {
		dbModel.initDB();
	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

export const getProductList = async (inventory=true, status=1, productIds=[]) => {
	try {
		let result = await dbModel.selectProducts(inventory, status, productIds)
		return result;
	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

export const getProductDetail = async (productId) => {
	try {
		let productData = await dbModel.selectProducts(false, -1, [productId])
		let saleDataArray = await dbModel.selectOrderDetail('', productId)
		let eventLog = await dbModel.selectEventLog('item_'+productId)
		let amount = 0;
		let lumpsum = 0;
		for await (const saleData of saleDataArray) {
			amount += saleData.qty;
			lumpsum += saleData.qty*saleData.unit_price;
		}
		let result = productData;
		result[0].amount = amount;
		result[0].lumpsum = lumpsum;
		result[0].eventLog = eventLog;
		console.log(eventLog)
		return result;
	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}
export const checkIsValidProduct = async (productId, qty) => {
	try {
		let productData = await dbModel.selectProducts(true, 1, [productId])

		if(productData.length > 0 && qty > 0) {
			productData = productData[0]
			if(productData.inventory >= qty && productData.status == 1) return productData
		}
		return 0

	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

export const updateProductDetail = async (productId, productData) => {
	try {
		let prevResult = await dbModel.selectProducts(false, -1, [productId])
		prevResult = prevResult[0]
		let updateResult = await dbModel.updateProducts(productId, productData)
		if(updateResult) {
			if(parseInt(prevResult.inventory) != parseInt(productData.inventory)){
				await dbModel.insertEventLog('item_'+productId, '更新商品(id:'+productId+') 貨存 '+ prevResult.inventory +' -> '+productData.inventory)
			}
			if(parseFloat(prevResult.price) != parseFloat(productData.price)){
				await dbModel.insertEventLog('item_'+productId, '更新商品(id:'+productId+') 價錢 '+ prevResult.price +' -> '+productData.price)
			}
			return productId;
		}
		else return false;
	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

export const createProduct = async (productData) => {
	try {
		let productId = await dbModel.insertProduct(productData)
		if(productId) {
			await dbModel.insertEventLog('item_'+productId, '新增商品(id:'+productId+')')
			return productId;
		}
		else return false;
	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}