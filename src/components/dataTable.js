import * as React from 'react';
import { View, Text, ScrollView, TouchableWithoutFeedback } from "react-native";

const DataTable = ({mapping, data, onPressFunc = function(){}}) => {

	const mappingKey = Object.keys(mapping)
	const handlePress = async (value) => {
        await onPressFunc(value);
    }
	return (
	  <View className="h-full">
		<View className="flex-row gap-4 justify-between justify-items-start w-full min-h-[40px]">
		{
			mappingKey.map((key) => {
				return (
					<View className={mapping[key].colClass} key={key}>
						<Text className={'text-lg font-extrabold justify-self-start ' + mapping[key].titleClass}>{mapping[key].title}</Text>
					</View>
				);
			})
		}
		</View>
		<View className="h-[90%] py-1 md:py-3 w-full">
			<ScrollView>
			{data.map((rowData, rowKey) => {
				return (
					<TouchableWithoutFeedback onPress={() => handlePress(rowData.id)} key={rowKey} className="my-1">
						<View className="flex-row gap-4 justify-between justify-items-start w-full border-b border-auxiliary py-2">
						{
							mappingKey.map((key) => {
								return (
									<View className={mapping[key].colClass} key={rowKey+key}>
										<Text className={'text-base justify-self-start '+ mapping[key].txtClass}>{rowData[key]}</Text>
									</View>
								);
							})
						}
						</View>
					</TouchableWithoutFeedback>
				);
			})}
			</ScrollView>
		</View>
	  </View>
	);
};

export default DataTable