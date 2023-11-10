import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import {Asset} from "expo-asset";

async function openDatabase() {
	const internalDbName = "dbInStorage.sqlite"; // Call whatever you want
    const sqlDir = FileSystem.documentDirectory + "SQLite/";
    if (!(await FileSystem.getInfoAsync(sqlDir + internalDbName)).exists) {
        await FileSystem.makeDirectoryAsync(sqlDir, {intermediates: true});
        const asset = Asset.fromModule(require("../../assets/database/lobizone.db"));
        await FileSystem.downloadAsync(asset.uri, sqlDir + internalDbName);
    }
   	return SQLite.openDatabase(internalDbName);
}

export const initDB = async () => {
	try {
		const db = await openDatabase();

	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

//Item related
export const selectProducts = async (inventory=true, status=1, productIds=[]) =>{
	try {
		let whereSqlArray = [];
		let whereSql = '';
		if(inventory) whereSqlArray.push('inventory > 0');
		if(status != -1) whereSqlArray.push('status = '+status);
		if(productIds.length != 0) whereSqlArray.push('id IN(' + productIds.join(', ') + ')');
		if(whereSqlArray.length != 0) whereSql = 'WHERE '+whereSqlArray.join(' AND ')

		const sql =  `SELECT * FROM items ` + whereSql + `;`
		console.log( sql )

		const db = await openDatabase();
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
			tx.executeSql(
				sql,
			 	null,
			 	(txObj, resultSet) => {
					resolve(resultSet.rows._array)
				}
			);
			});
		});

	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

export const updateProducts = async(productId, updateObject) => {
	try {
		const whereSql = 'WHERE id = '+productId

		const sql =  `UPDATE items SET name = "`+updateObject.name+`", price= `+updateObject.price+`, inventory= `+updateObject.inventory+`, description="`+updateObject.description+`" , thumbnail="`+updateObject.thumbnail+`" , status= `+updateObject.status+` `+whereSql+`;`
		console.log( sql )

		const db = await openDatabase();
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
			tx.executeSql(
				sql,
			 	null,
			 	(txObj, resultSet) => {
					resolve(resultSet)
				}
			);
			});
		});

	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

export const insertProduct = async (productData) =>{
	try {
		const sql = `INSERT INTO items ('name', 'price', 'description', 'thumbnail', 'inventory', 'status') VALUES ('`+productData.name+`',`+productData.price+`,'`+productData.description+`','`+productData.thumbnail+`',`+productData.inventory+`,`+productData.status+`);`
		console.log( sql )
		const db = await openDatabase();
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
			tx.executeSql(
				sql,
			 	null,
			 	(txObj, res) => {
					console.log(res.insertId)
					resolve(res.insertId)
				},
				(error) => {
				  console.log("execute error: " + error);
				  reject(error)
				}
			);
			});
		});

	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}
export const deductInventory = async(productId, qty) => {
	try {
		const whereSql = 'WHERE id = '+productId

		const sql =  `UPDATE items SET inventory = inventory -` + qty + ` `+whereSql+`;`
		console.log( sql )

		const db = await openDatabase();
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
			tx.executeSql(
				sql,
			 	null,
			 	(txObj, resultSet) => {
					resolve(true)
				}
			);
			});
		});

	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

//Order related
export const selectOrders = async (status=1, orderIds=[]) =>{
	try {
		let whereSqlArray = [];
		let whereSql = '';
		if(status != -1) whereSqlArray.push('status = '+status);
		if(orderIds.length != 0) whereSqlArray.push('id IN(' + orderIds.join(', ') + ')');
		if(whereSqlArray.length != 0) whereSql = 'WHERE '+whereSqlArray.join(' AND ')

		const sql =  `SELECT * FROM orders ` + whereSql + ` ORDER BY id DESC;`
		console.log( sql )
		const db = await openDatabase();
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
			tx.executeSql(
				sql,
			 	null,
			 	(txObj, resultSet) => {
					resolve(resultSet.rows._array)
				}
			);
			});
		});

	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

export const selectOrderDetail = async (orderId = '', productId='') =>{
	try {
		let whereSqlArray = [];
		let whereSql = '';
		if(orderId != '')whereSqlArray.push('order_id =' + orderId);
		if(productId != '')whereSqlArray.push('item_id =' + productId);
		if(whereSqlArray.length != 0) whereSql = 'WHERE '+whereSqlArray.join(' AND ')

		const sql =  `SELECT * FROM order_detail ` + whereSql + `;`
		console.log( sql )
		const db = await openDatabase();
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
			tx.executeSql(
				sql,
			 	null,
			 	(txObj, resultSet) => {
					resolve(resultSet.rows._array)
				}
			);
			});
		});

	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

export const insertOrder = async () =>{
	try {
		const sql = `INSERT INTO orders ('description', 'status', 'created_at') VALUES ('', 1, datetime('now', 'localtime'));`
		console.log( sql )
		const db = await openDatabase();
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
			tx.executeSql(
				sql,
			 	null,
			 	(txObj, res) => {
					resolve(res.insertId)
				}
			);
			});
		});

	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

export const insertOrderDetail = async (order_id, productArray) =>{
	try {
		let inserValueArray = []
		for await (const productData of productArray) {
			let tmp = '(' + order_id + ', '+ productData.id +', '+ productData.qty +', '+ productData.price +')'
			inserValueArray.push(tmp)
		}
		const sql = `INSERT INTO order_detail ('order_id', 'item_id', 'qty', 'unit_price') VALUES ` + inserValueArray.join(' , ');
		console.log( sql )
		const db = await openDatabase();
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
			tx.executeSql(
				sql,
			 	null,
			 	(txObj, res) => {
					resolve(true)
				}
			);
			});
		});

	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

//eventLog related
export const insertEventLog = async(code, message) => {
	try {
		const sql = `INSERT INTO event_log ('code', 'message', 'created_at') VALUES ('`+code+`', '`+message+`', datetime('now', 'localtime'));`
		console.log( sql )
		const db = await openDatabase();
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
			tx.executeSql(
				sql,
			 	null,
			 	(txObj, res) => {
					resolve(res.insertId)
				}
			);
			});
		});

	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

export const selectEventLog = async (code='') =>{
	try {
		let whereSqlArray = [];
		let whereSql = '';
		if(code != '') whereSqlArray.push('code = "'+code+'"');
		if(whereSqlArray.length != 0) whereSql = 'WHERE '+whereSqlArray.join(' AND ')

		const sql =  `SELECT * FROM event_log ` + whereSql + ` ORDER BY id DESC;`
		console.log( sql )
		const db = await openDatabase();
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
			tx.executeSql(
				sql,
			 	null,
			 	(txObj, resultSet) => {
					resolve(resultSet.rows._array)
				}
			);
			});
		});

	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}

//Development
export const tmpDevelopSql = async() => {
	try {

		//const sql =  ``
		//const sql =  `UPDATE items SET thumbnail='' WHERE id = 3`
		const sql =  `SELECT * FROM event_log`
		console.log( sql )

		const db = await openDatabase();
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
			tx.executeSql(
				sql,
			 	null,
			 	(txObj, resultSet) => {
					console.log(resultSet.rows._array)
					resolve(resultSet.rows._array)
				}
			);
			});
		});

	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}