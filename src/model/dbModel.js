import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase("../lobizone.db");

export const initDB = async () => {
	try {
		console.log(db);
		/*db.transaction(tx => {
			tx.executeSql(
			  'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, count INT)'
			)
		})*/
		//db.transaction(tx => {})
	}catch (error) {
		console.log(error)
		return({state: 'fail'});
	}
}