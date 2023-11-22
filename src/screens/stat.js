import * as React from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import Navigation from '../components/navigation';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import LoadingBar from '../components/loadingBar';
//import Chart from '../components/piechart';
import BarChart from '../components/barChart';
import MessageBox from '../components/messageBox';

import { getStatData } from '../controller/statController';
import { getCatList } from '../controller/categoryController';
import * as store from '../../store';

const Stat = () => {
	let [statData, setStatData] = React.useState({overall:{'amount':0, 'lumpsum':0}, rankAmount:[], rankLumpsum:[], rankAmountbyCat:[], rankLumpsumbyCat:[]});
	const [filterCategory, setFilterCategory] = React.useState(-1);
	const [categoryList, setCategoryList] = React.useState([]);
	const [isLoading, setLoading] = React.useState(false);
	const msgBoxRef = React.useRef()

	async function loadStatData() {
		try {
			setLoading(true)
			var result = await getStatData(filterCategory);
			if(result.state == 'success'){
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

	const changeFilterCategory = async(catId) => {
		setLoading(true)
		await setFilterCategory(catId)
		var result = await getStatData(catId);
		if(result.state == 'success'){
			await setStatData(result.data);
		}
		else {
			msgBoxRef.current.open(result.errMsg, 'bg-focus')
		}
		//var result = await getProductList(false, -1, [], catId);
		//if(result?.data) await setitemsList(result.data);
		setLoading(false)
	}

	async function getCategoryList() {
		try {
			setLoading(true)
			var result = await getCatList();
			if(result?.data) setCategoryList(result.data);
			setLoading(false)
		} catch (err) {
			console.log(err);
		}
	}

	useFocusEffect(
		React.useCallback(() => {
			loadStatData()
			getCategoryList()
		}, [])
	);

	return (
		<View className='bg-auxiliary w-full h-full flex flex-1 flex-column md:flex-row'>
			<View className="flex-none w-full md:w-16 h-auto md:h-full absolute md:relative bottom-0 md:bottom-[] z-10">
				<Navigation currentScreen='Stat'/>
			</View>
			<View className='grow w-full md:w-80 h-full'>
			{isLoading && <LoadingBar loading={isLoading}/>}
			<MessageBox ref={msgBoxRef}/>
				<View className="py-4 md:py-8 px-6 h-[95%] md:h-full w-full">
					<View className="flex flex-row pb-5 h-full">
						<View className="basis-full" >
							<View className='flex flex-row flex-wrap'>
								<ScrollView horizontal={true}>
								{
									filterCategory != -1 &&
									<TouchableWithoutFeedback onPress={() => changeFilterCategory(-1)}>
										<View className='bg-primary shadow-lg px-4 py-2 rounded-xl m-2'>
											<Text className='text-shiro text-l font-bold'>
												{categoryList.find(category => {return filterCategory== category.id}).name}
												{'   X'}
											</Text>
										</View>
									</TouchableWithoutFeedback>
								}
								{
									categoryList.map(function(category, i){
										if(filterCategory !== category.id){
										return (
											<TouchableWithoutFeedback onPress={() => changeFilterCategory(category.id)} key ={i}>
											<View className='bg-shiro shadow-lg px-4 py-2 rounded-xl m-2' >
												<Text className='text-primary text-l font-bold'>{category.name}</Text>
											</View>
											</TouchableWithoutFeedback>);
										}
									})
								}
								</ScrollView>
							</View>
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
										<Text className="text-primary font-semibold text-xl pt-1 pb-2">商品銷量首五位</Text>
										<BarChart chartData={statData.rankAmount} field="amount"/>
									</View>
								<View className="basis-full md:basis-0 py-3"></View>
									<View className="basis-full md:basis-1/2 bg-shiro shadow-lg px-4 py-2 rounded-xl">
										<Text className="text-primary font-semibold text-xl pt-1 pb-2">商品銷額首五位</Text>
										<BarChart chartData={statData.rankLumpsum} field="lumpsum"/>
									</View>
								</View>
								{filterCategory == -1 &&
								<>
									<View className="basis-full md:basis-0 py-3"></View>
									<View className="basis-full md:basis-1/2 bg-shiro shadow-lg px-4 py-2 rounded-xl">
										<Text className="text-primary font-semibold text-xl pt-1 pb-2">分類銷額首五位</Text>
										<BarChart chartData={statData.rankAmountbyCat} field="lumpsum"/>
									</View>
									<View className="basis-full md:basis-0 py-3"></View>
									<View className="basis-full md:basis-1/2 bg-shiro shadow-lg px-4 py-2 rounded-xl">
										<Text className="text-primary font-semibold text-xl pt-1 pb-2">分類銷額首五位</Text>
										<BarChart chartData={statData.rankLumpsumbyCat} field="lumpsum"/>
									</View>
								</>
								}
							</ScrollView>
						</View>
					</View>
				</View>
			</View>
		</View>
	)
}

export default Stat