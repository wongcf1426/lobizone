import * as React from 'react';
import { View, Text, Button } from "react-native";
import Navigation from '../components/navigation';
import LoadingBar from '../components/loadingBar';
import { useFocusEffect } from '@react-navigation/native';

import DataTable from '../components/dataTable';
//import { getUserList } from '../controller/UserController';
import * as store from '../../store';

const List = () => {
	let [result, setResult] = React.useState([]);
	let [isLoading, setLoading] = React.useState(false);
	async function fromAxios() {
		setLoading(true)
		//let tmp = await getUserList()
		let tmp = {result: []}
		setResult(tmp.result)
		setLoading(false)
	}
	let tableMapping = {'id': {title:'ID', colClass:'w-1/12 ', txtClass:'text-primary'}, 'name': {title:'Name', colClass:'w-1/3 ', txtClass:'text-primary'}, 'username': {title:'Username', colClass:'w-1/4 ', txtClass:'text-primary'}, 'password': {title:'Password', colClass:'w-1/3 ', txtClass:'text-primary'}}

	useFocusEffect(
		React.useCallback(() => {
			fromAxios()
			return () => {
			//reset data
			};
		}, [])
	);

	return (
		<>
			{isLoading && <LoadingBar loading={isLoading}/>}
			<View className={(store.device !== 'mobile' ? 'w-5/6 absolute right-0 ' : 'w-full ') + 'bg-primary h-full'}>
				<View className='w-full h-full'>
					<View className="py-8 px-6 h-5/6 w-full">
						<View className="grid grid-cols-12 gap-6">
							<View className="col-span-12 bg-auxiliary shadow-lg p-8 rounded-xl" >
								<View className="sm:pr-8">
									<DataTable mapping={tableMapping} data={result}/>
								</View>
							</View>
						</View>
					</View>
				</View>
				<Navigation/>
			</View>
		</>
	)
}

export default List