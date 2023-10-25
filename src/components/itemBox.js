import * as React from 'react';
import { View, Text, Image, TouchableWithoutFeedback } from "react-native";

const ItemBox = ({data, viewType, onPressFunc}) => {
	const handlePress = async () => {
        await onPressFunc(data.id);
    }

	return (
		<TouchableWithoutFeedback onPress={() => handlePress()}>
		<View className={(viewType == 'grid' ? 'col-span-3 shadow-lg rounded-xl ' : 'col-span-12 flex flex-row border-t border-auxiliary ') + "bg-shiro p-8"}>
			<Image
				className={(viewType == 'grid' ? 'w-full h-[120px] ' : 'basis-1/4 h-[100px] ') + "block mx-auto my-auto"}
				source={{uri:data.thumbnail}}
			/>
			<View className={(viewType == 'grid' ? '' : 'basis-3/4 pl-2 ') + "pt-2 h-[80px]"}>
				<Text className="text-kuro text-xl font-bold">{data.name}</Text>
				<Text className="text-accent text-l font-bold">$ {data.price}</Text>
				<Text className="text-kuro text-l">{data.description}</Text>
			</View>
	  	</View>
		</TouchableWithoutFeedback>
	);
};

export default ItemBox