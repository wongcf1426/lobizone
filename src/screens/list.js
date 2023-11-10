import * as React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Button } from "react-native";

import Navigation from '../components/navigation';
import LoadingBar from '../components/loadingBar';

import DataTable from '../components/dataTable';

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
		<View className='bg-auxiliary w-full h-full flex flex-1 flex-column md:flex-row'>
			<View className="flex-none w-full md:w-16 h-auto md:h-full absolute md:relative bottom-0 md:bottom-[] z-10">
				<Navigation currentScreen='List'/>
			</View>
			<View className='grow w-full md:w-80 h-full'>
				<View className="py-4 md:py-8 px-6 h-[95%] md:h-full w-full">
					<View className="flex flex-row pb-5 h-full">
						<View className="flex flex-row basis-full gap-6">
							<View className="basis-full bg-shiro shadow-lg p-8 rounded-xl" >
								<View className="sm:pr-8">
									<DataTable mapping={tableMapping} data={result}/>
								</View>
							</View>
						</View>
					</View>
				</View>
				<Navigation/>
			</View>
		</View>
	)
}

export default List