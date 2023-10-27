import * as React from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import Navigation from '../components/navigation';
import ItemBox from '../components/itemBox';

import { getProductList, checkIsValidProduct } from '../controller/productController';


const Cart = () => {
	const [itemsList, setitemsList] = React.useState([]);
	const [cartList, setCartList] = React.useState([]);

	const addCartItem = async(itemId, updateQty) => {
		let itemData = await checkIsValidProduct(itemId, updateQty)
		if (itemData !== 0) {
			updateQty = parseInt(updateQty)
			let prevCart = [...cartList];
			let existFlag = await prevCart.filter(function (el) {
				return el.id == itemId;
			});
			if(existFlag.length > 0) {
				updateQty += parseInt(existFlag[0].qty)
				updateCartItem(itemId, updateQty)
			}else{
				let itemPrice = updateQty*parseFloat(itemData.price)
				let tmp = {
					id: itemData.id,
					name: itemData.name,
					price: itemData.price,
					thumbnail: itemData.thumbnail,
					qty: updateQty,
					itemPrice: itemPrice
				}
				await setCartList([tmp, ...cartList])
			}
		}
	}

	const updateCartItem = async(itemId, updateQty) => {
		console.log('updateCartItem: ' + itemId + ' '+updateQty)
		updateQty = parseInt(updateQty)
		if(updateQty > 0)
		{
			let itemData = await checkIsValidProduct(itemId, updateQty)
			if (itemData !== 0) {
				let prevCart = [...cartList];
				let itemPrice = updateQty*parseFloat(itemData.price)
				let tmp = {
					id: itemData.id,
					name: itemData.name,
					price: itemData.price,
					thumbnail: itemData.thumbnail,
					qty: updateQty,
					itemPrice: itemPrice
				}

				var tmpCart = []
				await prevCart.map(function(el, i){
					if(el.id != itemData.id){
					tmpCart.push(el)
					}else {
					tmpCart.push(tmp)
					}
				})
				await setCartList(tmpCart)
			}
		} else {
			removeCartItem(itemId)
		}
	}

	const removeCartItem = async(itemId) => {
		let prevCart = [...cartList];
		var tmpCart = []
		await prevCart.map(function(el, i){
			if(el.id != itemId){
				tmpCart.push(el)
			}
		})
		await setCartList(tmpCart)
	}
	const resetCartItem = async() => {
		await setCartList([])
	}

	async function getItemList() {
		try {
			var result = await getProductList();
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
										{cartList.map(function(itemData, i){
											return <ItemBox data={itemData} key={i} viewType='mini-list' editable={true} onQtyUpdateFunc={(event,value) => updateCartItem(itemData.id, event)}/>;
										})}
										</View>
									</ScrollView>
								</View>
								<View className="h-[10%] flex flex-row flex-wrap justify-between w-full">
									<Text className="text-kuro text-2xl font-bold">Total</Text>
									<Text className="text-primary text-2xl font-bold">{
										cartList.reduce((accumulator, object) => {
											return accumulator + object.itemPrice;
										}, 0).toFixed(2)
									}</Text>
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
