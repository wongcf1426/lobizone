import * as React from 'react';
import { View, Text, WebView } from "react-native";
import Navigation from '../components/navigation';

import { testing } from '../controller/productController';
import * as store from '../../store';

const Home = () => {
	testing();
	return (
		<View className={(store.platformOS == 'web' ? 'w-5/6 absolute right-0 ' : 'w-full ') + 'bg-auxiliary h-full'}>
			<View className='w-full h-full'>
				<View className="py-8 px-6 h-5/6 w-full">
					<View className="grid grid-cols-12 gap-6 pb-5">
						<View className="col-span-12 bg-primary shadow-lg p-8 rounded-xl" >
							<View className="sm:pr-8">
								<Text className="text-auxiliary text-xl font-bold">Welcome</Text>
							</View>
						</View>
					</View>
					<View className="grid grid-cols-12 gap-6 pb-5">
						<View className="col-span-8 bg-accent shadow-lg p-8 rounded-xl" >
							<Text className="text-auxiliary text-xl font-bold">Working on Expo project</Text>
						</View>
					</View>
				</View>
			</View>
			<Navigation/>
		</View>
	)
}

export default Home