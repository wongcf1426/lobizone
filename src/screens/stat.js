import * as React from 'react';
import { View, Text, ScrollView } from "react-native";
import Navigation from '../components/navigation';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import LoadingBar from '../components/loadingBar';
//import Chart from '../components/piechart';

import { getStatData } from '../controller/statController';
import * as store from '../../store';


const Stat = () => {
	let [statData, setStatData] = React.useState({overall:{'amount':0, 'lumpsum':0}, rankAmount:[], rankLumpsum:[]});
	const [isLoading, setLoading] = React.useState(false);

	async function loadStatData() {
		try {
			setLoading(true)
			var result = await getStatData();
			if(result.state == 'success'){
				//console.log(result.data)
				await setStatData(result.data);
			}
			else {
				msgBoxRef.current.open(result.errMsg, 'bg-focus')
			}
			setLoading(false)
		} catch (err) {
			console.log(err);
		}
	}

	useFocusEffect(
		React.useCallback(() => {
			loadStatData()
		}, [])
	);

	return (
		<View className='bg-auxiliary w-full h-full flex flex-1 flex-column md:flex-row'>
			<View className="flex-none w-full md:w-16 h-auto md:h-full absolute md:relative bottom-0 md:bottom-[] z-10">
				<Navigation currentScreen='Stat'/>
			</View>
			<View className='grow w-full md:w-80 h-full'>
			{isLoading && <LoadingBar loading={isLoading}/>}
				<View className="py-4 md:py-8 px-6 h-[95%] md:h-full w-full">
					<View className="flex flex-row pb-5 h-full">
						<View className="basis-full" >
							<View className="bg-shiro shadow-lg px-4 py-2 rounded-xl mx-2 flex flex-row flex-wrap">
								<View className="basis-1/2 px-2">
									<View className="flex flex-row">
										<View className='bg-primary w-1/3 rounded-l-xl align-middle py-1'>
											<Text className="text-shiro w-fit text-center">
												<MaterialIcons name='tag' size={24}/>
											</Text>
										</View>
										<View className='w-2/3 rounded-r-xl align-middle border-2 border-primary py-1 text-center'>
											<Text className="text-kuro text-m text-center">{statData.overall.amount}</Text>
										</View>
									</View>
								</View>
								<View className="basis-1/2 px-2">
									<View className="flex flex-row">
										<View className='bg-primary w-1/3 rounded-l-xl align-middle py-1'>
											<Text className="text-shiro w-fit text-center">
												<MaterialIcons name='attach-money' size={24}/>
											</Text>
										</View>
										<View className='w-2/3 rounded-r-xl align-middle border-2 border-primary py-1 text-center'>
											<Text className="text-kuro text-m text-center">{statData.overall.lumpsum}</Text>
										</View>
									</View>
								</View>
							</View>
							<View className="py-3"></View>
							<ScrollView>
								<View className='flex flex-row flex-wrap mx-2'>
								<View className="basis-full md:basis-1/2 bg-shiro shadow-lg px-4 py-2 rounded-xl">
									<Text className="text-primary font-semibold text-xl pt-1 pb-2">銷量首五位</Text>
									{/*<Chart chartData={statData.rankAmount} field="amount"/>*/}
								</View>
								<View className="basis-full md:basis-0 py-3"></View>
								<View className="basis-full md:basis-1/2 bg-shiro shadow-lg px-4 py-2 rounded-xl">
									<Text className="text-primary font-semibold text-xl pt-1 pb-2">銷額首五位</Text>
									{/*<Chart chartData={statData.rankLumpsum} field="lumpsum"/>*/}
								</View>
								</View>
							</ScrollView>
						</View>
					</View>
				</View>
			</View>
		</View>
	)
}

export default Stat