import * as React from 'react';
import { View, Text, Image, TouchableWithoutFeedback, TextInput, ScrollView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

import DataTable from '../components/dataTable';
import NumberInput from '../components/numberInput.js';
import LoadingBar from '../components/loadingBar';

import { getProductDetail, updateProductDetail, createProduct } from '../controller/productController';

const defaultItemData = {id:0, name:'', price:0, 'description':'', thumbnail:'', 'inventory': 0, 'status': 1}

const ItemDetail = (props, ref) => {
	const [display, setDisplay] = React.useState(false);
	const [action, setAction] = React.useState('create');
	const [itemData, setItemData] = React.useState([defaultItemData]);
	const [isLoading, setLoading] = React.useState(false);

	let tableMapping = {'created_at': {title:'時間', colClass:'w-5/12 ', txtClass:'text-kuro text-sm', titleClass:'text-kuro text-base font-semibold'}, 'message': {title:'修改紀錄', colClass:'w-7/12 ', txtClass:'text-kuro text-sm', titleClass:'text-kuro text-base font-semibold'}}

	React.useImperativeHandle(ref, () => ({
		open: (itemId, action) => { displayModal(itemId, action) },
	}))

	const displayModal = async (itemId, action) => {
		console.log(action + ": " + itemId)
		setLoading(true)
		setAction(action)
		if(action == 'edit' || action == 'view') {
			var result = await getProductDetail(itemId);
			await setItemData(result);
		}
		await setDisplay(true)
		setLoading(false)
	}

	const hideModal = async() => {
		setLoading(true)
		await setItemData([defaultItemData])
		await props.reloadFunc();
		setDisplay(false)
		setLoading(false)
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
			setLoading(true)
			//do validation
			var validFlag = true
			var currItemData = [...itemData]
			currItemData = currItemData[0]
			if(currItemData.name == '' || currItemData.price == ''|| isNaN(parseFloat(currItemData.price))|| parseFloat(currItemData.price) < 0||currItemData.inventory == '' || isNaN(parseInt(currItemData.inventory))||parseInt(currItemData.inventory) < 0 ||currItemData.status == '')
			{
				validFlag = false;
			}
			if(validFlag)
			{
				console.log('valid pass')
				let saveStatus = false;
				let id = currItemData.id
				if(action == 'edit')
				{
					delete currItemData.id;
					saveStatus = await updateProductDetail(id, currItemData)
					if(saveStatus) {
						displayModal(saveStatus, 'view')
					}

				}else{
					delete currItemData.id;
					saveStatus = await createProduct(currItemData)
					if(saveStatus) {
						console.log('create success')
						displayModal(saveStatus, 'view')
					}
				}
			}else{
				console.log('valid fail')
			}
			setLoading(false)
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<>
		{isLoading && <LoadingBar loading={isLoading}/>}
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
							{action == 'view' ?
								<TouchableWithoutFeedback onPress={() => setAction('edit')}>
									<View className="justify-center items-center bg-primary shadow-lg px-3 py-1 rounded-xl ml-2">
										<Text className="text-shiro text-xl">
											編輯
										</Text>
									</View>
								</TouchableWithoutFeedback>
								:
								<TouchableWithoutFeedback onPress={() => saveItemDetail()}>
									<View className="justify-center items-center bg-primary shadow-lg px-3 py-1 rounded-xl ml-2">
										<Text className="text-shiro text-xl">
											儲存
										</Text>
									</View>
								</TouchableWithoutFeedback>
							}
						</View>
					</View>
					<View className="basis-full flex flex-row pt-4 h-[calc(100%-82px)]" >
						<View className="basis-1/4">
						{itemData[0].thumbnail == '' ?
							<View
								className="w-full h-[30vh] rounded-xl p-8 bg-grey"
							/>:
							<Image
								className="w-full h-[30vh] rounded-xl p-8"
								source={{uri:itemData[0].thumbnail}}
							/>
						}
						<View className="flex flex-row flex-wrap">
							<View className='border-b-2 border-grey p-2 basis-full'></View>
							<View className="basis-full px-2 pt-2 pb-1">
								<View className="flex flex-row">
									<View className='bg-primary w-1/3 rounded-l-xl align-middle py-1'>
										<Text className="text-shiro w-fit text-center">
											<MaterialIcons name='tag' size={24}/>
										</Text>
									</View>
									<View className='w-2/3 rounded-r-xl align-middle border-2 border-primary py-1 text-center'>
										<Text className="text-kuro text-m text-center">{itemData[0].amount}</Text>
									</View>
								</View>
							</View>
							<View className="basis-full px-2">
								<View className="flex flex-row">
									<View className='bg-primary w-1/3 rounded-l-xl align-middle py-1'>
										<Text className="text-shiro w-fit text-center">
											<MaterialIcons name='attach-money' size={24}/>
										</Text>
									</View>
									<View className='w-2/3 rounded-r-xl align-middle border-2 border-primary py-1 text-center'>
										<Text className="text-kuro text-m text-center">{itemData[0].lumpsum}</Text>
									</View>
								</View>
							</View>
						</View>
						</View>
						<View className="basis-3/4 pl-3 h-[90%]">
							<ScrollView>
								<View className="flex flex-row flex-wrap ">
									<View className="basis-1/3 rounded-xl text-l text-kuro justify-center h-[50px] border-2 border-grey p-2 bg-grey">
										<Text>{itemData[0].id}</Text>
									</View>
									<View className='basis-full py-2'>
										<Text className="pb-1">名稱  </Text>
										{action == 'view' ?
											<View className="basis-1/3 rounded-xl text-l text-kuro justify-center h-[50px] border-2 border-grey p-2 bg-grey">
												<Text>{itemData[0].name}</Text>
											</View>:
											<TextInput
												className='rounded-xl text-l text-kuro h-[50px] border-2 border-auxiliary p-2'
												value={itemData[0].name}
												onChangeText={value => updateData('name', value)}
											/>
										}

									</View>

									<View className="basis-1/2 pt-2 pb-6 h-[70px]">
										<Text className="pb-1">貨存  </Text>
										<NumberInput num={itemData[0].inventory} onChangeFunc={(value)=>updateData('inventory', value)} enableTextInput={true} editable={action != 'view'}/>
									</View>
									<View className="basis-1/2 pt-2 pb-6 h-[70px]">
									<Text className="pb-1">價錢  </Text>
										<NumberInput num={itemData[0].price} onChangeFunc={(value)=>updateData('price', value)} enableTextInput={true} editable={action != 'view'}/>
									</View>
									<View className='basis-full py-2'>
										<Text className="pb-1">詳細  </Text>
										{action == 'view' ?
											<View className="basis-1/3 rounded-xl text-l text-kuro justify-center h-[100px] border-2 border-grey p-2 bg-grey">
												<Text>{itemData[0].description}</Text>
											</View>:
											<TextInput
												multiline
												numberOfLines={4}
												className='rounded-xl text-l text-kuro border-2 border-auxiliary p-2'
												value={itemData[0].description}
												onChangeText={value => updateData('description', value)}
											/>
										}
									</View>
								</View>
								{ (action == 'view' && itemData[0]?.eventLog) &&
									<>
										<View className='border-b-2 border-grey p-2 pb-3 basis-full'></View>
										<View className='p-2 basis-full'>
											<DataTable mapping={tableMapping} data={itemData[0].eventLog} />
										</View>
									</>
								}
							</ScrollView>
						</View>
					</View>
				</View>
			</View>
		</View>
		</>
	);
};

export default React.forwardRef(ItemDetail)