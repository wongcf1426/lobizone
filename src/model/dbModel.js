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
		throw(error);
	}
}

//Item related
export const selectProducts = async (inventory=true, status=1, productIds=[], categoryId=-1) =>{
	try {
		let whereSqlArray = [];
		let whereSql = '';
		let joinSql = '';
		if(inventory) whereSqlArray.push('i.inventory > 0');
		if(status != -1) whereSqlArray.push('i.status = '+status);
		if(productIds.length != 0) whereSqlArray.push('i.id IN(' + productIds.join(', ') + ')');

		if(categoryId != -1) {
			whereSqlArray.push('cm.cat_id = '+categoryId);
			joinSql += 'JOIN category_mapping cm on cm.item_id=i.id '
		}
		if(whereSqlArray.length != 0) whereSql = 'WHERE '+whereSqlArray.join(' AND ')

		const sql =  `SELECT * FROM items i ` + joinSql + whereSql + `;`
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
		throw(error);
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
		throw(error);
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
		throw(error);
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
		throw(error);
	}
}

//category related
export const selectCategoryList= async () =>{
	try {
		let whereSqlArray = [];
		let whereSql = '';
		whereSqlArray.push('status = 1')
		if(whereSqlArray.length != 0) whereSql = 'WHERE '+whereSqlArray.join(' AND ')

		const sql =  `SELECT * FROM category ` + whereSql + `;`
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
		throw(error);
	}
}

export const getCategoryByProduct= async (productId) =>{
	try {
		let whereSqlArray = [];
		let whereSql = '';
		whereSqlArray.push('cm.item_id = '+productId)
		if(whereSqlArray.length != 0) whereSql = 'WHERE '+whereSqlArray.join(' AND ')

		const sql =  `SELECT c.id, c.name FROM category_mapping cm JOIN category c on c.id=cm.cat_id ` + whereSql + `;`
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
		throw(error);
	}
}

export const removeCategoryProductMapping= async (productId) =>{
	try {

		const sql =  `DELETE FROM category_mapping WHERE item_id=`+productId+`;`
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
		throw(error);
	}
}

export const addCategoryProductMapping= async (catId, productId) =>{
	try {
		const sql =  `INSERT INTO category_mapping('cat_id', 'item_id') VALUES (`+catId+`, `+productId+`);`
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
		throw(error);
	}
}

export const updateCategoryById = async(catId, updateObject) => {
	try {
		const whereSql = 'WHERE id = '+catId

		const sql =  `UPDATE category SET name = "`+updateObject.name+`" `+whereSql+`;`
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
		throw(error);
	}
}

export const insertCategory = async (catData) =>{
	try {
		const sql = `INSERT INTO category ('name', 'status') VALUES ('`+catData.name+`',`+catData.status+`);`
		console.log( sql )
		const db = await openDatabase();
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
			tx.executeSql(
				sql,
			 	null,
			 	(txObj, res) => {
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
		throw(error);
	}
}

//Order related
export const selectOrders = async (offset=0, status=1, orderIds=[]) =>{
	try {
		let whereSqlArray = [];
		let whereSql = '';
		if(status != -1) whereSqlArray.push('status = '+status);
		if(orderIds.length != 0) whereSqlArray.push('id IN(' + orderIds.join(', ') + ')');
		if(whereSqlArray.length != 0) whereSql = 'WHERE '+whereSqlArray.join(' AND ')
		let limitSql = ''
		if(offset != -1) limitSql='LIMIT 10 OFFSET '+ offset;

		const sql =  `SELECT * FROM orders ` + whereSql + ` ORDER BY id DESC `+limitSql+`;`
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
		throw(error);
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
		throw(error);
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
		throw(error);
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
		throw(error);
	}
}

//eventLog related
export const insertEventLog = async(code, message) => {
	try {
		const sql = `INSERT INTO event_log ('code', 'message', 'created_at') VALUES ('`+code+`', '`+JSON.stringify(message)+`', datetime('now', 'localtime'));`
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
		throw(error);
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
		throw(error);
	}
}

export const countTableRow= async (tbl='items', whereSql='WHERE 1', column='id') =>{
	try {
		const sql =  `SELECT COUNT(`+column+`) as total FROM ` +tbl+ ` ` + whereSql
		console.log( sql )
		const db = await openDatabase();
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
			tx.executeSql(
				sql,
			 	null,
			 	(txObj, resultSet) => {
					resolve(resultSet.rows._array[0].total)
				}
			);
			});
		});

	}catch (error) {
		throw(error);
	}
}

//Stat
export const sumStat = async(productIds=[], groupBy = '', orderBy = '', limit=-1) => {
	try {
		var whereSqlArray = [];
		var whereSql = '';

		whereSqlArray.push('o.status = 1')

		if(productIds.length != 0) whereSqlArray.push('od.item_id IN(' + productIds.join(', ') + ')');

		if(whereSqlArray.length != 0) whereSql = 'WHERE '+whereSqlArray.join(' AND ')

		var limitSql = ''
		if(limit != -1) limitSql='LIMIT '+ limit;

		var groupBySql = ''
		if(groupBy != '') groupBySql = 'GROUP BY '+groupBy;

		var orderBySql = ''
		if(orderBy != '') orderBySql = 'ORDER BY '+orderBy + ' DESC';

		var selectColumnSql = 'SUM(od.qty) as amount, SUM(od.qty*od.unit_price) as lumpsum '
		var joinSql = 'JOIN orders o on o.id=od.order_id ';
		if(productIds.length != 0 || groupBy == 'od.item_id')
		{
			selectColumnSql += ', od.item_id, p.name '
			joinSql += 'JOIN items p ON p.id=od.item_id'
		}else if(groupBy == 'cm.cat_id')
		{
			selectColumnSql += ', cm.cat_id, c.name '
			joinSql += 'JOIN items p ON p.id=od.item_id JOIN category_mapping cm ON cm.item_id=p.id JOIN category c ON c.id=cm.cat_id'
		}


		const sql =  `SELECT `+ selectColumnSql +` FROM order_detail od ` + joinSql + ` `+whereSql + ` `+ groupBySql + ` ` + orderBySql + ` `+limitSql+`;`

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
		throw(error);
	}
}

//Development
export const resetDB = async() => {
	try {
		const db = await openDatabase();
		await db.closeAsync()
		await db.deleteAsync()
		return({state: 'success', data:[]});
	}catch (error) {
		return({state: 'fail', errMsg: '錯誤: 532'});
	}
}

export const tmpDevelopSql = async() => {
	try {

		const sql =  ``
		//const sql =  `UPDATE items SET thumbnail='' WHERE id = 3`
		//const sql =  `SELECT * FROM event_log`
		//const sql =  `UPDATE orders SET status = 0 WHERE 1;`
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
		throw(error);
	}
}