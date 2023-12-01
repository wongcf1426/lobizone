import * as React from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback, PermissionsAndroid } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import Navigation from '../components/navigation';
import LoadingBar from '../components/loadingBar';
import MessageBox from '../components/messageBox';

import { exportAsExcel } from '../controller/statController';
import { resetDB } from '../model/dbModel';
import * as store from '../../store';

const Settings = () => {
	const [isLoading, setLoading] = React.useState(false);
	const msgBoxRef = React.useRef()

	let settingTable = [{icon:'format-list-bulleted', landing:'EventLog', text:'紀錄'}, {icon:'info-outline', landing:'Info', text:'資訊'}]

	const exportExcel = async() => {
		setLoading(true)
		let result = exportAsExcel();
			if (result?.data) {

			}else{
				msgBoxRef.current.open(result.errMsg, 'bg-focus')
			}
		setLoading(false)
	}

	return (
		<View className='bg-auxiliary w-full h-full flex flex-1 flex-column md:flex-row'>
			<View className="flex-none w-full md:w-16 h-auto md:h-full absolute md:relative bottom-0 md:bottom-[] z-10">
				<Navigation currentScreen='Settings'/>
			</View>
			<View className='grow w-full md:w-80 h-full'>
			{isLoading && <LoadingBar loading={isLoading}/>}
			<MessageBox ref={msgBoxRef}/>
				<View className="py-4 md:py-8 px-6 h-[95%] md:h-full w-full">
					<View className="flex flex-row pb-5 h-full">
						<View className="basis-full" >
							<View className="bg-shiro shadow-lg px-4 py-2 rounded-xl h-full mx-2 py-4">
								{
									settingTable.map(function(settingItem, i){
										return  (
											<TouchableWithoutFeedback key={i} onPress={() => store.navigate(settingItem.landing)}>
												<View className="justify-center items-center py-2 w-full flex flex-row border-b-2 border-grey py-3 px-2">
													<Text className="basis-1/3 text-kuro w-fit">
													<MaterialIcons name={settingItem.icon} size={26}/>
													</Text>
													<Text className="basis-2/3">{settingItem.text}</Text>
												</View>
									  		</TouchableWithoutFeedback>
									  );
									})
								}
								<TouchableWithoutFeedback onPress={() => exportExcel()}>
									<View className="justify-center items-center py-2 w-full flex flex-row border-b-2 border-grey py-3 px-2">
										<Text className="basis-1/3 text-kuro w-fit">
										<MaterialIcons name='all-inbox' size={26}/>
										</Text>
										<Text className="basis-2/3">匯出excel</Text>
									</View>
								</TouchableWithoutFeedback>
								{/*<View className="border-t-2 border-grey mt-auto">
								<TouchableWithoutFeedback onPress={() => resetDB()}>
									<View className="justify-center items-center py-2 w-full flex flex-row py-3 px-2">
										<Text className="basis-1/3 text-kuro w-fit">
										<MaterialIcons name='remove-circle-outline' size={26}/>
										</Text>
										<Text className="basis-2/3">Reset DB</Text>
									</View>
								</TouchableWithoutFeedback>
							</View>*/}
							</View>
						</View>
					</View>
				</View>
			</View>
		</View>
	)
}

export default Settings