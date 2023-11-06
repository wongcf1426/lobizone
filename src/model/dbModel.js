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

export const selectFrom = async () =>{
	try {
		const db = await openDatabase();
		return new Promise((resolve, reject) => {
			db.transaction(tx => {
			tx.executeSql(
			  `SELECT * FROM items;`,
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
