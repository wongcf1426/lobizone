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

		//console.log(db);
		db.transaction(tx => {
			tx.executeSql(
			  'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price DECIMAL, inventory INT, description TEXT, thumbnail TEXT, status INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP)',
			  null,
			  (txObj, { rows: { _array } }) => console.log({ data: _array }),
			  (txObj, error) => console.log('Error ', error)
			)
		})

		db.transaction(tx => {
			tx.executeSql(
			  `SELECT * from items where 1;`,
			  null,
			  (_, { rows: { _array } }) => console.log({ items: _array }),
			  (txObj, error) => console.log('Error ', error)
			);
		  });
		//db.transaction(tx => {})
	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}