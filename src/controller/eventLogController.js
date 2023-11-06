import * as dbModel from '../model/dbModel.js'
import * as testingData from '../../store/testing';

export const getLogList = async (inventory=true, status=1, productIds=[]) => {
	try {
		var resultArray = await testingData.items.filter(function (el) {
			return (!inventory || el.inventory > 0) &&
				   (status == -1 || el.status == status)&&
				   (productIds.length == 0 || productIds.includes(el.id));
		  });
		return resultArray;
	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}
