import * as React from 'react';
import { View, Text, Image, TouchableWithoutFeedback, TextInput, ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { MaterialIcons } from '@expo/vector-icons';

import DataTable from '../components/dataTable';
import NumberInput from '../components/numberInput.js';
import LoadingBar from '../components/loadingBar';
import MessageBox from '../components/messageBox';
import DropDownInput from '../components/dropDownInput';

import { getProductDetail, updateProductDetail, createProduct } from '../controller/productController';
import { getCatList } from '../controller/categoryController';
import * as store from '../../store';

const defaultItemData = {id:0, name:'', price:0, 'description':'', thumbnail:'', 'inventory': 0, 'status': 1,'category':  {'id': -1, 'name': '未分類'}, 'statData':{'amount':0, 'lumpsum':0}, eventLog:[]}

const ItemDetail = (props, ref) => {
	const [display, setDisplay] = React.useState(false);
	const [action, setAction] = React.useState('create');
	const [itemData, setItemData] = React.useState(defaultItemData);
	const [categoryList, setCategoryList] = React.useState([]);
	const [isLoading, setLoading] = React.useState(false);
	const msgBoxRef = React.useRef()

	let thumbnailChanged = false;

	let tableMapping = {'created_at': {title:'時間', colClass:'w-5/12 ', txtClass:'text-kuro text-sm', titleClass:'text-kuro text-base font-semibold'}, 'message': {title:'修改紀錄', colClass:'w-7/12 ', txtClass:'text-kuro text-sm', titleClass:'text-kuro text-base font-semibold'}}

	React.useImperativeHandle(ref, () => ({
		open: (itemId, action) => { displayModal(itemId, action) },
	}))

	const displayModal = async (itemId, action) => {
		console.log(action + ": " + itemId)
		setLoading(true)
		setAction(action)
		thumbnailChanged = false
		await getCategoryList()
		if(action == 'edit' || action == 'view') {
			var result = await getProductDetail(itemId);
			if(result.state == 'success'){
				console.log(result.data)
				await setItemData(result.data);
			}
			else {
				msgBoxRef.current.open(result.errMsg, 'bg-focus')
				hideModal()
			}
		}
		await setDisplay(true)
	}

	const hideModal = async() => {
		setLoading(true)
		await setItemData(defaultItemData)
		await props.reloadFunc();
		setDisplay(false)
		setLoading(false)
	}

	async function getCategoryList() {
		try {
			setLoading(true)
			var result = await getCatList();
			var listResult = [{'id': -1, 'name': '未分類'}]
			if(result?.data) listResult = listResult.concat(result.data);
			setCategoryList(listResult);
			setLoading(false)
		} catch (err) {
			console.log(err);
		}
	}

	const updateData = async(field, value)=>{
		let prevData = {}
		Object.assign(prevData, itemData)
		if((field == 'price' || field == 'inventory') && (value == 'minus' || value == 'plus'))
		{
			//check if prev isNAN -> auto 1
			if(isNaN(parseFloat(prevData[field]))){
				prevData[field] = 1
			}else if(field == 'price')
			{
				if(value == 'minus') prevData[field] = parseFloat(prevData[field]) - 1
				else prevData[field] = parseFloat(prevData[field]) + 1
			}else{
				if(value == 'minus') prevData[field] = parseInt(prevData[field]) - 1
				else prevData[field] = parseInt(prevData[field]) + 1
			}
		}else{
			prevData[field] = value
		}

		if(field == 'thumbnail') thumbnailChanged = true;
		await setItemData(prevData)
	}

	const pickImage = async () => {
		if(action != 'view')
		{
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [1, 1],
				quality: 0.4,
			});
			if (!result.canceled) {
				updateData('thumbnail', result.assets[0].uri);
			}
		}
	};

	const createImgDir = async () => {
		const imgDataDir = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'productIMG');
        const isDir = imgDataDir.isDirectory;
        if (!isDir) {
            try {
                await FileSystem.makeDirectoryAsync(
                    FileSystem.documentDirectory +  'productIMG',
                    { intermediates: true }
                );
            } catch (e) {
                return false
            }
        }
		return FileSystem.documentDirectory +  'productIMG';
	};

	async function saveItemDetail() {
		try {
			setLoading(true)

			//do validation
			var validFlag = true
			var currItemData = {}
			Object.assign(currItemData, itemData)
			delete currItemData.eventLog;
			delete currItemData.statData;

			let validMsg='';
			if(currItemData.name == '')
			{
				validFlag = false;
				validMsg='Name cannot be black'
			}else if(parseFloat(currItemData.price) < 0 || (isNaN(parseFloat(currItemData.price)) && parseFloat(currItemData.price) !=0)){
				validFlag = false;
				validMsg='Invalid price'
			}else if(parseInt(currItemData.inventory) < 0 || (parseInt(currItemData.inventory) != 0 && isNaN(parseInt(currItemData.inventory))))
			{
				validFlag = false;
				validMsg='Invalid inventory'
			}else if(parseInt(currItemData.status) != 0 && isNaN(currItemData.status))
			{
				validFlag = false;
				validMsg='Invalid status'
			}

			if(currItemData.thumbnail != '' && thumbnailChanged)
			{
				var dirPath = await createImgDir()
				if(dirPath != false)
				{
					let thumbnailFile = currItemData.thumbnail;
					let fileData = thumbnailFile.split('/');
					let fileName = fileData[fileData.length-1];
					await FileSystem.deleteAsync({
						fileUri: dirPath+'/'+fileName,
						options:{idempotent:true}
					});
					await FileSystem.copyAsync({
						from: thumbnailFile,
						to: dirPath+'/'+fileName,
					});
					currItemData.thumbnail = dirPath+'/'+fileName;
				}else
				{
					validFlag= false;
					validMsg='Fail to upload image'
				}
			}

			if(validFlag)
			{
				let id = currItemData.id
				if(action == 'edit')
				{
					delete currItemData.id;
					let saveStatus = await updateProductDetail(id, currItemData)
					if(saveStatus.state == 'success') {
						msgBoxRef.current.open('item updated', 'bg-primary')
						displayModal(saveStatus.data, 'view')
					}else{
						msgBoxRef.current.open(saveStatus.errMsg, 'bg-focus')
					}

				}else{
					delete currItemData.id;
					let saveStatus = await createProduct(currItemData)
					if(saveStatus.state == 'success') {
						console.log('create success')
						msgBoxRef.current.open('item created', 'bg-primary')
						displayModal(saveStatus.data, 'view')
					}else{
						msgBoxRef.current.open(saveStatus.errMsg, 'bg-focus')
					}
				}
			}else{
				msgBoxRef.current.open(validMsg, 'bg-focus')
			}
			setLoading(false)
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<>
		{isLoading && <LoadingBar loading={isLoading}/>}
		<MessageBox ref={msgBoxRef}/>
		<View className={(display ? 'flex ' : 'hidden ') + "absolute w-full h-full right-0 py-6 px-6 bg-auxiliary z-30"}>
			<View className="h-full w-full bg-white shadow-lg px-4 py-2 rounded-xl">
				<View className="flex flex-row flex-wrap h-full">
					<View className="basis-full justify-end flex flex-row pt-4 h-[10vh] md:h-[50px]" >
						<View className="basis-1/3 md:basis-1/6">
							<TouchableWithoutFeedback onPress={()=>{hideModal();}}>
								<Text className="text-grey text-l font-bold w-[32px]">
								<MaterialIcons name='close' size={32}/>
								</Text>
							</TouchableWithoutFeedback>
						</View>
						<View className="basis-1/3 md:basis-1/6">
						{action == 'edit' &&
							<TouchableWithoutFeedback onPress={() => displayModal(itemData.id, 'view')}>
								<View className="justify-center items-center bg-shiro border-2 border-primary shadow-lg px-3 py-1 rounded-xl">
									<Text className="text-primary text-base md:text-xl">
										取消
									</Text>
								</View>
							</TouchableWithoutFeedback>
						}
						</View>
						<View className="basis-1/3 md:basis-1/6">
							{action == 'view' ?
								<TouchableWithoutFeedback onPress={() => setAction('edit')}>
									<View className="justify-center items-center bg-primary border-2 border-primary shadow-lg px-3 py-1 rounded-xl ml-2">
										<Text className="text-shiro text-base md:text-xl">
											編輯
										</Text>
									</View>
								</TouchableWithoutFeedback>
								:
								<TouchableWithoutFeedback onPress={() => saveItemDetail()}>
									<View className="justify-center items-center bg-primary border-2 border-primary shadow-lg px-3 py-1 rounded-xl ml-2">
										<Text className="text-shiro text-base md:text-xl">
											儲存
										</Text>
									</View>
								</TouchableWithoutFeedback>
							}
						</View>
					</View>
					<View className="basis-full flex flex-row pt-4 h-[95%] flex-wrap" >
						<View className="basis-full md:basis-1/4 flex flex-row md:block">
							<TouchableWithoutFeedback onPress={() => pickImage()}>
						{(itemData.thumbnail == '' || itemData.thumbnail == null || itemData.thumbnail == 'null') ?
							<View
								className="w-full h-[8vh] md:h-[30vh] rounded-xl p-8 bg-grey basis-1/3 mr-2 md:mr-0"
							/>:
							<Image
								className="w-full h-[8vh] md:h-[30vh] rounded-xl p-8 basis-1/3 mr-2 md:mr-0"
								source={{uri:itemData.thumbnail}}
							/>
						}
							</TouchableWithoutFeedback>
							<View className="flex flex-row flex-wrap basis-2/3 border-l-2 md:border-l-0 border-grey">
								{store.device !='mobile' &&
									<View className='border-b-2 border-grey p-2 basis-full'></View>
								}
								<View className="basis-1/2 md:basis-full px-2 md:pt-2 md:pb-1 my-auto">
									<View className="flex flex-row">
										<View className='bg-primary w-1/3 rounded-l-xl align-middle py-1'>
											<Text className="text-shiro w-fit text-center">
												<MaterialIcons name='tag' size={24}/>
											</Text>
										</View>
										<View className='w-2/3 rounded-r-xl align-middle border-2 border-primary py-1 text-center'>
											<Text className="text-kuro text-m text-center">{itemData.statData.amount}</Text>
										</View>
									</View>
								</View>
								<View className="basis-1/2 md:basis-full px-2 my-auto">
									<View className="flex flex-row">
										<View className='bg-primary w-1/3 rounded-l-xl align-middle py-1'>
											<Text className="text-shiro w-fit text-center">
												<MaterialIcons name='attach-money' size={24}/>
											</Text>
										</View>
										<View className='w-2/3 rounded-r-xl align-middle border-2 border-primary py-1 text-center'>
											<Text className="text-kuro text-m text-center">{itemData.statData.lumpsum}</Text>
										</View>
									</View>
								</View>
							</View>
						</View>
						<View className="basis-full md:basis-3/4 pl-3 h-[80%] md:h-[90%] pt-4 md:pt-0">
							<ScrollView>
								<View className="h-full w-full flex flex-row flex-wrap">
									<View className="basis-full flex flex-row flex-wrap">
										<View className="basis-1/3 rounded-xl text-l text-kuro justify-center h-[50px] border-2 border-grey p-2 bg-grey">
											<Text>{itemData.id}</Text>
										</View>
										<View className="basis-2/3 h-[50px] w-full flex flex-row px-8 py-1">
											{
												action == 'view' ?
												<View className={(itemData.status == 1 ? 'bg-grey ': 'bg-shiro ')+'border-grey border-2 rounded-3xl h-full w-full justify-center'}>
													<Text className={(itemData.status == 1 ? 'text-shiro ': 'text-grey ') + 'text-base font-semibold text-center'}>
													{store.statusList.find(obj => {return obj.key == itemData.status}).status}
													</Text>
												</View>
												:
												<TouchableWithoutFeedback onPress={() => updateData('status', (itemData.status == 1 ? 0: 1))}>
													<View className={(itemData.status == 1 ? 'bg-primary ': 'bg-shiro ')+'border-primary border-2 rounded-3xl h-full w-full justify-center'}>
														<Text className={(itemData.status == 1 ? 'text-shiro ': 'text-primary ') + 'text-base font-semibold text-center'}>
														{store.statusList.find(obj => {return obj.key == itemData.status}).status}
														</Text>
													</View>
												</TouchableWithoutFeedback>
											}

										</View>
										<View className='basis-full py-2'>
											<Text className="pb-1">名稱  </Text>
											{action == 'view' ?
												<View className="basis-1/3 rounded-xl text-l text-kuro justify-center h-[50px] border-2 border-grey p-2 bg-grey">
													<Text>{itemData.name}</Text>
												</View>:
												<TextInput
													className='rounded-xl text-l text-kuro h-[50px] border-2 border-auxiliary p-2'
													value={itemData.name}
													onChangeText={value => updateData('name', value)}
												/>
											}
										</View>

										<View className="basis-1/2 pt-2 pb-6 h-[70px]">
											<Text className="pb-1">貨存  </Text>
											<NumberInput num={itemData.inventory} onChangeFunc={(value)=>updateData('inventory', value)} enableTextInput={true} editable={action != 'view'}/>
										</View>
										<View className="basis-1/2 pt-2 pb-6 h-[70px]">
										<Text className="pb-1">價錢  </Text>
											<NumberInput num={itemData.price} onChangeFunc={(value)=>updateData('price', value)} enableTextInput={true} editable={action != 'view'}/>
										</View>
										<View className='basis-full py-2'>
											<Text className="pb-1">分類  </Text>
												<DropDownInput
													selectedObj={itemData.category}
													labelField='name'
													optionList={categoryList}
													editable={action !== 'view'}
													onChangeFunc={(value)=>updateData('category', value)}
												/>
										</View>
										<View className='basis-full py-2'>
											<Text className="pb-1">詳細  </Text>
											{action == 'view' ?
												<View className="basis-1/3 rounded-xl text-l text-kuro justify-center h-[100px] border-2 border-grey p-2 bg-grey">
													<Text>{itemData.description}</Text>
												</View>:
												<TextInput
													multiline
													numberOfLines={4}
													className='rounded-xl text-l text-kuro border-2 border-auxiliary p-2'
													value={itemData.description}
													onChangeText={value => updateData('description', value)}
												/>
											}
										</View>
									</View>
									{ (action == 'view' && itemData?.eventLog) &&
										<>
											<View className='border-b-2 border-grey p-2 pb-3 basis-full'></View>
											<View className='p-2 basis-full'>
												<DataTable mapping={tableMapping} data={itemData.eventLog} />
											</View>
										</>
									}
								</View>
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