import * as React from 'react';
import { View, Text, Image, TouchableWithoutFeedback, TextInput } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import NumberInput from '../components/numberInput.js';

//viewType: grid/ list/ mini-list
const ItemBox = ({data, viewType, editable, itemActivate = 1, onPressFunc = function(){}, onQtyUpdateFunc = function(){}}) => {

	const updateQty = (value)=>{
		if(value == 'minus'){
			onQtyUpdateFunc(parseInt(data.qty)-1)
		}else if(value == 'plus'){
			onQtyUpdateFunc(parseInt(data.qty)+1)
		}else if(parseInt(value) != NaN){
			console.log('itemBox: ' + value)
			onQtyUpdateFunc(parseInt(value))
		}else{
			onQtyUpdateFunc(1)
		}
	}

	const handlePress = async () => {
        await onPressFunc();
    }
	return (
		<TouchableWithoutFeedback onPress={() => handlePress()}>
			<View className={(viewType == 'grid' ? 'basis-1/2 md:basis-1/3 ' : 'basis-full border-b border-auxiliary ') + ""}>
				<View className={(
					viewType == 'grid' ? 'shadow-lg rounded-xl m-2 p-4 pb-2 ' : (
						viewType == 'list' ? 'shadow-lg rounded-xl m-1 flex flex-row p-4 ' :
						'flex flex-row p-4 '
						)
					) + (itemActivate == 1 ? "bg-shiro" : "bg-grey")
				}>
					{data.thumbnail == '' ?
						<View
							className={(
								viewType == 'grid' ? 'w-full h-[10vh] md:h-[20vh] max-h-[120px] ' : (
									viewType == 'list' ? 'basis-1/6 h-[5vh] md:h-[100px] rounded-xl ' :
									'basis-1/6 h-[50px] max-w-[50px] rounded-xl '
									)
								) + "block mx-auto my-auto bg-grey"
							}
						/>
						:
						<Image
							className={(
								viewType == 'grid' ? 'w-full h-[10vh] md:h-[20vh] max-h-[120px] ' : (
									viewType == 'list' ? 'basis-1/6 h-[5vh] md:h-[100px] rounded-xl ' :
									'basis-1/6 h-[50px] max-w-[50px] rounded-xl '
									)
								) + "block mx-auto my-auto"
							}
							source={{uri:data.thumbnail}}
						/>
					}

					<View className={(
						viewType == 'grid' ? 'h-[80px]' : (
							viewType == 'list' ? 'basis-1/2 pl-4 h-[8vh] md:h-[100px] ' :
							'basis-1/3 pl-2 h-[80px] '
						)
						) + "pt-2 overflow-hidden"
					}>
						<Text className={(viewType == 'mini-list' ? 'text-base ' : 'text-l ') + "text-kuro font-bold"}>{data.name}</Text>
						{(viewType == 'grid') && <Text className={(data.inventory<5 ? 'bg-focus text-shiro border-2 border-focus ' : 'bg-shiro border-2 border-primary text-primary ') + "rounded-xl text-sm px-[2px] text-center w-[80px]"}>貨存: {data.inventory}</Text>}
						{(viewType !== 'list') && <Text className={(viewType == 'mini-list' ? 'text-base ' : 'text-xl ') + "text-primary font-bold"}>$ {data.price}</Text>}
						{(viewType == 'list') && <Text className="text-kuro text-m text-clip">{data.description}</Text>}
					</View>
					{viewType == 'list'||viewType == 'mini-list' &&
						(editable ?
						<View className='basis-1/2 pl-1 '>
							<View className="mt-auto mb-auto w-full h-[40px]">
								<NumberInput num={data.qty} onChangeFunc={(value) => updateQty(value)}/>
							</View>
						</View>:
						<View className='basis-1/2 pl-1 '>
							<View className="mt-auto mb-auto w-full h-[40px]">
								<NumberInput num={data.qty} editable={false}/>
							</View>
						</View>
						)
					}
					{viewType == 'list' &&
						<View className='basis-1/6 pl-4'>
							 <Text className={(data.inventory<5 ? 'bg-focus text-shiro border-2 border-focus ' : 'bg-shiro border-2 border-primary text-primary ') + "mt-auto mb-auto rounded-xl text-xs md:text-sm text-center w-[40px] md:w-[80px]"}>貨存: {data.inventory}</Text>
						</View>
					}
					{viewType == 'list' &&
						<View className='basis-1/6 pl-4'>
							<Text className={(itemActivate == 1 ? 'text-primary ' : 'text-shiro ') + 'mt-auto mb-auto text-sm md:text-xl font-bold text-center'}>$ {data.price}</Text>
						</View>
					}

				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default ItemBox