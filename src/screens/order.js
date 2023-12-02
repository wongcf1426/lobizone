import * as React from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import Navigation from '../components/navigation';
import Pagination from '../components/pagination';
import DataTable from '../components/dataTable';
import ItemBox from '../components/itemBox';
import LoadingBar from '../components/loadingBar';

import { getOrderList, getOrderDetail } from '../controller/orderController';
import * as store from '../../store';

const Order = () => {
	let [orderList, setOrderList] = React.useState([]);
	let [orderDetail, setOrderDetail] = React.useState([]);
	let [maxPage, setMaxPage] = React.useState(1);
	let [currPage, setCurrPage] = React.useState(1);
	const [isLoading, setLoading] = React.useState(false);
	const [showDetail, setShowDetail] = React.useState(false);

	let tableMapping = {'created_at': {title:'交易時間', colClass:'w-1/2 ', txtClass:'text-kuro font-normal', titleClass:'text-primary text-xl font-semibold'}, 'amount': {title:'金額', colClass:'w-5/12 ', txtClass:'text-kuro font-normal', titleClass:'text-primary text-xl font-semibold'}}

	async function loadOrderList(page) {
		try {
			setLoading(true)
			var result = await getOrderList(page);
			if(result?.data) {
				setOrderList(result.data);
				let tmp = Math.ceil(result.countRow/10)
				setMaxPage(tmp);
			}
			setLoading(false)
		} catch (err) {
			console.log(err);
		}
	}

	async function updateCurrPage(value) {
		try {
			setLoading(true)
			setCurrPage(value)
			loadOrderList(value);
			setLoading(false)
		} catch (err) {
			console.log(err);
		}
	}
	async function showOrderDetail(value) {
		try {
			setLoading(true)
			var result = await getOrderDetail(value);
			if(result?.data)setOrderDetail(result.data)
			setShowDetail(true)
			setLoading(false)
		} catch (err) {
			console.log(err);
		}
	}

	useFocusEffect(
		React.useCallback(() => {
			loadOrderList(1)
			setCurrPage(1)
		}, [])
	);

	return (
		<View className='bg-auxiliary w-full h-full flex flex-1 flex-column md:flex-row'>
			<View className="flex-none w-full md:w-16 h-auto md:h-full absolute md:relative bottom-0 md:bottom-[] z-10">
				<Navigation currentScreen='Order'/>
			</View>
			<View className='grow w-full md:w-80 h-full'>
			{isLoading && <LoadingBar loading={isLoading}/>}
				<View className="py-4 md:py-8 px-6 h-[90%] md:h-full w-full">
					<View className="flex flex-row pb-5 h-full">
						<View className="basis-full md:basis-8/12" >
							<View className="bg-shiro shadow-lg px-4 py-2 rounded-xl h-[95%] md:h-full mx-2 my-auto md:md-0 pb-[35px]">
								<DataTable mapping={tableMapping} data={orderList} onPressFunc={(value=>showOrderDetail(value))}/>
								<Pagination currPage={currPage} totalPages={maxPage} onPressFunc={(value) => updateCurrPage(value)}/>
							</View>
						</View>
						<View className={((!showDetail && store.device== 'mobile')  ? 'hidden ':'block ')+" md:block basis-full md:basis-4/12 absolute md:relative w-[102%] md:w-auto h-full md:h-auto z-30 pt-3 md:pt-0"}>
							<View className="bg-shiro shadow-lg px-4 py-2 rounded-xl mx-2 items-end h-full">
								<View className="h-[85%] pb-4 w-full">
									{store.device == 'mobile' &&
										<View className="w-full items-end">
											<TouchableWithoutFeedback onPress={()=>{setShowDetail(false);}}>
											<Text className="text-grey text-l font-bold w-[32px]">
												<MaterialIcons name='close' size={32}/>
											</Text>
											</TouchableWithoutFeedback>
										</View>
									}
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