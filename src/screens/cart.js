import * as React from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import { useSelector, useDispatch } from 'react-redux'
import { MaterialIcons } from '@expo/vector-icons';

import Navigation from '../components/navigation';
import ItemBox from '../components/itemBox';

import * as testingData from '../../store/testing';
import * as store from '../../store';
import { addCart } from '../../store/cart'

import { testing } from '../controller/productController';

const Cart = () => {
	const [ispopCart, setispopCart] = React.useState(false);

	const shoppingCart  = useSelector(state => state.cart)
	const dispatch = useDispatch()
	console.log(shoppingCart)

	const addItemToCart = async(itemId) => {
		dispatch(addCart({itemId: itemId}))
	}

	const showCartPop=()=>{
		if(ispopCart) setispopCart(false)
		else setispopCart(true)
	}
	
	//testing();

	return (
		<View className={(store.device !== 'mobile' ? 'w-full pl-[4rem] absolute right-0 ' : 'w-full ') + 'bg-auxiliary h-full'}>
			<View className='w-full h-full'>
				<View className="py-8 px-6 h-full w-full">
					<View className="grid grid-cols-12 gap-6 pb-5">
						<View className="col-span-10 bg-primary shadow-lg p-4 rounded-xl" >
							<View>
								<Text className="text-shiro text-xl font-bold">Tag/ Searching Box</Text>
							</View>
						</View>
						<View className="col-span-2 bg-accent shadow-lg p-4 rounded-xl" >
							<TouchableWithoutFeedback onPress={showCartPop}>
								<View className="justify-center items-center ">
									<Text className="text-shiro text-xl font-bold">
										<MaterialIcons name='shopping-cart' size={28}/>
									</Text>
								</View>
							</TouchableWithoutFeedback>
						</View>
					</View>
					<ScrollView>
						<View className="grid grid-cols-12 gap-6 pb-5">
							{testingData.items.map(function(itemData, i){
								return <ItemBox data={itemData} key={i} viewType='grid' onPressFunc = {event => addItemToCart(itemData.id)}/>;
							})}
						</View>
					</ScrollView>
				</View>

				<View className={(ispopCart ? 'block ' : 'hidden ') + "absolute py-8 px-6 h-full w-full"}>
					<View className="bg-primary shadow-lg p-8 rounded-xl h-full" >
						<View className="grid grid-cols-12 gap-6 pb-5 h-full">
							<View className="col-span-10" >
								<Text className="text-shiro text-xl font-bold">Order Detail</Text>
							</View>
							<View className="col-span-2" >
								<TouchableWithoutFeedback onPress={showCartPop}>
									<View className="justify-end items-end">
										<Text className="text-shiro text-xl font-bold">
											<MaterialIcons name="close" size={30} />
										</Text>
									</View>
								</TouchableWithoutFeedback>
							</View>
							<View className="col-span-8 bg-shiro shadow-lg p-4 rounded-xl" >
								<ScrollView>
									<View className="grid grid-cols-12">
										{testingData.items.map(function(itemData, i){
											return <ItemBox data={itemData} key={i} viewType='list' onPressFunc = {event => addItemToCart(itemData.id)}/>;
										})}
									</View>
								</ScrollView>
							</View>
							<View className="col-span-4 bg-shiro shadow-lg p-4 rounded-xl" >
								
							</View>
						</View>
					</View>
				</View>
			</View>
			<Navigation currentScreen='Cart'/>
		</View>
	)
}

export default Cart