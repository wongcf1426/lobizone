import * as React from 'react';
import { View, Text } from "react-native";

const DataTable = props => {
	const mapping = props.mapping
	const data = props.data

	const mappingKey = Object.keys(mapping)

	return (
	  <View>
		<View className="flex-row gap-4 justify-between justify-items-start w-full">
		{
			mappingKey.map((key) => {
				return (
					<View className={mapping[key].colClass} key={key}>
						<Text className={'text-lg font-bold justify-self-start ' + mapping[key].txtClass}>{mapping[key].title}</Text>
					</View>
				);
			})
		}
		</View>
		<View>
		{data.map((rowData, rowKey) => {
			return (
				<View className="flex-row gap-4 justify-between justify-items-start w-full" key={rowKey}>
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
			);
      	})}
		</View>
	  </View>
	);
};

export default DataTable