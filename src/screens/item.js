import * as React from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import Navigation from '../components/navigation';
import ItemBox from '../components/itemBox';
import ItemDetail from '../components/itemDetail';
import LoadingBar from '../components/loadingBar';

import { getProductList } from '../controller/productController';
import { getCatList } from '../controller/categoryController';
import * as store from '../../store';


const ItemList = () => {
	const [itemsList, setitemsList] = React.useState([]);
	//const [filterStatus, setFilterStatus] = React.useState(1);
	const [isLoading, setLoading] = React.useState(false);
	const [filterCategory, setFilterCategory] = React.useState(-1);
	const [categoryList, setCategoryList] = React.useState([]);

	const detailRef = React.useRef()

	async function getItemList() {
		try {
			setLoading(true)
			//ar result = await getProductList(false, filterStatus, [], filterCategory);
			var result = await getProductList(false, -1, [], filterCategory);
			if(result?.data) await setitemsList(result.data);
			setLoading(false)
		} catch (err) {
			console.log(err);
		}
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

	/*async function changeFilterStatus(newStatus) {
		try {
			setLoading(true)
			setFilterStatus(newStatus)
			var result = await getProductList(false, newStatus, [],filterCategory);
			if(result?.data) await setitemsList(result.data);
			setLoading(false)
		} catch (err) {
			console.log(err);
		}
	}*/

	const changeFilterCategory = async(catId) => {
		setLoading(true)
		await setFilterCategory(catId)
		var result = await getProductList(false, -1, [], catId);
		if(result?.data) await setitemsList(result.data);
		setLoading(false)
	}
	useFocusEffect(
		React.useCallback(() => {
			getItemList()
			getCategoryList()
		}, [])
	);

	return (
		<View className='bg-auxiliary w-full h-full flex flex-1 flex-column md:flex-row'>
			<View className="flex-none w-full md:w-16 h-auto md:h-full absolute md:relative bottom-0 md:bottom-[] z-10">
				<Navigation currentScreen='Item'/>
			</View>
			<View className='grow w-full md:w-80 h-full'>
			{isLoading && <LoadingBar loading={isLoading}/>}
				<View className="py-6 px-6 h-full w-full">
					<View className="flex flex-row pb-5 h-full">
						<View className="basis-full" >
							<View className='flex flex-row flex-wrap'>
								{
									/*store.statusList.map(function(stausTag, i){
										return (
											<TouchableWithoutFeedback onPress={() => changeFilterStatus(stausTag.key)} key ={i}>
											<View className={(filterStatus == stausTag.key ? 'bg-primary ':'bg-shiro ') + "shadow-lg px-4 py-2 rounded-xl m-2 "} >
												<Text className={(filterStatus == stausTag.key ? 'text-shiro ':'text-primary ') + " text-l font-bold"}>{stausTag.status}</Text>
											</View>
											</TouchableWithoutFeedback>);
									})*/
								}
								{filterCategory != -1 &&
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
								<View className="grow" >
									<TouchableWithoutFeedback onPress={() => detailRef.current.open('', 'create')}>
										<View className="shadow-lg px-6 py-2 rounded-xl m-2 bg-shiro right-0 absolute" >
											<Text className="text-primary text-l font-bold"><MaterialIcons name='add' size={22}/></Text>
										</View>
									</TouchableWithoutFeedback>
								</View>
							</View>
							<ScrollView>
								<View className="flex flex-row flex-wrap pb-5">
									{itemsList.map(function(itemData, i){
										if(itemData.inventory > 0 && itemData.status == 1) return <ItemBox data={itemData} key={itemData.id} viewType='list' editable={false} onPressFunc={event => detailRef.current.open(itemData.id, 'view')}/>;
									})}
									<View className="basis-full pt-4 pb-2">
										<Text className="border-b-2 border-shiro text-shiro font-bold text-xl w-[40%]">售罄</Text>
									</View>
									{itemsList.map(function(itemData, i){
										if(itemData.inventory < 1 && itemData.status == 1) return <ItemBox data={itemData} key={itemData.id} viewType='list' editable={false} onPressFunc={event => detailRef.current.open(itemData.id, 'view')}/>;
									})}
									<View className="basis-full pt-4 pb-2">
										<Text className="border-b-2 border-shiro text-shiro font-bold text-xl w-[40%]">隱藏</Text>
									</View>
									{itemsList.map(function(itemData, i){
										if(itemData.status == 0) return <ItemBox data={itemData} key={itemData.id} viewType='list' editable={false} itemActivate={0} onPressFunc={event => detailRef.current.open(itemData.id, 'view')}/>;
									})}
								</View>
							</ScrollView>
						</View>
					</View>
				</View>
			</View>
			<ItemDetail ref={detailRef} reloadFunc={()=> getItemList(0)}/>
		</View>
	)
}

export default ItemList
