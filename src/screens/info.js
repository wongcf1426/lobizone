import * as React from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import Navigation from '../components/navigation';

import * as store from '../../store';

const Info = () => {
	return (
		<View className='bg-auxiliary w-full h-full flex flex-1 flex-column md:flex-row'>
			<View className="flex-none w-full md:w-16 h-auto md:h-full absolute md:relative bottom-0 md:bottom-[] z-10">
				<Navigation currentScreen='Settings'/>
			</View>
			<View className='grow w-full md:w-80 h-full'>
				<View className="py-4 md:py-8 px-6 h-[95%] md:h-full w-full">
					<View className="flex flex-row pb-5 h-full">
						<View className="basis-full" >
							<View className="bg-shiro shadow-lg px-4 py-2 rounded-xl h-full mx-2 py-4">
								<View className="justify-center items-center py-2 relative group w-full flex flex-row border-b-2 border-grey py-3 px-2">
									<Text className="basis-full">SauNgan ver beta0.1</Text>
								</View>
								<View className="justify-center items-center py-2 relative group w-full flex flex-row px-2">
									<Text className="basis-full">Build 20231202</Text>
								</View>
								<View className="justify-center items-center py-2 relative group w-full flex flex-row px-2">
									<Text className="basis-full">develop by sau1426@lobizone</Text>
								</View>
							</View>
						</View>
					</View>
				</View>
			</View>
		</View>
	)
}

export default Info