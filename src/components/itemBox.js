import * as React from 'react';
import { View, Text, Image, TouchableWithoutFeedback, TextInput } from "react-native";
import NumberInput from '../components/numberInput.js';

//viewType: grid/ list/ mini-list
const ItemBox = ({data, viewType, editable, onPressFunc = function(){}, onQtyUpdateFunc = function(){}}) => {

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
			<View className={(viewType == 'grid' ? 'basis-1/3 ' : 'basis-full border-b border-auxiliary ') + ""}>
				<View className={(viewType == 'grid'? 'shadow-lg rounded-xl m-2 p-8 pb-4 ' : 'flex flex-row p-4 ')+"bg-shiro"}>
					<Image
						className={(viewType == 'grid' ? 'w-full h-[100px] ' : 'basis-1/6 h-[50px] max-w-[50px] rounded-xl ') + "block mx-auto my-auto"}
						source={{uri:data.thumbnail}}
					/>
					<View className={(viewType == 'grid' ? '' : 'basis-1/3 pl-2 ') + "pt-2 h-[80px] overflow-hidden"}>
						<Text className={(viewType == 'mini-list' ? 'text-base ' : 'text-l ') + "text-kuro font-bold"}>{data.name}</Text>
						{(viewType !== 'mini-list') && <Text className={(data.inventory<5 ? 'bg-accent text-shiro ' : 'bg-auxiliary text-kuro ') + "rounded-xl text-sm px-[3px] py-[1px] text-center"}>貨存: {data.inventory}</Text>}
						<Text className={(viewType == 'mini-list' ? 'text-base ' : 'text-xl ') + "text-accent font-bold"}>$ {data.price}</Text>
						{(viewType !== 'mini-list') && <Text className="text-kuro text-m text-clip">{data.description}</Text>}
					</View>
					{editable &&
						<View className='basis-1/2 pl-1 '>
							<View className="mt-auto mb-auto w-full h-[40px]">
								<NumberInput num={data.qty} onChangeFunc={(value) => updateQty(value)}/>

							</View>
						</View>
					}
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default ItemBox