import * as React from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import Navigation from '../components/navigation';
import ItemBox from '../components/itemBox';
import LoadingBar from '../components/loadingBar';
import MessageBox from '../components/messageBox';

import { getProductList, checkIsValidProduct } from '../controller/productController';
import { getCatList } from '../controller/categoryController';
import { createOrder } from '../controller/orderController';
import * as store from '../../store';

const Cart = () => {
	const [itemsList, setitemsList] = React.useState([]);
	const [cartList, setCartList] = React.useState([]);
	const [isLoading, setLoading] = React.useState(false);
	const [showCart, setShowCart] = React.useState(false);

	const [filterCategory, setFilterCategory] = React.useState(-1);
	const [categoryList, setCategoryList] = React.useState([]);
	const msgBoxRef = React.useRef()

	const addCartItem = async(itemId, updateQty) => {
		let itemData = await checkIsValidProduct(itemId, updateQty)
		if (itemData?.data) {
			updateQty = parseInt(updateQty)
			let prevCart = [...cartList];
			let existFlag = await prevCart.filter(function (el) {
				return el.id == itemId;
			});
			if(existFlag.length > 0) {
				updateQty += parseInt(existFlag[0].qty)
				updateCartItem(itemId, updateQty)
			}else{
				let itemPrice = updateQty*parseFloat(itemData.data.price)
				let tmp = {
					id: itemData.data.id,
					name: itemData.data.name,
					price: itemData.data.price,
					thumbnail: itemData.data.thumbnail,
					qty: updateQty,
					itemPrice: itemPrice
				}
				await setCartList([tmp, ...cartList])
			}
		}else{
			msgBoxRef.current.open(itemData.errMsg, 'bg-focus')
		}
	}

	const updateCartItem = async(itemId, updateQty) => {
		console.log('updateCartItem: ' + itemId + ' '+updateQty)
		updateQty = parseInt(updateQty)
		if(updateQty > 0)
		{
			let itemData = await checkIsValidProduct(itemId, updateQty)
			if (itemData?.data) {
				let prevCart = [...cartList];
				let itemPrice = updateQty*parseFloat(itemData.data.price)
				let tmp = {
					id: itemData.data.id,
					name: itemData.data.name,
					price: itemData.data.price,
					thumbnail: itemData.data.thumbnail,
					qty: updateQty,
					itemPrice: itemPrice
				}

				var tmpCart = []
				await prevCart.map(function(el, i){
					if(el.id != itemData.data.id){
						tmpCart.push(el)
					}else {
						tmpCart.push(tmp)
					}
				})
				await setCartList(tmpCart)
				console.log(tmpCart)
			}else{
				msgBoxRef.current.open(itemData.errMsg, 'bg-focus')
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

	const confirmCart = async() => {
		setLoading(true)
		//todo checking
		if(cartList.length > 0)
		{
			let orderResult = await createOrder(cartList)
			if(orderResult.state == 'success') {
				msgBoxRef.current.open('order created', 'bg-primary')
				var result = await getProductList();
				if(result?.data) setitemsList(result.data);
				await resetCartItem()
			}else{
				msgBoxRef.current.open(orderResult.errMsg, 'bg-focus')
			}
		}
		setLoading(false)
	}

	const changeFilterCategory = async(catId) => {
		setLoading(true)
		await setFilterCategory(catId)
		await getItemList(catId)
		setLoading(false)
	}

	async function getItemList(catId = -1) {
		try {
			setLoading(true)
			var result = await getProductList(true, 1,[],catId);
			if(result?.data) setitemsList(result.data);
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

	useFocusEffect(
		React.useCallback(() => {
			getItemList()
			getCategoryList()
			return async () => {
				await resetCartItem()
			};
		}, [])
	);


	return (
		<View className='bg-auxiliary w-full h-full flex flex-1 flex-column md:flex-row'>
			<View className="flex-none w-full md:w-16 h-auto md:h-full absolute md:relative bottom-0 md:bottom-[] z-10">
				<Navigation currentScreen='Cart'/>
			</View>
			<View className='grow w-full md:w-80 h-full'>
			{isLoading && <LoadingBar loading={isLoading}/>}
			<MessageBox ref={msgBoxRef}/>
				<View className="py-4 md:py-8 px-6 h-[95%] md:h-full w-full">
					{(store.device == 'mobile' && !showCart) &&
						<TouchableWithoutFeedback onPress={()=>{setShowCart(true);}}>
						<View className="absolute w-[60px] h-[60px] bg-accent rounded-xl z-30 bottom-8 right-5">
							<View className='w-full h-full justify-center'>
								<Text className="text-shiro w-[26px] mx-auto">
									<MaterialIcons name='add-shopping-cart' size={26}/>
								</Text>
							</View>
							{
								(cartList.reduce((accumulator, object) => {
									return accumulator + object.qty;
								}, 0) > 0) &&
								<View className='absolute w-[20px] h-[20px] rounded-full bg-focus top-1 right-1'>
									<Text className="text-shiro text-xs text-center text-semibold">
										{cartList.reduce((accumulator, object) => {
											return accumulator + object.qty;
										}, 0)}
									</Text>
								</View>

							}
						</View>
						</TouchableWithoutFeedback>
					}
					<View className="flex flex-row pb-5 h-full md:h-full">
						<View className="basis-full md:basis-8/12" >
						<View className='flex flex-row flex-wrap'>
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
							</View>
							<ScrollView>
								<View className="flex flex-row flex-wrap pb-5">
									{itemsList.map(function(itemData, i){
										let tmp = cartList.find((cartItem) => cartItem.id == itemData.id)
										if(tmp == undefined)
										{
											return <ItemBox data={itemData} key={i} viewType='grid' editable={false} onPressFunc={event => addCartItem(itemData.id, 1)}/>;
										}
									})}
								</View>
							</ScrollView>
						</View>
						<View className={((!showCart && store.device== 'mobile')  ? 'hidden ':'block ')+" md:block basis-full md:basis-4/12 absolute md:relative w-[102%] md:w-auto h-[98%] md:h-auto z-30"}>
							<View className="bg-shiro shadow-lg px-4 py-2 rounded-xl mx-2 items-end h-full">
								<View className="h-[80%] pb-4 w-full">
									{store.device == 'mobile' &&
										<View className="w-full items-end">
											<TouchableWithoutFeedback onPress={()=>{setShowCart(false);}}>
											<Text className="text-grey text-l font-bold w-[32px]">
												<MaterialIcons name='close' size={32}/>
											</Text>
											</TouchableWithoutFeedback>
										</View>
									}
									<ScrollView>
										<View className="flex flex-row flex-wrap w-full">
										{cartList.map(function(itemData, i){
											return <ItemBox data={itemData} key={i} viewType='mini-list' editable={true} onQtyUpdateFunc={(event,value) => updateCartItem(itemData.id, event)}/>;
										})}
										</View>
									</ScrollView>
								</View>
								<View className="h-[8%] flex flex-row flex-wrap justify-between w-full">
									<Text className="text-kuro text-2xl font-bold">總金額</Text>
									<Text className="text-primary text-2xl font-bold">{
										cartList.reduce((accumulator, object) => {
											return accumulator + object.itemPrice;
										}, 0).toFixed(2)
									}</Text>
								</View>
								<View className="h-[10%] w-full flex flex-row justify-end">
									<View className="basis-1/4" >
										<View className='items-end mr-2'>
										<TouchableWithoutFeedback onPress={()=>{resetCartItem();setShowCart(false);}}>
											<View className="justify-center items-center bg-accent shadow-lg p-4 rounded-xl w-full">
												<Text className="text-shiro text-l font-bold">
													<MaterialIcons name='delete' size={24}/>
												</Text>
											</View>
										</TouchableWithoutFeedback>
										</View>
									</View>
									<View className="basis-1/2" >
										<TouchableWithoutFeedback onPress={()=>{confirmCart();setShowCart(false);}}>
											<View className="justify-center items-center bg-primary shadow-lg p-4 rounded-xl w-full">
												<Text className="text-shiro text-xl font-bold">
													<MaterialIcons name="input" size={24} />
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
