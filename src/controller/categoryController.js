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
			await dbModel.insertEventLog('catERR', 'update failed code25')
			return ({state: 'fail', errMsg: '錯誤: code25'});
		}
	}catch (error) {
		console.log(error)
		await dbModel.insertEventLog('catERR', error)
		return({state: 'fail', errMsg: error});
	}
}


export const createCategory = async (catData) => {
	try {
		let catId = await dbModel.insertCategory(catData)
		if(catId) {
			await dbModel.insertEventLog('cat_'+catId, '新增分類(id:'+catId+')')
			return ({state: 'success', data: catId});
		}
		else {
			await dbModel.insertEventLog('catERR', 'create failed code46')
			return ({state: 'fail', errMsg: '錯誤: code46'});
		}
	}catch (error) {
		console.log(error)
		await dbModel.insertEventLog('catERR', error)
		return({state: 'fail', errMsg: 'error'});
	}
}