import * as dbModel from '../model/dbModel.js'
import * as testingData from '../../store/testing';

export const getEventLog = async (code='') => {
	try {
		if(testingData.mode == 'testing') var resultArray = testingData.event_log 
		else var resultArray = await dbModel.selectEventLog(code)
		
		return resultArray;
	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}
