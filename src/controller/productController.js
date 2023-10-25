import * as dbModel from '../model/dbModel.js'

export const testing = async () => {
	try {
		dbModel.initDB();
	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}