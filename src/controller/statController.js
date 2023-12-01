import * as dbModel from '../model/dbModel.js'
import * as testingData from '../../store/testing';
import * as FileSystem from 'expo-file-system';

import * as Sharing from 'expo-sharing';

import XLSX from 'xlsx';

export const getStatData = async (filterCategory = -1) => {
	try {
		if(testingData.layout_dev)
		{
			var result={"overall": {"amount": 211, "lumpsum": 3220}, "rankAmount": [{"amount": 102, "item_id": 5, "lumpsum": 1100, "name": "加購", "thumbnail": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRppnVRGfKkfeXXBHZxfR-2bdiQ4mLofWwrgQ&usqp=CAU"}, {"amount": 73, "item_id": 1, "lumpsum": 733, "name": "明信片（款A", "thumbnail": "https://media.istockphoto.com/id/828156368/de/foto/demo.jpg?s=612x612&w=0&k=20&c=jT1TzYO-5XJYjUByI-G12oATtB6yO8QXcm1iesvlKTA="}, {"amount": 18, "item_id": 6, "lumpsum": 1187, "name": "貼貼1", "thumbnail": ""}, {"amount": 5, "item_id": 8, "lumpsum": 30, "name": "新貼貼", "thumbnail": ""}, {"amount": 5, "item_id": 7, "lumpsum": 25, "name": "貼貼2", "thumbnail": ""}], "rankLumpsum": [{"amount": 18, "item_id": 6, "lumpsum": 1187, "name": "貼貼1", "thumbnail": ""}, {"amount": 102, "item_id": 5, "lumpsum": 1100, "name": "加購", "thumbnail": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRppnVRGfKkfeXXBHZxfR-2bdiQ4mLofWwrgQ&usqp=CAU"}, {"amount": 73, "item_id": 1, "lumpsum": 733, "name": "明信片（款A", "thumbnail": "https://media.istockphoto.com/id/828156368/de/foto/demo.jpg?s=612x612&w=0&k=20&c=jT1TzYO-5XJYjUByI-G12oATtB6yO8QXcm1iesvlKTA="}, {"amount": 2, "item_id": 4, "lumpsum": 50, "name": "貼紙（小）", "thumbnail": "https://mydeermoon.com/cdn/shop/files/image_fd85722f-d5bd-416e-98b8-67f0ce5f92b4.png?v=1692945697"}, {"amount": 3, "item_id": 3, "lumpsum": 50, "name": "貼紙", "thumbnail": ""}]}
		}
		else
		{

			let productIds = [];
			if(filterCategory !== -1){
				var productMapResult = await dbModel.selectProducts(false, 1, [], filterCategory)
				if(productMapResult) productMapResult.map((item) => productIds.push(item.id))
			}
			var overall = await dbModel.sumStat(productIds)
			var rankAmount = await dbModel.sumStat(productIds, 'od.item_id', 'amount', 5)
			var rankLumpsum = await dbModel.sumStat(productIds, 'od.item_id', 'lumpsum', 5)

			let tmpAmount = await rankAmount.reduce((accumulator, object) => {
				return accumulator + object.amount;
			}, 0)
			let tmpLumpsum = await rankLumpsum.reduce((accumulator, object) => {
				return accumulator + object.lumpsum;
			}, 0)
			rankAmount.push({name:'其他', amount:overall[0].amount - tmpAmount})
			rankLumpsum.push({name:'其他', lumpsum:overall[0].lumpsum - tmpLumpsum})

			var rankAmountbyCat = []
			var rankLumpsumbyCat = []
			if(filterCategory == -1){
				//get groupby cat
				rankAmountbyCat = await dbModel.sumStat([], 'cm.cat_id', 'amount', 5)
				rankLumpsumbyCat = await dbModel.sumStat([], 'cm.cat_id', 'lumpsum', 5)
			}
			var result= {overall: overall[0], rankAmount: rankAmount, rankLumpsum:rankLumpsum, rankAmountbyCat: rankAmountbyCat, rankLumpsumbyCat: rankLumpsumbyCat}
		}
		return {state: 'success', data:result};

	}catch (error) {
		console.log(error)
		await dbModel.insertEventLog('statERR', error)
		return({state: 'fail', errMsg: error});
	}
}

export const exportAsExcel = async () => {
	try {
		const fileName = 'sauNgan.csv';
		const fileUri = FileSystem.documentDirectory + fileName;

		var data = [
			{"name":"John", "city": "Seattle"},
			{"name":"Mike", "city": "Los Angeles"},
			{"name":"Zach", "city": "New York"}
			];

			 var ws = XLSX.utils.json_to_sheet(data);

			  var wb = XLSX.utils.book_new();
			  XLSX.utils.book_append_sheet(wb,ws,"Prova");

			  const wbout = XLSX.write(wb, {type:'base64', bookType:"csv"});

			FileSystem.writeAsStringAsync(fileUri, wbout, {
			  encoding: FileSystem.EncodingType.Base64
			})
			await Sharing.shareAsync(fileUri, { UTI: '.csv', mimeType: 'text/csv' });

	}
	catch (error) {
		console.log(error)
		await dbModel.insertEventLog('statERR', error)
		return({state: 'fail', errMsg: error});
	}
}

