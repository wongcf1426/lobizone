import * as React from 'react';
import { View, Text, ScrollView } from "react-native";
import Navigation from '../components/navigation';
import { useFocusEffect } from '@react-navigation/native';

import DataTable from '../components/dataTable';
import ItemBox from '../components/itemBox';
import LoadingBar from '../components/loadingBar';

import { getOrderList, getOrderDetail } from '../controller/orderController';

const Order = () => {
	let [orderList, setOrderList] = React.useState([]);
	let [orderDetail, setOrderDetail] = React.useState([]);
	const [isLoading, setLoading] = React.useState(false);

	let tableMapping = {'id': {title:'ID', colClass:'w-1/12 ', txtClass:'text-kuro font-normal', titleClass:'text-primary text-xl font-semibold'}, 'created_at': {title:'交易時間', colClass:'w-1/2 ', txtClass:'text-kuro font-normal', titleClass:'text-primary text-xl font-semibold'}, 'amount': {title:'金額', colClass:'w-5/12 ', txtClass:'text-kuro font-normal', titleClass:'text-primary text-xl font-semibold'}}

	async function loadOrderList() {
		try {
			setLoading(true)
			var result = await getOrderList();
			setOrderList(result);
			setLoading(false)
		} catch (err) {
			console.log(err);
		}
	}

	async function showOrderDetail(value) {
		try {
			setLoading(true)
			var result = await getOrderDetail(value);
			setOrderDetail(result)
			setLoading(false)
		} catch (err) {
			console.log(err);
		}
	}

	useFocusEffect(
		React.useCallback(() => {
			loadOrderList()
		}, [])
	);

	return (
		<View className='bg-auxiliary w-full h-full flex flex-1 flex-row'>
			<View className="flex-none w-16 h-full">
				<Navigation currentScreen='Order'/>
			</View>
			<View className='grow w-80'>
			{isLoading && <LoadingBar loading={isLoading}/>}
				<View className="py-6 px-6 h-full w-full">
					<View className="flex flex-row pb-5 h-full">
						<View className="basis-8/12" >
							<View className="bg-shiro shadow-lg px-4 py-2 rounded-xl h-full mx-2">
								<DataTable mapping={tableMapping} data={orderList} onPressFunc={(value=>showOrderDetail(value))}/>
							</View>
						</View>
						<View className="basis-4/12" >
							<View className="bg-shiro shadow-lg px-4 py-2 rounded-xl mx-2 items-end h-full">
								<View className="h-[85%] pb-4 w-full">
									<ScrollView>
										<View className="flex flex-row flex-wrap w-full">
										{orderDetail.map(function(itemData, i){
											return <ItemBox data={itemData} key={i} viewType='mini-list' editable={false} />;
										})}
										</View>
									</ScrollView>
								</View>
								<View className="h-[10%] flex flex-row flex-wrap justify-between w-full">
									<Text className="text-kuro text-2xl font-bold">總金額</Text>
									<Text className="text-primary text-2xl font-bold">{
										orderDetail.reduce((accumulator, object) => {
											return accumulator + object.itemPrice;
										}, 0).toFixed(2)
									}</Text>
								</View>
							</View>
						</View>
					</View>
				</View>
			</View>
		</View>
	)
}

export default Order