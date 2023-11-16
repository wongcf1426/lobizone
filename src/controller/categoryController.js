import * as dbModel from '../model/dbModel.js'
import * as testingData from '../../store/testing';

export const getCatList = async () => {
	try {
		if(testingData.layout_dev) var result = testingData.category
		else var result = await dbModel.selectCategory()
		return ({state: 'success', data: result});
	}catch (error) {
		console.log(error)
		await dbModel.insertEventLog('productERR', error)
		return({state: 'fail', errMsg: error});
	}
}
