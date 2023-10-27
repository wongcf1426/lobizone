import * as React from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import Navigation from '../components/navigation';
import ItemBox from '../components/itemBox';

import { getProductList, checkIsValidProduct } from '../controller/productController';

const statusList = [{'key':1, 'status':'公開'},{'key':0, 'status':'隱藏'},{'key':2, 'status':'封存'}]

const ItemList = () => {
	const [itemsList, setitemsList] = React.useState([]);
	const [filterStatus, setFilterStatus] = React.useState(1);

	async function getItemList() {
		try {
			var result = await getProductList(false, filterStatus);
			setitemsList(result);
		} catch (err) {
			console.log(err);
		}
	}

	React.useEffect( () => {
        getItemList();
    }, []);

	return (
		<View className='bg-auxiliary w-full h-full flex flex-1 flex-row'>
			<View className="flex-none w-16 h-full">
				<Navigation currentScreen='Item'/>
			</View>
			<View className='grow w-80'>
				<View className="py-6 px-6 h-full w-full">
					<View className="flex flex-row pb-5 h-full">
						<View className="basis-full" >
							<View className='flex flex-row flex-wrap'>
								{
									statusList.map(function(stausTag, i){
										return (
											<View key ={i} className={(filterStatus == stausTag.key ? 'bg-primary ':'bg-shiro ') + "shadow-lg px-4 py-2 rounded-xl m-2 "} >
												<Text className={(filterStatus == stausTag.key ? 'text-shiro ':'text-primary ') + " text-l font-bold"}>{stausTag.status}</Text>
											</View>);
									})
								}
							</View>
							<ScrollView>
								<View className="flex flex-row flex-wrap pb-5">
									{itemsList.map(function(itemData, i){
										if(itemData.inventory > 0) return <ItemBox data={itemData} key={i} viewType='list' editable={false}/>;
									})}
									<View className="pt-4 pb-2 w-[40%]">
										<Text className="border-b-2 border-shiro text-shiro font-bold text-xl">售罄</Text>
									</View>
									{itemsList.map(function(itemData, i){
										if(itemData.inventory < 1) return <ItemBox data={itemData} key={i} viewType='list' editable={false} itemActivate={0}/>;
									})}
								</View>
							</ScrollView>
						</View>
					</View>
				</View>
			</View>
		</View>
	)
}

export default ItemList
