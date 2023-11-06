import * as React from 'react';
import { View, Text, ScrollView } from "react-native";
import Navigation from '../components/navigation';

import DataTable from '../components/dataTable';
import ItemBox from '../components/itemBox';
import { getOrderList, getOrderDetail } from '../controller/orderController';

const Order = () => {
	let [orderList, setOrderList] = React.useState([]);
	let [orderDetail, setOrderDetail] = React.useState([]);

	let tableMapping = {'id': {title:'ID', colClass:'w-1/6 ', txtClass:'text-primary font-semibold'}, 'amount': {title:'金額', colClass:'w-1/3 ', txtClass:'text-primary font-semibold'}, 'created_at': {title:'交易時間', colClass:'w-1/2 ', txtClass:'text-primary font-semibold'}}

	async function loadOrderList() {
		try {
			var result = await getOrderList();
			setOrderList(result);
		} catch (err) {
			console.log(err);
		}
	}

	async function showOrderDetail(value) {
		try {
			var result = await getOrderDetail(value);
			setOrderDetail(result)
			console.log(result)
		} catch (err) {
			console.log(err);
		}
	}

	React.useEffect( () => {
        loadOrderList();
    }, []);
	return (
		<View className='bg-auxiliary w-full h-full flex flex-1 flex-row'>
			<View className="flex-none w-16 h-full">
				<Navigation currentScreen='Order'/>
			</View>
			<View className='grow w-80'>
				<View className="py-6 px-6 h-full w-full">
					<View className="flex flex-row pb-5 h-full">
						<View className="basis-8/12" >
							<View className="bg-primary shadow-lg px-4 rounded-xl mx-2 h-[10%]" >
								<Text className="text-shiro text-xl font-bold my-auto">交易記錄</Text>
							</View>
							<View className="mx-2 h-[10px]" >
							</View>
							<View className="bg-shiro shadow-lg p-4 rounded-xl h-[calc(90%-10px)] mx-2">
								<DataTable mapping={tableMapping} data={orderList} onPressFunc={(value=>showOrderDetail(value))}/>
							</View>
						</View>
						<View className="basis-4/12" >
							<View className="bg-shiro shadow-lg px-4 py-2 rounded-xl mx-2 items-end h-full">
								<View className="h-[90%] pb-4 w-full">
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