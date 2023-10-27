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

		db.transaction(tx => {
			tx.executeSql(
			  'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price DECIMAL, inventory INT, description TEXT, thumbnail TEXT, status INT);CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, status INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);CREATE TABLE IF NOT EXISTS order_detail (order_id INTEGER, item_id INTEGER, qty INT, unit_price INT);CREATE TABLE IF NOT EXISTS event_log (id INTEGER PRIMARY KEY AUTOINCREMENT, code INT, message TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);',
			  null,
			  (txObj, { rows: { _array } }) => console.log({ data: _array }),
			  (txObj, error) => console.log('Error ', error)
			)
		})
	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}