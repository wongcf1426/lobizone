import * as React from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import { useSelector, useDispatch } from 'react-redux'
import { MaterialIcons } from '@expo/vector-icons';
import Drawer from '@mui/material/Drawer';

import Navigation from '../components/navigation';
import ItemBox from '../components/itemBox';

import * as store from '../../store';
import { addtoCart, updateCart, resetCart } from '../../store/cart'

import { getProductList } from '../controller/productController';

const Cart = () => {
	const [ispopCart, setispopCart] = React.useState(false);
	const [itemsList, setitemsList] = React.useState([]);

	const shoppingCart = useSelector(state => state.cart)
	const dispatch = useDispatch()

	const addCartItem = async(itemId, updateQty) => {
		var tmpItem = shoppingCart.cart.filter(function (el) {
			return el.id == itemId;
		});
		if(tmpItem.length > 0){
			//exist in cart
			tmpItem = tmpItem[0]
			dispatch(updateCart({itemId: itemId, updateQty: parseInt(tmpItem.qty) + parseInt(updateQty)}))
		}else{
			dispatch(addtoCart({itemId: itemId, updateQty: updateQty}))
		}
	}
	const updateCartItem = async(itemId, updateQty) => {
		var tmpItem = shoppingCart.cart.filter(function (el) {
			return el.id == itemId;
		});
		console.log('screen updatecart' + updateQty)
		if(tmpItem.length > 0){
			//exist in cart
			tmpItem = tmpItem[0]
			dispatch(updateCart({itemId: itemId, updateQty: parseInt(updateQty)}))
		}
	}

	const resetCartItem = async() => {
		dispatch(resetCart())
	}

	const showCartPop=()=>{
		if(ispopCart) setispopCart(false)
		else setispopCart(true)
	}

	async function getItemList() {
		try {
			const result = await getProductList();
			setitemsList(result);
		} catch (err) {
			console.log(err);
		}
	}

	React.useEffect( () => {
        getItemList();
    }, []);

	return (
		<View className={(store.device !== 'mobile' ? 'w-full pl-[4rem] absolute right-0 ' : 'w-full ') + 'bg-auxiliary h-full'}>
			<View className='w-full h-full'>
				<View className="py-8 px-6 h-full w-full">
					<View className="flex flex-row pb-5">
						<View className="basis-5/6" >
							<View className="bg-primary shadow-lg p-4 rounded-xl m-2 " >
								<Text className="text-shiro text-xl font-bold">Tag/ Searching Box</Text>
							</View>
						</View>
						<View className="basis-1/6" >
							<TouchableWithoutFeedback onPress={showCartPop}>
								<View className="flex flex-row justify-center items-center bg-accent shadow-lg p-4 rounded-xl m-2 ">
									<View className="w-7 h-5 bg-shiro rounded-full justify-center items-center">
										<Text className="text-accent text-l font-bold">{shoppingCart.totalqty}</Text>
									</View>
									<Text className="text-shiro text-l font-bold">
										<MaterialIcons name='shopping-cart' size={24}/>
									</Text>
								</View>
							</TouchableWithoutFeedback>
						</View>
					</View>
					<ScrollView>
						<View className="flex flex-row flex-wrap pb-5">
							{itemsList.map(function(itemData, i){
								return <ItemBox data={itemData} key={i} viewType='grid' editable={false} onPressFunc={event => addCartItem(itemData.id, 1)}/>;
							})}
						</View>
					</ScrollView>
				</View>
				<Drawer
					anchor={'right'}
					open={ispopCart}
					onClose={showCartPop}
				>
					<View className="bg-shiro shadow-lg p-4 h-full items-end">
						<View className="h-[75%] pb-4 w-[300px]">
							<ScrollView>
								<View className="flex flex-row flex-wrap w-[1/3]">
								{shoppingCart.cart.map(function(itemData, i){
									return <ItemBox data={itemData} key={i} viewType='mini-list' editable={true} editQty={itemData.qty} onQtyUpdateFunc={(event,value) => updateCartItem(itemData.id, event)}/>;
								})}
								</View>
							</ScrollView>
						</View>
						<View className="h-[10%] flex flex-row flex-wrap justify-between w-[300px]">
							<Text className="text-kuro text-2xl font-bold">Total</Text>
							<Text className="text-primary text-2xl font-bold">0.0</Text>
						</View>
						<View className="h-[15%] w-full items-end justify-end">
							<TouchableWithoutFeedback onPress={()=>{resetCartItem();showCartPop();}}>
								<View className="mt-auto justify-center items-center bg-accent shadow-lg p-2 rounded-xl w-[25%] mb-2">
									<Text className="text-shiro text-xl font-bold">
										<MaterialIcons name='delete' size={24}/>
									</Text>
								</View>
							</TouchableWithoutFeedback>
							<TouchableWithoutFeedback onPress={()=>{resetCartItem();showCartPop();}}>
								<View className="mt-auto justify-center items-center bg-primary shadow-lg p-4 rounded-xl w-full">
									<Text className="text-shiro text-xl font-bold">
										checkout
									</Text>
								</View>
							</TouchableWithoutFeedback>
						</View>
					</View>
				</Drawer>
			</View>
			<Navigation currentScreen='Cart'/>
		</View>
	)
}

export default Cart
