import * as React from 'react';
import { View, Text, Image, TouchableWithoutFeedback, TextInput, ScrollView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import NumberInput from '../components/numberInput.js';

import { getProductList } from '../controller/productController';

const defaultItemData = {id:0, name:'', price:0, 'description':'', thumbnail:'', 'inventory': 0, 'status': 0}

const ItemDetail = (props, ref) => {
	const [display, setDisplay] = React.useState(false);
	const [itemData, setItemData] = React.useState([defaultItemData]);

	React.useImperativeHandle(ref, () => ({
		open: (itemId, action) => { displayModal(itemId, action) },
	}))

	const displayModal = async (itemId, action) => {
		console.log(action + ": " + itemId)
		if(action == 'edit') {
			var result = await getProductList(false, -1, [itemId]);
			console.log('result')
			console.log(result)

			await setItemData(result);
			console.log('itemData')
			console.log(itemData)
		}
		await setDisplay(true)
	}

	const hideModal = async() => {
		await setItemData([defaultItemData])
		console.log(defaultItemData)
		console.log(itemData)
		setDisplay(false)
	}

	const updateData = async(field, value)=>{
		let prevData = [...itemData];
		if((field == 'price' || field == 'inventory') && (value == 'minus' || value == 'plus'))
		{
			//check if prev isNAN -> auto 1
			if(isNaN(parseFloat(prevData[0][field]))){
				prevData[0][field] = 1
			}else if(field == 'price')
			{
				if(value == 'minus') prevData[0][field] = parseFloat(prevData[0][field]) - 1
				else prevData[0][field] = parseFloat(prevData[0][field]) + 1
			}else{
				if(value == 'minus') prevData[0][field] = parseInt(prevData[0][field]) - 1
				else prevData[0][field] = parseInt(prevData[0][field]) + 1
			}
		}else{
			prevData[0][field] = value
		}

		await setItemData(prevData)
	}

	async function saveItemDetail() {
		try {
			//do validation
			var validFlag = true
			var currItemData = [...itemData]
			currItemData = currItemData[0]
			console.log(currItemData)
			if(currItemData.name == '' || currItemData.price == ''|| isNaN(parseFloat(currItemData.price))|| parseFloat(currItemData.price) < 0||currItemData.inventory == '' || isNaN(parseInt(currItemData.inventory))||parseInt(currItemData.inventory) < 0 ||currItemData.status == '')
			{
				validFlag = false;
			}
			if(validFlag)
			{
				console.log('valid pass')
				//await updateOrderDetail(currItemData);
			}else{
				console.log('valid fail')
			}
			var result = await getProductList(false, -1, [currItemData.id]);
			await setItemData(result);

		} catch (err) {
			console.log(err);
		}
	}

	return (
		<View className={(display ? 'flex ' : 'hidden ') + "absolute w-full h-full right-0 py-6 px-6 bg-auxiliary"}>
			<View className="h-full w-full bg-white shadow-lg px-4 py-2 rounded-xl">
				<View className="flex flex-row flex-wrap h-full">
					<View className="basis-full justify-end flex flex-row pt-4 h-[50px]" >
						<View className="basis-1/6">
							<TouchableWithoutFeedback onPress={() => hideModal()}>
								<View className="justify-center items-center bg-shiro border-2 border-primary shadow-lg px-3 py-1 rounded-xl">
									<Text className="text-primary text-xl">
										取消
									</Text>
								</View>
							</TouchableWithoutFeedback>
						</View>
						<View className="basis-1/6">
							<TouchableWithoutFeedback onPress={() => saveItemDetail()}>
								<View className="justify-center items-center bg-primary shadow-lg px-3 py-1 rounded-xl ml-2">
									<Text className="text-shiro text-xl">
										儲存
									</Text>
								</View>
							</TouchableWithoutFeedback>
						</View>
					</View>
					<View className="basis-full flex flex-row pt-4 h-[calc(100%-50px-32px)]" >
						<View className="basis-1/3">
							<Image
								className="w-full h-[200px] rounded-xl p-8"
								source={{uri:itemData[0].thumbnail}}
							/>
						</View>
						<View className="basis-2/3 pl-3">
						<ScrollView>
							<View className="flex flex-row flex-wrap ">
								<View className="basis-1/3 rounded-xl text-l text-kuro justify-center h-[50px] border-2 border-auxiliary p-2 bg-auxiliary">
									<Text>{itemData[0].id}</Text>
								</View>
								<View className='basis-full py-2'>
									<Text className="pb-1">名稱  </Text>
									<TextInput
										className='rounded-xl text-l text-kuro h-[50px] border-2 border-auxiliary p-2'
										value={itemData[0].name}
										onChangeText={value => updateData('name', value)}
									/>
								</View>

								<View className="basis-1/2 pt-2 pb-6 h-[70px]">
									<Text className="pb-1">貨存  </Text>
									<NumberInput num={itemData[0].inventory} onChangeFunc={(value)=>updateData('inventory', value)} enableTextInput={true}/>
								</View>
								<View className="basis-1/2 pt-2 pb-6 h-[70px]">
								<Text className="pb-1">價錢  </Text>
									<NumberInput num={itemData[0].price} onChangeFunc={(value)=>updateData('price', value)} enableTextInput={true}/>
								</View>
								<View className='basis-full py-2'>
									<Text className="pb-1">詳細  </Text>
									<TextInput
										multiline
										numberOfLines={4}
										className='rounded-xl text-l text-kuro border-2 border-auxiliary p-2'
										value={itemData[0].description}
										onChangeText={value => updateData('description', value)}
									/>
								</View>
							</View>
							</ScrollView>
						</View>

					</View>
				</View>
			</View>
		</View>
	);
};

export default React.forwardRef(ItemDetail)