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

export const getProductList = async (inventory=true, status=1, productIds=[], categoryId = -1) => {
	try {
		if(testingData.layout_dev) var result = testingData.items
		else var result = await dbModel.selectProducts(inventory, status, productIds, categoryId)
		return ({state: 'success', data: result});
	}catch (error) {
		console.log(error)
		await dbModel.insertEventLog('productERR', error)
		return({state: 'fail', errMsg: error});
	}
}

export const getProductDetail = async (productId) => {
	try {
		if(testingData.layout_dev)
		{
			var productData = [testingData.items[0]]
			var saleDataArray = testingData.order_detail
			var eventLog = testingData.event_log
			var categoryMapArray = []
		}
		else
		{
			var productData = await dbModel.selectProducts(false, -1, [productId])
			var saleDataArray = await dbModel.sumStat([productId])
			var categoryMapArray = await dbModel.getCategoryByProduct(productId)
			var eventLog = await dbModel.selectEventLog('item_'+productId)
		}
		if(productData.length > 0 && productData[0]?.id)
		{
			let result = productData[0]

			if(saleDataArray.length > 0 && saleDataArray[0]?.amount) result.statData = saleDataArray[0]
			else result.statData = {amount: 0, lumpsum: 0}

			if(eventLog) result.eventLog = eventLog;
			else result.eventLog = [];

			if(categoryMapArray.length > 0) result.category = categoryMapArray[0]
			else result.category = {'id': -1, 'name': '未分類'}

			return {state: 'success', data: result};
		}
		else{
			await dbModel.insertEventLog('productERR', error)
			return({state: 'fail', errMsg: 'empty result'});
		}

	}catch (error) {
		console.log(error)
		return({state: 'fail', errMsg: error});
	}
}
export const checkIsValidProduct = async (productId, qty) => {
	try {
		if(testingData.layout_dev) var productData = testingData.items
		else var productData = await dbModel.selectProducts(true, 1, [productId])


		if(productData.length > 0 && qty > 0) {
			productData = productData[0]
			if(productData.inventory >= qty && productData.status == 1) return ({state: 'success', data:productData})
			else return ({state: 'fail', errMsg: 'fail to add cart'})
		}else{
			return ({state: 'fail', errMsg: 'empty result'})
		}
	}catch (error) {
		console.log(error)
		await dbModel.insertEventLog('productERR', error)
		return({state: 'fail', errMsg: error});
	}
}

export const updateProductDetail = async (productId, productData) => {
	try {
		let prevResult = await dbModel.selectProducts(false, -1, [productId])
		prevResult = prevResult[0]
		let updateResult = await dbModel.updateProducts(productId, productData)

		await dbModel.removeCategoryProductMapping(productId)
		if(productData?.category && productData.category?.id && productData.category.id != -1)
		{
			await dbModel.addCategoryProductMapping(productData.category.id, productId)
		}
		//do update category mapping
		if(updateResult) {

			if(parseInt(prevResult.inventory) != parseInt(productData.inventory)){
				await dbModel.insertEventLog('item_'+productId, '更新商品(id:'+productId+') 貨存 '+ prevResult.inventory +' -> '+productData.inventory)
			}
			if(parseFloat(prevResult.price) != parseFloat(productData.price)){
				await dbModel.insertEventLog('item_'+productId, '更新商品(id:'+productId+') 價錢 '+ prevResult.price +' -> '+productData.price)
			}
			return ({state: 'success', data: productId});
		}
		else {
			await dbModel.insertEventLog('productERR', 'update failed')
			return ({state: 'fail', errMsg: 'update failed'});
		}
	}catch (error) {
		console.log(error)
		await dbModel.insertEventLog('productERR', error)
		return({state: 'fail', errMsg: error});
	}
}

export const createProduct = async (productData) => {
	try {
		let productId = await dbModel.insertProduct(productData)
		//do create category mapping
		if(productId) {
			if(productData?.category && productData.category?.id && productData.category.id != -1)
			{
				await dbModel.addCategoryProductMapping(productData.category.id, productId)
			}
			await dbModel.insertEventLog('item_'+productId, '新增商品(id:'+productId+')')
			return ({state: 'success', data: productId});
		}
		else {
			await dbModel.insertEventLog('productERR', 'create failed')
			return ({state: 'fail', errMsg: 'create failed'});
		}
	}catch (error) {
		console.log(error)
		await dbModel.insertEventLog('productERR', error)
		return({state: 'fail, errMsg: error'});
	}
}