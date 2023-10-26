import * as React from 'react';
import { View, Text, Image, TouchableWithoutFeedback, TextInput } from "react-native";
import QuantityInput from '../components/numberInput.js';

//viewType: grid/ list/ mini-list
const ItemBox = ({data, viewType, editable, editQty=0, onPressFunc = function(){}, onQtyUpdateFunc = function(){}}) => {
	const [qty, setqty] = React.useState(editQty);

	const updateQty = (value)=>{
		console.log('itemBox' + value)
		setqty(value)
		onQtyUpdateFunc(value)
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
						<Text className={(viewType == 'mini-list' ? 'text-m ' : 'text-l ') + "text-kuro font-bold"}>{data.name}</Text>
						<Text className={(viewType == 'mini-list' ? 'text-m ' : 'text-xl ') + "text-accent font-bold"}>$ {data.price}</Text>
						{(viewType !== 'mini-list') && <Text className="text-kuro text-m">{data.description}</Text>}
					</View>
					{editable &&
						<View className='basis-1/2 pl-1 '>
							<View className="mt-auto mb-auto">
								<QuantityInput
									qty={qty}
									onChangeFunc={(event,value) => updateQty(event)}
								/>
							</View>
						</View>
					}
				</View>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default ItemBox