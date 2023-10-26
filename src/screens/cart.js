import * as React from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import { useSelector, useDispatch } from 'react-redux'
import { MaterialIcons } from '@expo/vector-icons';

import Navigation from '../components/navigation';
import ItemBox from '../components/itemBox';

import * as store from '../../store';
import { addtoCart, updateCart, resetCart } from '../../store/cart'

import { getProductList } from '../controller/productController';

const Cart = () => {
	const [itemsList, setitemsList] = React.useState([]);
	const [itemsIds, setitemsIds] = React.useState([]);

	const shoppingCart = useSelector(state => state.cart)
	console.log(shoppingCart)
	const dispatch = useDispatch()

	const addCartItem = async(itemId, updateQty) => {
		var tmpItem = shoppingCart.cart.filter(function (el) {
			return el.id == itemId;
		});
		if(tmpItem.length > 0){
			//exist in cart
			tmpItem = tmpItem[0]
			await dispatch(updateCart({itemId: itemId, updateQty: parseInt(tmpItem.qty) + parseInt(updateQty)}))
		}else{
			await dispatch(addtoCart({itemId: itemId, updateQty: updateQty}))
			var tmp = itemsIds
			tmp.push(itemId)
			setitemsIds(tmp)
			getItemList()
		}

	}
	const updateCartItem = async(itemId, updateQty) => {
		var tmpItem = shoppingCart.cart.filter(function (el) {
			return el.id == itemId;
		});
		if(tmpItem.length > 0){
			//exist in cart
			tmpItem = tmpItem[0]
			await dispatch(updateCart({itemId: itemId, updateQty: parseInt(updateQty)}))
		}
		getItemList()
	}

	const resetCartItem = async() => {
		await dispatch(resetCart())
		await setitemsIds([])
		var result = await getProductList();
		setitemsList(result);
	}

	async function getItemList() {
		try {
			var result = await getProductList();
			result = await result.filter(function (el) {
				return !itemsIds.includes(el.id);
			});
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
				<Navigation currentScreen='Cart'/>
			</View>
			<View className='grow w-80'>
				<View className="py-8 px-6 h-full w-full">
					<View className="flex flex-row pb-5 h-full">
						<View className="basis-8/12" >
							<View className="bg-primary shadow-lg p-4 rounded-xl m-2 " >
								<Text className="text-shiro text-xl font-bold">Tag/ Searching Box</Text>
							</View>
							<ScrollView>
								<View className="flex flex-row flex-wrap pb-5">
									{itemsList.map(function(itemData, i){
										return <ItemBox data={itemData} key={i} viewType='grid' editable={false} onPressFunc={event => addCartItem(itemData.id, 1)}/>;
									})}
								</View>
							</ScrollView>
						</View>
						<View className="basis-4/12" >
							<View className="bg-shiro shadow-lg px-4 py-2 rounded-xl mx-2 items-end h-full">
								<View className="h-[80%] pb-4 w-full">
									<ScrollView>
										<View className="flex flex-row flex-wrap w-full">
										{shoppingCart.cart.map(function(itemData, i){
											return <ItemBox data={itemData} key={i} viewType='mini-list' editable={true} editQty={itemData.qty} onQtyUpdateFunc={(event,value) => updateCartItem(itemData.id, event)}/>;
										})}
										</View>
									</ScrollView>
								</View>
								<View className="h-[10%] flex flex-row flex-wrap justify-between w-full">
									<Text className="text-kuro text-2xl font-bold">Total</Text>
									<Text className="text-primary text-2xl font-bold">{shoppingCart.totalprice.toFixed(2)}</Text>
								</View>
								<View className="h-[10%] w-full flex flex-row justify-end">
									<View className="basis-1/4" >
										<View className='items-end mr-2'>
										<TouchableWithoutFeedback onPress={()=>{resetCartItem();}}>
											<View className="justify-center items-center bg-accent shadow-lg p-4 rounded-xl w-full">
												<Text className="text-shiro text-l font-bold">
													<MaterialIcons name='delete' size={24}/>
												</Text>
											</View>
										</TouchableWithoutFeedback>
										</View>
									</View>
									<View className="basis-1/2" >
										<TouchableWithoutFeedback onPress={()=>{resetCartItem();}}>
											<View className="justify-center items-center bg-primary shadow-lg p-4 rounded-xl w-full">
												<Text className="text-shiro text-xl font-bold">
													checkout
												</Text>
											</View>
										</TouchableWithoutFeedback>
									</View>
								</View>
							</View>
						</View>
					</View>
					
				</View>
			</View>
			
		</View>
	)
}

export default Cart
