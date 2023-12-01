import * as React from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback, TextInput } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import Navigation from '../components/navigation';
import LoadingBar from '../components/loadingBar';
import MessageBox from '../components/messageBox';

import { getCatList, updateCat, createCategory } from '../controller/categoryController';
import * as store from '../../store';

const defaultCategoryData = {id:0, name:'','status': 1}

const Category = () => {
	const [categoryList, setCategoryList] = React.useState([]);
	const [updatingId, setUpdatingId] = React.useState(-1);
	const [updatingObj, setUpdatingObj] = React.useState(defaultCategoryData);
	const [isLoading, setLoading] = React.useState(false);
	const msgBoxRef = React.useRef()

	async function getCategoryList() {
		try {
			setLoading(true)
			var result = await getCatList();
			if(result?.data) await setCategoryList(result.data);
			setLoading(false)
		} catch (err) {
			console.log(err);
		}
	}

	async function setUpdate(catId, catObject) {
		try {
			setLoading(true)
			if(catId == 0){
				var result = await getCatList();
				if(result?.data) {
					result.data = result.data.concat([defaultCategoryData])
					await setCategoryList(result.data);
				}
			}else{
				getCategoryList()
			}
			setUpdatingId(catId)
			setUpdatingObj(catObject)
			setLoading(false)
		} catch (err) {
			console.log(err);
		}
	}
	async function updateFieldData(value) {
		try {
			let prevData = {}
			Object.assign(prevData, updatingObj)
			prevData.name = value
			await setUpdatingObj(prevData)
		} catch (err) {
			console.log(err);
		}
	}

	async function updateCategory() {
		try {
			setLoading(true)
			var validFlag = true
			var validMsg='';
			var currItemData = {}
			Object.assign(currItemData, updatingObj)
			if(currItemData.name == '')
			{
				validFlag = false;
				validMsg='Name cannot be black'
			}
			if(validFlag)
			{
				let id = currItemData.id
				if(id != 0) {
					let saveStatus = await updateCat(id, currItemData)
					if(saveStatus.state == 'success') {
						msgBoxRef.current.open('成功更新分類', 'bg-primary')
					}else{
						msgBoxRef.current.open(saveStatus.errMsg, 'bg-focus')
					}
				}
				else{
					let saveStatus = await createCategory(currItemData)
					if(saveStatus.state == 'success') {
						msgBoxRef.current.open('成功建立分類', 'bg-primary')
					}else{
						msgBoxRef.current.open(saveStatus.errMsg, 'bg-focus')
					}
				}
			}else{
				msgBoxRef.current.open(validMsg, 'bg-focus')
			}

			getCategoryList()
			setUpdatingId(-1)
			setUpdatingObj(defaultCategoryData)
			setLoading(false)
		} catch (err) {
			console.log(err);
		}
	}

	useFocusEffect(
		React.useCallback(() => {
			getCategoryList()
			setUpdatingId(-1)
			setUpdatingObj(defaultCategoryData)
		}, [])
	);
	return (
		<View className='bg-auxiliary w-full h-full flex flex-1 flex-column md:flex-row'>
			<View className="flex-none w-full md:w-16 h-auto md:h-full absolute md:relative bottom-0 md:bottom-[] z-10">
				<Navigation currentScreen='Item'/>
			</View>
			<View className='grow w-full md:w-80 h-full'>
			{isLoading && <LoadingBar loading={isLoading}/>}
			<MessageBox ref={msgBoxRef}/>
				<View className="py-4 md:py-8 px-6 h-[95%] md:h-full w-full">
					<View className="flex flex-row pb-5 h-full">
						<View className="basis-full" >
							<View className="bg-shiro shadow-lg px-4 py-2 rounded-xl h-full mx-2 py-4">
								<View className='bg-shiro px-2 py-2 flex flex-row flex-wrap justify-between' >
									<View >
										<Text className='text-primary text-xl font-bold'>管理分類</Text>
									</View>
									<View >
										<TouchableWithoutFeedback onPress={()=>{store.navigationRef.goBack();}}>
											<Text className="text-grey text-l font-bold w-[32px]">
												<MaterialIcons name='close' size={32}/>
											</Text>
										</TouchableWithoutFeedback>
									</View>
								</View>
								<ScrollView>
								{
									categoryList.map(function(category, i){
										return (
											<View className='bg-shiro px-4 py-2 m-2 border-grey border-b border-dotted flex flex-wrap flex-row justify-between' key={i}>
											{
												category.id == updatingId ?
												<TextInput
													className='rounded-xl text-l text-kuro border-2 border-auxiliary px-2 py-1 basis-3/4'
													value={updatingObj.name}
													onChangeText={value => updateFieldData(value)}

												/> :
												<Text className="text-kuro text-l">{category.name}</Text>
											}
												<View>
													<TouchableWithoutFeedback onPress={() => (category.id == updatingId ? updateCategory() : setUpdate(category.id, category))} key={i}>
														<Text className='items-center my-auto'>
															<MaterialIcons name={(category.id == updatingId) ? 'save' : 'edit'} size={20}/>
														</Text>
													</TouchableWithoutFeedback>
												</View>
											</View>
										)
									})
								}
									<TouchableWithoutFeedback onPress={() => setUpdate(0, defaultCategoryData)}>
										<View className='bg-shiro px-4 py-2 m-2 flex flex-wrap flex-row justify-center'>

											<Text className='items-center my-auto'>
												<MaterialIcons name='add' size={20}/>
											</Text>
										</View>
									</TouchableWithoutFeedback>
								</ScrollView>
							</View>
						</View>
					</View>
				</View>
			</View>
		</View>
	)
}

export default Category
