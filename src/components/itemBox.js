import * as React from 'react';
import { View, Text, Image } from "react-native";

const ItemBox = props => {
	const data = props.data

	return (
		<View className="col-span-3 bg-shiro shadow-lg p-8 rounded-xl" >
			<Image
				className="block w-full h-[120px] mx-auto my-auto"
				source={{uri:data.thumbnail}}
			/>
			<View className="pt-2 h-[80px]" >
				<Text className="text-kuro text-xl font-bold">{data.name}</Text>
				<Text className="text-accent text-l font-bold">$ {data.price}</Text>
				<Text className="text-kuro text-l">{data.description}</Text>
			</View>
	  	</View>
	);
};

export default ItemBox