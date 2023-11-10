import * as React from 'react';
import { View, Text, ScrollView } from "react-native";
import Navigation from '../components/navigation';
import { useFocusEffect } from '@react-navigation/native';

import DataTable from '../components/dataTable';
import LoadingBar from '../components/loadingBar';

import { getEventLog } from '../controller/eventLogController';
import * as store from '../../store';

const Order = () => {
	let [eventLog, setEventLog] = React.useState([]);
	const [isLoading, setLoading] = React.useState(false);

	let tableMapping = {'id': {title:'ID', colClass:'w-1/12 ', txtClass:'text-kuro text-sm', titleClass:'text-primary text-base font-bold'}, 'message': {title:'訊息', colClass:'w-7/12 ', txtClass:'text-kuro text-sm', titleClass:'text-primary text-base font-bold'}, 'created_at': {title:'時間', colClass:'w-4/12 ', txtClass:'text-kuro text-sm', titleClass:'text-primary text-base font-bold'}}

	async function loadEventLog() {
		try {
			setLoading(true)
			var result = await getEventLog();
			setEventLog(result);
			setLoading(false)
		} catch (err) {
			console.log(err);
		}
	}

	useFocusEffect(
		React.useCallback(() => {
			loadEventLog()
		}, [])
	);

	return (
		<View className='bg-auxiliary w-full h-full flex flex-1 flex-column md:flex-row'>
			<View className="flex-none w-full md:w-16 h-auto md:h-full absolute md:relative bottom-0 md:bottom-[] z-10">
				<Navigation currentScreen='Info'/>
			</View>
			<View className='grow w-full md:w-80 h-full'>
			{isLoading && <LoadingBar loading={isLoading}/>}
				<View className="py-4 md:py-8 px-6 h-[95%] md:h-full w-full">
					<View className="flex flex-row pb-5 h-full">
						<View className="basis-full" >
							<View className="bg-shiro shadow-lg px-4 py-2 rounded-xl h-full mx-2">
								<DataTable mapping={tableMapping} data={eventLog} />
							</View>
						</View>
					</View>
				</View>
			</View>
		</View>
	)
}

export default Order