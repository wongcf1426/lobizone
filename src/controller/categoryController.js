import * as dbModel from '../model/dbModel.js'
import * as testingData from '../../store/testing';

export const getCatList = async () => {
	try {
		if(testingData.layout_dev) var result = testingData.category
		else var result = await dbModel.selectCategoryList()
		return ({state: 'success', data: result});
	}catch (error) {
		console.log(error)
		await dbModel.insertEventLog('catERR', error)
		return({state: 'fail', errMsg: error});
	}
}


export const updateCat = async (catid, catData) => {
	try {
		var result = await dbModel.updateCategoryById(catid, catData)
		if(result){
			return ({state: 'success', data: catid});
		}
		else {
			await dbModel.insertEventLog('catERR', 'update failed')
			return ({state: 'fail', errMsg: 'update failed'});
		}
	}catch (error) {
		console.log(error)
		await dbModel.insertEventLog('catERR', error)
		return({state: 'fail', errMsg: error});
	}
}


export const createCategory = async (catData) => {
	try {
		console.log('37' + catData)
		//let catId = 1
		let catId = await dbModel.insertCategory(catData)
		if(catId) {
			await dbModel.insertEventLog('cat_'+catId, '新增分類(id:'+catId+')')
			return ({state: 'success', data: catId});
		}
		else {
			await dbModel.insertEventLog('catERR', 'create failed')
			return ({state: 'fail', errMsg: 'create failed'});
		}
	}catch (error) {
		console.log(error)
		await dbModel.insertEventLog('catERR', error)
		return({state: 'fail, errMsg: error'});
	}
}