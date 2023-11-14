import * as React from 'react';
import { View, Text } from "react-native";
import { PieChart } from 'react-native-svg-charts'

import * as store from '../../store';

const Label = ({i, itemName, itemField}) => {
	const colorStyles = {
        backgroundColor: store.chartPalette[i]
    };
	return(
		<>
			<View className={'h-[20px] w-[20px] align-middle h-auto '} style={[colorStyles]}>
			</View>
			<View className='pl-2 w-[80%] text-center flex flex-row overflow-visible'>
				<Text className="text-kuro text-m">{itemName}</Text><Text className="text-kuro text-m font-semibold">: {itemField}</Text>
			</View>
		</>
	)
}

const Chart = ({chartData, field}) => {
	const pieData = chartData
	.map((value, index) => ({
		value:value[field],
		svg: {
			fill: store.chartPalette[index],
		},
		key: `pie-${index}`
	}))
	return (
		<>
			<PieChart style={{ height: 200 }} data={pieData} />
			<View className="py-2 flex flex-row flex-wrap">
				{chartData.map(function(itemData, i){
					return (
						<View className="basis-full md:basis-1/3 flex flex-row my-1" key={i}>
							<Label i={i} itemName={itemData.name} itemField={itemData[field]}/>
						</View>
					);
				})}
			</View>
		</>
	)
}



export default Chart;