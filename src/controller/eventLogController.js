import * as dbModel from '../model/dbModel.js'
import * as testingData from '../../store/testing';

export const getEventLog = async (code='') => {
	try {
		if(testingData.layout_dev) var resultArray = testingData.event_log
		else var resultArray = await dbModel.selectEventLog(code)

		return ({state: 'success', data: resultArray});
	}catch (error) {
		console.log(error)
		await dbModel.insertEventLog('elERR', error)
		return({state: 'fail', errMsg: error});
	}
}
