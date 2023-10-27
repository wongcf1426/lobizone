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

export const checkIsValidProduct = async (productId, qty) => {
	try {
		var productData = testingData.items.filter(function (el) {
			return el.id == productId;
		  });

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